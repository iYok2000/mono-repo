import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Throttle function to limit how often a function can be called
 */
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook to track scroll progress (0-100)
 * Useful for progress bars
 */
export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    }, 100); // Throttle to every 100ms

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}

/**
 * Hook to detect which section is currently active based on scroll position
 */
export function useActiveSection(offset = 150): string {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = throttle(() => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "overview";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - offset) {
          current = section.getAttribute("data-section") || "overview";
        }
      });

      setActiveSection(current);
    }, 100); // Throttle to every 100ms

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return activeSection;
}

/**
 * Combined hook for both scroll progress and active section
 * More efficient if you need both values
 */
export function useScrollTracking(offset = 150) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = throttle(() => {
      // Calculate progress
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

      // Detect active section
      const sections = document.querySelectorAll("[data-section]");
      let current = "overview";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - offset) {
          current = section.getAttribute("data-section") || "overview";
        }
      });

      setActiveSection(current);
    }, 100); // Throttle to every 100ms

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return { scrollProgress, activeSection };
}
