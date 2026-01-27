"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface CardData {
  theme: "business" | "birthday";
  from: string;
  to: string;
  message: string;
  videoUrl?: string;
  images?: string[];
  animation: boolean;
}

function decodeCardData(encoded: string): CardData | null {
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function ScanPage() {
  const searchParams = useSearchParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const data = searchParams.get("d");
    if (data) {
      const decoded = decodeCardData(data);
      if (decoded) {
        setCardData(decoded);
        
        // If animation enabled, wait 1.5s before showing content
        if (decoded.animation) {
          setTimeout(() => {
            setAnimating(false);
            setTimeout(() => setShowContent(true), 300);
          }, 1500);
        } else {
          setAnimating(false);
          setShowContent(true);
        }
      }
    }
  }, [searchParams]);

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="text-center">
          <p className="text-xl text-[var(--muted)]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const themeConfig = {
    business: {
      icon: "💼",
      gradient: "from-blue-500/10 to-purple-500/10",
      accentColor: "text-blue-600",
    },
    birthday: {
      icon: "🎂",
      gradient: "from-pink-500/10 to-orange-500/10",
      accentColor: "text-pink-600",
    },
  };

  const theme = themeConfig[cardData.theme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4`}>
      {/* Animation Screen */}
      {animating && cardData.animation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)] animate-fadeOut">
          <div className="text-center space-y-4 animate-pulse">
            <div className="text-9xl">{theme.icon}</div>
            <p className="text-xl font-semibold text-[var(--foreground)]">
              กำลังเปิดโมเมนต์...
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`w-full max-w-2xl transition-all duration-700 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 text-center border-b border-[var(--border)]">
            <div className="text-6xl mb-4">{theme.icon}</div>
            <h1 className={`text-3xl lg:text-4xl font-bold ${theme.accentColor} mb-2`}>
              {cardData.to}
            </h1>
            <p className="text-[var(--muted)]">จาก {cardData.from}</p>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Message */}
            {cardData.message && (
              <div className="p-6 rounded-2xl bg-[var(--surface-muted)]">
                <p className="text-[var(--foreground)] text-center leading-relaxed whitespace-pre-wrap">
                  {cardData.message}
                </p>
              </div>
            )}

            {/* Video Button */}
            {cardData.videoUrl && (
              <a
                href={cardData.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-[var(--primary)] text-white font-semibold text-lg hover:bg-[var(--primary-hover)] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                เปิดวิดีโอ
              </a>
            )}

            {/* Images Gallery */}
            {cardData.images && cardData.images.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  อัลบั้มรูป
                </h2>
                <div className={`grid gap-3 ${
                  cardData.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {cardData.images.map((img, index) => (
                    <a
                      key={index}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-xl overflow-hidden bg-[var(--surface-muted)] hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback */}
            <div className="pt-4 border-t border-[var(--border)]">
              <details className="text-sm text-[var(--muted)]">
                <summary className="cursor-pointer hover:text-[var(--foreground)] transition-colors">
                  เปิดไม่ได้?
                </summary>
                <div className="mt-3 space-y-2 text-xs">
                  <button
                    onClick={() => window.open(cardData.videoUrl, "_blank")}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--border)] transition-colors"
                  >
                    เปิดในเบราว์เซอร์
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(cardData.videoUrl || "")}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--border)] transition-colors"
                  >
                    คัดลอกลิงก์
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center mt-6">
          <p className="text-sm text-[var(--subtle)]">
            Powered by <span className="font-semibold text-[var(--primary)]">GyByte</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            pointer-events: none;
          }
        }
        .animate-fadeOut {
          animation: fadeOut 1.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
