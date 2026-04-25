"use client";

import { 
  ScrollytellingSection, 
  ScrollReveal, 
  FloatingCard, 
  FlyingByte 
} from "@/components/interactive";

export function ScrollytellingDemo() {
  return (
    <ScrollytellingSection className="min-h-[150vh] py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--primary-soft)] to-[var(--background)] opacity-50" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
            ไถลงมาเพื่อดูความมหัศจรรย์
          </h2>
          <p className="text-[var(--muted)] text-lg">
            Scroll down to see the magic ✨
          </p>
        </ScrollReveal>

        {/* Main Animation Area */}
        <div className="relative min-h-[80vh] flex items-center justify-center">
          {/* Floating NFC Card */}
          <FloatingCard className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-72 h-44 card-premium rounded-2xl shadow-2xl border border-[var(--primary)]/20 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1F2937] p-6 flex flex-col justify-between">
                {/* Logo */}
                <div className="flex justify-between items-start">
                  <span className="text-3xl">🎁</span>
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
                    <span className="text-white text-xs font-bold">NFC</span>
                  </div>
                </div>
                
                {/* Text */}
                <div>
                  <p className="text-[var(--primary)] text-sm mb-1">Tap to unlock</p>
                  <h4 className="text-white text-lg font-bold">Your Special Gift</h4>
                </div>
                
                {/* Emerald Line */}
                <div className="w-full h-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent" />
              </div>
            </div>
          </FloatingCard>

          {/* Flying Byte - Right Side */}
          <FlyingByte 
            className="absolute right-[10%] top-1/3 z-20"
            delay={500}
            direction="right"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse" />
              
              {/* Byte Body */}
              <div className="byte-soft w-20 h-20 rounded-[1.2rem] flex items-center justify-center relative shadow-xl">
                {/* Eye */}
                <div className="w-10 h-10 bg-[var(--byte-led)] rounded-lg flex items-center justify-center"
                     style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}>
                  <div className="w-5 h-5 bg-black/20 rounded-md" />
                </div>
                
                {/* Antenna */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-5 h-5 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Speech Bubble */}
              <div className="absolute -top-8 -right-2 bg-[var(--card)] px-2 py-1 rounded-lg shadow-md border border-[var(--border)] text-sm">
                👋 สวัสดี!
              </div>
            </div>
          </FlyingByte>

          {/* Decorative Elements */}
          <ScrollReveal delay={200} direction="left" className="absolute left-[5%] bottom-1/4">
            <div className="w-16 h-16 bg-[var(--amber-soft)] rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400} direction="right" className="absolute right-[5%] bottom-1/3">
            <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-full flex items-center justify-center">
              <span className="text-xl">💚</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Text */}
        <ScrollReveal delay={600} className="text-center mt-20">
          <p className="text-[var(--muted)] text-sm">
            นี่คือประสบการณ์ที่ผู้รับจะได้พบเมื่อเปิดการ์ด
          </p>
        </ScrollReveal>
      </div>
    </ScrollytellingSection>
  );
}
