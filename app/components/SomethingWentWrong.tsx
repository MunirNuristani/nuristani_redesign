"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

interface SomethingWentWrongProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * SomethingWentWrong Component
 * Displays an error message with optional retry functionality
 */
export default function SomethingWentWrong({ 
  message = "Something went wrong", 
  onRetry 
}: SomethingWentWrongProps) {
  const { state } = useAppContext();
  const { language } = state;
  const currentLanguage = language || "prs";
  const direction = currentLanguage === "en" ? "ltr" : "rtl";

  return (
    <div 
      dir={direction}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="mb-6">
        <svg 
          className="w-16 h-16 mx-auto text-red-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 max-w-md">
          {message}
        </p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}