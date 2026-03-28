"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import LoadingPage from "../loading";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

interface HistoricalFigure {
  id: string;
  imageUrl: string;
  imagePath: string;
  caption: {
    en: string;
    prs: string;
    ps: string;
    nr: string;
  };
  era: string;
  createdAt: unknown;
  updatedAt: unknown;
}

function HistoricalFigures() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const { historicalFiguresTitle, notFound } = phrases;

  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);
  const [dir, setDir] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Pagination for slow internet connections
  const [displayCount, setDisplayCount] = useState<number>(24);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    if (lang !== null) {
      setDir(lang === "en" ? "ltr" : "rtl");
    }
  }, [lang]);

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await axios.get("/api/historicalFigures");

        if (response.data && Array.isArray(response.data)) {
          // Define era order (oldest to newest)
          const eraOrder: { [key: string]: number } = {
            "Pre-1800": 1,
            "1800-1850": 2,
            "1850-1900": 3,
            "1900-1920": 4,
            "1920-1940": 5,
            "1940-1960": 6,
            "1960-1980": 7,
            "1980-2000": 8,
            "2000-Present": 9,
            "Custom": 10,
          };

          // Sort by era (oldest first), then by creation date within each era
          const sortedFigures = response.data.sort((a: HistoricalFigure, b: HistoricalFigure) => {
            const aEraOrder = eraOrder[a.era] || 999;
            const bEraOrder = eraOrder[b.era] || 999;

            // Sort by era first
            if (aEraOrder !== bEraOrder) {
              return aEraOrder - bEraOrder;
            }

            // Within same era, sort by creation date
            if (!a.createdAt || !b.createdAt) return 0;
            const aTime = typeof a.createdAt === 'object' && a.createdAt !== null && 'seconds' in a.createdAt
              ? (a.createdAt as { seconds: number }).seconds
              : 0;
            const bTime = typeof b.createdAt === 'object' && b.createdAt !== null && 'seconds' in b.createdAt
              ? (b.createdAt as { seconds: number }).seconds
              : 0;
            return aTime - bTime; // Oldest first within era
          });
          setFigures(sortedFigures);
        } else {
          console.warn("Invalid response format from API");
          setFigures([]);
        }
      } catch (error) {
        console.error("Error fetching historical figures:", error);
        setError("Failed to load historical figures. Please try again later.");
        setFigures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFigures();
  }, []);

  const openModal = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedFigure(null);
    // Restore body scroll
    document.body.style.overflow = "auto";
  };

  // Infinite scroll - load more images automatically
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < figures.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + 24);
            setLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [displayCount, figures.length]);

  const displayedFigures = figures.slice(0, displayCount);
  const hasMore = displayCount < figures.length;

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedFigure) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedFigure]);

  if (loading) {
    return <LoadingPage />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="container flex justify-center items-center flex-col mx-auto py-20 text-center px-4">
        <svg
          width="200px"
          height="200px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-500 mb-4"
        >
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Content</h2>
        <p className="text-lg text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show "not found" message if there are no figures
  if (figures.length === 0) {
    return (
      <div className="container flex justify-center items-center flex-col mx-auto py-20 text-center">
        <svg
          width="400px"
          height="400px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.828 5l-1-1H22v15.172l-1-1v-.69l-3.116-3.117-.395.296-.714-.714.854-.64a.503.503 0 0 1 .657.046L21 16.067V5zM3 20v-.519l2.947-2.947a1.506 1.506 0 0 0 .677.163 1.403 1.403 0 0 0 .997-.415l2.916-2.916-.706-.707-2.916 2.916a.474.474 0 0 1-.678-.048.503.503 0 0 0-.704.007L3 18.067V5.828l-1-1V21h16.172l-1-1zM17 8.5A1.5 1.5 0 1 1 15.5 7 1.5 1.5 0 0 1 17 8.5zm-1 0a.5.5 0 1 0-.5.5.5.5 0 0 0 .5-.5zm5.646 13.854l.707-.707-20-20-.707.707z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
        <p className="text-2xl">{notFound[lang]}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 px-4 max-w-7xl" dir={dir}>
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent pb-8">
          {historicalFiguresTitle[lang]}
        </h1>
      </div>

      {/* Masonry Grid with Horizontal Flow - Wabi-Sabi Style */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gridAutoRows: '20px',
          gridAutoFlow: 'dense'
        }}
      >
        {displayedFigures.map((figure, index) => {
          // Create variety in heights - wabi-sabi aesthetic (capped for better UX)
          const heights = [8, 9, 10, 11, 12, 14];
          const rowSpan = heights[(index * 3 + 2) % heights.length];

          return (
            <div
              key={figure.id}
              className="group cursor-pointer"
              style={{ gridRowEnd: `span ${rowSpan}` }}
              onClick={() => openModal(figure)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 bg-white h-full">
                {/* Image with natural aspect ratio */}
                <div className="relative w-full h-full">
                  <Image
                    src={figure.imageUrl}
                    alt={figure.caption[lang] || figure.caption.en}
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      console.error(`Failed to load image for ${figure.caption.en}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Caption overlaid on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="text-white font-semibold text-sm md:text-base line-clamp-2 drop-shadow-lg">
                      {figure.caption[lang] || figure.caption.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-12 py-8">
          {loadingMore && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* Modal / Lightbox */}
      {selectedFigure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full max-h-[80vh] rounded-lg shadow-2xl mx-auto flex justify-center items-center">
                <Image
                  src={selectedFigure.imageUrl}
                  alt={selectedFigure.caption[lang] || selectedFigure.caption.en}
                  width={800}
                  height={1200}
                  className="object-fit max-h-[80vh] w-auto"
                  quality={85}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  onError={() => {
                    console.error(`Failed to load modal image for ${selectedFigure.caption.en}`);
                  }}
                />
              </div>

              {/* Caption and Era below image */}
              <div className="mt-4 text-center w-2/3 bg-gray-700 z-20 py-2 rounded-lg">
                <h2 className="text-xl md:text-2xl font-semibold  drop-shadow-lg text-white">
                  {selectedFigure.caption[lang] || selectedFigure.caption.en}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalFigures;
