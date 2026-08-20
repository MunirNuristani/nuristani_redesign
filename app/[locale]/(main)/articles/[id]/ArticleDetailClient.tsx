"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";
import { ArticleBlock, isArticleBlocks } from "@/utils/articleBlocks";

export interface ArticlePicture {
  id: string;
  url: string;
}

export interface ArticleData {
  name: string;
  nameEn: string;
  author: string;
  authorEn: string;
  language: string;
  body: string | ArticleBlock[];
  pictures: ArticlePicture[];
}



export default function ArticleDetailClient({ article }: { article: ArticleData | null }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}`;
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!article) {
    return (
      <div className="dict-results" style={{ maxWidth: 860 }}>
        <div className="dict-empty">
          <h3>{phrases.noResultFound[lang]}</h3>
          <Link href={`${base}/articles`} className="back-link">
            {phrases.returnBack[lang]}
          </Link>
        </div>
      </div>
    );
  }

  const title = lang === "en" && article.nameEn ? article.nameEn : article.name;
  const authorName = lang === "en" && article.authorEn ? article.authorEn : article.author;

  const bodyDir = article.language === "en" ? "ltr" : "rtl";
  const blocks = isArticleBlocks(article.body) ? article.body : null;
  const [cover, ...rest] = blocks ? [] : article.pictures;

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <div className="flex mb-[22px]">
            <Link
              href={`${base}/articles`}
              className="group inline-flex items-center gap-[7px] text-[0.85rem] font-semibold text-(--ink) no-underline ps-[14px] pe-[18px] py-[9px] border border-(--line) rounded-full bg-(--surface) transition-[border-color,color,transform,box-shadow] duration-150 ease-in-out hover:border-(--accent) hover:text-(--accent) hover:-translate-y-[1px] hover:shadow-[0_10px_20px_-16px_rgba(20,30,20,0.4)]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                className="transition-transform duration-150 ease-in-out rtl:scale-x-[-1] group-hover:-translate-x-[3px] rtl:group-hover:translate-x-[3px]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {phrases.returnBack[lang]}
            </Link>
          </div>
          <h1>{title}</h1>
          <p className="kicker">
            {phrases.author[lang]}: {authorName || "—"} 
          </p>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 860 }}>
        {blocks ? (
          <div className="article-body" dir={bodyDir}>
            {blocks.map((block, i) => {
              switch (block.type) {
                case "heading":
                  return <h2 key={i} dangerouslySetInnerHTML={{ __html: block.content }} />;
                case "quote":
                  return <blockquote key={i} dangerouslySetInnerHTML={{ __html: block.content }} />;
                case "list": {
                  const ListTag = block.ordered ? "ol" : "ul";
                  return (
                    <ListTag key={i}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ListTag>
                  );
                }
                case "image":
                  return (
                    <figure className="my-[30px]" key={i}>
                      <div className="relative w-full aspect-[16/9] rounded-(--radius) overflow-hidden bg-(--surface-2) shadow-[0_14px_34px_-22px_rgba(20,30,20,0.35)]">
                        <Image
                          src={block.url}
                          alt={block.caption || title}
                          fill
                          sizes="(max-width: 860px) 100vw, 860px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-[10px] text-[0.85rem] text-(--ink-muted) text-center">{block.caption}</figcaption>
                      )}
                    </figure>
                  );
                case "paragraph":
                default:
                  return <p key={i} dangerouslySetInnerHTML={{ __html: block.content }} />;
              }
            })}
          </div>
        ) : (
          <>
            {cover && (
              <div className="relative w-full aspect-[16/9] rounded-(--radius) overflow-hidden bg-(--surface-2) mb-[34px] shadow-[0_14px_34px_-22px_rgba(20,30,20,0.35)]">
                <Image
                  src={cover.url}
                  alt={title}
                  fill
                  sizes="(max-width: 860px) 100vw, 860px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            )}

            <div className="article-body" dir={bodyDir} dangerouslySetInnerHTML={{ __html: article.body as string }} />

            {rest.length > 0 && (
              <>
                <div className="result-section-label">{phrases.morePics[lang]}</div>
                <div className="gallery-grid">
                  {rest.map((p, i) => (
                    <div className="gallery-item" key={p.id || i} onClick={() => setLightbox(p.url)}>
                      <div className="gallery-media">
                        <Image
                          src={p.url}
                          alt={`${title} ${i + 2}`}
                          fill
                          sizes="220px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="close-btn" aria-label="close" onClick={() => setLightbox(null)}>
            ✕
          </button>
          <Image
            src={lightbox}
            alt=""
            width={1200}
            height={900}
            style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "85vh" }}
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
