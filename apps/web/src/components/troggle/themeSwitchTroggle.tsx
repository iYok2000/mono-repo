"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type CSSProperties } from "react";
import { Trees, University } from "lucide-react";

export default function ThemeSwitchToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [knobDark, setKnobDark] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = (resolvedTheme ?? theme ?? "light") as "light" | "dark";
  const isDark = activeTheme === "dark";

  useEffect(() => {
    setKnobDark(isDark);
  }, [isDark]);

  if (!mounted || knobDark === null) return null;

  const handleToggle = () => {
    const next = !knobDark;

    setKnobDark(next);

    setTimeout(() => {
      setTheme(next ? "dark" : "light");
    }, 200);
  };

  const knobStyle: CSSProperties = {
    transform: `translateX(${knobDark ? 32 : 0}px)`,
    transition: "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="relative inline-flex items-center"
    >
      <div className="relative h-8 w-16 rounded-full bg-[var(--color-border)]/80">
        <div
          style={knobStyle}
          className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-md"
        >
          {knobDark ? (
            <Trees className="h-4 w-4 text-emerald-300" />
          ) : (
            <University className="h-4 w-4 text-black-300" />
          )}
        </div>
      </div>
    </button>
  );
}
