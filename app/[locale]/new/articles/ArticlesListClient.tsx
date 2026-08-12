"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";

export interface Article {
  id: string;
  name: string;
  nameEn: string;
  author: string;
  authorEn: string;
  language: string;
}

export default function ArticlesListClient({ articles }: { articles: Article[] }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;

  const [q, setQ] = useState("");
  const [filterLang, setFilterLang] = useState("all");

  const filtered = useMemo(() => {
    let list = [...articles].sort((a, b) => {
      const an = lang === "en" ? a.nameEn || a.name : a.name;
      const bn = lang === "en" ? b.nameEn || b.name : b.name;
      return an.localeCompare(bn);
    });
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((a) => {
        const title = (lang === "en" ? a.nameEn : a.name).toLowerCase();
        const author = (lang === "en" ? a.authorEn : a.author).toLowerCase();
        return title.includes(needle) || author.includes(needle);
      });
    }
    if (filterLang !== "all") {
      list = list.filter((a) => a.language === filterLang);
    }
    return list;
  }, [articles, q, filterLang, lang]);

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{articles.length} {phrases.articles[lang]}</p>
          <h1>{phrases.articleList[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1080 }}>
        <div className="list-toolbar">
          <div className="list-search">
            <input
              type="text"
              placeholder={phrases.searchArticlePlaceholder[lang]}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="icon">⌕</span>
          </div>
          <select className="list-filter" value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
            <option value="all">{phrases.allLangs[lang]}</option>
            <option value="en">{phrases.english[lang]}</option>
            <option value="prs">{phrases.farsi[lang]}</option>
            <option value="ps">{phrases.pashto[lang]}</option>
            <option value="nr">{phrases.nuristani[lang]}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="list-empty">
            <h3>{phrases.noArticleFound[lang]}</h3>
            <p>{phrases.noArticleFoundDetails[lang]}</p>
          </div>
        ) : (
          <div className="list-grid">
            {filtered.map((a) => (
              <Link className="article-card" href={`/${locale}/articles/${a.id}`} key={a.id}>
                <span className="lang-pill mono">{a.language.toUpperCase()}</span>
                <h4>{lang === "en" && a.nameEn ? a.nameEn : a.name}</h4>
                <span className="by">{lang === "en" && a.authorEn ? a.authorEn : a.author}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
