"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { trackSession, trackPageVisit, trackButtonClick } from "@/utils/analytics";

export interface Book {
  id: string;
  title: string;
  author: string;
  translator: string;
  coverUrl: string | null;
  linkUrl: string | null;
}

const PER_PAGE = 12;

export default function BooksListClient({ books }: { books: Book[] }) {
  const { state } = useAppContext();
  const { language: lang } = state;

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    trackSession();
    trackPageVisit("books-library");
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return books;
    const needle = q.trim().toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(needle) ||
        b.author.toLowerCase().includes(needle) ||
        b.translator.toLowerCase().includes(needle)
    );
  }, [books, q]);

  useEffect(() => setPage(1), [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goToPage = (p: number) => {
    trackButtonClick({
      buttonType: "suggestion-click",
      buttonLabel: `Page ${p}`,
      additionalData: { fromPage: page, toPage: p, totalPages },
    });
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <h1>{phrases.digitalLibrary[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1080 }}>
        <div className="list-toolbar">
          <div className="list-search">
            <input
              type="text"
              placeholder={phrases.bookSearchPlaceholder[lang]}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="11" cy="11" r="7" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3" />
              </svg>
            </span>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="list-empty">
            <h3>{phrases.noBookFound[lang]}</h3>
            <p>{phrases.noBookFoundDetail[lang]}</p>
          </div>
        ) : (
          <div className="list-grid">
            {pageItems.map((b) => (
              <a
                className="bg-(--surface) border border-(--line) rounded-(--radius) p-4 no-underline text-inherit flex flex-col h-full shadow-[0_8px_20px_-16px_rgba(20,30,20,0.35)] transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:border-(--accent) hover:shadow-[0_16px_30px_-18px_rgba(20,30,20,0.4)]"
                href={b.linkUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                key={b.id}
                onClick={() =>
                  trackButtonClick({
                    buttonType: "suggestion-click",
                    buttonLabel: b.title,
                    additionalData: { bookId: b.id, author: b.author, translator: b.translator || "N/A" },
                  })
                }
              >
                <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-(--surface-2) mb-3">
                  {b.coverUrl && (
                    <Image src={b.coverUrl} alt={b.title} fill sizes="260px" unoptimized style={{ objectFit: "cover" }} />
                  )}
                </div>
                <h4 className="text-[0.92rem] font-semibold mb-1 leading-[1.4]">{b.title.trim()}</h4>
                <span className="text-[0.78rem] text-(--ink-muted) mt-auto pt-[10px] border-t border-dashed border-(--line)">{b.author}</span>
              </a>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-[6px] mt-10 flex-wrap">
            <button
              className="min-w-9 h-9 px-2.5 rounded-[7px] border border-(--line) bg-(--surface) text-[1.1rem] mono disabled:opacity-40"
              disabled={page === 1}
              onClick={() => goToPage(Math.max(1, page - 1))}
            >
              {phrases.prevPage[lang]}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`min-w-9 h-9 px-2.5 rounded-[7px] border text-[1.1rem] mono disabled:opacity-40 ${
                  p === page ? "bg-(--accent) border-(--accent) text-white" : "border-(--line) bg-(--surface)"
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="min-w-9 h-9 px-2.5 rounded-[7px] border border-(--line) bg-(--surface) text-[1.1rem] mono disabled:opacity-40"
              disabled={page === totalPages}
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
            >
              {phrases.nextPage[lang]}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
