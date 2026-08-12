"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";

export default function Footer() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}/new`;

  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h5>NURISTANI.INFO</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.7, maxWidth: "32ch" }}>
              {phrases.mainH1[lang]}
            </p>
          </div>
          <div>
            <h5>{phrases.dictionary[lang]}</h5>
            <ul>
              <li><Link href={`${base}/alphabet`}>{phrases.alphabet[lang]}</Link></li>
              <li><Link href={`${base}/dictionary`}>{phrases.dictionary[lang]}</Link></li>
              <li><Link href={`${base}/articles`}>{phrases.articles[lang]}</Link></li>
              <li><Link href={`${base}/books`}>{phrases.books[lang]}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{phrases.images[lang]}</h5>
            <ul>
              <li><Link href={`${base}/landscape_images`}>{phrases.pictures[lang]}</Link></li>
              <li><Link href={`${base}/historic_images`}>{phrases.historicalImages2[lang]}</Link></li>
              <li><Link href={`${base}/historical-figures`}>{phrases.historicalFiguresTitle[lang]}</Link></li>
              <li><Link href={`${base}/calendar`}>{phrases.calendar[lang]}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{phrases.contact[lang]}</h5>
            <ul>
              <li><a href="https://www.facebook.com/MTGCF/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.instagram.com/mtgkfoundation/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="mailto:mtkgfoundation@gmail.com" className="mono" style={{ direction: "ltr", display: "inline-block" }}>mtkgfoundation@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{phrases.copyWrite[lang]}</span>
          <span className="mono">nuristani.info/new</span>
        </div>
      </div>
    </footer>
  );
}
