"use client";

import { useState } from "react";

interface MobilePreviewProps {
  imageTh: string;
  imageEn: string;
  urlTh: string;
  urlEn: string;
  bannerId?: string;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({
  imageTh,
  imageEn,
  urlTh,
  urlEn,
  bannerId,
}) => {
  const [lang, setLang] = useState<"th" | "en">("th");

  const currentImage = lang === "th" ? imageTh : imageEn;
  const currentUrl = lang === "th" ? urlTh : urlEn;

  const handleBannerClick = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Language Toggle */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setLang("th")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            lang === "th"
              ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-foreground"
          }`}
        >
          ภาษาไทย
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            lang === "en"
              ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-foreground"
          }`}
        >
          English
        </button>
      </div>

      {/* Mobile Device Frame */}
      <div className="relative scale-90 sm:scale-100">
        {/* Phone Frame */}
        <div className="relative bg-linear-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-3 shadow-xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-3xl z-10 shadow-lg"></div>

          {/* Screen */}
          <div className="relative bg-white dark:bg-gray-100 rounded-4xl overflow-hidden w-60 h-[480px]">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-linear-to-b from-black/5 to-transparent z-10 flex items-center justify-between px-6 pt-1.5">
              <div className="text-[10px] font-semibold text-gray-900">
                9:41
              </div>
              <div className="flex items-center gap-0.5">
                {/* Signal */}
                <svg
                  className="w-3 h-3 text-gray-900"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 20h4v-4H2v4zm6 0h4V10H8v10zm6 0h4V4h-4v16z" />
                </svg>
                {/* Battery */}
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

            {/* App Content */}
            <div className="pt-10 px-3 h-full overflow-y-auto bg-gray-50">
              {/* Banner Display */}
              <div className="mt-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                  {currentImage ? (
                    <button
                      onClick={handleBannerClick}
                      className="w-full cursor-pointer hover:opacity-95 transition-all duration-200 active:scale-[0.98]"
                      title={`Click to open: ${currentUrl || "No URL"}`}
                    >
                      <img
                        key={currentImage}
                        src={currentImage}
                        alt={`Banner ${lang.toUpperCase()}`}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </button>
                  ) : (
                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-400 text-xs">No image</p>
                    </div>
                  )}
                </div>

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

        {/* Info Badge */}
        {bannerId && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
            {bannerId}
          </div>
        )}
      </div>
    </div>
  );
};
