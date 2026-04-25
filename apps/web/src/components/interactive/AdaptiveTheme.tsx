"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";

// Content Types
export type ContentType = 
  | "birthday"
  | "anniversary"
  | "secret"
  | "graduation"
  | "wedding"
  | "general";

// Theme mapping
const contentThemeMap: Record<ContentType, "warm" | "premium"> = {
  birthday: "warm",
  graduation: "warm",
  wedding: "warm",
  general: "warm",
  anniversary: "premium",
  secret: "premium",
};

interface AdaptiveThemeContextValue {
  contentType: ContentType;
  theme: "warm" | "premium";
  setContentType: (type: ContentType) => void;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextValue>({
  contentType: "general",
  theme: "warm",
  setContentType: () => {},
});

export function useAdaptiveTheme() {
  return useContext(AdaptiveThemeContext);
}

interface AdaptiveThemeProviderProps {
  children: React.ReactNode;
  defaultContentType?: ContentType;
}

export function AdaptiveThemeProvider({ 
  children, 
  defaultContentType = "general" 
}: AdaptiveThemeProviderProps) {
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const theme = contentThemeMap[contentType];

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set data attributes for CSS styling
    root.setAttribute("data-content-type", contentType);
    root.setAttribute("data-theme", theme);
    
    // Apply dark class if premium theme
    if (theme === "premium") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    return () => {
      root.removeAttribute("data-content-type");
      root.removeAttribute("data-theme");
    };
  }, [contentType, theme]);

  return (
    <AdaptiveThemeContext.Provider value={{ contentType, theme, setContentType }}>
      {children}
    </AdaptiveThemeContext.Provider>
  );
}

// Hook to detect content type from URL or props
export function useContentTypeDetection(urlPath?: string) {
  const { setContentType } = useAdaptiveTheme();

  const detectContentType = useCallback((path: string): ContentType => {
    const lowercasePath = path.toLowerCase();
    
    if (lowercasePath.includes("birthday") || lowercasePath.includes("bday")) {
      return "birthday";
    }
    if (lowercasePath.includes("anniversary") || lowercasePath.includes("anniv")) {
      return "anniversary";
    }
    if (lowercasePath.includes("secret") || lowercasePath.includes("surprise")) {
      return "secret";
    }
    if (lowercasePath.includes("graduation") || lowercasePath.includes("grad")) {
      return "graduation";
    }
    if (lowercasePath.includes("wedding") || lowercasePath.includes("marry")) {
      return "wedding";
    }
    
    return "general";
  }, []);

  useEffect(() => {
    if (urlPath) {
      const detected = detectContentType(urlPath);
      setContentType(detected);
    }
  }, [urlPath, detectContentType, setContentType]);

  return { detectContentType };
}

// Content Type Selector Component (for demo/testing)
interface ContentTypeSelectorProps {
  className?: string;
}

export function ContentTypeSelector({ className = "" }: ContentTypeSelectorProps) {
  const { contentType, theme, setContentType } = useAdaptiveTheme();

  const contentTypes: { value: ContentType; label: string; emoji: string }[] = [
    { value: "birthday", label: "Birthday", emoji: "🎂" },
    { value: "anniversary", label: "Anniversary", emoji: "💕" },
    { value: "secret", label: "Secret/Surprise", emoji: "🎁" },
    { value: "graduation", label: "Graduation", emoji: "🎓" },
    { value: "wedding", label: "Wedding", emoji: "💒" },
    { value: "general", label: "General", emoji: "📦" },
  ];

  return (
    <div className={`p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] ${className}`}>
      <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Content Type (Adaptive UI Demo)
      </h4>
      
      <div className="grid grid-cols-3 gap-2">
        {contentTypes.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => setContentType(value)}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium transition-all
              ${contentType === value
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[var(--border)]"
              }
            `}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted)]">
          Current: <span className="text-[var(--primary)] font-medium">{contentType}</span>
          {" → "}
          Theme: <span className="font-medium">{theme === "warm" ? "☀️ Warm/Light" : "🌙 Premium/Dark"}</span>
        </p>
      </div>
    </div>
  );
}

// Wrapper component that auto-applies theme based on content
interface AdaptiveContentWrapperProps {
  children: React.ReactNode;
  contentType: ContentType;
  className?: string;
}

export function AdaptiveContentWrapper({ 
  children, 
  contentType,
  className = ""
}: AdaptiveContentWrapperProps) {
  const theme = contentThemeMap[contentType];

  return (
    <div 
      data-content-type={contentType}
      data-theme={theme}
      className={`
        transition-colors duration-500
        ${theme === "premium" ? "dark" : ""}
        ${className}
      `}
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
}
