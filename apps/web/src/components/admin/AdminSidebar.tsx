"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { Tag, Wrench, Image, LayoutDashboard, Activity, Settings } from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "แดชบอร์ด",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "จัดการหมวดหมู่",
    href: "/admin/category",
    icon: Tag,
  },
  {
    title: "จัดการ Product",
    href: "/admin/product",
    icon: Wrench,
  },
  {
    title: "จัดการ Banner",
    href: "/admin/banner",
    icon: Image,
  },
  {
    title: "Home Settings",
    href: "/admin/home-settings",
    icon: Settings,
  },
  {
    title: "Health Check",
    href: "/admin/healthcheck",
    icon: Activity,
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
          "fixed md:sticky top-16 left-0 z-40 w-60 glass-panel md:rounded-r-2xl h-[calc(100vh-4rem)] transition-transform duration-300 md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center pt-6 pb-4 px-4 border-b border-(--border)">
          <div className="w-12 h-12 bg-(--primary) rounded-xl flex items-center justify-center mb-2 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
            <span className="text-white font-black text-xl">G</span>
          </div>
          <h2 className="text-sm font-bold text-foreground">GyByte Management</h2>
          <p className="text-xs text-(--muted) mt-0.5">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${item.title}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-(--primary) text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                    : "text-foreground hover:translate-x-1 hover:bg-white/60 dark:hover:bg-white/5"
                )}
              >
                <Icon className={cx("w-5 h-5 shrink-0", isActive ? "text-white" : "text-(--primary)")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="p-3 border-t border-(--border)">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-(--primary-soft) text-(--primary) font-semibold text-sm hover:bg-(--primary) hover:text-white transition-all duration-200"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </aside>
    </>
  );
};
