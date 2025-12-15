"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { DecorativeVariant, DecorativeImageProps } from "./types";

const VARIANT_CONFIG: Record<
  DecorativeVariant,
  {
    filename: string;
    defaultClass: string;
    defaultWidth: number;
    defaultHeight: number;
  }
> = {
  "bottom-left": {
    filename: "bottom-left",
    defaultClass: "absolute bottom-0 left-0",
    defaultWidth: 450,
    defaultHeight: 450,
  },
  "top-right": {
    filename: "top-right",
    defaultClass: "fixed top-10 right-0",
    defaultWidth: 320,
    defaultHeight: 320,
  },
  "top-center": {
    filename: "top-center",
    defaultClass: "absolute top-[-10] left-1/2 -translate-x-1/2",
    defaultWidth: 100,
    defaultHeight: 100,
  },
  "theme-main": {
    filename: "theme-main",
    defaultClass: "fixed top-1/4 right-1/2 translate-x-1/2",
    defaultWidth: 600,
    defaultHeight: 600,
  },
  decoration: {
    filename: "decoration",
    defaultClass: "absolute bottom-1/4 right-1/3",
    defaultWidth: 300,
    defaultHeight: 300,
  },
};

export function DecorativeImage({
  variant,
  className,
  width,
  height,
  zIndex = -1,
  opacity = 0.6,
  priority = false,
  alt = "",
}: DecorativeImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const config = VARIANT_CONFIG[variant];
  const isDark = resolvedTheme === "dark";
  const theme = isDark ? "dark" : "light";

  const imageSrc = `/decorative/${theme}/${config.filename}.png`;
  const positionClass = className || config.defaultClass;
  const imageWidth = width || config.defaultWidth;
  const imageHeight = height || config.defaultHeight;

  return (
    <div
      className={`pointer-events-none select-none ${positionClass}`}
      style={{ zIndex, opacity }}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        priority={priority}
        quality={90}
        draggable={false}
      />
    </div>
  );
}
