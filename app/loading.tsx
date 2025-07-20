"use client";
import React from "react";
import Image from "next/image";

function LoadingPage() {
  return (
    <div className="h-[calc(100dvh-200px)] w-screen bg-white">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <Image
          src="/logo_original_noLabel.png"
          alt="Loading..."
          width={200}
          height={200}
          className="animate-pulse mb-4"
        />
        <div className="loader"></div>
        
      </div>
    </div>
  );
}

export default LoadingPage;
