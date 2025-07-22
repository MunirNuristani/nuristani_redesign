"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import LoadingPage from "@/app/loading";
import { phrases } from "@/utils/i18n";
import { useAppContext } from "@/context/AppContext";
// Type definitions
interface Picture {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

function ArticleDetail() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;
  const { state } = useAppContext();
  const { language: lang } = state;
  const {
    english,
    farsi,
    pashto,
    nuristani,
    noResultFound,
    returnBack,
    author,
    morePics,
  } = phrases;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (articleId) {
      setLoading(true);
      axios
        .get(`/api/getArticle?id=${articleId}`)
        .then((res) => {
          setArticle(res.data);
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [articleId]);

  const handleBackClick = () => {
    router.back();
  };

  const getLanguageDisplay = (language: string) => {
    switch (language) {
      case "en":
        return english[lang] || "English";
      case "prs":
        return farsi[lang] || "دری";
      case "ps":
        return pashto[lang] || "پشتو";
      case "nr":
        return nuristani[lang] || "نورستانی";
      default:
        return language;
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center max-w-7xl">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {noResultFound[lang]}{" "}
          </h3>
          <p className="text-gray-600">مقاله مورد نظر پیدا نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4"
      dir={lang === "en" ? "ltr" : "rtl"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className={`mb-6 flex w-full ${"justify-start"}`}>
          <button
            onClick={handleBackClick}
            className={`inline-flex justify-center items-center px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group ${
              lang === "en" ? "text-lg" : "text-xl"
            }`}
          >
            <svg
              className={`w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300 ${
                lang !== "en" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {returnBack[lang]}
          </button>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                {lang === "en"
                  ? article?.Article_Name_en
                  : article?.Article_Name}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-lg font-medium">
                  {author[lang]}:{" "}
                  {lang === "en"
                    ? article?.Author_Name_en
                    : article?.Author_Name}
                </span>
              </div>
            </div>

            {article?.language && (
              <div className="flex items-center">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold rounded-xl border border-blue-200">
                  {getLanguageDisplay(article.language)}
                </span>
              </div>
            )}
          </div>

          {/* Main Image */}
          {article?.Pictures && article?.Pictures.length > 0 && (
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={article?.Pictures[0].url}
                alt={`${article?.Article_Name} - تصویر اصلی`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                unoptimized={true}
              />
            </div>
          )}

          <div
            dir={article.language === "en" ? "ltr" : "rtl"}
            className="prose prose-lg text-2xl max-w-none text-justify leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article?.Article_body }}
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.8",
            }}
          />
        </div>

        {/* Additional Images */}
        {article?.Pictures && article?.Pictures.length > 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {morePics[lang]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article?.Pictures.slice(1).map((img: Picture, idx: number) => (
                <div
                  key={`${img.id}-${idx}`}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={img.url}
                      alt={`${article?.Article_Name} - تصویر ${idx + 2}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;
