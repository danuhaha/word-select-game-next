import { NextRequest } from 'next/server';

// Helper to call Telegram API
async function tgCall(token: string, method: string, payload: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function getGithubFile(token: string, owner: string, repo: string, path: string, branch: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GitHub get content failed: ${res.status}`);
  return res.json();
}

async function putGithubFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string,
  contentB64: string,
  sha: string | undefined,
  message: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      message,
      content: contentB64,
      sha,
      branch,
    }),
  });
  if (!res.ok) throw new Error(`GitHub put content failed: ${res.status}`);
  return res.json();
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token) return new Response('Missing TELEGRAM_BOT_TOKEN', { status: 500 });

  // Optional verify Telegram webhook secret header
  if (secret) {
    const hdr = req.headers.get('x-telegram-bot-api-secret-token');
    if (hdr !== secret) return new Response('Forbidden', { status: 403 });
  }

  const update = await req.json().catch(() => ({}));

  const callback = update?.callback_query;
  if (!callback) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = callback.id as string;
  const fromId = callback.from?.id as number | undefined;
  const data = callback.data as string | undefined;
  const message = callback.message;

  // Optional: only allow an authorized user to add words
  const allowedUserId = process.env.ALLOWED_TELEGRAM_USER_ID;
  if (allowedUserId && String(fromId) !== String(allowedUserId)) {
    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: 'Недостаточно прав для добавления.',
      show_alert: true,
    });
    return new Response('Unauthorized user', { status: 403 });
  }

  let payload: { a?: string; w?: string } | undefined;
  try {
    payload = data ? JSON.parse(data) : undefined;
  } catch {
    payload = undefined;
  }

  if (!payload || payload.a !== 'add' || !payload.w) {
    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: 'Некорректные данные кнопки.',
      show_alert: true,
    });
    return new Response('Bad callback data', { status: 400 });
  }

  const word = String(payload.w).toLowerCase();

  // GitHub repo info
  const ghToken = process.env.GITHUB_TOKEN;
  const ghOwner = process.env.GITHUB_OWNER;
  const ghRepo = process.env.GITHUB_REPO;
  const ghBranch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'src/data/addedWords.json';

  if (!ghToken || !ghOwner || !ghRepo) {
    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: 'GitHub env vars not configured.',
      show_alert: true,
    });
    return new Response('Missing GitHub env', { status: 500 });
  }

  try {
    // Get file content and sha
    const fileJson = await getGithubFile(ghToken, ghOwner, ghRepo, filePath, ghBranch);
    const { sha, content } = fileJson;
    const currentStr = Buffer.from(content, 'base64').toString('utf-8');
    const arr: string[] = JSON.parse(currentStr || '[]');
    if (!arr.includes(word)) arr.push(word);
    arr.sort();
    const nextStr = JSON.stringify(arr, null, 2) + '\n';
    const nextB64 = Buffer.from(nextStr, 'utf-8').toString('base64');
    await putGithubFile(ghToken, ghOwner, ghRepo, filePath, ghBranch, nextB64, sha, `chore(dict): add word "${word}" via Telegram`);

    // Acknowledge with a toast and update message markup
    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: `Добавлено: ${word}`,
      show_alert: false,
    });

    if (message?.chat?.id && message?.message_id) {
      // Remove inline keyboard (prevents duplicate adds)
      await tgCall(token, 'editMessageReplyMarkup', {
        chat_id: message.chat.id,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [] },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = typeof e === 'object' && e !== null && 'message' in e ? (e as { message?: string }).message : 'неизвестная';
    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: `Ошибка: ${errorMessage}`,
      show_alert: true,
    });
    return new Response('GitHub update failed', { status: 500 });
  }
}
