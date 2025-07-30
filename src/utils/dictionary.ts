import { getRussianWords, getValidRussianWords, isRussianWordValid, getRandomRussianWord, canFormWord } from './russianDictionary';

type DictionaryType = {
  [key: string]: string[];
};

export const getDictionary = (): DictionaryType => {
  // We're now using Russian words from the russian_nouns.txt file
  const russianWords = getRussianWords();
  const dictionary: DictionaryType = {};
  
  // Build dictionary from Russian words
  russianWords.forEach(word => {
    if (word.length >= 6) { // Only use longer words as base words
      dictionary[word.toLowerCase()] = [];
    }
  });
  
  return dictionary;
};

export const getValidWords = (word: string): Set<string> => {
  return getValidRussianWords(word);
};

export const isWordValid = (word: string, validWords: Set<string>): boolean => {
  return isRussianWordValid(word, validWords);
};

export const getRandomWord = (length: number = 15): string => {
  return getRandomRussianWord(length);
};

export const jumbleWord = (word: string): string => {
  const wordArray = word.split('');
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  return wordArray.join('');
};
