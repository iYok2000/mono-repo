"use client";

import { useState, useEffect } from "react";
import type { Banner } from "@/types/banner";

interface BannerCarouselProps {
  banners: Banner[];
  lang: "th" | "en";
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const currentBanner = banners[currentIndex];
  const currentImage = lang === "th" ? currentBanner?.image_th : currentBanner?.image_en;
  const currentUrl = lang === "th" ? currentBanner?.url_th : currentBanner?.url_en;

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlay, banners.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlay(false);
  };

  const handleBannerClick = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  if (banners.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-xl">
        <p className="text-gray-400 text-sm">No active banners</p>
      </div>
    );
  }

  return (
    <div className="relative mb-6">
      {/* Banner Display */}
      <div className="bg-white dark:bg-gray-100 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={handleBannerClick}
          className="w-full cursor-pointer hover:opacity-95 transition-opacity active:scale-[0.98]"
          title={`Click to open: ${currentUrl || "No URL"}`}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={`Banner ${currentBanner?.id}`}
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </button>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous banner"
          >
            <svg
              className="w-4 h-4"
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
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next banner"
          >
            <svg
              className="w-4 h-4"
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

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-gray-900 w-4"
                  : "bg-gray-900/50 hover:bg-gray-900/75"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
