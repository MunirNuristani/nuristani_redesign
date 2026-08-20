"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";
import LangSwitch from "./LangSwitch";

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  submenu?: { key: string; label: string; href: string }[];
}

export default function Menu({ onClose }: { onClose: () => void }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}`;

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const {
    homePage, alphabet, dictionary, articles, books, images, pictures,
    historicalImages2, historicalFiguresTitle, calendar, technology, contact, mainH1,
  } = phrases;

  const items: MenuItem[] = useMemo(
    () => [
      { key: "home", label: homePage[lang], href: base },
      { key: "alphabet", label: alphabet[lang], href: `${base}/alphabet` },
      { key: "dictionary", label: dictionary[lang], href: `${base}/dictionary` },
      { key: "articles", label: articles[lang], href: `${base}/articles` },
      { key: "books", label: books[lang], href: `${base}/books` },
      {
        key: "images",
        label: images[lang],
        submenu: [
          { key: "landscape", label: pictures[lang], href: `${base}/landscape_images` },
          { key: "historic", label: historicalImages2[lang], href: `${base}/historic_images` },
          { key: "figures", label: historicalFiguresTitle[lang], href: `${base}/historical-figures` },
        ],
      },
      { key: "calendar", label: calendar[lang], href: `${base}/calendar` },
      { key: "technology", label: technology[lang], href: `${base}/technology` },
      { key: "contact", label: contact[lang], href: `${base}/contact` },
    ],
    [base, lang, homePage, alphabet, dictionary, articles, books, images, pictures, historicalImages2, historicalFiguresTitle, calendar, technology, contact]
  );

  const menuLinkClass =
    "relative flex items-center justify-between w-full py-4 px-0.5 text-[1.3rem] font-semibold no-underline text-(--ink) bg-transparent border-0 text-start hover:text-(--accent) max-[860px]:text-[1.1rem]";

  return (
    <div className="relative flex min-h-dvh">
      <button
        className="fixed top-[18px] end-5 z-[1] w-10 h-10 flex items-center justify-center bg-transparent border-0 rounded-full text-(--ink) transition-colors duration-150 ease-in-out hover:bg-(--surface-2)"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        className="flex-1 hidden min-[861px]:flex flex-col items-center justify-center gap-[18px] border-e border-(--line) cursor-pointer"
        onClick={onClose}
      >
        <Image src="/logo_original_noLabel.png" alt="Nuristani Cultural Foundation Logo" width={90} height={90} />
        <h2 className="text-[1.2rem] text-center max-w-[22ch] m-0">{mainH1[lang] || mainH1.en}</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-1 max-w-[560px] mx-auto w-full pt-[90px] px-[26px] pb-[50px] min-[861px]:pt-0 min-[861px]:px-11 min-[861px]:pb-15">
        {items.map((item) => {
          const hasSubmenu = !!item.submenu?.length;
          const isSubmenuOpen = openSubmenu === item.key;
          return (
            <div className="border-b border-(--line)" key={item.key}>
              {hasSubmenu ? (
                <button className={menuLinkClass} onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.key)}>
                  <span>{item.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`shrink-0 transition-transform duration-200 ease-in-out ${isSubmenuOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link className={menuLinkClass} href={item.href!} onClick={onClose}>
                  {item.label}
                </Link>
              )}

              {hasSubmenu && (
                <div
                  className={`overflow-hidden transition-[max-height] duration-[250ms] ease-in-out ${
                    isSubmenuOpen ? "max-h-[220px]" : "max-h-0"
                  }`}
                >
                  {item.submenu!.map((sub) => (
                    <Link
                      className="block pt-[10px] pr-[2px] pb-[14px] pl-[18px] text-[1.02rem] font-medium no-underline text-(--ink-muted) hover:text-(--accent-2)"
                      href={sub.href}
                      key={sub.key}
                      onClick={onClose}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-[22px] max-w-[200px]">
          <LangSwitch />
        </div>
      </div>
    </div>
  );
}
