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
  const base = `/${locale}/new`;

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
      <header className="site-header">
        <div className="site-header-inner">
          <Link href={base} className="site-logo" aria-label="Home - Nuristani Cultural Foundation">
            <Image src="/logo_original_noLabel_invert.png" alt="Nuristani Cultural Foundation Logo" width={100} height={100} />
          </Link>
          <h1 className="site-h1">{phrases.mainH1[lang] || phrases.mainH1.en}</h1>
          <div className="site-menu-btn" aria-controls="new-main-navigation">
            <Hamburger toggled={isOpen} toggle={setIsOpen} color={isOpen ? "#1a221d" : "#fff"} label={isOpen ? "Close navigation menu" : "Open navigation menu"} size={22} />
          </div>
        </div>
      </header>

      <div id="new-main-navigation" className={`menu-overlay${isOpen ? " is-open" : ""}`}>
        <Menu onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
}
