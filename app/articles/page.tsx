"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { phrases } from "@/utils/i18n";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import LoadingPage from "../loading";
// Type definitions
interface Article {
  id?: number;
  No: number;
  Article_Name: string;
  Article_Name_en: string;
  Article_body: string;
  Author_Name: string;
  Author_Name_en: string;
  Status: string;
  language: string;
}

function ListArticles() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const {
    // articleTitle,
    // articleAuthor,
    // languageTitle,
    // publish,
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

  const router = useRouter();


  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/getArticles");
      const sortedArticles = res.data.sort((a: Article, b: Article) => {
        const nameA = lang === "en" ? a.Article_Name_en : a.Article_Name;
        const nameB = lang === "en" ? b.Article_Name_en : b.Article_Name;
        return nameA.localeCompare(nameB);
      });
      setArticles(sortedArticles);
      setFilteredArticles(sortedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [lang]);

  // Filter articles based on search and language
  useEffect(() => {
    let filtered = articles;

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

    setFilteredArticles(filtered);
  }, [searchTerm, selectedLanguage, articles, lang]);

  const handleArticleClick = (article: Article) => {
    router.push(`/articles/${article.id}`);
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



  if (loading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {articleList[lang]}
          </h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="md:col-span-4">
              <TextField
                id="filled-search"
                label={searchArticleTitle[lang]}
                type="search"
                variant="outlined"
                placeholder={searchArticlePlaceholder[lang]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                size="small"
              />
            </div>

            {/* Language Filter */}
            <div className="md:col-span-1">
              <InputLabel id="demo-simple-select-label">
                {articleLanguage[lang]}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="w-full"
                value={selectedLanguage}
                label={articleLanguage[lang]}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                size="small"
              >
                <MenuItem value="all">{allLangs[lang]}</MenuItem>
                <MenuItem value="en">{english[lang]}</MenuItem>
                <MenuItem value="prs">{farsi[lang]}</MenuItem>
                <MenuItem value="ps">{pashto[lang]}</MenuItem>
                <MenuItem value="nr">{nuristani[lang]}</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => handleArticleClick(article)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow ">
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mb-1">
                          {lang === "en"
                            ? article.Article_Name_en
                            : article.Article_Name}
                        </h3>
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
                        <span className={`${lang=== "en" ? "text-md ": "text-xl"} font-medium mx-2`}>{readMore[lang]}</span>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center gap-2">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center ">
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
            <h3 className={`${lang === "en" ? "text-xl" : "text-2xl"} font-bold text-gray-700 mb-3`}>
              {noArticleFound[lang]}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {noArticleFoundDetails[lang]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListArticles;
