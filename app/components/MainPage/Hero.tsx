"use client";
import Button from "@mui/material/Button";
import Image from "next/image";
export default function Hero() {
  return (
    <div>
      <div
        className=" hidden md:flex relative w-full h-[calc(100dvh-200px)] bg-cover bg-center bg-no-repeat  items-center justify-center mt-"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
        {/*  */}
        <HeroSection />
      </div>
      <div
        className=" flex md:hidden relative w-full h-[calc(100dvh-150px)] bg-cover bg-center bg-no-repeat  items-center justify-center mt-"
        style={{ backgroundImage: "url('/heroImage01.png')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
        <HeroSection />
        {/*  */}
      </div>
    </div>
  );
}

const HeroSection = () => {
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
            Mirza Taza Gul Khan <br /> Cultural Foundation
          </h1>
        </div>
        {/* Description */}
        <p className="text-gray-700 text-base md:text-lg">
          Our objective is to gather and present information about Nuristan’s
          history, language, and culture.
        </p>
        {/* Button */}
        <Button
          variant="outlined"
          endIcon={
            <svg
              className="ml-2 w-4 h-4"
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
      <div className="w-full md:w- hidden md:block">
        <Image
          src="/heroImage01.png"
          alt="Traditional Nuristani Design"
          className="w-full object-contain"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};
