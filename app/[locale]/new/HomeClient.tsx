"use client";

import { useEffect,  useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import jalaali from "jalaali-js";
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

export interface Book {
  id: string;
  title: string;
  author: string;
}

interface Stats {
  dariNuristani: number;
  nuristaniPashtoDari: number;
  articles: number;
}

// Curated from utils/i18n.ts — real Kalasha-Ala vocabulary already shipped
// in the product's own translation data, used for the hero/grid demo since
// there's no "random word" endpoint to hit for a browsing widget.
const FEATURED_WORDS = [
  { w: "الا", t: "a · lā", en: "language", prs: "زبان، لسان" },
  { w: "باښ", t: "bāṣ̌", en: "letter", prs: "حرف" },
  { w: "ڇا", t: "ča", en: "phoneme", prs: "صدا، اوا" },
  { w: "وېل", t: "wēl", en: "year", prs: "سال" },
  { w: "تڙۉݩ", t: "tərṹ", en: "search", prs: "جستجو" },
  { w: "بوی", t: "boy", en: "confirm", prs: "تایید" },
  { w: "اݩت", t: "ãt", en: "message", prs: "پیام" },
  { w: "ښچۉݩ", t: "ṣ̌čṹ", en: "send", prs: "ارسال" },
];

const ERAS = [
  { label: "Pre-1800", key: "pre1800" },
  { label: "1800–1900", key: "e1800" },
  { label: "1900–1960", key: "e1900" },
  { label: "1960–2000", key: "e1960" },
  { label: "2000–اکنون", key: "e2000" },
];

const ERA_DESCRIPTIONS: Record<string, string> = {
  pre1800: "چهره‌های پیش از سدهٔ نزدهم — رهبران محلی، بزرگان طوایف و راویان روایات شفاهی نورستان.",
  e1800: "دورهٔ پیش از یکجاسازی نورستان با افغانستان — ساختار اجتماعی و رهبری سنتی کافرستان.",
  e1900: "نسل نخست پس از تغییر نام به نورستان — آغاز نهادهای رسمی و آموزش نوین.",
  e1960: "چهره‌های ادبی، علمی و سیاسی نورستان در دهه‌های پرتحول افغانستان معاصر.",
  e2000: "نسل تازه — پژوهشگران، معلمان و فعالان حفظ زبان و فرهنگ نورستانی.",
};

interface SearchResult {
  Word: string;
  ABBR?: string;
  pronunciation?: string;
  Meaning?: string;
}

const PRS_MONTHS = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];
const NR_MONTHS = ["وېشنله ماس", "بي دوت ماس", "یاݩـگر ماس", "لاو کڙ پرېلي ماس", "لاوپوک ماس", "لاو لېتر ماس", "اتاو ماس", "پوټ شاݩ ماس", "سرپوچ ماس", "اۉرڼا ماس", "دې سؤچ ماس", "اؤشتؤم دؤم ماس"];
const PRS_DAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

