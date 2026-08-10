export interface WordData {
  Word: string;
  pronunciation?: string;
  Meaning?: string;
  ABBR?: string;
}

export interface NuristaniWordData {
  Word: string;
  pronunciation?: string;
  ABBR?: string;
  pashto?: string;
  dari?: string;
}

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
};

// Calculate similarity score (0-1, where 1 is perfect match)
const calculateSimilarity = (search: string, word: string): number => {
  const searchLower = search.toLowerCase();
  const wordLower = word.toLowerCase();

  if (searchLower === wordLower) return 1.0;
  if (wordLower.startsWith(searchLower)) return 0.9;
  if (wordLower.includes(searchLower)) return 0.75;

  const distance = levenshteinDistance(searchLower, wordLower);
  const maxLength = Math.max(searchLower.length, wordLower.length);
  const similarity = 1 - distance / maxLength;

  return similarity >= 0.6 ? similarity * 0.6 : 0;
};

interface WordMatch<T> {
  word: string;
  score: number;
  data: T;
}

export function suggestWords<T extends { Word: string }>(
  data: T[],
  searchTerm: string,
  limit = 5
): string[] {
  const term = searchTerm.trim();
  const matches: WordMatch<T>[] = [];

  for (const item of data) {
    const word = item.Word?.trim();
    if (!word) continue;
    const score = calculateSimilarity(term, word);
    if (score > 0) {
      matches.push({ word, score, data: item });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit).map((m) => m.word);
}

export function searchWords<T extends { Word: string }>(
  data: T[],
  searchTerm: string,
  similarLimit = 15
): { exactMatches: T[]; similarWords: string[] } {
  const term = searchTerm.trim();
  const exactMatches: T[] = [];
  const wordMatches: WordMatch<T>[] = [];

  for (const item of data) {
    const word = item.Word?.trim();
    if (!word) continue;
    const score = calculateSimilarity(term, word);

    if (score === 1.0) {
      exactMatches.push(item);
    } else if (score > 0) {
      wordMatches.push({ word, score, data: item });
    }
  }

  wordMatches.sort((a, b) => b.score - a.score);
  const similarWords = wordMatches.slice(0, similarLimit).map((m) => m.word);

  return { exactMatches, similarWords };
}
