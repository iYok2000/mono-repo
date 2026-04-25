"use client";

import { ChevronDown } from "lucide-react";
import { useState, ReactNode } from "react";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-[var(--card)] hover:bg-[var(--muted)]/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[var(--muted-foreground)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6 bg-[var(--muted)]/10 border-t border-[var(--border)]">{children}</div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export function Accordion({ children, className = "" }: AccordionProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
