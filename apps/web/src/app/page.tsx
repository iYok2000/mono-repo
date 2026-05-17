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
import { getHomeSettings } from "@/services/homeSettings";
import type { HomeSettings } from "@/services/homeSettings";

export default function Home() {
  const [sections, setSections] = useState<SectionVisibility>(DEFAULT_SECTION_VISIBILITY);
  const [settings, setSettings] = useState<HomeSettings | null>(null);

  useEffect(() => {
    getHomeSections().then(setSections).catch(() => setSections(DEFAULT_SECTION_VISIBILITY));
    getHomeSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <LandingSidebar />
      <main className="relative min-h-screen bg-background md:pl-72">
      <DecorativeImage variant="theme-main" opacity={0.03} zIndex={0} />
      
      {sections.hero && <HeroSection settings={settings?.hero} />}
      {sections.what_is_it && <WhatIsItSection settings={settings?.what_is_it} />}
      {sections.sku && <SKUSection />}
      {sections.how_it_works && <HowItWorksSection settings={settings?.how_it_works} />}
      {sections.occasions && <OccasionsSection settings={settings?.occasions} />}
      {sections.why_nfc && <WhyNFCSection settings={settings?.why_nfc} />}
      {sections.why_us && <WhyUsSection settings={settings?.why_us} />}
      {sections.preview && <PreviewSection settings={settings?.preview} />}
      {sections.faq && <FAQSection settings={settings?.faq} />}
      {sections.final_cta && <FinalCTASection settings={settings?.final_cta} />}
    </main>
    </>
  );
}
