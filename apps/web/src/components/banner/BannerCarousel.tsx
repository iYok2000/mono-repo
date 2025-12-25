"use client";

import { useState, useEffect } from "react";
import type { Banner } from "@/types/banner";

interface BannerCarouselProps {
  banners: Banner[];
  autoPlayInterval?: number;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-(--color-surface) shadow-md">
      {/* Recommended image size: 1920 x 400px (aspect ratio 24:5 or 4.8:1) */}
      <a
        href={currentBanner.url_th}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full aspect-24/5 max-h-[330px]"
      >
        <img
          src={currentBanner.image_th}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-banner.jpg";
          }}
        />
      </a>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white shadow-lg"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
