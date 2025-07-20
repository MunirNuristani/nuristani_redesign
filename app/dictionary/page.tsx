"use client";
import React, { useState, useEffect } from "react";
import wordslist from "../../WordBank.json";
import { phrases } from "../../utils/i18n";

// Type definitions
interface WordData {
  index: number;
  Word: string;
  pronunciation?: string;
  Meaning?: string;
  ABBR?: string;
}

const Page: React.FC = () => {
  const {} = phrases;
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
  const lan =
    (typeof window !== "undefined" && localStorage.getItem("lan")) || "";

  useEffect(() => {
    setDir(lan === "en" ? "ltr" : "rtl");
  }, [lan]);

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
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            قاموس دری – نورستانی
          </h1>
          <p className="text-lg text-gray-600 font-medium">(کلښه الا)</p>
          <p className="text-sm text-gray-500 mt-2">
            Dari - Nuristani Dictionary
          </p>
        </div>
        {/* Welcome Message */}
        {!hasSearched && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center mb-8 hidden md:block lg:block">
            {/* <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div> */}
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              به قاموس دری - نورستانی خوش آمدید
            </h3>
            <p className="text-gray-600 leading-relaxed">
              برای شروع، لغت مورد نظر خود را در وارد کنید. این دیکشنری شامل
              هزاران لغت از زبان دری به نورستانی است.
            </p>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="word"
                className="block text-lg font-semibold text-gray-700 mb-3 text-right"
              >
                جستجوی لغت
              </label>
              <div className="relative">
                <input
                  id="word"
                  type="text"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-right bg-gray-50 focus:bg-white"
                  value={searchValue}
                  placeholder="لغت مورد نظر خود را وارد کنید..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchValue(e.target.value)
                  }
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  </button>
                )}
              </div>
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
                    <span>جستجو</span>
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
                    نتایج دقیق
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {displaySelectedWord.map((wordData: WordData) => (
                    <div
                      key={wordData.index}
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
                  ))}
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
                    لغات مشابه
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
                  نتیجه‌ای یافت نشد
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  لغت مورد نظر شما در دیکشنری موجود نیست. لطفاً املای کلمه را
                  بررسی کنید یا کلمه دیگری را امتحان کنید.
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  جستجوی جدید
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
