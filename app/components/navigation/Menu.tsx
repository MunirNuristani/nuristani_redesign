"use client";
import React, { useEffect, useMemo, useState } from "react";
import LangSelect from "./LangSelect";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import Link from "next/link";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type LanguageCode = "en" | "prs" | "ps" | "nr";
const Menu = (props: Props) => {
  const { setIsOpen } = props;
  const { state } = useAppContext();
  const { language }: { language: LanguageCode } = state;
  const [isClient, setIsClient] = useState(false);
  const [ lang, setLang ] = useState("en");

  const {
    homePage,
    alphabet,
    dictionary,
    articles,
    books,
    pictures,
    technology,
    contact,
    mainH1,
  } = phrases;

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLang(language);
  }, [language]);

  // Memoize options to ensure they update when language changes
  const options = useMemo(() => {
    if (!isClient || !language) {
      // Return default options during SSR or when language is not ready
      return [
        { key: 1, label: "Home", link: "/" },
        { key: 2, label: "Alphabet", link: "/Alphabet" },
        { key: 3, label: "Dictionary", link: "/dictionary" },
        { key: 4, label: "Articles", link: "/Articles" },
        { key: 5, label: "Books", link: "/Books" },
        { key: 6, label: "Pictures", link: "/LandScapes" },
        { key: 7, label: "Historic", link: "/Historic" },
        { key: 8, label: "Technology", link: "/Technology" },
        { key: 9, label: "Contact", link: "/Contact" },
      ];
    }

    return [
      {
        key: 1,
        label: homePage[language],
        link: "/",
      },
      {
        key: 2,
        label: alphabet[language] || "Alphabet",
        link: "/alphabet",
      },
      {
        key: 3,
        label: dictionary[language] || "Dictionary",
        link: "/dictionary",
      },
      {
        key: 4,
        label: articles[language] || "Articles",
        link: "/articles",
      },
      {
        key: 5,
        label: books[language] || "Books",
        link: "/books",
      },
      {
        key: 6,
        label: pictures[language] || "Pictures",
        link: "/landscape_images",
      },
      {
        key: 7,
        label: pictures[language] || "Historic",
        link: "/historic_images",
      },
      {
        key: 8,
        label: technology[language] || "Technology",
        link: "/technology",
      },
      {
        key: 9,
        label: contact[language] || "Contact",
        link: "/contact",
      },
    ];
  }, [
    language,
    isClient,
    homePage,
    alphabet,
    dictionary,
    articles,
    books,
    pictures,
    technology,
    contact,
  ]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-row w-full max-w-full overflow-hidden">
      <div className="w-1/2 hidden lg:flex justify-center items-center flex-col gap-y-4">
        <div>
          <Image
            src="/logo_original_noLabel.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <h1>{mainH1[lang as keyof typeof mainH1]}</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="mx-8 my-4 gap-2">
          {options.map((option) => {
            return (
              <div
                key={option.key}
                className={`relative min-w-full flex-grow-0 flex items-center justify-start overflow-x-hidden md:my-2 my-4  px-1 py-1 overflow-hidden after:content-[''] after:bg-[var(--color-secondary)] after:h-1 after:w-0 after:transition-all after:duration-300 hover:after:w-full after:bottom-0 after:absolute ${
                  isClient
                    ? language === "en"
                      ? "after:left-0"
                      : "after:right-0"
                    : "after:left-0"
                } `}
              >
                <Link
                  href={option.link}
                  className="text-2xl w-full font-bold cursor-pointer z-50"
                  onClick={handleClose}
                >
                  {option.label}
                </Link>
              </div>
            );
          })}
          <LangSelect setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
