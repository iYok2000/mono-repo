"use client";

import { Home, Zap, Package2, Gift, HelpCircle } from "lucide-react";

const navLinks = [
  { icon: Home, label: "หน้าหลัก", href: "#" },
  { icon: Zap, label: "วิธีทำงาน", href: "#how-it-works" },
  { icon: Package2, label: "แพ็กเกจ", href: "#pricing" },
  { icon: Gift, label: "ตัวอย่างการ์ด", href: "#preview" },
  { icon: HelpCircle, label: "FAQ", href: "#faq" },
];

export function LandingSidebar() {
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
    <aside className="fixed left-4 top-24 hidden md:flex flex-col h-[calc(100vh-120px)] w-64 z-40">
      <div className="glass-panel rounded-2xl h-full flex flex-col p-4 shadow-(--shadow-md)">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center py-5 mb-2 border-b border-(--border)">
          <div className="w-16 h-16 bg-(--primary) rounded-2xl flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
            <span className="text-white font-black text-2xl">G</span>
          </div>
          <h3 className="font-bold text-foreground text-base">GyByte Magic</h3>
          <p className="text-xs text-(--muted) mt-0.5">NFC Memory Gift</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 pt-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:translate-x-1 hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-200"
            >
              <link.icon className="w-5 h-5 shrink-0 text-(--primary)" />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="pt-3 border-t border-(--border)">
          <a href="/create/express">
            <button className="w-full py-3 rounded-xl bg-(--primary-soft) text-(--primary) font-semibold text-sm hover:bg-(--primary) hover:text-white transition-all duration-200">
              สั่งของขวัญด่วน
            </button>
          </a>
        </div>
      </div>
    </aside>
  );
}
