"use client";

import { useState, memo } from "react";
import Link from "next/link";

export interface TOCItem {
  id: string;
  title: string;
  icon: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

/**
 * Desktop Table of Contents - Sticky Sidebar
 */
export const DesktopTOC = memo(function DesktopTOC({
  items,
  activeSection,
  onSectionClick,
}: TableOfContentsProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">
        {/* Back Button */}
        <Link
          href="/product"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) hover:text-foreground transition-colors mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
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
          กลับไปหน้ารายการ
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 bg-(--color-surface) rounded-xl border border-(--color-border) p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3 px-2">
            สารบัญ
          </h3>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                flex items-center gap-2 group
                ${
                  activeSection === item.id
                    ? "bg-(--color-primary) text-white font-medium shadow-sm"
                    : "text-foreground hover:bg-(--color-surface) hover:shadow-sm"
                }
              `}
            >
              <span
                className={`text-base transition-transform ${
                  activeSection === item.id
                    ? "scale-110"
                    : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.title}</span>
              {activeSection === item.id && (
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
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-6 bg-(--color-surface) rounded-xl border border-(--color-border) p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">
            ดำเนินการ
          </h3>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full px-3 py-2 text-sm text-foreground hover:bg-(--color-border) rounded-lg transition-colors flex items-center gap-2"
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
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            กลับขึ้นด้านบน
          </button>
        </div>
      </div>
    </aside>
  );
});

/**
 * Mobile Table of Contents - Floating Button with Dropdown
 */
export const MobileTOC = memo(function MobileTOC({
  items,
  activeSection,
  onSectionClick,
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating TOC Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-(--color-primary) text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Table of contents"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Drawer */}
      <div
        className={`
          lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--color-surface) border-t border-(--color-border) rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-(--color-border)">
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--color-muted)">
              สารบัญ
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-(--color-border) transition-colors flex items-center justify-center"
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

          {/* TOC Items */}
          <nav className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200
                  flex items-center gap-3
                  ${
                    activeSection === item.id
                      ? "bg-(--color-primary) text-white font-medium shadow-md"
                      : "text-foreground hover:bg-(--color-border)"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.title}</span>
                {activeSection === item.id && (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-(--color-border) flex gap-2">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsOpen(false);
              }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) text-foreground hover:bg-(--color-border) transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              กลับขึ้นบน
            </button>
            <Link
              href="/product"
              className="flex-1 px-4 py-2.5 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
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
              รายการ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});
