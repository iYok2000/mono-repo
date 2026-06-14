"use client";

import { useState, useEffect, memo, lazy, Suspense } from "react";
import { DecorativeImage } from "@/components/decorative";
import { LandingSidebar } from "@/components/layout/LandingSidebar";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HeroSection } from "@/components/home";
import {
  getHomeSections,
  DEFAULT_SECTION_VISIBILITY,
  type SectionVisibility,
} from "@/services/settingsService";
import { getHomeSettings, type HomeSettings } from "@/services/homeSettings";

// Lazy load below-the-fold sections for better initial load performance
const WhatIsItSection = lazy(() => import("@/components/home/WhatIsItSection").then(m => ({ default: m.WhatIsItSection })));
const SKUSection = lazy(() => import("@/components/home/SKUSection").then(m => ({ default: m.SKUSection })));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const OccasionsSection = lazy(() => import("@/components/home/OccasionsSection").then(m => ({ default: m.OccasionsSection })));
const WhyNFCSection = lazy(() => import("@/components/home/WhyNFCSection").then(m => ({ default: m.WhyNFCSection })));
const WhyUsSection = lazy(() => import("@/components/home/WhyUsNewSection").then(m => ({ default: m.WhyUsSection })));
const PreviewSection = lazy(() => import("@/components/home/WhyUsSection").then(m => ({ default: m.PreviewSection })));
const FAQSection = lazy(() => import("@/components/home/FAQSection").then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import("@/components/home/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

const SectionFallback = memo(function SectionFallback() {
  return <div className="min-h-[200px]" />;
});

export default function Home() {
  const [sections, setSections] = useState<SectionVisibility>(DEFAULT_SECTION_VISIBILITY);
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);

  useEffect(() => {
    getHomeSections().then(setSections).catch(() => setSections(DEFAULT_SECTION_VISIBILITY));
    getHomeSettings().then(setHomeSettings).catch(() => {/* use component defaults */});
  }, []);

  return (
    <>
      <LandingSidebar />
      <main className="relative min-h-screen bg-background md:pl-72">
        <DecorativeImage variant="theme-main" opacity={0.03} zIndex={0} />

        {/* Hero loads immediately — above the fold */}
        {sections.hero && (
          <HeroSection settings={homeSettings?.hero} />
        )}

        {/* Below-the-fold sections: lazy loaded + scroll animated */}
        <Suspense fallback={<SectionFallback />}>
          {sections.what_is_it && (
            <AnimatedSection variant="fade-up">
              <WhatIsItSection settings={homeSettings?.what_is_it} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.sku && (
            <AnimatedSection variant="fade-up" delay={100}>
              <SKUSection settings={homeSettings?.sku} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.how_it_works && (
            <AnimatedSection variant="fade-up">
              <HowItWorksSection settings={homeSettings?.how_it_works} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.occasions && (
            <AnimatedSection variant="fade-up">
              <OccasionsSection settings={homeSettings?.occasions} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.why_nfc && (
            <AnimatedSection variant="fade-up">
              <WhyNFCSection settings={homeSettings?.why_nfc} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.why_us && (
            <AnimatedSection variant="fade-up">
              <WhyUsSection settings={homeSettings?.why_us} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.preview && (
            <AnimatedSection variant="scale-up">
              <PreviewSection settings={homeSettings?.preview} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.faq && (
            <AnimatedSection variant="fade-up">
              <FAQSection settings={homeSettings?.faq} />
            </AnimatedSection>
          )}
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {sections.final_cta && (
            <AnimatedSection variant="scale-up" delay={100}>
              <FinalCTASection settings={homeSettings?.final_cta} />
            </AnimatedSection>
          )}
        </Suspense>
      </main>
    </>
  );
}
