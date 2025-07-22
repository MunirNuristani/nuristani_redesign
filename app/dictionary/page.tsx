"use client";
import React, { useState, useEffect } from "react";
import wordslist from "../../WordBank.json";
import { phrases } from "../../utils/i18n";
import { useAppContext } from "@/context/AppContext";
import { inputBaseClasses } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// Type definitions
interface WordData {
  index: number;
  Word: string;
  pronunciation?: string;
  Meaning?: string;
  ABBR?: string;
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
  } = phrases;

  const data: WordData[] = wordslist as WordData[];
  const [searchValue, setSearchValue] = useState<string>("");
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [displaySelectedWord, setDisplaySelectedWord] = useState<WordData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const [dir, setDir] = useState<string>("");

  useEffect(() => {
    setDir(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

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
        const words: string[] = [];
        const exactMatches: WordData[] = [];
        const partialMatches: string[] = [];

        for (let i = 0; i < data.length; i++) {
          const wordData = data[i] as WordData;
          const searchTerm = wd.trim().toLowerCase();
          const wordLower = wordData.Word.trim().toLowerCase();

          // Exact match
          if (wordLower === searchTerm) {
            exactMatches.push(wordData);
          }
          // Partial matches (contains search term)
          else if (wordLower.includes(searchTerm)) {
            partialMatches.push(wordData.Word);
          }
          // Similar words (starts with search term)
          else if (wordLower.startsWith(searchTerm)) {
            words.push(wordData.Word);
          }
        }

        // Combine all matches, prioritizing exact matches
        const allSimilarWords = [...partialMatches, ...words];
        const uniqueSimilarWords = Array.from(new Set(allSimilarWords)).slice(
          0,
          10
        ); // Limit to 10 suggestions

        if (exactMatches.length === 0 && uniqueSimilarWords.length === 0) {
          setShowNoResults(true);
        } else {
          setDisplaySelectedWord(exactMatches);
          setDisplayWords(uniqueSimilarWords);
        }
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
  };

  const clearSearch = (): void => {
    setSearchValue("");
    setDisplayWords([]);
    setDisplaySelectedWord([]);
    setShowNoResults(false);
    setHasSearched(false);
  };

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
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {!hasSearched && (
              <div className="   py-2 text-center mb-8 hidden md:block lg:block">
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  {dicWelcomeText[lang]}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dicDescriptionText[lang]}
                </p>
              </div>
            )}

            <div>
              <TextField
                className="w-full mb-4 pb-4"
                id="outlined-suffix-shrink"
                label={wordSearch[lang]}
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
                placeholder={searchPlaceholder[lang]}
                variant="outlined"
                slotProps={
                  searchValue
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              onClick={clearSearch}
                              sx={{
                                opacity: 0,

                                cursor: "pointer",
                                [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]:
                                  {
                                    opacity: 1,
                                  },
                              }}
                            >
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined
                }
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال جستجو...</span>
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
                <div className="bg-gradient-to-r from-blue-500 to-emerald-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
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
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {displaySelectedWord.map(
                    (wordData: WordData, index: number) => (
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

                          {wordData.Meaning && (
                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-lg text-gray-700 leading-relaxed">
                                {wordData.Meaning}
                              </p>
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
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
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
                  </h3>
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
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  {noResultFound[lang]}
                </h3>
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
