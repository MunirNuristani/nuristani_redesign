"use client";
import React, { useState, useEffect } from "react";
import { phrases } from "../../utils/i18n";
import { useAppContext } from "@/context/AppContext";
import { inputBaseClasses } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  trackPageVisit,
  trackDictionarySearch,
  trackButtonClick,
  trackAutocompleteSelection,
  trackDictionaryTabSwitch,
  trackSession,
} from "@/utils/analytics";

// Type definitions for Dari -> Nuristani dictionary
interface WordData {
  index: number;
  Word: string;
  pronunciation?: string;
  Meaning?: string;
  ABBR?: string;
}

// Type definition for Nuristani -> Pashto/Dari dictionary
interface NuristaniWordData {
  Word: string;
  pronunciation?: string;
  ABBR?: string;
  pashto?: string;
  dari?: string;
}

type DictionaryType = "dariToNuristani" | "nuristaniToPashtoDari";

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
};

// Calculate similarity score (0-1, where 1 is perfect match)
const calculateSimilarity = (search: string, word: string): number => {
  const searchLower = search.toLowerCase();
  const wordLower = word.toLowerCase();

  // Exact match
  if (searchLower === wordLower) return 1.0;

  // Starts with (high priority)
  if (wordLower.startsWith(searchLower)) return 0.9;

  // Contains (medium priority)
  if (wordLower.includes(searchLower)) return 0.75;

  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(searchLower, wordLower);
  const maxLength = Math.max(searchLower.length, wordLower.length);
  const similarity = 1 - (distance / maxLength);

  // Only consider if similarity is above threshold (60%)
  return similarity >= 0.6 ? similarity * 0.6 : 0;
};

// Smart word matching with scoring
interface WordMatch {
  word: string;
  score: number;
  data: WordData | NuristaniWordData;
}

