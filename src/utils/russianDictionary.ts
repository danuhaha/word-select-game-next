import russianWords from '@/data/russianWords.json';

/**
 * Gets the Russian words array
 */
export const getRussianWords = (): string[] => {
  return russianWords;
};

/**
 * Checks if a word can be formed from the letters of another word
 */
export const canFormWord = (sourceWord: string, targetWord: string): boolean => {
  const sourceLetters: Record<string, number> = {};

  // Count letters in the source word
  for (const letter of sourceWord.toLowerCase()) {
    sourceLetters[letter] = (sourceLetters[letter] || 0) + 1;
  }

  // Check if target word can be formed
  for (const letter of targetWord.toLowerCase()) {
    if (!sourceLetters[letter] || sourceLetters[letter] <= 0) {
      return false;
    }
    sourceLetters[letter]--;
  }

  return true;
};

/**
 * Gets a list of valid words that can be formed from the letters of the given word
 */
export const getValidRussianWords = (word: string): Set<string> => {
  const allWords = getRussianWords();
  const validWords = new Set<string>();

  // Add the original word
  validWords.add(word.toLowerCase());

  // Find all words that can be formed from the letters of the given word
  for (const dictWord of allWords) {
    if (dictWord.length >= 4 && dictWord.length <= word.length && canFormWord(word, dictWord)) {
      validWords.add(dictWord.toLowerCase());
    }
  }

  return validWords;
};

/**
 * Checks if a word is valid (can be formed from the letters of the source word)
 */
export const isRussianWordValid = (word: string, validWords: Set<string>): boolean => {
  return validWords.has(word.toLowerCase());
};

/**
 * Gets a random Russian word with the specified minimum length, excluding words with dashes
 */
export const getRandomRussianWord = (minLength: number = 15): string => {
  const allWords = getRussianWords();
  // Filter out words with dashes and apply minimum length requirement
  const filteredWords = allWords.filter((word) => word.length >= minLength && !word.includes('-'));

  if (filteredWords.length === 0) {
    // Fallback to any word without dashes if no words of the specified length exist
    const wordsWithoutDashes = allWords.filter((word) => !word.includes('-'));
    if (wordsWithoutDashes.length === 0) {
      // Final fallback to any word
      return allWords[Math.floor(Math.random() * allWords.length)];
    }
    return wordsWithoutDashes[Math.floor(Math.random() * wordsWithoutDashes.length)];
  }

  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};

/**
 * This function is intentionally not shuffling the word as per requirements
 */
export const prepareRussianWord = (word: string): string => {
  // Return the word as is, without shuffling
  return word;
};
