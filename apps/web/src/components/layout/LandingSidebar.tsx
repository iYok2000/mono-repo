"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Home, Zap, Package2, Gift, HelpCircle, ArrowRight } from "lucide-react";
import { getCategories, type Category } from "@/services/categoryService";

const navLinks = [
  { icon: Home, label: "หน้าหลัก", href: "#" },
  { icon: Zap, label: "วิธีทำงาน", href: "#how-it-works" },
  { icon: Package2, label: "แพ็กเกจ", href: "#pricing" },
  { icon: Gift, label: "ตัวอย่างการ์ด", href: "#preview" },
  { icon: HelpCircle, label: "FAQ", href: "#faq" },
];

let categoryCache: Category[] | null = null;

const getCategoryAnchor = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, "-");

export function LandingSidebar() {
  const [categories, setCategories] = useState<Category[]>(categoryCache ?? []);
  const [loadingCategories, setLoadingCategories] = useState(!categoryCache);

  useEffect(() => {
    let mounted = true;

    if (categoryCache) {
      setLoadingCategories(false);
      return () => {
        mounted = false;
      };
    }

    getCategories()
      .then((data) => {
        categoryCache = data;
        if (mounted) setCategories(data);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      })
      .finally(() => {
        if (mounted) setLoadingCategories(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryLinks = useMemo(
    () =>
      categories
        .slice()
        .sort((a, b) => a.name_th.localeCompare(b.name_th, "th"))
        .map((category) => ({
          id: category.id,
          label: category.name_th || category.name_en,
          href: `/product#${getCategoryAnchor(category.name_th || category.name_en)}`,
        })),
    [categories]
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const el = document.getElementById(href.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href === "#") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <aside className="fixed left-4 top-24 z-40 hidden h-[calc(100vh-120px)] w-64 flex-col md:flex">
      <div className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 p-3 shadow-(--shadow-md) dark:border-white/10">
        {/* Profile Section */}
        <div className="mb-2 flex flex-col items-center border-b border-(--border) px-3 py-5 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--primary) shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
            <span className="text-white font-black text-2xl">G</span>
          </div>
          <h3 className="font-bold text-foreground text-base">GyByte Magic</h3>
          <p className="text-xs text-(--muted) mt-0.5">NFC Memory Gift</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-1 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:translate-x-1 hover:bg-white/70 dark:hover:bg-white/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft) transition-colors group-hover:bg-(--primary)">
                <link.icon className="h-4.5 w-4.5 text-(--primary) transition-colors group-hover:text-white" />
              </span>
              <span>{link.label}</span>
            </a>
          ))}

          <div className="mt-3 border-t border-(--border) pt-3">
            <div className="mb-2 flex items-center justify-between px-3.5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-(--muted)">
                <Package2 className="h-3.5 w-3.5 text-(--primary)" />
                Categories
              </div>
              <Link href="/product" className="text-[11px] font-semibold text-(--primary) hover:underline">
                ทั้งหมด
              </Link>
            </div>

            {loadingCategories && (
              <div className="space-y-2 px-3.5 py-1">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-8 animate-pulse rounded-lg bg-white/50 dark:bg-white/5" />
                ))}
              </div>
            )}

            {!loadingCategories && categoryLinks.length > 0 && (
              <div className="flex flex-col gap-1">
                {categoryLinks.map((category) => (
                  <a
                    key={category.id}
                    href={category.href}
                    className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:translate-x-1 hover:bg-white/70 dark:hover:bg-white/5"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-(--primary) shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                    <span className="truncate">{category.label}</span>
                  </a>
                ))}
              </div>
            )}

            {!loadingCategories && categoryLinks.length === 0 && (
              <p className="px-3.5 py-2 text-xs text-(--muted)">ยังไม่มีหมวดหมู่</p>
            )}
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="border-t border-(--border) px-1 pt-3">
          <Link
            href="/create/express"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary-soft) px-4 py-3 text-sm font-semibold text-(--primary) transition-all duration-200 hover:bg-(--primary) hover:text-white"
          >
            สั่งของขวัญด่วน
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
