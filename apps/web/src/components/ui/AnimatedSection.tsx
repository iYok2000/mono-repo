"use client";

import { memo, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type AnimationVariant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-up";

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

const variantStyles: Record<AnimationVariant, { from: string; to: string }> = {
  "fade-up": {
    from: "opacity-0 translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  "fade-in": {
    from: "opacity-0",
    to: "opacity-100",
  },
  "slide-left": {
    from: "opacity-0 -translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "slide-right": {
    from: "opacity-0 translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "scale-up": {
    from: "opacity-0 scale-95",
    to: "opacity-100 scale-100",
  },
};

export const AnimatedSection = memo(function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isInView ? styles.to : styles.from} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
});
