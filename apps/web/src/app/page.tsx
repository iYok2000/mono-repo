import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { HomeSettings } from "@/types/homeSettings";
import { DecorativeImage } from "@/components/decorative";

// Static import for Hero - Above the fold (critical for FCP/LCP)
import { HeroSection } from "@/components/home/HeroSection";

// Dynamic imports for below-the-fold sections (code splitting + lazy load)
const WhatIsItSection = dynamic(
  () => import("@/components/home/WhatIsItSection").then(mod => ({ default: mod.WhatIsItSection })),
  { loading: () => <SectionSkeleton /> }
);

const SKUSection = dynamic(
  () => import("@/components/home/SKUSection").then(mod => ({ default: mod.SKUSection })),
  { loading: () => <SectionSkeleton /> }
);

const HowItWorksSection = dynamic(
  () => import("@/components/home/HowItWorksSection").then(mod => ({ default: mod.HowItWorksSection })),
  { loading: () => <SectionSkeleton /> }
);

const OccasionsSection = dynamic(
  () => import("@/components/home/OccasionsSection").then(mod => ({ default: mod.OccasionsSection })),
  { loading: () => <SectionSkeleton /> }
);

const WhyNFCSection = dynamic(
  () => import("@/components/home/WhyNFCSection").then(mod => ({ default: mod.WhyNFCSection })),
  { loading: () => <SectionSkeleton /> }
);

const WhyUsSection = dynamic(
  () => import("@/components/home/WhyUsNewSection").then(mod => ({ default: mod.WhyUsSection })),
  { loading: () => <SectionSkeleton /> }
);

const PreviewSection = dynamic(
  () => import("@/components/home/WhyUsSection").then(mod => ({ default: mod.PreviewSection })),
  { loading: () => <SectionSkeleton /> }
);

const FAQSection = dynamic(
  () => import("@/components/home/FAQSection").then(mod => ({ default: mod.FAQSection })),
  { loading: () => <SectionSkeleton /> }
);

const FinalCTASection = dynamic(
  () => import("@/components/home/FinalCTASection").then(mod => ({ default: mod.FinalCTASection })),
  { loading: () => <SectionSkeleton /> }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Loading skeleton for lazy-loaded sections
 */
function SectionSkeleton() {
  return (
    <div className="w-full py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted/20 rounded-lg mx-auto" />
          <div className="h-4 w-64 bg-muted/10 rounded mx-auto" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-muted/10 rounded-xl" />
            <div className="h-40 bg-muted/10 rounded-xl" />
            <div className="h-40 bg-muted/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fetch home settings with ISR caching
 */
async function getHomeSettings(): Promise<HomeSettings | null> {
  try {
    const response = await fetch(`${API_URL}/api/home-settings`, {
      next: { 
        revalidate: 60,           // ISR: rebuild every 60 seconds
        tags: ['home-settings']   // For on-demand revalidation
      }
    });
    
    if (!response.ok) return null;
    const result = await response.json();
    // API returns {success: boolean, data: HomeSettings}
    return result.data || null;
  } catch {
    return null;
  }
}

/**
 * Generate metadata for SEO and Open Graph
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomeSettings();
  
  const defaultTitle = "GyByte - NFC Gift Cards ที่ทำให้คุณโดดเด่น";
  const defaultDescription = "ส่งความทรงจำและความประทับใจผ่าน NFC Gift Cards สมัยใหม่ แค่แตะก็เข้าถึงได้ทันที";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gybyte.co";

  return {
    title: settings?.meta_title || defaultTitle,
    description: settings?.meta_description || defaultDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "/" },
    openGraph: {
      title: settings?.og_title || settings?.meta_title || defaultTitle,
      description: settings?.og_description || settings?.meta_description || defaultDescription,
      images: settings?.og_image ? [{ url: settings.og_image, width: 1200, height: 630 }] : ["/og-image.jpg"],
      type: "website",
      siteName: "GyByte",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.og_title || settings?.meta_title || defaultTitle,
      description: settings?.og_description || settings?.meta_description || defaultDescription,
      images: settings?.og_image ? [settings.og_image] : ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Check if section is enabled
 */
function isSectionEnabled(
  settings: HomeSettings | null,
  key: keyof Pick<HomeSettings, 'hero' | 'what_is_it' | 'sku' | 'how_it_works' | 'occasions' | 'why_nfc' | 'why_us' | 'preview' | 'faq' | 'final_cta'>
): boolean {
  if (!settings) return true;
  return settings[key]?.enabled !== false;
}

/**
 * Home Page - Server Component with SSR + ISR + Code Splitting
 * 
 * Performance optimizations:
 * 1. Hero section: Static import (above-the-fold, critical for LCP)
 * 2. Other sections: Dynamic imports with code splitting
 * 3. Decorative: Client-only, non-blocking
 * 4. ISR: Cached and revalidated every 60 seconds
 * 5. Suspense boundaries: Progressive loading
 * 6. Data-driven: Sections controlled by admin settings
 */
export default async function Home() {
  const settings = await getHomeSettings();

  return (
    <main className="relative min-h-screen bg-background">
      {/* Decorative background - Renders on server, non-critical */}
      <DecorativeImage variant="theme-main" opacity={0.03} zIndex={0} />
      
      {/* Hero - Static import for fast FCP/LCP */}
      {isSectionEnabled(settings, 'hero') && (
        <HeroSection settings={settings?.hero} />
      )}

      {/* Below the fold - Dynamic imports with Suspense */}
      {isSectionEnabled(settings, 'what_is_it') && (
        <Suspense fallback={<SectionSkeleton />}>
          <WhatIsItSection settings={settings?.what_is_it} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'sku') && (
        <Suspense fallback={<SectionSkeleton />}>
          <SKUSection settings={settings?.sku} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'how_it_works') && (
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorksSection settings={settings?.how_it_works} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'occasions') && (
        <Suspense fallback={<SectionSkeleton />}>
          <OccasionsSection settings={settings?.occasions} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'why_nfc') && (
        <Suspense fallback={<SectionSkeleton />}>
          <WhyNFCSection settings={settings?.why_nfc} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'why_us') && (
        <Suspense fallback={<SectionSkeleton />}>
          <WhyUsSection settings={settings?.why_us} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'preview') && (
        <Suspense fallback={<SectionSkeleton />}>
          <PreviewSection settings={settings?.preview} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'faq') && (
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection settings={settings?.faq} />
        </Suspense>
      )}

      {isSectionEnabled(settings, 'final_cta') && (
        <Suspense fallback={<SectionSkeleton />}>
          <FinalCTASection settings={settings?.final_cta} />
        </Suspense>
      )}
    </main>
  );
}
