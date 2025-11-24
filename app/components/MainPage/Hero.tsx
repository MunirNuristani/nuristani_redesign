"use client";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
export default function Hero() {
  const { state } = useAppContext();
  const { language: lang } = state; 
  const { mainH1, statementTitle, learnMore } = phrases;


  return (
    <div>
      {/* Desktop Hero */}
      <div className="hidden md:flex relative w-full h-[calc(100dvh-200px)] items-center justify-center overflow-hidden">
        <Image
          src="/bg.jpg"
          alt="Nuristani cultural background"
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-white/40 z-10"></div>
        <div className="relative z-20">
          <HeroSection
            lang={lang}
            mainH1={mainH1}
            statementTitle={statementTitle}
            learnMore={learnMore}
          />
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="flex md:hidden relative w-full h-[calc(100dvh-150px)] items-center justify-center overflow-hidden">
        <Image
          src="/heroImage01.png"
          alt="Nuristani cultural design"
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-white/40 z-10"></div>
        <div className="relative z-20">
          <HeroSection lang={lang} mainH1={mainH1} statementTitle={statementTitle} learnMore={learnMore} />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HeroSection = ({ lang, mainH1, statementTitle, learnMore }: any) => {
  const isRTL = lang !== "en";

  return (
    <div
      className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl flex flex-col md:flex-row items-center p-6 md:p-8 lg:p-10 space-y-6 md:space-y-0 md:space-x-8 lg:space-x-10 w-[95%] min-w-5xl lg:max-w-6xl mx-auto"
      style={{ minHeight: '400px' }}
    >
      {/* Left Section - Text Content */}
      <div className="flex flex-col items-start space-y-4 gap-4 md:w-1/2 min-w-">
        {/* Logo */}
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center justify-center w-20 h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 relative flex-shrink-0">
            <Image
              src="/logo_original.png"
              alt="Mirza Taza Gul Khan Cultural Foundation Logo"
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        {/* Title */}
        <div className="w-full flex justify-center items-center" style={{ minHeight: '80px' }}>
          <h1
            className={`font-bold text-gray-900  leading-tight w-full ${
              isRTL
                ? 'text-3xl md:text-4xl lg:text-5xl'
                : 'text-2xl md:text-3xl lg:text-4xl'
            }`}
            style={{
              lineHeight: isRTL ? '1.4' : '1.2',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {mainH1[lang]}
          </h1>
        </div>
        {/* Description */}
        <div className="w-full" style={{ minHeight: '100px' }}>
          <p
            className={`text-gray-700  ${
              isRTL
                ? 'text-base md:text-lg lg:text-xl leading-loose'
                : 'text-base md:text-lg lg:text-xl leading-relaxed'
            }`}
            style={{
              lineHeight: isRTL ? '1.8' : '1.6',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {statementTitle[lang]}
          </p>
        </div>
        {/* Button */}
        <div className="w-full flex justify-center md:justify-start pt-2">
          <Button
            variant="outlined"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem', lg: '1.125rem' },
              padding: { xs: '8px 16px', md: '10px 20px', lg: '12px 24px' },
              minWidth: '140px',
            }}
            endIcon={
              <svg
                className={`ml-2 w-4 h-4 lg:w-5 lg:h-5 ${lang === "en" ? "" : "rotate-180"}`}
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
           { learnMore[lang]}
          </Button>
        </div>
      </div>

      {/* Right Section - Cultural Pattern Image */}
      <div className="w-full md:w-1/2 hidden md:flex relative aspect-square max-w-[300px] lg:max-w-[400px] flex-shrink-0">
        <Image
          src="/heroImage01.png"
          alt="Traditional Nuristani cultural design pattern"
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 300px, 100vw"
          className="object-contain"
          loading="eager"
        />
      </div>
    </div>
  );
};
