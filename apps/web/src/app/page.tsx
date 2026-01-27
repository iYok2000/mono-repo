"use client";

import { DecorativeImage } from "@/components/decorative";
import { 
  HeroSection, 
  SKUSection, 
  HowItWorksSection, 
  WhyUsSection,
  PreviewSection, 
  FAQSection,
  FinalCTASection
} from "@/components/home";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      <DecorativeImage variant="theme-main" opacity={0.03} zIndex={0} />
      
      {/* Hero Section */}
      <HeroSection />

      {/* SKU Selection */}
      <SKUSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Why Us */}
      <WhyUsSection />

      {/* Preview / Examples */}
      <PreviewSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection />
    </main>
  );
}
