"use client";
import React from "react";
import Image from "next/image";

function LoadingPage() {
  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col justify-center items-center h-full">
        <Image
          src="/logo_original_noLabel.png"
          alt="Loading..."
          width={80}
          height={80}
          className="animate-pulse mb-4"
        />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingPage;
