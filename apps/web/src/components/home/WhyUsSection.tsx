"use client";

import { memo } from "react";

interface PreviewSettings {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
}

interface PreviewSectionProps {
  settings?: PreviewSettings;
}

// Fallback mock image shown until an image is set from the admin panel.
const MOCK_PREVIEW_IMAGE = "/mock/preview-card.svg";

/**
 * Preview / Examples section — rendered as a single product-style card.
 * All content is editable from the admin panel
 * (home_settings.preview: title, subtitle, description, image).
 */
export const PreviewSection = memo(function PreviewSection({ settings }: PreviewSectionProps) {
  const title = settings?.title || "ตัวอย่างการ์ด";
  const subtitle = settings?.subtitle || "ดูว่าจะออกมาหน้าตาแบบไหน";
  const description = settings?.description || "";
  const image = settings?.image || MOCK_PREVIEW_IMAGE;

  return (
    <section className="relative py-16 lg:py-24" id="preview">
      <div className="mx-auto w-full max-w-4xl px-6">
        <article className="group grid overflow-hidden rounded-3xl border border-(--border) bg-(--card) shadow-(--shadow-md) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-lg) hover:border-(--primary)/40 md:grid-cols-2">
          {/* Product image */}
          <div className="relative aspect-4/3 overflow-hidden bg-(--surface-muted) md:aspect-auto md:h-full md:min-h-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
            {subtitle && (
              <span className="inline-flex w-fit items-center rounded-full bg-(--primary-soft) px-3 py-1 text-sm font-medium text-(--primary)">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl font-bold leading-tight text-foreground lg:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="text-base leading-relaxed text-(--muted) whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
});
