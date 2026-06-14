"use client";

import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Play } from "lucide-react";
import Link from "next/link";
import { BsPeople } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";

interface HeroSettings {
  badge_text?: string;
  badge_icon?: string;
  title_highlight?: string;
  title_rest?: string;
  subtitle?: string;
  feature_1?: string;
  feature_2?: string;
  feature_3?: string;
  cta_primary?: string;
  cta_secondary?: string;
  cta_tertiary?: string;
}

interface HeroSectionProps {
  settings?: HeroSettings;
}

export const HeroSection = memo(function HeroSection({ settings }: HeroSectionProps) {
  // Fallback to default values if settings not provided
  const badgeText = settings?.badge_text || "ของขวัญความทรงจำ • Digital Gift to Thailand";
  const titleHighlight = settings?.title_highlight || "ของขวัญวิดีโอแบบ NFC";
  const titleRest = settings?.title_rest || "ที่เปิดคลิปความทรงจำได้ทันที";
  const subtitle = settings?.subtitle || "แตะการ์ดเพียงครั้งเดียว ก็เปิดคลิป วิดีโอ หรือข้อความแทนใจได้ทันที — ของขวัญสุดพิเศษสำหรับวันเกิด ครบรอบ และทุกโอกาสที่คุณอยากให้ความทรงจำอยู่ได้นาน";
  const feature1 = settings?.feature_1 || "มี QR สำรอง สแกนได้ทุกเครื่อง";
  const feature2 = settings?.feature_2 || "ไฟล์อยู่ใน Google Drive ของคุณ—คุมสิทธิ์เอง";
  const feature3 = settings?.feature_3 || "ตั้งเวลาเปิด + ใส่รหัส ได้";
  const ctaPrimary = settings?.cta_primary || "สั่งของขวัญด่วน";
  const ctaSecondary = settings?.cta_secondary || "Squad 7-10 คน";
  const ctaTertiary = settings?.cta_tertiary || "ดูตัวอย่างของขวัญ";

  return (
    <section className="relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Pre-title Badge — stagger 0 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-soft)] rounded-full opacity-0 animate-[slide-up_0.6s_ease-out_0.1s_forwards]">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse-led"></span>
              <span className="text-[var(--primary)] text-sm font-medium">
                {badgeText}
              </span>
            </div>

            {/* Main Heading — stagger 1 */}
            <div className="space-y-3 opacity-0 animate-[slide-up_0.7s_ease-out_0.25s_forwards]">
              <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight">
                <span className="text-[var(--primary)] inline-block">
                  {titleHighlight}
                </span>
                <br />
                <span className="text-[var(--foreground)] inline-block mt-1">
                  {titleRest}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] leading-relaxed max-w-xl font-normal">
                {subtitle}
              </p>
            </div>

            {/* Micro-proof Badges — stagger 2 */}
            <div className="space-y-2.5 opacity-0 animate-[slide-up_0.6s_ease-out_0.45s_forwards]">
              {[feature1, feature2, feature3].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 group/feature">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover/feature:scale-110">
                    <Check className="w-3 h-3 text-[var(--primary)]" />
                  </div>
                  <p className="text-base text-[var(--muted)] font-normal leading-relaxed transition-colors duration-200 group-hover/feature:text-[var(--foreground)]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons — stagger 3 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 opacity-0 animate-[slide-up_0.6s_ease-out_0.6s_forwards]">
              <Button icon={<Play className="w-4 h-4" />} variant="large">
                {ctaPrimary}
              </Button>

              <Button variant="secondary">{ctaSecondary}</Button>

              <Button icon={<Play className="w-4 h-4" />} variant="link">
                {ctaTertiary}
              </Button>
            </div>
          </div>

          {/* Right: Mascot "Byte" - Premium Ceramic Black Design */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in delay-300">
            <div className="relative">
              {/* Background Violet Magic Glow */}
              <div className="absolute inset-0 bg-[var(--violet)]/20 rounded-full blur-[100px] animate-magic-glow"></div>
              {/* Emerald Inner Glow */}
              <div className="absolute inset-8 bg-[var(--primary)]/15 rounded-full blur-[60px] animate-pulse-led"></div>

              {/* Mascot Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Premium Byte Mascot - Ceramic Black with Emerald Running Lights */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Outer Glow Ring */}
                    <div className="absolute -inset-4 rounded-[4rem] bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/20 to-[var(--primary)]/0 blur-xl animate-running-lights"></div>
                    
                    {/* Body - Ceramic Black Finish */}
                    <div className="byte-ceramic w-64 h-64 rounded-[3rem] flex items-center justify-center relative overflow-hidden">
                      {/* Ceramic Shine Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02] pointer-events-none"></div>
                      
                      {/* LED Running Light Strips - Top */}
                      <div className="absolute top-3 left-8 right-8 h-[2px] byte-led-strip rounded-full"></div>
                      
                      {/* LED Running Light Strips - Bottom */}
                      <div className="absolute bottom-3 left-8 right-8 h-[2px] byte-led-strip rounded-full" style={{ animationDelay: "0.5s" }}></div>
                      
                      {/* LED Running Light Strips - Left */}
                      <div className="absolute left-3 top-8 bottom-8 w-[2px] byte-led-strip rounded-full" style={{ animationDelay: "1s" }}></div>
                      
                      {/* LED Running Light Strips - Right */}
                      <div className="absolute right-3 top-8 bottom-8 w-[2px] byte-led-strip rounded-full" style={{ animationDelay: "1.5s" }}></div>
                      
                      {/* LED Eye/Screen - Emerald Glow */}
                      <div className="relative">
                        <div className="absolute -inset-4 bg-[var(--primary)]/30 rounded-3xl blur-2xl animate-pulse-led"></div>
                        <div className="w-32 h-32 bg-[var(--byte-led)] rounded-2xl animate-pulse-led flex items-center justify-center relative overflow-hidden"
                             style={{ boxShadow: "0 0 60px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.3)" }}>
                          {/* Eye Reflection */}
                          <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-lg blur-sm"></div>
                          <div className="w-16 h-16 bg-black/30 rounded-xl backdrop-blur-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Antenna/NFC Symbol with Premium Glow */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[var(--primary)]/40 rounded-full blur-xl animate-pulse-led"></div>
                        <div className="w-14 h-14 bg-gradient-to-b from-[var(--byte-body-light)] to-[var(--byte-body)] rounded-full flex items-center justify-center border border-[var(--primary)]/30 shadow-lg"
                             style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" }}>
                          <div className="w-6 h-6 bg-[var(--primary)] rounded-full animate-pulse-led"
                               style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating NFC Card - Matte Black with Spot UV */}
                <div className="absolute top-10 right-0 animate-bounce">
                  <div className="card-premium rounded-xl px-4 py-3 border border-[var(--primary)]/20 animate-magic-glow"
                       style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(167, 139, 250, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📱</span>
                      <span className="text-[var(--primary)] text-xs font-semibold animate-spot-uv">NFC</span>
                    </div>
                  </div>
                </div>

                {/* Floating QR Code - Premium Style */}
                <div className="absolute bottom-20 left-0 animate-bounce" style={{ animationDelay: "0.5s" }}>
                  <div className="card-premium rounded-xl px-4 py-3 border border-[var(--violet)]/20"
                       style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(167, 139, 250, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔲</span>
                      <span className="text-[var(--violet)] text-xs font-semibold animate-spot-uv">QR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient - moved down to avoid covering buttons */}
      <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none"></div>
    </section>
  );
});
