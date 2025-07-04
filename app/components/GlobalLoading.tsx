"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

/**
 * GlobalLoading Component
 * A spinner component used as a Suspense fallback for loading states
 * Supports RTL/LTR layouts and multilingual text
 */
export default function GlobalLoading() {
  const { state } = useAppContext();
  const { language } = state;
  
  // Get current language for RTL/LTR direction
  const currentLanguage = language || "prs";
  const direction = currentLanguage === "en" ? "ltr" : "rtl";
  
  // Loading text in different languages
  const loadingText = {
    en: "Loading...",
    prs: "لوډ کیږي...", // Loading in Dari
    ps: "پرمخ وړل کیږي...", // Loading in Pashto
    nr: "لوډ کیږي..." // Loading in Nuristani
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm"
      dir={direction}
      role="status"
      aria-live="polite"
      aria-label={loadingText[currentLanguage]}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {loadingText[currentLanguage]}
        </p>
      </div>
    </div>
  );
}

/**
 * LoadingSpinner Component
 * A smaller spinner for inline loading states
 */
export function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}