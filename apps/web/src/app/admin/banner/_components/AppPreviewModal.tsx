"use client";

import { useState } from "react";
import { BannerCarousel } from "./BannerCarousel";
import type { Banner } from "@/types/banner";

interface AppPreviewModalProps {
  banners: Banner[];
  isOpen: boolean;
  onClose: () => void;
}

export const AppPreviewModal: React.FC<AppPreviewModalProps> = ({
  banners,
  isOpen,
  onClose,
}) => {
  const [previewLang, setPreviewLang] = useState<"th" | "en">("th");

  if (!isOpen) return null;

  const activeBanners = banners
    .filter((b) => b.is_active)
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-(--color-border) px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            ตัวอย่างแอพ
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
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
        </div>

        <div className="p-6">
          {/* Language Toggle */}
          <div className="flex justify-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setPreviewLang("th")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                previewLang === "th"
                  ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-foreground"
              }`}
            >
              ภาษาไทย
            </button>
            <button
              onClick={() => setPreviewLang("en")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                previewLang === "en"
                  ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-foreground"
              }`}
            >
              English
            </button>
          </div>

          {/* Mobile Preview with Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative scale-90 sm:scale-100">
              <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-3 shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-3xl z-10 shadow-lg"></div>
                <div className="relative bg-white dark:bg-gray-100 rounded-[2rem] overflow-hidden w-[240px] h-[480px]">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/5 to-transparent z-10 flex items-center justify-between px-6 pt-1.5">
                    <div className="text-[10px] font-semibold text-gray-900">
                      9:41
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3 text-gray-900"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2 20h4v-4H2v4zm6 0h4V10H8v10zm6 0h4V4h-4v16z" />
                      </svg>
                      <svg
                        className="w-5 h-3 text-gray-900"
                        viewBox="0 0 24 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="1" y="2" width="18" height="8" rx="2" />
                        <path d="M19 4v4" />
                      </svg>
                    </div>
                  </div>

                  {/* App Content with Banner Carousel */}
                  <div className="pt-10 px-3 h-full overflow-y-auto bg-gray-50">
                    <div className="mt-2">
                      <BannerCarousel banners={activeBanners} lang={previewLang} />

                      {/* Additional Content (Demo) */}
                      <div className="mt-4 space-y-2.5">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-900 rounded-full"></div>
                </div>

                {/* Side Buttons */}
                <div className="absolute left-0 top-20 w-0.5 h-10 bg-gray-700 rounded-l-sm -translate-x-full"></div>
                <div className="absolute left-0 top-32 w-0.5 h-6 bg-gray-700 rounded-l-sm -translate-x-full"></div>
                <div className="absolute right-0 top-28 w-0.5 h-12 bg-gray-700 rounded-r-sm translate-x-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