const Page: React.FC = () => {
  const { state } = useAppContext();
  const { language: lang } = state;
  const {
    dictionaryTitle,
    search,
    wordSearch,
    searchPlaceholder,
    dicWelcomeText,
    dicDescriptionText,
    exactMatches,
    similarMatches,
    newSearch,
    noResultFound,
    noResultDetail,
    kalashaAla,
    dariToNuristani,
    nuristaniToPashtoDari,
    pashtoTranslation,
    dariTranslation,
    searching,
    secondDicWelcomeText
  } = phrases;

  // Dictionary selection state
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryType>("dariToNuristani");

  // Dictionary data state
  const [dariNuristaniData, setDariNuristaniData] = useState<WordData[]>([]);
  const [nuristaniPashtoDariData, setNuristaniPashtoDariData] = useState<NuristaniWordData[]>([]);
  const [dictionaryLoading, setDictionaryLoading] = useState<boolean>(true);

  const [searchValue, setSearchValue] = useState<string>("");
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [displaySelectedWord, setDisplaySelectedWord] = useState<(WordData | NuristaniWordData)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Autocomplete states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  const [dir, setDir] = useState<string>("");

  useEffect(() => {
    setDir(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  // Track page visit and session on mount
  useEffect(() => {
    trackSession();
    trackPageVisit("dictionary");
  }, []);

  // Load dictionary data dynamically
  useEffect(() => {
    const loadDictionaries = async () => {
      setDictionaryLoading(true);
      try {
        // Load both dictionaries in parallel
        const [dariResponse, nuristaniResponse] = await Promise.all([
          fetch('/api/dictionary/dari-nuristani'),
          fetch('/api/dictionary/nuristani-pashto-dari'),
        ]);

        const [dariData, nuristaniData] = await Promise.all([
          dariResponse.json(),
          nuristaniResponse.json(),
        ]);

        setDariNuristaniData(dariData);
        setNuristaniPashtoDariData(nuristaniData);
      } catch (error) {
        console.error('Error loading dictionary data:', error);
      } finally {
        setDictionaryLoading(false);
      }
    };

    loadDictionaries();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#outlined-suffix-shrink") && !target.closest(".autocomplete-dropdown")) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete with smart matching
  useEffect(() => {
    if (searchValue.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      const data = selectedDictionary === "dariToNuristani"
        ? dariNuristaniData
        : nuristaniPashtoDariData;

      const searchTerm = searchValue.trim();
      const wordMatches: WordMatch[] = [];

      // Score all words
      for (let i = 0; i < data.length; i++) {
        const word = data[i].Word.trim();
        const score = calculateSimilarity(searchTerm, word);

        if (score > 0) {
          wordMatches.push({ word, score, data: data[i] });
        }
      }

      // Sort by score (descending) and take top 5
      wordMatches.sort((a, b) => b.score - a.score);
      const topMatches = wordMatches.slice(0, 5).map(m => m.word);

      setSuggestions(topMatches);
      setShowSuggestions(topMatches.length > 0 && !hasSearched);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchValue, selectedDictionary, hasSearched, dariNuristaniData, nuristaniPashtoDariData]);

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLSpanElement>,
    wd: string = searchValue
  ): void => {
    e.preventDefault();
    setLoading(true);
    setDisplayWords([]);
    setDisplaySelectedWord([]);
    setShowNoResults(false);
    setHasSearched(true);

    // Simulate loading for better UX
    setTimeout(() => {
      if (wd.trim().length > 0) {
        const exactMatchesResults: (WordData | NuristaniWordData)[] = [];
        const wordMatches: WordMatch[] = [];

        // Select the appropriate data based on dictionary type
        const data = selectedDictionary === "dariToNuristani"
          ? dariNuristaniData
          : nuristaniPashtoDariData;

        const searchTerm = wd.trim();

        // Score all words using smart matching
        for (let i = 0; i < data.length; i++) {
          const wordData = data[i];
          const word = wordData.Word.trim();
          const score = calculateSimilarity(searchTerm, word);

          // Exact match (score = 1.0)
          if (score === 1.0) {
            exactMatchesResults.push(wordData);
          }
          // Similar words (score > 0 but not exact)
          else if (score > 0) {
            wordMatches.push({ word, score, data: wordData });
          }
        }

        // Sort by relevance score (descending) and take top 15
        wordMatches.sort((a, b) => b.score - a.score);
        const similarWords = wordMatches.slice(0, 15).map(m => m.word);

        if (exactMatchesResults.length === 0 && similarWords.length === 0) {
          setShowNoResults(true);
        } else {
          setDisplaySelectedWord(exactMatchesResults);
          setDisplayWords(similarWords);
        }

        // Track the search
        trackDictionarySearch({
          searchQuery: searchTerm,
          dictionaryType: selectedDictionary,
          resultsFound: exactMatchesResults.length > 0 || similarWords.length > 0,
          exactMatchCount: exactMatchesResults.length,
          similarMatchCount: similarWords.length,
        });
      } else {
        setShowNoResults(true);
      }
      setLoading(false);
    }, 300);
  };

  const setWord = (e: React.MouseEvent<HTMLSpanElement>, wd: string): void => {
    e.preventDefault();
    setSearchValue(wd);
    handleSearch(e, wd);

    // Track similar word click
    trackButtonClick({
      buttonType: "similar-word-click",
      buttonLabel: wd,
      dictionaryType: selectedDictionary,
    });
  };

  const clearSearch = (): void => {
    setSearchValue("");
    setDisplayWords([]);
    setDisplaySelectedWord([]);
    setShowNoResults(false);
    setHasSearched(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    // Track clear search
    trackButtonClick({
      buttonType: "clear-search",
      dictionaryType: selectedDictionary,
    });
  };

  // Handle suggestion selection and trigger search
  const handleSuggestionClick = (suggestion: string, triggerSearch: boolean = true, position: number = -1): void => {
    // Track autocomplete selection
    if (position >= 0) {
      trackAutocompleteSelection({
        searchQuery: searchValue,
        suggestionSelected: suggestion,
        suggestionPosition: position,
        dictionaryType: selectedDictionary,
      });
    }

    setSearchValue(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);

    if (triggerSearch) {
      // Create a synthetic event to trigger search
      setLoading(true);
      setDisplayWords([]);
      setDisplaySelectedWord([]);
      setShowNoResults(false);
      setHasSearched(true);

      setTimeout(() => {
        const data = selectedDictionary === "dariToNuristani"
          ? dariNuristaniData
          : nuristaniPashtoDariData;

        const searchTerm = suggestion.trim();
        const exactMatchesResults: (WordData | NuristaniWordData)[] = [];
        const wordMatches: WordMatch[] = [];

        // Score all words using smart matching
        for (let i = 0; i < data.length; i++) {
          const wordData = data[i];
          const word = wordData.Word.trim();
          const score = calculateSimilarity(searchTerm, word);

          // Exact match (score = 1.0)
          if (score === 1.0) {
            exactMatchesResults.push(wordData);
          }
          // Similar words (score > 0 but not exact)
          else if (score > 0) {
            wordMatches.push({ word, score, data: wordData });
          }
        }

        // Sort by relevance score (descending) and take top 15
        wordMatches.sort((a, b) => b.score - a.score);
        const similarWords = wordMatches.slice(0, 15).map(m => m.word);

        if (exactMatchesResults.length === 0 && similarWords.length === 0) {
          setShowNoResults(true);
        } else {
          setDisplaySelectedWord(exactMatchesResults);
          setDisplayWords(similarWords);
        }
        setLoading(false);
      }, 300);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!showSuggestions || suggestions.length === 0) {
      // If no suggestions are showing, let the form submit handle Enter
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          // Select the highlighted suggestion and trigger search
          handleSuggestionClick(suggestions[selectedSuggestionIndex], true, selectedSuggestionIndex);
        } else if (suggestions.length > 0) {
          // No suggestion selected but suggestions exist - select first one
          handleSuggestionClick(suggestions[0], true, 0);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Show loading state while dictionaries are loading
  if (dictionaryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">{searching[lang]}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {dictionaryTitle[lang]}
          </h1>
          <p className="text-lg text-gray-600 font-medium">{`( ${kalashaAla[lang]} )`}</p>
        </div>

        {/* Dictionary Selection - Modern Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 mb-6">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1" role="tablist" aria-label="Dictionary selection">
            <button
              onClick={() => {
                const previousDictionary = selectedDictionary;
                if (previousDictionary !== "dariToNuristani") {
                  trackDictionaryTabSwitch({
                    fromDictionary: previousDictionary,
                    toDictionary: "dariToNuristani",
                  });
                }
                setSelectedDictionary("dariToNuristani");
                clearSearch();
              }}
              role="tab"
              aria-selected={selectedDictionary === "dariToNuristani"}
              aria-label="Switch to Dari to Nuristani dictionary"
              className={`flex-1 px-6 py-4 rounded-lg font-semibold text-base transition-all duration-300 ${
                selectedDictionary === "dariToNuristani"
                ? "bg-[var(--color-secondary)] text-white "
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{dariToNuristani[lang]}</span>
              </div>
            </button>

            <button
              onClick={() => {
                const previousDictionary = selectedDictionary;
                if (previousDictionary !== "nuristaniToPashtoDari") {
                  trackDictionaryTabSwitch({
                    fromDictionary: previousDictionary,
                    toDictionary: "nuristaniToPashtoDari",
                  });
                }
                setSelectedDictionary("nuristaniToPashtoDari");
                clearSearch();
              }}
              role="tab"
              aria-selected={selectedDictionary === "nuristaniToPashtoDari"}
              aria-label="Switch to Nuristani to Pashto/Dari dictionary"
              className={`flex-1 px-6 py-4 rounded-lg font-semibold text-base transition-all duration-300 ${
                selectedDictionary === "nuristaniToPashtoDari"
                  ? "bg-[var(--color-secondary)] text-white "
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{nuristaniToPashtoDari[lang]}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {!hasSearched && (
              <div className="   py-2 text-center mb-8 hidden md:block lg:block">
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  {selectedDictionary === "dariToNuristani" ? dicWelcomeText[lang] : secondDicWelcomeText[lang]}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {dicDescriptionText[lang]}
                </p>
              </div>
            )}

            <div className="relative">
              <TextField
                className="w-full mb-4 pb-4"
                id="outlined-suffix-shrink"
                label={wordSearch[lang]}
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchValue(e.target.value);
                  setHasSearched(false);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0 && !hasSearched) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder={searchPlaceholder[lang]}
                variant="outlined"
                autoComplete="off"
                slotProps={
                  searchValue
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{
                                opacity: 0,
                                cursor: "pointer",
                                [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]:
                                  {
                                    opacity: 1,
                                  },
                              }}
                            >
                              <button
                                onClick={clearSearch}
                                type="button"
                                aria-label="Clear search input"
                                className="flex items-center justify-center"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined
                }
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="autocomplete-dropdown absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 max-h-80 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion, true, index)}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                        index === selectedSuggestionIndex
                          ? "bg-blue-100 text-blue-800 font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      } ${index === 0 ? "rounded-t-xl" : ""} ${
                        index === suggestions.length - 1 ? "rounded-b-xl" : ""
                      } border-b border-gray-100 last:border-b-0`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{suggestion}</span>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] focus:ring-4 focus:ring-[var(--color-secondary-ring)] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span> {searching[lang]}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {lang === "en" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                    <span>{search[lang]}</span>
                    {lang !== "en" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Exact Matches */}
            {displaySelectedWord.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className=" bg-[var(--color-primary)] px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {exactMatches[lang]}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {displaySelectedWord.map(
                    (wordData: WordData | NuristaniWordData, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-green-200"
                      >
                        <div className=" space-y-2 ">
                          <div className="flex items-center justify-start space-x-reverse space-x-2">
                            <span className="text-3xl font-bold text-gray-800">
                              {wordData.Word}
                            </span>
                            {wordData.pronunciation && (
                              <span className="text-lg text-gray-600 bg-white mx-3 px-3 py-1 rounded-full border">
                                [{wordData.pronunciation.trim()}]
                              </span>
                            )}
                          </div>

                          {wordData.ABBR && (
                            <div className="flex justify-start">
                              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {wordData.ABBR.trim()}
                              </span>
                            </div>
                          )}

                          {/* For Dari -> Nuristani dictionary */}
                          {selectedDictionary === "dariToNuristani" && "Meaning" in wordData && wordData.Meaning && (
                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-lg text-gray-700 leading-relaxed">
                                {wordData.Meaning}
                              </p>
                            </div>
                          )}

                          {/* For Nuristani -> Pashto/Dari dictionary */}
                          {selectedDictionary === "nuristaniToPashtoDari" && (
                            <div className="mt-4 space-y-3">
                              {"pashto" in wordData && wordData.pashto && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                    {pashtoTranslation[lang]}:
                                  </h4>
                                  <p className="text-lg text-gray-700 leading-relaxed">
                                    {wordData.pashto}
                                  </p>
                                </div>
                              )}
                              {"dari" in wordData && wordData.dari && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                    {dariTranslation[lang]}:
                                  </h4>
                                  <p className="text-lg text-gray-700 leading-relaxed">
                                    {wordData.dari}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Similar Words */}
            {displayWords.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-[var(--color-secondary)] px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    {similarMatches[lang]}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayWords.map((word: string, index: number) => (
                      <button
                        key={index}
                        onClick={(e) => setWord(e, word)}
                        className="p-4 text-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 text-right font-medium text-gray-700 hover:text-blue-700"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {showNoResults && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  {noResultFound[lang]}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {noResultDetail[lang]}
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold text-xl rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {newSearch[lang]}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
