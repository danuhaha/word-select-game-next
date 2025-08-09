import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN env var' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    interface TelegramReportBody {
      word?: string;
      initialWord?: string;
      jumbledWord?: string | string[];
      selectedLetters?: string[];
      meta?: Record<string, unknown>;
      channel?: string;
    }

    const body: TelegramReportBody = await req.json().catch(() => ({} as TelegramReportBody));
    const { word, initialWord, jumbledWord, selectedLetters, meta, channel = '@categories_4' } = body || {};

    if (!word) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing "word" in body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const now = new Date().toISOString();
    const text = [
      `🚫 Invalid word submitted`,
      `Word: ${word}`,
      initialWord ? `Initial: ${initialWord}` : undefined,
      selectedLetters ? `Selected: ${selectedLetters.join('')}` : undefined,
      jumbledWord ? `Pool: ${Array.isArray(jumbledWord) ? jumbledWord.join('') : String(jumbledWord)}` : undefined,
      meta ? `Meta: ${JSON.stringify(meta)}` : undefined,
      `When: ${now}`,
    ]
      .filter(Boolean)
      .join('\n');

    const chatId = process.env.TELEGRAM_CHAT_ID || channel;
    const reply_markup = {
      inline_keyboard: [
        [
          {
            text: 'Добавить в словарь',
            callback_data: JSON.stringify({ a: 'add', w: word.toLowerCase() }).slice(0, 64),
          },
        ],
      ],
    };

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, reply_markup }),
    });

    const tgJson = await tgResp.json().catch(() => ({}));
    if (!tgResp.ok || tgJson?.ok === false) {
      return new Response(JSON.stringify({ ok: false, error: 'Telegram API error', details: tgJson }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
