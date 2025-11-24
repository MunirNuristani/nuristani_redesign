"use client";
import React from "react";
import Image from "next/legacy/image";
import Links from "./Links"
import Link from "next/link";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="w-full h-20 lg:h-24 bg-[var(--primary)] flex items-center bottom-0 flex-col justify-between">
      <div className="flex justify-between items-center w-full pt-3 pl-7 pr-7 pb-0">
        <Link href="/" className="relative flex justify-center items-center h-[40px] w-[40px] md:h-[40px] md:w-[40px] lg:h-[60px] lg:w-[60px] xl:h-[60px] xl:w-[60px]" aria-label="Home - Nuristani Cultural Foundation">
          <Image
            src={"/logo_original_noLabel.png"}
            alt="Nuristani Cultural Foundation Logo"
            objectFit="fill"
            layout="fill"
          />
        </Link>
        <div className="text-2xl font-bold cursor-pointer z-50">
          <Links/>
        </div>
      </div>
    
      <div className="w-full text-[8px] border-t-1">
        <p className="text-center text-xs">
          © <span>{year}</span> <a href="https://nuristani.dev" className="cursor-pointer" aria-label="Visit nuristani.dev">nuristani.dev</a>. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
