"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ScrollytellingSectionProps {
  children: React.ReactNode;
  onProgress?: (progress: number) => void;
  className?: string;
}

export function ScrollytellingSection({ 
  children, 
  onProgress,
  className = "" 
}: ScrollytellingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress: 0 when section enters viewport, 1 when it exits
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const total = end - start;
      const current = -start;
      
      const newProgress = Math.max(0, Math.min(1, current / total));
      setProgress(newProgress);
      onProgress?.(newProgress);
      
      // Update CSS custom property for animations
      section.style.setProperty("--scroll-progress", newProgress.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgress]);

  return (
    <div 
      ref={sectionRef} 
      className={`relative ${className}`}
      style={{ "--scroll-progress": progress } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// Hook for scroll-based animations
export function useScrollProgress(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio > threshold);
        setProgress(entry.intersectionRatio);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible, progress };
}

// Scroll-triggered reveal component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({ 
  children, 
  className = "",
  delay = 0,
  direction = "up"
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollProgress(0.2);

  const getTransform = () => {
    if (isVisible) return "translate(0, 0)";
    switch (direction) {
      case "up": return "translateY(50px)";
      case "down": return "translateY(-50px)";
      case "left": return "translateX(50px)";
      case "right": return "translateX(-50px)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Parallax element
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

// Card Float-In Animation Component
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className = "", delay = 0 }: FloatingCardProps) {
  const { ref, isVisible, progress } = useScrollProgress(0.3);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? "translateZ(0) rotateX(0) scale(1)"
          : "translateZ(-100px) rotateX(15deg) scale(0.9)",
        transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {children}
    </div>
  );
}

// Byte Fly-In Animation Component
interface FlyingByteProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right";
}

export function FlyingByte({ 
  children, 
  className = "", 
  delay = 300,
  direction = "right"
}: FlyingByteProps) {
  const { ref, isVisible } = useScrollProgress(0.3);
  const [showWave, setShowWave] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowWave(true), delay + 800);
      return () => clearTimeout(timer);
    } else {
      setShowWave(false);
    }
  }, [isVisible, delay]);

  const getInitialTransform = () => {
    return direction === "right"
      ? "translateX(100px) translateY(-50px) rotate(15deg)"
      : "translateX(-100px) translateY(-50px) rotate(-15deg)";
  };

  return (
    <div
      ref={ref}
      className={`${className} ${showWave ? "animate-byte-wave" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? "translateX(0) translateY(0) rotate(0deg)"
          : getInitialTransform(),
        transition: `all 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
