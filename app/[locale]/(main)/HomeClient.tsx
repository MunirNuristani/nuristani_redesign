"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  { labelKey: "eraPre1800", descKey: "eraDescPre1800", key: "pre1800" },
  { labelKey: "era1800to1900", descKey: "eraDesc1800to1900", key: "e1800" },
  { labelKey: "era1900to1960", descKey: "eraDesc1900to1960", key: "e1900" },
  { labelKey: "era1960to2000", descKey: "eraDesc1960to2000", key: "e1960" },
  { labelKey: "era2000Present", descKey: "eraDesc2000Present", key: "e2000" },
] as const;

const PRS_MONTHS = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];
const NR_MONTHS = ["وېشنله ماس", "بي دوت ماس", "یاݩـگر ماس", "لاو کڙ پرېلي ماس", "لاوپوک ماس", "لاو لېتر ماس", "اتاو ماس", "پوټ شاݩ ماس", "سرپوچ ماس", "اۉرڼا ماس", "دې سؤچ ماس", "اؤشتؤم دؤم ماس"];
const PRS_DAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

export default function HomeClient({ articles, books }: { articles: Article[]; books: Book[]; stats: Stats }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}`;
  const isRTL = lang !== "en";

  /* hero specimen carousel */
  const [heroIdx, setHeroIdx] = useState(0);
  const heroWords = FEATURED_WORDS.slice(0, 4);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotionRef.current) return;
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % heroWords.length), 4200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* word grid open/close */
  const [openWord, setOpenWord] = useState<string | null>(null);

  /* eras */
  const [activeEra, setActiveEra] = useState<(typeof ERAS)[number]["key"]>(ERAS[0].key);

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
      <section className="relative overflow-hidden min-h-160 max-[640px]:min-h-130 flex items-center py-15 max-[640px]:py-10">
        <Image
          src="/bg.jpg"
          alt="Nuristani cultural landscape"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="z-0 hidden min-[861px]:block"
          style={{ objectFit: "cover", objectPosition: "center" }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <Image
          src="/heroImage01.webp"
          alt="Nuristani cultural design"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="z-0 hidden max-[860px]:block"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0 z-1 bg-linear-to-b from-[rgba(15,22,16,0.32)] to-[rgba(15,22,16,0.5)]" />
        <div className="wrap relative z-2">
          <div className="flex flex-col items-center max-w-155 mx-auto bg-[rgba(255,255,255,0.9)] backdrop-blur-[14px] rounded-2xl py-11.5 px-10 max-[640px]:py-8 max-[640px]:px-6 shadow-[0_30px_70px_-30px_rgba(8,14,9,0.55)] min-[861px]:max-w-260 min-[861px]:flex-row min-[861px]:items-center min-[861px]:gap-12.5 min-[861px]:py-14 min-[861px]:px-15">
            <div className="flex flex-col items-center w-full text-center min-[861px]:items-start min-[861px]:text-start min-[861px]:flex-1">
              <Image
                src="/logo_original_noLabel.png"
                alt=""
                width={64}
                height={64}
                priority
                className="block mx-auto mb-5 min-[861px]:mx-0"
              />
              <h1 className="text-[clamp(1.55rem,1.2rem+1.5vw,2.2rem)] font-semibold leading-[1.35] mb-4 text-(--ink)">
                {phrases.mainH1[lang]}
              </h1>
              <p className="text-base leading-[1.85] text-(--ink-muted) max-w-[46ch] mx-auto mb-7 min-[861px]:mx-0">
                {phrases.statementTitle[lang]}
              </p>
              <div className="cta-row justify-center! min-[861px]:justify-start!">
                <Link className="cta solid" href={`${base}/dictionary`}>
                  {phrases.learnMore[lang]} {isRTL ? "←" : "→"}
                </Link>
              </div>
            </div>
            <div className="hidden min-[861px]:block min-[861px]:relative min-[861px]:shrink-0 min-[861px]:w-85 min-[861px]:h-85 min-[1200px]:w-100 min-[1200px]:h-100">
              <Image
                src="/heroImage01-pattern.webp"
                alt="Traditional Nuristani cultural design pattern"
                fill
                quality={75}
                sizes="(min-width: 1200px) 400px, (min-width: 861px) 340px, 0px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden pt-7.5">
        <div className="hero-bg" />
        <div className="wrap relative grid grid-cols-[1.15fr_0.85fr] max-[860px]:grid-cols-1 gap-13.5 items-center pt-16 max-[860px]:pt-8.5 px-0 pb-22.5">
          <div className="relative">
            <h1 className="text-[clamp(2.3rem,1.6rem+3.2vw,3.5rem)] font-semibold leading-tight mb-5">
              {phrases.livingDictionaryOf[lang]} <span className="text-(--accent)">{phrases.kalashaAla[lang]}</span>
            </h1>
            <p className="text-base leading-[1.9] text-(--ink-muted) max-w-[48ch] mb-7.5 ms-auto max-[860px]:ms-0">
              {phrases.statementTitle[lang]}
            </p>
            <div className="cta-row">
              <Link className="cta solid" href={`${base}/dictionary`}>
                {phrases.search[lang]} ←
              </Link>
            </div>
          </div>

          <div className="relative bg-(--surface) border border-(--line) rounded-(--radius) pt-6 px-6 pb-5 shadow-[0_18px_40px_-24px_rgba(20,30,20,0.28)]">
            <div className="min-h-42">
              <div className="font-semibold text-[2.9rem] text-center my-1 transition-opacity duration-250 ease-in-out">{hw.w}</div>
              <div dir="ltr" className="mono text-[1.05rem] text-(--accent) text-center mb-4">[{hw.t}]</div>
              <div className="flex justify-between border-t border-dashed border-(--line) pt-2.75 text-[0.85rem]">
                <span className="text-(--ink) font-semibold">{hw.en}</span>
                <span className="text-(--ink) font-semibold">{hw.prs}</span>
              </div>
              <div className="flex justify-between pt-1.5 text-[0.85rem]">


              </div>
            </div>
            <div className="flex justify-center gap-1.75 mt-4.5">
              {heroWords.map((_, i) => (
                <button
                  key={i}
                  className={
                    i === heroIdx
                      ? "h-1.75 w-4.5 rounded-sm border-0 bg-(--accent) transition-[background-color,width] duration-200"
                      : "h-1.75 w-1.75 rounded-full border-0 bg-(--line) transition-[background-color,width] duration-200"
                  }
                  aria-label={`${phrases.wordLabel[lang]} ${i + 1}`}
                  onClick={() => setHeroIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-21 bg(--surface)">
        <div className="wrap">
          <div className="section-head reveal">
            <div>

              <h2>{phrases.beyondArchive[lang]}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 max-[860px]:grid-cols-1 gap-4.5 reveal">
            <Link
              className="block bg-(--surface) border border-(--line) rounded-(--radius) p-7.5 no-underline text-inherit transition-[border-color,transform] duration-150 ease-in-out hover:border-(--accent) hover:-translate-y-0.5"
              href={`${base}/technology`}
            >
              <h3 className="m-0 mb-1.5 text-[1.1rem]">{phrases.keyboards[lang]}</h3>
              <p className="text-(--ink-muted) text-[0.85rem] m-0 mb-5">{phrases.downloadKeyboardText[lang]}</p>
              <div className="flex gap-2.5 flex-wrap">
                <span className="flex items-center gap-2 text-[0.82rem] px-3.5 py-2 rounded-full border border-(--line) bg-(--ground)">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
                  {phrases.windows[lang]}
                </span>
                <span className="flex items-center gap-2 text-[0.82rem] px-3.5 py-2 rounded-full border border-(--line) bg-(--ground)">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
                  {phrases.android[lang]}
                </span>
                <span className="flex items-center gap-2 text-[0.82rem] px-3.5 py-2 rounded-full border border-(--line) bg-(--ground) text-(--ink-muted)">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--ink-muted)" />
                  {phrases.macos[lang]}
                </span>
                <span className="flex items-center gap-2 text-[0.82rem] px-3.5 py-2 rounded-full border border-(--line) bg-(--ground) text-(--ink-muted)">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--ink-muted)" />
                  {phrases.ios[lang]}
                </span>
              </div>
            </Link>
            <Link
              className="flex items-center gap-5.5 bg-(--surface) border border-(--line) rounded-(--radius) p-7.5 no-underline text-inherit transition-[border-color,transform] duration-150 ease-in-out hover:border-(--accent) hover:-translate-y-0.5"
              href={`${base}/calendar`}
            >
              <div className="bg-(--ground) border border-(--line) rounded-[10px] px-5.5 py-4.5 text-center min-w-30">
                <div className="mono text-[2.75rem] font-medium text-(--accent) leading-none">{calendar?.day ?? "--"}</div>
                <div className="text-[0.8rem] mt-1.5">{calendar?.month ?? "--"}</div>
              </div>
              <div>
                <p className="font-semibold m-0 mb-1">{calendar?.weekday ?? "—"}</p>
                <p dir="ltr" className="mono text-base text-(--ink-muted) text-end">{calendar?.greg ?? "—"}</p>
                <p className="text-[0.78rem] text-(--accent) mt-1.5">
                  {calendar ? `${calendar.nr} ${phrases.nuristaniMonthNameSuffix[lang]}` : "—"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      

      <section className="py-21">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <h2>{phrases.fewWordsFromKalashaAla[lang]}</h2>
            </div>
            <p className="desc">{phrases.wordGridDesc[lang]}</p>
          </div>
          <div className="grid grid-cols-4 max-[860px]:grid-cols-2 gap-3.5 reveal">
            {FEATURED_WORDS.map((item) => (
              <div
                key={item.w}
                className={`relative bg-(--surface) border rounded-(--radius) px-4 py-5 text-center cursor-pointer transition-[transform,box-shadow,border-color] duration-180 ease-in-out hover:-translate-y-0.75 hover:border-(--accent) hover:shadow-[0_16px_30px_-20px_rgba(20,30,20,0.35)] ${
                  openWord === item.w
                    ? "-translate-y-0.75 border-(--accent) shadow-[0_16px_30px_-20px_rgba(20,30,20,0.35)]"
                    : "border-(--line)"
                }`}
                onClick={() => setOpenWord(openWord === item.w ? null : item.w)}
              >
                <div className="text-[1.5rem] font-semibold mb-1.5">{item.w}</div>
                <div className="text-[0.78rem] text-(--ink-muted)">{item.en}</div>
                <div
                  dir="ltr"
                  className={`mono overflow-hidden transition-[max-height,margin-top] duration-220 ease-in-out text-base text-(--accent) ${
                    openWord === item.w ? "max-h-7.5 mt-2" : "max-h-0"
                  }`}
                >
                  [{item.t}]
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-(--surface) border-t border-b border-(--line) py-21">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
      
              <h2>{phrases.recentWritings[lang]}</h2>
            </div>
            <div className="flex gap-2">
              <button
                className="w-8.5 h-8.5 rounded-full border border-(--line) bg-(--ground) flex items-center justify-center transition-colors duration-150 hover:border-(--accent) hover:text-(--accent)"
                aria-label={phrases.carouselPrev[lang]}
                onClick={() => scrollTrack(-1)}
              >
                →
              </button>
              <button
                className="w-8.5 h-8.5 rounded-full border border-(--line) bg-(--ground) flex items-center justify-center transition-colors duration-150 hover:border-(--accent) hover:text-(--accent)"
                aria-label={phrases.carouselNext[lang]}
                onClick={() => scrollTrack(1)}
              >
                ←
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto [scroll-snap-type:x_proximity] pb-1.5 [scrollbar-width:thin] reveal" ref={trackRef}>
            {articles.map((a) => (
              <Link className="article-card snap-start flex-none basis-70" href={`${base}/articles/${a.id}`} key={a.id}>
                <span className="lang-pill mono">{a.language.toUpperCase()}</span>
                <h4>{lang === "en" && a.nameEn ? a.nameEn : a.name}</h4>
                <span className="by">{lang === "en" && a.authorEn ? a.authorEn : a.author}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-21">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">{phrases.digitalLibrary[lang]}</p>
              <h2>{phrases.booksShelfHeading[lang]}</h2>
            </div>
            <p className="desc">{phrases.booksShelfDesc[lang]}</p>
          </div>
          <div className="grid grid-cols-4 max-[860px]:grid-cols-2 gap-3.5 reveal">
            {books.map((b, i) => {
              const rem = i % 3;
              const gradient =
                rem === 1
                  ? "bg-[linear-gradient(155deg,var(--accent-2)_0%,color-mix(in_srgb,var(--accent-2)_74%,black)_100%)]"
                  : rem === 2
                    ? "bg-[linear-gradient(155deg,#3b4a3f_0%,#212b24_100%)]"
                    : "bg-[linear-gradient(155deg,var(--accent)_0%,color-mix(in_srgb,var(--accent)_74%,black)_100%)]";
              return (
                <Link
                  className={`${gradient} text-[#f2f6f3] rounded-md px-4 py-5.5 min-h-47.5 flex flex-col justify-between shadow-[0_14px_26px_-18px_rgba(20,30,20,0.4)] transition-transform duration-180 ease-in-out hover:-translate-y-1 no-underline`}
                  href={`${base}/books`}
                  key={b.id}
                >
                  <span className="text-[0.95rem] font-semibold leading-normal">{b.title.trim()}</span>
                  <span className="text-[0.72rem] opacity-85">{b.author}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-(--surface-2) py-21">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">{phrases.historicalFiguresTitle[lang]}</p>
              <h2>{phrases.browseByEra[lang]}</h2>
            </div>
            <p className="desc">{phrases.erasSectionDesc[lang]}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end mb-7.5 reveal">
            {ERAS.map((e) => (
              <button
                key={e.key}
                className={`mono text-base px-4 py-2.25 rounded-full border transition-all duration-150 ease-in-out ${activeEra === e.key
                    ? "bg-(--accent) border-(--accent) text-white"
                    : "border-(--line) bg-(--surface) hover:border-(--accent)"
                  }`}
                onClick={() => setActiveEra(e.key)}
              >
                {phrases[e.labelKey][lang]}
              </button>
            ))}
          </div>
          <div className="bg-(--surface) border border-(--line) rounded-(--radius) p-10 text-center reveal">
            <div className="mono text-[2.9rem] text-(--accent) font-medium">
              {phrases[ERAS.find((e) => e.key === activeEra)!.labelKey][lang]}
            </div>
            <p className="text-(--ink-muted) text-[0.9rem] max-w-[50ch] mt-3 mx-auto leading-[1.7]">
              {phrases[ERAS.find((e) => e.key === activeEra)!.descKey][lang]}
            </p>
          </div>
        </div>
      </section>

   

      <section className="bg-[#16201a] text-[#eef1ea] py-24 text-center">
        <div className="wrap">

          <p className="text-[#b7c6bd] max-w-[52ch] mx-auto mb-7.5 leading-[1.8]">{phrases.contactMsgSalutation[lang]}</p>
          <h2 className="pb-2 text-[clamp(1.6rem,1.3rem+1.4vw,2.3rem)] mb-4">{phrases.closingHeading[lang]}</h2>
          <div className="cta-row justify-center!">

            <Link className="cta solid" href={`${base}/contact`}>
              {phrases.contactUs[lang]} ←
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}


