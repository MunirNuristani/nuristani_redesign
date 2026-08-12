"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

type DictionaryType = "dariToNuristani" | "nuristaniToPashtoDari";

interface WordData {
  Word: string;
  ABBR?: string;
  pronunciation?: string;
  Meaning?: string;
  pashto?: string;
  dari?: string;
}

export default function NewDictionaryPage() {
  const { state } = useAppContext();
  const { language: lang } = state;

  const [dict, setDict] = useState<DictionaryType>("dariToNuristani");
  const [query, setQuery] = useState("");
  const [exactMatches, setExactMatches] = useState<WordData[]>([]);
  const [similarWords, setSimilarWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = (term: string) => {
    const q = term.trim();
    if (!q) {
      setExactMatches([]);
      setSimilarWords([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    fetch(`/api/dictionary/search?dict=${dict}&q=${encodeURIComponent(q)}&mode=search`)
      .then((r) => r.json())
      .then((data) => {
        setExactMatches(data.exactMatches ?? []);
        setSimilarWords(data.similarWords ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dict]);

  const dictLabel = {
    dariToNuristani: phrases.dariToNuristani[lang],
    nuristaniToPashtoDari: phrases.nuristaniToPashtoDari[lang],
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{phrases.kalashaAla[lang]}</p>
          <h1>{phrases.dictionaryTitle[lang]}</h1>
          <p className="lede">{phrases.dicDescriptionText[lang]}</p>

          <div className="dict-tabs">
            <button
              className={dict === "dariToNuristani" ? "is-active" : ""}
              onClick={() => {
                setDict("dariToNuristani");
                setQuery("");
                setHasSearched(false);
              }}
            >
              {dictLabel.dariToNuristani}
            </button>
            <button
              className={dict === "nuristaniToPashtoDari" ? "is-active" : ""}
              onClick={() => {
                setDict("nuristaniToPashtoDari");
                setQuery("");
                setHasSearched(false);
              }}
            >
              {dictLabel.nuristaniToPashtoDari}
            </button>
          </div>

          <div className="search-box large">
            <input
              type="text"
              placeholder={phrases.searchPlaceholder[lang]}
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="icon">⌕</span>
          </div>
        </div>
      </section>

      <div className="dict-results">
        {!hasSearched && (
          <div className="dict-empty">
            <h3>{dict === "dariToNuristani" ? phrases.dicWelcomeText[lang] : phrases.secondDicWelcomeText[lang]}</h3>
          </div>
        )}

        {hasSearched && loading && <p className="dict-empty">{phrases.searching[lang]}</p>}

        {hasSearched && !loading && exactMatches.length === 0 && similarWords.length === 0 && (
          <div className="dict-empty">
            <h3>{phrases.noResultFound[lang]}</h3>
            <p>{phrases.noResultDetail[lang]}</p>
          </div>
        )}

        {exactMatches.length > 0 && (
          <>
            <div className="result-section-label">{phrases.exactMatches[lang]}</div>
            {exactMatches.map((w, i) => (
              <div className="word-card-full" key={i}>
                <div className="wc-top">
                  <span className="wc-word">{w.Word?.trim()}</span>
                  {w.pronunciation && <span className="wc-pron mono">[{w.pronunciation.trim()}]</span>}
                </div>
                {w.ABBR && <span className="wc-abbr">{w.ABBR.trim()}</span>}
                {dict === "dariToNuristani" && w.Meaning && <p className="wc-meaning">{w.Meaning}</p>}
                {dict === "nuristaniToPashtoDari" && (
                  <>
                    {w.pashto && (
                      <>
                        <p className="wc-gloss-label">{phrases.pashtoTranslation[lang]}</p>
                        <p className="wc-meaning">{w.pashto}</p>
                      </>
                    )}
                    {w.dari && (
                      <>
                        <p className="wc-gloss-label">{phrases.dariTranslation[lang]}</p>
                        <p className="wc-meaning">{w.dari}</p>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {similarWords.length > 0 && (
          <>
            <div className="result-section-label">{phrases.similarMatches[lang]}</div>
            <div className="similar-list">
              {similarWords.map((w, i) => (
                <button key={i} className="similar-chip" onClick={() => setQuery(w)}>
                  {w}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
