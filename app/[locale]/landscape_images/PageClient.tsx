"use client";

import { useState, useEffect, useRef } from "react";
import LoadingPage from "../loading";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import { phrases } from "@/utils/i18n";

function LandscapeGallery() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const { landscapeTitle } = phrases;

  const [loading, setLoading] = useState<boolean>(true);
  const [displayUrl, setDisplayUrl] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    const fetchImages = async () => {
      try {
        setError(null);
        const imageList = await axios.get("/api/getLandscapeImages");
        const urls = imageList.data.map((item: { url: string }) => item.url);
        setDisplayUrl(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedImage]);

  // Infinite scroll - load more images automatically
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < displayUrl.length) {
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
  }, [displayCount, displayUrl.length]);

  const displayedImages = displayUrl.slice(0, displayCount);
  const hasMore = displayCount < displayUrl.length;

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

  if (displayUrl.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-gray-500 text-lg">No images to display</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 px-4 max-w-7xl" dir={dir}>
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent pb-8">
          {landscapeTitle[lang]}
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
        {displayedImages.map((imageUrl, index) => {
          // Create variety in heights - wabi-sabi aesthetic (capped for better UX)
          const heights = [8, 9, 10, 11, 12, 14];
          const rowSpan = heights[(index * 3 + 2) % heights.length];

          return (
            <div
              key={index}
              className="group cursor-pointer"
              style={{ gridRowEnd: `span ${rowSpan}` }}
              onClick={() => openModal(imageUrl)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 bg-white h-full">
                {/* Image with natural aspect ratio */}
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={`Landscape ${index + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      console.error(`Failed to load image ${index}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
      {selectedImage && (
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
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full max-h-[80vh] rounded-lg shadow-2xl">
                <Image
                  src={selectedImage}
                  alt="Landscape view"
                  width={1200}
                  height={800}
                  className="object-contain max-h-[80vh] w-auto mx-auto"
                  quality={85}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  onError={() => {
                    console.error(`Failed to load modal image`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandscapeGallery;
