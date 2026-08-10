"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { BookOpen, Bookmark, Type, FileText, ImageIcon, Camera } from "lucide-react";
import { phrases } from "@/utils/i18n";
import Link from "@/app/components/LocaleLink";

const CardContainer = () => {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [direction, setDirection] = useState("ltr");
  const {
    alphabet,
    alphabetInfo,
    books,
    booksInfo,
    dictionary,
    dicInfo,
    articles,
    articleInfo,
    landscapeImages,
    landscapeImagesInfo,
    historicalImages,
    historicalImagesInfo,
  } = phrases;

 
  useEffect(() => {
    setDirection(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  const cardData = [
    {
      title: alphabet[lang],
      description: alphabetInfo[lang],
      icon: <Type className="w-12 h-12" />,
      route: "/alphabet",
      id: "alphabet",
    },
    {
      title: books[lang],
      description: booksInfo[lang],
      icon: <BookOpen className="w-12 h-12" />,
      route: "/books",
      id: "books",
    },
    {
      title: dictionary[lang],
      description: dicInfo[lang],
      icon: <Bookmark className="w-12 h-12" />,
      route: "/dictionary",
      id: "dictionary",
    },
    {
      title: articles[lang],
      description: articleInfo[lang],
      icon: <FileText className="w-12 h-12" />,
      route: "/articles",
      id: "articles",
    },
    {
      title: landscapeImages[lang],
      description: landscapeImagesInfo[lang],
      icon: <ImageIcon className="w-12 h-12" />,
      route: "/landscape_images",
      id: "landscape",
    },
    {
      title: historicalImages[lang],
      description: historicalImagesInfo[lang],
      icon: <Camera className="w-12 h-12" />,
      route: "/historic_images",
      id: "historical",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Card = ({ title, description, icon, route, id }: any) => (
    <Link
      key={id}
      href={route}
      className={`
        flex flex-col items-center justify-start
        p-6 m-4
        min-h-[250px]
        bg-gradient-to-br from-white to-gray-50
        border-2 border-gray-200
        rounded-xl
        shadow-md hover:shadow-xl
        cursor-pointer
        transition-all duration-300
        hover:scale-105
        hover:border-blue-300
      `}
    >
      <div className="text-blue-600 mb-4" aria-hidden="true">{icon}</div>

      <h2
        className={`
        font-bold mb-3 text-center
        ${lang === "en" ? "text-xl" : "text-2xl"}
        text-gray-800
      `}
      >
        {title}
      </h2>

      <p
        className={`
        text-center text-gray-600 leading-relaxed
        ${lang === "en" ? "text-base" : "text-lg"}
      `}
      >
        {description}
      </p>
    </Link>
  );

  return (
    <section
      dir={direction}
      className={`
        w-full max-w-6xl mx-auto px-4 py-8
        ${lang === "en" ? "font-sans" : ""}
      `}
    >
      <div className="text-center mb-8">
    
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <Card
            key={card.id || index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            route={card.route}
            id={card.id}
          />
        ))}
      </div>
    </section>
  );
};

export default CardContainer;
