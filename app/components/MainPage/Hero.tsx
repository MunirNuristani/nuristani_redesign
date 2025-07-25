"use client";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
export default function Hero() {
  const { state } = useAppContext();
  const { language: lang } = state; 
  const { mainH1, statementTitle } = phrases;


  return (
    <div>
      <div
        className=" hidden md:flex relative w-full h-[calc(100dvh-200px)] bg-cover bg-center bg-no-repeat  items-center justify-center mt-"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
        {/*  */}
        <HeroSection
          lang={lang}
          mainH1={mainH1}
          statementTitle={statementTitle}
        />
      </div>
      <div
        className=" flex md:hidden relative w-full h-[calc(100dvh-150px)] bg-cover bg-center bg-no-repeat  items-center justify-center mt-"
        style={{ backgroundImage: "url('/heroImage01.png')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
        <HeroSection lang={lang} mainH1={mainH1} statementTitle={statementTitle} />
        {/*  */}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HeroSection = ({ lang, mainH1, statementTitle }: any) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl flex flex-col md:flex-row items-center p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10 max-w-5xl mx-4">
      {/* Left Section */}
      <div className="flex flex-col items-start space-y-4 gap-6">
        {/* Logo */}
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center justify-center w-20 h-20">
            <Image
              src="/logo_original.png"
              alt="Foundation Logo"
              className="object-contain"
              width={1000}
              height={1000}
            />
          </div>
        </div>
        {/* Title */}
        <div className="w-full flex justify-center items-center ">
          <h1 className=" align-middle text-2xl md:text-3xl font-bold text-gray-900">
            {mainH1[lang]}
          </h1>
        </div>
        {/* Description */}
        <p className="text-gray-700 text-base md:text-lg">
          {statementTitle[lang]}
        </p>
        {/* Button */}
        <Button
          variant="outlined"
          endIcon={
            <svg
              className={`ml-2 w-4 h-4 ${lang === "en" ? "" : "rotate-180"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          }
        >
          Learn More
        </Button>
      </div>

      {/* Right Section - Cultural Pattern */}
      <div className="w-full md:w-1/2 hidden md:block">
        <Image
          src="/heroImage01.png"
          alt="Traditional Nuristani Design"
          className="w-full object-contain"
          width={800}
          height={800}
        />
      </div>
    </div>
  );
};
