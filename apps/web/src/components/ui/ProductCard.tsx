"use client";

import { ReactNode } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  price: string;
  cta: string;
  href: string;
  popular?: boolean;
  badge?: ReactNode;
  icon?: string;
}

export function ProductCard({
  id,
  name,
  tagline,
  description,
  features,
  price,
  cta,
  href,
  popular = false,
  badge,
  icon,
}: ProductCardProps) {
  return (
    <div
      className={`relative group rounded-2xl border-2 p-6 lg:p-8 transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 ${
        popular
          ? "border-[var(--primary)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--card)]"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]"
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-[var(--primary)] text-white shadow-md">
            ⭐ ยอดนิยม
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header with Icon */}
        <div>
          {icon && <div className="text-5xl mb-4">{icon}</div>}
          <h3 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
            {name}
          </h3>
          <p className="text-base text-[var(--muted)] mb-1">{tagline}</p>
          {badge && (
            <div className="mt-2">
              {badge}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[var(--foreground)] leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[var(--foreground)]">
            {price}
          </span>
          <span className="text-[var(--muted)]">/ การ์ด</span>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[var(--foreground)] text-sm lg:text-base">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={href}
          className={`block w-full text-center px-6 py-3 lg:py-4 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 ${
            popular
              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md hover:shadow-lg"
              : "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white"
          }`}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
