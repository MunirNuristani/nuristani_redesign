"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

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

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{books.length} {phrases.books[lang]}</p>
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
            <span className="icon">⌕</span>
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
              <a className="book-tile" href={b.linkUrl || "#"} target="_blank" rel="noopener noreferrer" key={b.id}>
                <div className="book-cover">
                  {b.coverUrl && (
                    <Image src={b.coverUrl} alt={b.title} fill sizes="260px" unoptimized style={{ objectFit: "cover" }} />
                  )}
                </div>
                <h4>{b.title.trim()}</h4>
                <span className="by">{b.author}</span>
              </a>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              {phrases.prevPage[lang]}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={p === page ? "is-active" : ""} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              {phrases.nextPage[lang]}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
