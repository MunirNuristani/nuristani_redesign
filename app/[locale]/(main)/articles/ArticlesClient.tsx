"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "@/app/components/LocaleLink";
import { phrases } from "@/utils/i18n";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { useAppContext } from "@/context/AppContext";
import { trackPageVisit, trackSession, trackButtonClick } from "@/utils/analytics";

// Type definitions
export interface Article {
  id?: number;
  No: number;
  Article_Name: string;
  Article_Name_en: string;
  Author_Name: string;
  Author_Name_en: string;
  Status: string;
  language: string;
}

interface ArticlesClientProps {
  initialArticles: Article[];
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const {
    articleList,
    english,
    pashto,
    farsi,
    nuristani,
    searchArticleTitle,
    searchArticlePlaceholder,
    articleLanguage,
    allLangs,
    noArticleFound,
    noArticleFoundDetails,
    readMore,
  } = phrases;

  // Track page visit and session on mount
  useEffect(() => {
    trackSession();
    trackPageVisit("articles-list");
  }, []);

  // Re-sort by the active display language (no re-fetch needed)
  const sortedArticles = useMemo(() => {
    return [...initialArticles].sort((a, b) => {
      const nameA = lang === "en" ? a.Article_Name_en : a.Article_Name;
      const nameB = lang === "en" ? b.Article_Name_en : b.Article_Name;
      return nameA.localeCompare(nameB);
    });
  }, [initialArticles, lang]);

  // Filter articles based on search and language
  const filteredArticles = useMemo(() => {
    let filtered = sortedArticles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((article) => {
        const title =
          lang === "en" ? article.Article_Name_en : article.Article_Name;
        const author =
          lang === "en" ? article.Author_Name_en : article.Author_Name;
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(
        (article) => article.language === selectedLanguage
      );
    }

    return filtered;
  }, [sortedArticles, searchTerm, selectedLanguage, lang]);

  const handleArticleClick = (article: Article) => {
    // Track article click
    trackButtonClick({
      buttonType: "suggestion-click",
      buttonLabel: lang === "en" ? article.Article_Name_en : article.Article_Name,
      additionalData: {
        articleId: article.id,
        author: lang === "en" ? article.Author_Name_en : article.Author_Name,
        language: article.language,
      },
    });
  };

  const getLanguage = (writeLang: string) => {
    switch (writeLang) {
      case "en":
        return english[lang] || "English";
      case "prs":
        return farsi[lang] || "Persian";
      case "ps":
        return pashto[lang] || "Pashto";
      case "nr":
        return nuristani[lang] || "Nuristani";
      default:
        return writeLang;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {articleList[lang]}
          </h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="md:col-span-4">
              <Input
                id="filled-search"
                label={searchArticleTitle[lang]}
                type="search"
                placeholder={searchArticlePlaceholder[lang]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>

            {/* Language Filter */}
            <div className="md:col-span-1">
              <Select
                id="demo-simple-select"
                label={articleLanguage[lang]}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                fullWidth
                options={[
                  { value: "all", label: allLangs[lang] },
                  { value: "en", label: english[lang] },
                  { value: "prs", label: farsi[lang] },
                  { value: "ps", label: pashto[lang] },
                  { value: "nr", label: nuristani[lang] },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <Link
                key={index}
                href={`/articles/${article.id}`}
                onClick={() => handleArticleClick(article)}
                className="block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="grow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="grow ">
                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mb-1">
                          {lang === "en"
                            ? article.Article_Name_en
                            : article.Article_Name}
                        </h2>
                      </div>
                      <span
                        className={`inline-block px-3 py-1  font-semibold rounded-   ml-4`}
                      >
                        {getLanguage(article.language)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600 text-sm mb-3 ">
                      <span className="font-medium text-xl">
                        {lang === "en"
                          ? article.Author_Name_en
                          : article.Author_Name}
                      </span>

                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span className={`${lang === "en" ? "text-md " : "text-xl"} font-medium mx-2`}>{readMore[lang]}</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6L8 4 2 10l6 6 2-2m-2-4h8m4 0l2-2-2-2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center gap-2">
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center ">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className={`${lang === "en" ? "text-xl" : "text-2xl"} font-bold text-gray-700 mb-3`}>
              {noArticleFound[lang]}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {noArticleFoundDetails[lang]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
