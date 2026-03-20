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

interface MenuItem {
  key: number;
  label: string;
  link?: string;
  submenu?: MenuItem[];
}

type LanguageCode = "en" | "prs" | "ps" | "nr";
const Menu = (props: Props) => {
  const { setIsOpen } = props;
  const { state } = useAppContext();
  const { language }: { language: LanguageCode } = state;
  const [isClient, setIsClient] = useState(false);
  const [ lang, setLang ] = useState("en");
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const {
    homePage,
    alphabet,
    dictionary,
    articles,
    books,
    pictures,
    images,
    technology,
    contact,
    mainH1,
    historicalImages2,
    historicalFiguresTitle,
    calendar,
  } = phrases;

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLang(language);
  }, [language]);

  // Memoize options to ensure they update when language changes
  const options: MenuItem[] = useMemo(() => {
    if (!isClient || !language) {
      // Return default options during SSR or when language is not ready
      return [
        { key: 1, label: "Home", link: "/" },
        { key: 2, label: "Alphabet", link: "/Alphabet" },
        { key: 3, label: "Dictionary", link: "/dictionary" },
        { key: 4, label: "Articles", link: "/Articles" },
        { key: 5, label: "Books", link: "/Books" },
        {
          key: 6,
          label: "Images",
          submenu: [
            { key: 61, label: "Pictures", link: "/LandScapes" },
            { key: 62, label: "Historic", link: "/Historic" },
            { key: 63, label: "Historical Figures", link: "/historical-figures" },
          ]
        },
        { key: 7, label: "Calendar", link: "/calendar" },
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
        label: images[language] || "Images",
        submenu: [
          {
            key: 61,
            label: pictures[language] || "Pictures",
            link: "/landscape_images",
          },
          {
            key: 62,
            label: historicalImages2[language] || "Historic",
            link: "/historic_images",
          },
          {
            key: 63,
            label: historicalFiguresTitle[language] || "Historical Figures",
            link: "/historical-figures",
          },
        ]
      },
      {
        key: 7,
        label: calendar[language] || "Calendar",
        link: "/calendar",
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
  }, [isClient, language, homePage, alphabet, dictionary, articles, books, pictures, images, historicalImages2, historicalFiguresTitle, calendar, technology, contact]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const toggleSubmenu = (key: number) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  return (
    <div className="flex flex-row w-full max-w-full overflow-hidden">
      <div className="w-1/2 hidden lg:flex justify-center items-center flex-col gap-y-4">
        <div>
          <Image
            src="/logo_original_noLabel.png"
            alt="Nuristani Cultural Foundation Logo"
            width={100}
            height={100}
          />
        </div>
        <h2 className="text-center">{mainH1[lang as keyof typeof mainH1]}</h2>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-8 my-4 gap-2">
          {options.map((option) => {
            const hasSubmenu = option.submenu && option.submenu.length > 0;
            const isSubmenuOpen = openSubmenu === option.key;

            return (
              <div key={option.key} className="transition-all duration-300 ease-in-out">
                {/* Main menu item */}
                <div
                  className={`relative w-full flex-grow-0 flex items-center justify-start md:my-2 my-4 px-1 py-1 ${
                    !hasSubmenu ? `after:content-[''] after:bg-[var(--color-secondary)] after:h-1 after:w-0 after:transition-all after:duration-300 hover:after:w-full after:bottom-0 after:absolute ${
                      isClient
                        ? language === "en"
                          ? "after:left-0"
                          : "after:right-0"
                        : "after:left-0"
                    }` : ""
                  }`}
                >
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(option.key)}
                      className="text-2xl w-full font-bold cursor-pointer z-50 flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      <svg
                        className={`w-6 h-6 transition-transform duration-200 ${
                          isSubmenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={option.link || "#"}
                      className="text-2xl w-full font-bold cursor-pointer z-50"
                      onClick={handleClose}
                    >
                      {option.label}
                    </Link>
                  )}
                </div>

                {/* Submenu items */}
                {hasSubmenu && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSubmenuOpen
                        ? "max-h-96 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-6">
                      {option.submenu!.map((subItem) => (
                        <div
                          key={subItem.key}
                          className={`relative w-full flex items-center justify-start overflow-x-hidden my-2 px-1 py-1 overflow-hidden after:content-[''] after:bg-[var(--color-accent)] after:h-1 after:w-0 after:transition-all after:duration-300 hover:after:w-full after:bottom-0 after:absolute ${
                            isClient
                              ? language === "en"
                                ? "after:left-0"
                                : "after:right-0"
                              : "after:left-0"
                          }`}
                        >
                          <Link
                            href={subItem.link || "#"}
                            className="text-xl w-full font-semibold cursor-pointer z-50"
                            onClick={handleClose}
                          >
                            {subItem.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
