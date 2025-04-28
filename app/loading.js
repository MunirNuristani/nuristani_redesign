"use client";
import React from "react";
import Image from "next/image"

function LoadingPage() {
  return (
    <div class="h-screen bg-white">
      <div class="flex justify-center items-center h-full">
        <Image
          class="h-16 w-16"
          src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
          alt=""
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}

export default LoadingPage;
