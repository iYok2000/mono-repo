"use client";

import Link from "next/link";
import { memo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeSwitchToggle from "../troggle/themeSwitchTroggle";
import { ActionButton } from "../ui/ActionButton";
import { DecorativeImage } from "../decorative";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "Dev Toolkit", href: "/dev-toolkit" },
  { name: "Projects", href: "/project" },
  { name: "Contact", href: "/" },
];

const homeNavLinks = [
  { name: "วิธีทำงาน", href: "#how-it-works" },
  { name: "ตัวอย่าง", href: "#examples" },
  { name: "FAQ", href: "#faq" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isHomePage = pathname === "/";

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      router.push("/admin/category");
    }, 3500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b text-foreground ${
      isHomePage ? 'bg-[var(--card)]/80 backdrop-blur-md border-[var(--border)]' : 'border-(--color-border) bg-background'
    }`}>
      {!isHomePage && (
        <div
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className="absolute top-3 left-1/2 -translate-x-1/2 w-[150] h-[150] select-none active:opacity-50 transition-opacity"
          style={{ zIndex: 1 }}
        >
          <DecorativeImage variant="top-center" opacity={0.78} zIndex={2} />
        </div>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo - GyByte for home, Noppachai.dev for other pages */}
        {isHomePage ? (
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="font-semibold text-[var(--foreground)] text-lg">GyByte</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight sm:gap-3 sm:text-lg hover:opacity-80 transition-opacity">
            <svg
              className="h-4 w-4 text-(--color-primary) sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="hidden sm:inline">Noppachai.dev</span>
            <span className="sm:hidden">N.dev</span>
          </Link>
        )}

        {/* Navigation Links - different for home page */}
        <div className="ml-auto flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="hidden items-center gap-6 md:flex">
            {isHomePage ? (
              homeNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {link.name}
                </a>
              ))
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-(--color-muted) transition-colors hover:text-(--color-primary)"
                >
                  {link.name}
                </Link>
              ))
            )}
          </div>
          {isHomePage ? (
            <div className="hidden md:block">
              <Button variant="small">เริ่มทำ</Button>
            </div>
          ) : (
            <div className="hidden sm:block">
              <ActionButton />
            </div>
          )}
        </div>
        {!isHomePage && (
          <div className="ml-3 flex gap-2 sm:ml-6 lg:ml-8">
            <ThemeSwitchToggle />
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Header);
