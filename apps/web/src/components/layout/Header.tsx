"use client";

import { memo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import ThemeSwitchToggle from "../troggle/themeSwitchTroggle";
import { DecorativeImage } from "../decorative";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "วิธีทำงาน", href: "#how-it-works" },
  { name: "ตัวอย่าง", href: "#examples" },
  { name: "FAQ", href: "#faq" },
];

const Header = () => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      window.location.href = "/admin/category";
    }, 3500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Handle logo click - scroll to top if on home page, otherwise navigate
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // If not on home page, let the default <a> behavior handle navigation
  };

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md text-foreground">
      {/* Admin Secret Access - Press and hold logo for 3.5 seconds */}
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo - GyByte */}
        <a 
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <span className="text-[var(--card)] font-bold text-xl">G</span>
          </div>
          <span className="font-semibold text-[var(--foreground)] text-lg">GyByte</span>
        </a>

        {/* Navigation Links */}
        <div className="ml-auto flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Button variant="small">เริ่มทำ</Button>
          </div>
        </div>
        {/* GitHub and Theme Toggle */}
        <div className="ml-3 flex items-center gap-2 sm:ml-6 lg:ml-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] hover:border-[var(--primary)]"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeSwitchToggle />
        </div>
      </div>
    </nav>
  );
};

export default memo(Header);
