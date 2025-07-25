"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { FaBookReader } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";
import { BsType } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { phrases } from "@/utils/i18n";
import { useRouter } from "next/navigation";

const CardContainer = () => {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [direction, setDirection] = useState("ltr");
  const router = useRouter();
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

 
  const handleRouting = (route: string) => {
    console.log(`Navigating to: ${route}`);
    router.push(route);
    // dispatch({ type: "LOADINGPAGE", payload: true });
  };

  useEffect(() => {
    setDirection(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  const cardData = [
    {
      title: alphabet[lang],
      description: alphabetInfo[lang],
      icon: <BsType className="w-12 h-12" />,
      route: "/alphabet",
      id: "alphabet",
    },
    {
      title: books[lang],
      description: booksInfo[lang],
      icon: <FaBookReader className="w-12 h-12" />,
      route: "/books",
      id: "books",
    },
    {
      title: dictionary[lang],
      description: dicInfo[lang],
      icon: <IoBookmarks className="w-12 h-12" />,
      route: "/dictionary",
      id: "dictionary",
    },
    {
      title: articles[lang],
      description: articleInfo[lang],
      icon: <FiFileText className="w-12 h-12" />,
      route: "/articles",
      id: "articles",
    },
    {
      title: landscapeImages[lang],
      description: landscapeImagesInfo[lang],
      icon: <FaRegImage className="w-12 h-12" />,
      route: "/landscape_images",
      id: "landscape",
    },
    {
      title: historicalImages[lang],
      description: historicalImagesInfo[lang],
      icon: <IoCameraOutline className="w-12 h-12" />,
      route: "/historic_images",
      id: "historical",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Card = ({ title, description, icon, route, id }: any) => (
    <div
      key={id}
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
      onClick={() => handleRouting(route)}
    >
      <div className="text-blue-600 mb-4">{icon}</div>

      <h3
        className={`
        font-bold mb-3 text-center
        ${lang === "en" ? "text-xl" : "text-2xl"}
        text-gray-800
      `}
      >
        {title}
      </h3>

      <p
        className={`
        text-center text-gray-600 leading-relaxed
        ${lang === "en" ? "text-base" : "text-lg"}
      `}
      >
        {description}
      </p>
    </div>
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
