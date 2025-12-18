"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/cx";

interface MenuItem {
  title: string;
  //   icon: React.ReactNode;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "จัดการหมวดหมู่",
    href: "/admin/category",
  },
  {
    title: "จัดการ DevToolkit",
    href: "/admin/devtoolkit",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-(--color-primary) text-white shadow-lg"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cx(
          "fixed md:sticky top-0 left-0 z-40 w-64 bg-(--color-surface) border-r border-(--color-border) min-h-screen transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">
            จัดการ DevTools
          </h2>

          <nav className="space-y-1 md:space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cx(
                    "flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-(--color-primary) text-white"
                      : "text-(--color-muted) hover:bg-(--color-surface-alt) hover:text-foreground"
                  )}
                >
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
