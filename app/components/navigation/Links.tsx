"use client";
import React from "react";
import { Mail } from "lucide-react";

const Links = () => {
  return (
    <div
      className={`flex flex-row-reverse justify-center items-center text-lg lg:text-3xl `}
    >
      <a
        href="https://www.facebook.com/MTGCF/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our Facebook page"
      >
        <svg
          className="mx-2 lg:mx-4 w-[1em] h-[1em]"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/mtgkfoundation/"
        target="_blank"
        rel="noopener noreferrer"
        className="border-r-2"
        aria-label="Visit our Instagram page"
      >
        <svg
          className="mx-2 lg:mx-4 w-[1em] h-[1em]"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
      <a
        href="mailto:mtkgfoundation@gmail.com,nuristani.munir@gmail.com"
        className="border-r-2"
        aria-label="Send us an email"
      >
        <Mail className="mx-2 lg:mx-4 w-[1em] h-[1em]" aria-hidden="true" />
      </a>
    </div>
  );
};

export default Links;
