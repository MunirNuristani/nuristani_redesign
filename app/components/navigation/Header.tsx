"use client";
import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Hamburger from "hamburger-react";
import Menu from "./Menu";
import { phrases } from "@/utils/i18n";
import { useAppContext } from "@/context/AppContext";
import { Language } from "@/context/Reducer";

const Header = () => {
  const { state } = useAppContext();
  const { language }: { language: Language } = state;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lang, setLang] = useState("en");

  const { mainH1 } = phrases;

  useEffect(() => {
    setLang(language);
  }, [language]);
  return (
    <>
      <header className="w-full h-20 bg-[var(--color-secondary)] flex items-center overflow-hidden">
        <div className="flex justify-between items-center w-full px-7">
          <a href="/" className="relative h-[60px] w-[60px]" aria-label="Home - Nuristani Cultural Foundation">
            <Image
              src={"/logo_original_noLabel_invert.png"}
              alt="Nuristani Cultural Foundation Logo"
              width={100}
              height={100}
            />
          </a>
          <div>
            <h1 className="hidden lg:flex text-2xl font-bold text-white">
              {mainH1[lang as keyof typeof mainH1]}
            </h1>
          </div>
          <button
            className="text-2xl font-bold cursor-pointer z-50"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="main-navigation"
          >
            <Hamburger
              toggled={isOpen}
              toggle={setIsOpen}
              color={isOpen ? "var(--color-secondary)" : "white"}
            />
          </button>
        </div>
      </header>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`fixed overflow-hidden transition-all duration-500 ease top-0 right-0 h-screen flex justify-center items-center menuBG z-40 ${
          isOpen ? "w-full" : "w-0"
        } `}
      >
        <Menu setIsOpen={setIsOpen} />
      </nav>
    </>
  );
};

export default Header;
