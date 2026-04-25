"use client";

import { useState, useEffect } from "react";
import { DecorativeImage } from "@/components/decorative";
import { LandingSidebar } from "@/components/layout/LandingSidebar";
import { 
  HeroSection,
  WhatIsItSection,
  SKUSection, 
  HowItWorksSection,
  OccasionsSection,
  WhyNFCSection,
  WhyUsSection,
  PreviewSection, 
  FAQSection,
  FinalCTASection
} from "@/components/home";
import {
  getHomeSections,
  DEFAULT_SECTION_VISIBILITY,
  type SectionVisibility,
} from "@/services/settingsService";

export default function Home() {
  const [sections, setSections] = useState<SectionVisibility>(DEFAULT_SECTION_VISIBILITY);

  useEffect(() => {
    getHomeSections().then(setSections).catch(() => setSections(DEFAULT_SECTION_VISIBILITY));
  }, []);

  return (
    <>
      <LandingSidebar />
      <main className="relative min-h-screen bg-background md:pl-72">
      <DecorativeImage variant="theme-main" opacity={0.03} zIndex={0} />
      
      {sections.hero && <HeroSection />}
      {sections.what_is_it && <WhatIsItSection />}
      {sections.sku && <SKUSection />}
      {sections.how_it_works && <HowItWorksSection />}
      {sections.occasions && <OccasionsSection />}
      {sections.why_nfc && <WhyNFCSection />}
      {sections.why_us && <WhyUsSection />}
      {sections.preview && <PreviewSection />}
      {sections.faq && <FAQSection />}
      {sections.final_cta && <FinalCTASection />}
    </main>
    </>
  );
}
