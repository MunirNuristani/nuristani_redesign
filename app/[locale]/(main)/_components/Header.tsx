"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Hamburger from "hamburger-react";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Locale } from "@/utils/locales";
import Menu from "./Menu";

export default function Header() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const params = useParams();
  const locale = params.locale as Locale;
  const base = `/${locale}`;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-(--accent)">
        <div className="flex items-center justify-between gap-5 max-w-[1220px] mx-auto py-[14px] px-10 max-[860px]:px-5 max-[860px]:py-3">
          <Link href={base} className="shrink-0 block w-[52px] h-[52px] relative" aria-label="Home - Nuristani Cultural Foundation">
            <Image src="/logo_original_noLabel_invert.png" alt="Nuristani Cultural Foundation Logo" width={100} height={100} />
          </Link>
          <h1 className="flex-1 text-center text-white text-[1.15rem] font-semibold m-0 hidden min-[861px]:block">
            {phrases.mainH1[lang] || phrases.mainH1.en}
          </h1>
          <div className="relative z-[60] shrink-0 flex items-center" aria-controls="new-main-navigation">
            <Hamburger toggled={isOpen} toggle={setIsOpen} color={isOpen ? "#1a221d" : "#fff"} label={isOpen ? "Close navigation menu" : "Open navigation menu"} size={22} />
          </div>
        </div>
      </header>

      <div
        id="new-main-navigation"
        className={`fixed inset-0 z-50 bg-(--ground) overflow-y-auto transition-[opacity,visibility] duration-300 ease-in-out ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <Menu onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
}
