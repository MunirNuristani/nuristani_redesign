"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaEnvelope, FaArrowUp } from "react-icons/fa6";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";

export default function Footer() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}`;

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startY = window.scrollY;
    if (prefersReducedMotion || startY === 0) {
      window.scrollTo(0, 0);
      return;
    }

    const duration = 600;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY * (1 - easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const footerLinkClass =
    "no-underline text-[0.88rem] text-white/90 relative inline-block transition-colors duration-200 ease-in-out hover:text-white after:content-[''] after:absolute after:start-0 after:-bottom-0.5 after:w-0 after:h-px after:bg-white after:transition-[width] after:duration-[250ms] after:ease-in-out hover:after:w-full";
  const footerListClass = "list-none m-0 p-0 grid gap-[11px]";
  const footerHeadingClass = "mono text-[0.82rem] tracking-[0.1em] text-white/60 mb-4 uppercase";
  const footerSocialLinkClass =
    "w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white/12 border border-white/24 text-white transition-[background-color,transform,border-color] duration-200 ease-in-out hover:bg-(--accent-2) hover:border-(--accent-2) hover:-translate-y-[3px]";

  return (
    <footer className="relative overflow-hidden bg-(--accent) text-white pt-14">
      <div
        className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_58px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_58px)] [mask-image:linear-gradient(to_bottom,transparent,black_35%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
        aria-hidden="true"
      />
      <div className="wrap relative">
        <div className="flex items-center justify-between gap-5 flex-wrap pb-9 border-b border-white/[0.18] max-[480px]:flex-col max-[480px]:items-start">
          <Link href={base} className="flex items-center gap-[14px] no-underline">
            <Image src="/logo_original_noLabel_invert.png" alt="" width={54} height={54} className="block shrink-0" />
            <div>
              <h5 className="mono text-[0.92rem] tracking-[0.08em] uppercase text-white m-0">NURISTANI.INFO</h5>
              <p className="mt-[6px] text-[0.82rem] text-white/72 max-w-[34ch] leading-[1.6]">{phrases.mainH1[lang]}</p>
            </div>
          </Link>
          <button
            type="button"
            className="group flex items-center gap-[9px] bg-white/12 border border-white/30 text-white rounded-full px-5 py-[11px] text-[0.82rem] cursor-pointer transition-[background-color,transform,border-color] duration-200 ease-in-out font-[inherit] hover:bg-white/22 hover:border-white/50 hover:-translate-y-0.5"
            onClick={scrollToTop}
          >
            <span>{phrases.backToTop[lang]}</span>
            <FaArrowUp size={12} className="transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[30px] py-10 max-[860px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-[26px]">
          <div>
            <h5 className={footerHeadingClass}>{phrases.dictionary[lang]}</h5>
            <ul className={footerListClass}>
              <li><Link className={footerLinkClass} href={`${base}/alphabet`}>{phrases.alphabet[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/dictionary`}>{phrases.dictionary[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/articles`}>{phrases.articles[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/books`}>{phrases.books[lang]}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className={footerHeadingClass}>{phrases.images[lang]}</h5>
            <ul className={footerListClass}>
              <li><Link className={footerLinkClass} href={`${base}/landscape_images`}>{phrases.pictures[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/historic_images`}>{phrases.historicalImages2[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/historical-figures`}>{phrases.historicalFiguresTitle[lang]}</Link></li>
              <li><Link className={footerLinkClass} href={`${base}/calendar`}>{phrases.calendar[lang]}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className={footerHeadingClass}>{phrases.contact[lang]}</h5>
            <ul className={footerListClass}>
              <li>
                <a href="mailto:mtkgfoundation@gmail.com" dir="ltr" className="mono inline-block">
                  mtkgfoundation@gmail.com
                </a>
              </li>
            </ul>
            <div className="flex gap-[10px] mt-[18px]">
              <a className={footerSocialLinkClass} href="https://www.facebook.com/MTGCF/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF size={14} />
              </a>
              <a className={footerSocialLinkClass} href="https://www.instagram.com/mtgkfoundation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a className={footerSocialLinkClass} href="mailto:mtkgfoundation@gmail.com" aria-label="Email">
                <FaEnvelope size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-[10px] py-[22px] border-t border-white/[0.18] text-[0.78rem] text-white/62">
          <span>{phrases.copyWrite[lang]}</span>
          <span dir="ltr" className="mono">nuristani.info</span>
        </div>
      </div>
    </footer>
  );
}
