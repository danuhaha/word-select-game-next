import { russianLetterFrequency } from './russianLetterFrequency';

export type RankEntry = { name: string; minPoints: number };

export const baseRankNames = ['Сверхразум', 'Гений', 'Профи', 'Мастер', 'Отлично', 'Хорошо', 'Неплохо', 'Разогрев', 'Хорошее начало', 'Новичок'];

export const baseRankPercents = [100, 70, 50, 40, 25, 15, 8, 5, 2, 0];

export const baseRankNamesForRankSystem = ['Новичок', 'Хорошее начало', 'Разогрев', 'Неплохо', 'Хорошо', 'Отлично', 'Мастер', 'Профи', 'Гений', 'Сверхразум'];

export const baseRankPercentsForRankSystem = [0, 2, 5, 8, 15, 25, 40, 50, 70, 100];

export function calculateWordRarity(word?: string): number {
  if (!word) return 0;
  return word
    .toLowerCase()
    .split('')
    .reduce((sum, letter) => sum + (russianLetterFrequency[letter] || 0), 0);
}

export function getDynamicRankThresholds(maxScore: number, initialWord: string): RankEntry[] {
  const rarity = calculateWordRarity(initialWord);
  let highestRankPoints = 300 + 0.01 * maxScore;
  if (rarity < 20) highestRankPoints += 20 - rarity;
  if (rarity > 20) highestRankPoints -= rarity - 20;
  highestRankPoints = Math.max(100, highestRankPoints);
  return baseRankPercents.map((percent, idx) => ({
    name: baseRankNames[idx],
    minPoints: Math.round((highestRankPoints * percent) / 100),
  }));
}

export function getDynamicRankThresholdsForRankSystem(maxScore: number, initialWord: string): RankEntry[] {
  const rarity = calculateWordRarity(initialWord);
  let highestRankPoints = 300 + 0.01 * maxScore;
  if (rarity < 20) highestRankPoints += 20 - rarity;
  if (rarity > 20) highestRankPoints -= rarity - 20;
  highestRankPoints = Math.max(100, highestRankPoints);
  return baseRankPercentsForRankSystem.map((percent, idx) => ({
    name: baseRankNamesForRankSystem[idx],
    minPoints: Math.round((highestRankPoints * percent) / 100),
  }));
}

export function getCurrentRankName(score: number, maxScore: number, initialWord: string): string {
  const ranks = getDynamicRankThresholds(maxScore, initialWord);
  const current = [...ranks].reverse().find((r) => score >= r.minPoints) || ranks[0];
  return current.name;
}
