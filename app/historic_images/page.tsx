"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/utils/firebase-config"; // Adjust path as needed
import LoadingPage from "../loading";
import { useAppContext } from "@/context/AppContext"; // Adjust path as needed
import axios from "axios";
import Image from "next/image";

function PictureGallery() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayUrl, setDisplayUrl] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [dir, setDir] = useState<string>("");

  // Ref for thumbnail container
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lang !== null) {
      setDir(lang === "en" ? "ltr" : "rtl");
    }
  }, [lang]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageList = await axios.get("/api/getHistoricalImages");

        const imageUrls = imageList.data.map(
          (item: { url: string }) => item.url
        );
        console.log(imageUrls);
        setImageUrls(imageUrls);

        // If no images are returned, set loading to false immediately
        if (imageUrls.length === 0) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false); // Also set loading to false on error
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urlPromises = imageUrls.map(async (image) => {
          try {
            const url = await getDownloadURL(ref(storage, image));
            return url;
          } catch (error) {
            console.error(`Error fetching image ${image}:`, error);
            return null;
          }
        });

        const urls = await Promise.all(urlPromises);
        const validUrls = urls.filter((url): url is string => url !== null);
        console.log(validUrls);
        setDisplayUrl(validUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (imageUrls.length > 0) {
      fetchImages();
    }
  }, [imageUrls]);

  // Function to scroll thumbnail into view
  const scrollThumbnailIntoView = useCallback((index: number) => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const thumbnail = container.children[index] as HTMLElement;

    if (!thumbnail) return;

    const containerRect = container.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();

    const containerCenter = containerRect.width / 2;
    const thumbnailCenter =
      thumbnailRect.left - containerRect.left + thumbnailRect.width / 2;

    const scrollOffset = thumbnailCenter - containerCenter;

    container.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  }, []);

  // Update current image index and scroll thumbnail
  const updateCurrentImage = useCallback(
    (newIndex: number) => {
      setCurrentImageIndex(newIndex);
      // Use setTimeout to ensure state is updated before scrolling
      setTimeout(() => {
        scrollThumbnailIntoView(newIndex);
      }, 0);
    },
    [scrollThumbnailIntoView]
  );

  const goToNext = useCallback(() => {
    const newIndex =
      currentImageIndex === displayUrl.length - 1 ? 0 : currentImageIndex + 1;
    updateCurrentImage(newIndex);
  }, [currentImageIndex, displayUrl.length, updateCurrentImage]);

  const goToPrevious = useCallback(() => {
    const newIndex =
      currentImageIndex === 0 ? displayUrl.length - 1 : currentImageIndex - 1;
    updateCurrentImage(newIndex);
  }, [currentImageIndex, displayUrl.length, updateCurrentImage]);

  const goToImage = useCallback(
    (index: number) => {
      updateCurrentImage(index);
    },
    [updateCurrentImage]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        lang === "en" ? goToPrevious() : goToNext();
      } else if (event.key === "ArrowRight") {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        lang === "en" ? goToNext() : goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, lang]);

  // Scroll to current thumbnail on mount and when displayUrl changes
  useEffect(() => {
    if (displayUrl.length > 0) {
      setTimeout(() => {
        scrollThumbnailIntoView(currentImageIndex);
      }, 100);
    }
  }, [displayUrl.length, currentImageIndex, scrollThumbnailIntoView]);

  if (loading) {
    return <LoadingPage />;
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
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
          عکس های تاریخی نورستان
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Main gallery container */}
        <div className="relative">
          {/* Main image display */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
            <Image
              src={displayUrl[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              loading="lazy"
              unoptimized={true}
            />

            {/* Navigation arrows */}
            {displayUrl.length > 1 && (
              <>
                <button
                  onClick={lang === "en" ? goToPrevious : goToNext}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={lang === "en" ? goToNext : goToPrevious}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium">
                {currentImageIndex + 1} / {displayUrl.length}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {displayUrl.length > 1 && (
            <div className="p-6 bg-gray-50">
              <div
                ref={thumbnailContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 px-2 
                h-28  md:min-h-42 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
                style={{ scrollbarWidth: "thin" }}
              >
                {displayUrl.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className="flex-shrink-0 relative transition-all duration-200"
                  >
                    <div
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex
                          ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-50"
                          : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:ring-offset-gray-50"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        unoptimized={true}
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PictureGallery;