export default function HomeClient({ articles, books, stats }: { articles: Article[]; books: Book[]; stats: Stats }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}/new`;
  const isRTL = lang !== "en";

  /* hero specimen carousel */
  const [heroIdx, setHeroIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const heroWords = FEATURED_WORDS.slice(0, 4);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotionRef.current) return;
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % heroWords.length), 4200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* live search against the real dictionary API */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/dictionary/search?dict=dariToNuristani&q=${encodeURIComponent(q)}&mode=search`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((data) => {
          setResults([...(data.exactMatches ?? [])]);
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        })
        .finally(() => setSearching(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  /* word grid open/close */
  const [openWord, setOpenWord] = useState<string | null>(null);

  /* eras */
  const [activeEra, setActiveEra] = useState(ERAS[0].key);

  /* article carousel scroll */
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTrack = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * (isRTL ? -300 : 300), behavior: "smooth" });
  };

  /* live calendar */
  const [calendar, setCalendar] = useState<{ day: number; month: string; weekday: string; greg: string; nr: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setCalendar({
      day: j.jd,
      month: `${PRS_MONTHS[j.jm - 1]} ${j.jy}`,
      weekday: PRS_DAYS[now.getDay()],
      greg: now.toLocaleDateString("en-CA"),
      nr: NR_MONTHS[j.jm - 1],
    });
  }, []);

  /* stat count-up */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsIn, setStatsIn] = useState(false);
  useEffect(() => {
    if (!statsRef.current || typeof IntersectionObserver === "undefined") {
      setStatsIn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".new-theme .reveal");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const hw = heroWords[heroIdx];

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="dot" />
              نورستان · آرشیف زنده
            </p>
            <h1 className="headline">
              قاموس زندهٔ <span className="u">کلښه الا</span>
            </h1>
            <p className="sub">{phrases.statementTitle[lang]}</p>
            <div className="cta-row">
              <Link className="cta ghost" href={`${base}/articles`}>
                {phrases.articles[lang]}
              </Link>
              <Link className="cta solid" href={`${base}/dictionary`}>
                {phrases.search[lang]} ←
              </Link>
            </div>
          </div>

          <div className="specimen">
            <div className="specimen-top">
              <span className="specimen-id mono">NR · {String(heroIdx + 1).padStart(3, "0")}</span>
              <button
                className={`specimen-play${playing ? " is-playing" : ""} flex items-center justify-center`}
                aria-label="پخش تلفظ"
                onClick={() => {
                  setPlaying(true);
                  setTimeout(() => setPlaying(false), 700);
                }}
              >
                ▶
              </button>
            </div>
            <div className="specimen-body">
              <div className="word">{hw.w}</div>
              <div className="translit">[{hw.t}]</div>
              <div className="gloss-row">
                <span className="k">English</span>
                <span className="v">{hw.en}</span>
              </div>
              <div className="gloss-row">
                <span className="k">دری</span>
                <span className="v">{hw.prs}</span>
              </div>
            </div>
            <div className="specimen-dots">
              {heroWords.map((_, i) => (
                <button key={i} className={i === heroIdx ? "is-active" : ""} aria-label={`واژه ${i + 1}`} onClick={() => setHeroIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">امتحان کنید</p>
              <h2>در قاموس زنده جستجو کنید</h2>
            </div>
            <p className="desc">جستجوی واقعی روی قاموس دری–نورستانی — همان API که در صفحهٔ قاموس استفاده می‌شود.</p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="یک واژهٔ دری بنویسید…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="icon">⌕</span>
          </div>
          <p className="search-hint mono">{searching ? "..." : query ? `${results.length} نتیجه` : "نتیجه زنده از قاموس واقعی"}</p>
          <div className="search-results">
            {!query && <p className="empty-hint">نتیجه اینجا نمایش داده می‌شود…</p>}
            {query && !searching && results.length === 0 && <p className="no-results">{phrases.noResultFound[lang]}</p>}
            {results.slice(0, 6).map((r, i) => (
              <div className="result-row" key={i}>
                <span className="rw">{r.Word?.trim()}</span>
                <span className="rg">{r.Meaning?.slice(0, 60)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats" ref={statsRef}>
        <div className="stats-inner">
          <Stat n={stats.dariNuristani} label="واژه دری–نورستانی" active={statsIn} />
          <Stat n={stats.nuristaniPashtoDari} label="واژه نورستانی–پشتو/دری" active={statsIn} />
          <Stat n={stats.articles} label="مقاله منتشرشده" active={statsIn} />
        </div>
      </section>

      <section className="word-grid-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">مرور آرشیف</p>
              <h2>چند واژه از کلښه الا</h2>
            </div>
            <p className="desc">روی هر کارت بزنید تا آوانگاری آن را ببینید.</p>
          </div>
          <div className="word-grid reveal">
            {FEATURED_WORDS.map((item) => (
              <div
                key={item.w}
                className={`word-card${openWord === item.w ? " is-open" : ""}`}
                onClick={() => setOpenWord(openWord === item.w ? null : item.w)}
              >
                <div className="w">{item.w}</div>
                <div className="g">{item.en}</div>
                <div className="extra mono">[{item.t}]</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="articles-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">مقالات · نمونه واقعی</p>
              <h2>نوشته‌های تازه</h2>
            </div>
            <div className="carousel-controls">
              <button aria-label="قبلی" onClick={() => scrollTrack(-1)}>→</button>
              <button aria-label="بعدی" onClick={() => scrollTrack(1)}>←</button>
            </div>
          </div>
          <div className="article-track reveal" ref={trackRef}>
            {articles.map((a) => (
              <Link className="article-card" href={`${base}/articles/${a.id}`} key={a.id}>
                <span className="lang-pill mono">{a.language.toUpperCase()}</span>
                <h4>{lang === "en" && a.nameEn ? a.nameEn : a.name}</h4>
                <span className="by">{lang === "en" && a.authorEn ? a.authorEn : a.author}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="books-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">{phrases.digitalLibrary[lang]}</p>
              <h2>چند عنوان از قفسهٔ کتاب‌ها</h2>
            </div>
            <p className="desc">عنوان‌های واقعی از کتابخانهٔ نهاد.</p>
          </div>
          <div className="shelf reveal">
            {books.map((b) => (
              <Link className="spine" href={`${base}/books`} key={b.id}>
                <span className="stitle">{b.title.trim()}</span>
                <span className="sauthor">{b.author}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="eras-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">{phrases.historicalFiguresTitle[lang]}</p>
              <h2>مرور بر اساس دوره</h2>
            </div>
            <p className="desc">دوره‌بندی واقعی آرشیف — با کلیک، هر دوره را برجسته کنید.</p>
          </div>
          <div className="era-track reveal">
            {ERAS.map((e) => (
              <button
                key={e.key}
                className={`era-chip${activeEra === e.key ? " is-active" : ""}`}
                onClick={() => setActiveEra(e.key)}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="era-display reveal">
            <div className="big mono">{ERAS.find((e) => e.key === activeEra)?.label}</div>
            <p>{ERA_DESCRIPTIONS[activeEra]}</p>
          </div>
        </div>
      </section>

      <section className="tools-section">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">ابزارها</p>
              <h2>فراتر از یک آرشیف</h2>
            </div>
          </div>
          <div className="tools-grid reveal">
            <Link className="tool-card" href={`${base}/technology`}>
              <h3>{phrases.keyboards[lang]}</h3>
              <p className="d">{phrases.downloadKeyboardText[lang]}</p>
              <div className="platform-row">
                <span className="platform-pill">
                  <span className="s" />
                  {phrases.windows[lang]}
                </span>
                <span className="platform-pill">
                  <span className="s" />
                  {phrases.android[lang]}
                </span>
                <span className="platform-pill soon">
                  <span className="s" />
                  {phrases.macos[lang]}
                </span>
                <span className="platform-pill soon">
                  <span className="s" />
                  {phrases.ios[lang]}
                </span>
              </div>
            </Link>
            <Link className="tool-card calendar-card" href={`${base}/calendar`}>
              <div className="calendar-face">
                <div className="day mono">{calendar?.day ?? "--"}</div>
                <div className="month">{calendar?.month ?? "--"}</div>
              </div>
              <div className="calendar-meta">
                <p className="wd">{calendar?.weekday ?? "—"}</p>
                <p className="greg mono">{calendar?.greg ?? "—"}</p>
                <p className="nr">{calendar ? `${calendar.nr} — نام ماه به نورستانی` : "—"}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <p className="eyebrow">همراه ما شوید</p>
          <h2>در حفظ زبان و فرهنگ نورستان سهیم شوید</h2>
          <p>{phrases.contactMsgSalutation[lang]}</p>
          <div className="cta-row">
            <Link className="cta ghost" href={`${base}/technology`}>
              {phrases.technology[lang]}
            </Link>
            <Link className="cta solid" href={`${base}/contact`}>
              {phrases.contactUs[lang]} ←
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label, active }: { n: number; label: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(n);
      return;
    }
    let raf: number;
    const start = performance.now();
    const duration = 1100;
    const step = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * n));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, n]);

  return (
    <div className="stat">
      <span className="n mono">{display.toLocaleString("en-US")}</span>
      <span className="l">{label}</span>
    </div>
  );
}
