"use client";

import React, { useState, useRef } from "react";

interface AudioPlayProps {
  src: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * AudioPlay Component
 * A simple audio player with play/pause functionality
 */
export default function AudioPlay({ src, ariaLabel, className = "" }: AudioPlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    console.error("Error loading audio file:", src);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />
      
      <button
        onClick={handlePlay}
        disabled={isLoading}
        aria-label={ariaLabel || "Play audio"}
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </div>
  );
}