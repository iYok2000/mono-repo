"use client";

import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Zap, Users, Heart, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";

interface SKUSettings {
  title?: string;
  subtitle?: string;
  card_title?: string;
  express_enabled?: boolean;
  express_badge_text?: string;
  express_emoji?: string;
  express_name?: string;
  express_tagline?: string;
  express_description?: string;
  express_feature_1?: string;
  express_feature_2?: string;
  express_feature_3?: string;
  express_feature_4?: string;
  express_button_text?: string;
  express_button_link?: string;
  express_footer_text?: string;
  squad_enabled?: boolean;
  squad_badge_text?: string;
  squad_emoji?: string;
  squad_name?: string;
  squad_tagline?: string;
  squad_description?: string;
  squad_feature_1?: string;
  squad_feature_2?: string;
  squad_feature_3?: string;
  squad_feature_4?: string;
  squad_button_text?: string;
  squad_button_link?: string;
  squad_footer_text?: string;
  greeting_enabled?: boolean;
  greeting_badge_text?: string;
  greeting_emoji?: string;
  greeting_name?: string;
  greeting_tagline?: string;
  greeting_description?: string;
  greeting_feature_1?: string;
  greeting_feature_2?: string;
  greeting_feature_3?: string;
  greeting_feature_4?: string;
  greeting_button_text?: string;
  greeting_button_link?: string;
  greeting_footer_text?: string;
}

interface SKUSectionProps {
  settings?: SKUSettings;
}

export const SKUSection = memo(function SKUSection({ settings }: SKUSectionProps) {
  const title = settings?.title || "เลือกแพ็กของขวัญที่เหมาะกับคุณ";
  const subtitle = settings?.subtitle || "คนส่วนใหญ่เลือก <strong>Express</strong> — ของขวัญเร็ว ใช้ได้เลย ทั้ง 3 แบบมี NFC + QR สำรอง";

  const expressEmoji = settings?.express_emoji || "⚡";
  const expressName = settings?.express_name || "GyByte Express";
  const expressBadge = settings?.express_badge_text || "เร็วสุด";
  const expressTagline = settings?.express_tagline || "⭐ ตัวเลือกยอดนิยม — ของขวัญเร็ว ใช้ได้เลย";
  const expressDesc = settings?.express_description || "สำหรับวันเกิด ครบรอบ เซอร์ไพรส์ — ทำเสร็จไวในวันเดียว เหมาะสำหรับของขวัญแทนใจ 1 คน";
  const expressF1 = settings?.express_feature_1 || "ตั้งเวลาเปิด + ใส่รหัสผ่านได้";
  const expressF2 = settings?.express_feature_2 || "ใช้ลิงก์จาก Google Drive ของคุณ";
  const expressF3 = settings?.express_feature_3 || "ครอบ NFC + QR สำรองทุกชิ้น";
  const expressF4 = settings?.express_feature_4 || "เหมาะสำหรับเซอร์ไพรส์ 1 คน";
  const expressBtnText = settings?.express_button_text || "สั่งของขวัญด่วน Express";
  const expressBtnLink = settings?.express_button_link || "/create/express";
  const expressFooter = settings?.express_footer_text || "พร้อมใช้ใน 10 นาที • เหมาะสำหรับของขวัญฉุกเฉิน";

  const squadEmoji = settings?.squad_emoji || "👥";
  const squadName = settings?.squad_name || "GyByte Squad";
  const squadBadge = settings?.squad_badge_text || "ทำหมู่";
  const squadTagline = settings?.squad_tagline || "Group Video Gift — อัดคลิปอวยพรจากเพื่อนหลายคน";
  const squadDesc = settings?.squad_description || "เหมาะสำหรับ <strong>วันอำลาเพื่อน</strong>, <strong>วันแต่งงาน</strong>, หรือ<strong>ครบรอบพิเศษของหมู่คณะ</strong> — เมื่อมีเพื่อน 7–10 คนที่อยากส่งคลิปอวยพรรวมกัน";
  const squadF1 = settings?.squad_feature_1 || "มีหน้าสถานะติดตามว่าใครส่งคลิปแล้ว";
  const squadF2 = settings?.squad_feature_2 || "เราตัดต่อให้ + เพิ่มเพลงประกอบ + ส่ง Final";
  const squadF3 = settings?.squad_feature_3 || "Use-case: อำลา / แต่งงาน / ครบรอบหมู่คณะ";
  const squadF4 = settings?.squad_feature_4 || "รองรับ 7–10 คน (ขยายได้ตามจำนวนเพื่อน)";
  const squadBtnText = settings?.squad_button_text || "เริ่มสร้าง Squad Pack";
  const squadBtnLink = settings?.squad_button_link || "/create/squad";
  const squadFooter = settings?.squad_footer_text || "ใช้เวลา 3–5 วัน • เหมาะสำหรับของขวัญแบบมีส่วนร่วม";

  const greetingEmoji = settings?.greeting_emoji || "💌";
  const greetingName = settings?.greeting_name || "Greeting Card";
  const greetingBadge = settings?.greeting_badge_text || "เริ่มต้นเบาๆ";
  const greetingTagline = settings?.greeting_tagline || "ใช้แทนการ์ดกระดาษ — ราคาประหยัด ทำง่าย";
  const greetingDesc = settings?.greeting_description || "เหมาะสำหรับ<strong>ของขวัญทั่วไป</strong> เช่น วันเกิดเพื่อนร่วมงาน ส่งกำลังใจ หรือใช้เป็น<strong>นามบัตรส่วนตัว</strong>ที่มีข้อความอวยพร";
  const greetingF1 = settings?.greeting_feature_1 || "เทมเพลตนามบัตรให้เลือก (ทำเสร็จไว)";
  const greetingF2 = settings?.greeting_feature_2 || "ใส่ชื่อ IG Line@ เบอร์ รูปภาพ";
  const greetingF3 = settings?.greeting_feature_3 || "เพิ่มวิดีโออวยพรสั้นๆ หรือข้อความ";
  const greetingF4 = settings?.greeting_feature_4 || "ใช้แทนการ์ดกระดาษ — ราคาถูกสุด";
  const greetingBtnText = settings?.greeting_button_text || "เลือกเทมเพลต Greeting";
  const greetingBtnLink = settings?.greeting_button_link || "/create/greeting";
  const greetingFooter = settings?.greeting_footer_text || "เริ่มต้นง่าย • เหมาะสำหรับของขวัญทั่วไป";

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[var(--card)]" id="pricing">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold text-[var(--foreground)] mb-4">
            {title}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: subtitle }} />
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-16">
          {/* Express Card */}
          <div className="relative group bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-1 animate-slide-in">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/5 transition-all duration-300 -z-10 blur-xl"></div>
            
            {/* Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full shadow-md">
                <Zap className="w-3 h-3" />
                {expressBadge}
              </span>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="w-11 h-11 mb-3 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl">{expressEmoji}</div>
                <h3 className="text-lg lg:text-xl font-bold text-[var(--foreground)] mb-1">
                  {expressName}
                </h3>
                <p className="text-sm text-[var(--primary)] font-medium mb-2">
                  {expressTagline}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {expressDesc}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{expressF1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{expressF2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{expressF3}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5 fill-[var(--primary)]" />
                  <span className="text-[var(--muted)] text-sm">{expressF4}</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-1">
                <Link href={expressBtnLink}>
                  <Button variant="primary" fullWidth>
                    {expressBtnText}
                  </Button>
                </Link>
                <p className="text-center text-xs text-[var(--subtle)] mt-2.5">
                  {expressFooter}
                </p>
              </div>
            </div>
          </div>

          {/* Squad Card - Position 2 */}
          <div className="relative group bg-[var(--card)] rounded-2xl border-2 border-transparent p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-in delay-200" style={{ 
            background: 'var(--squad-gradient)',
            backgroundClip: 'padding-box',
            // borderImage: 'var(--squad-gradient) 1'
          }}>
            {/* Inner white background with gradient border effect */}
            <div className="absolute inset-[2px] bg-[var(--card)] rounded-2xl -z-10"></div>
            
            {/* Gradient overlay for subtle tint */}
            <div className="absolute inset-[2px] rounded-2xl -z-10 opacity-60" style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))'
            }}></div>
            
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-20" style={{
              background: 'var(--squad-gradient)',
              filter: 'blur(20px)'
            }}></div>
            
            {/* Popular Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-white text-xs font-semibold rounded-full shadow-md" style={{
                background: 'var(--squad-gradient)'
              }}>
                <Users className="w-3 h-3" />
                {squadBadge}
              </span>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Header */}
              <div>
                <div className="w-11 h-11 mb-3 rounded-xl bg-[var(--violet)]/10 flex items-center justify-center text-2xl">{squadEmoji}</div>
                <h3 className="text-lg lg:text-xl font-bold text-[var(--foreground)] mb-1">
                  {squadName}
                </h3>
                <p className="text-sm font-medium mb-2" style={{
                  background: 'var(--squad-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {squadTagline}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: squadDesc }} />
              </div>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{squadF1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{squadF2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{squadF3}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-[var(--violet)] flex-shrink-0 mt-0.5 fill-[var(--violet)]" />
                  <span className="text-[var(--muted)] text-sm">{squadF4}</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-1">
                <Link href={squadBtnLink}>
                  <button className="w-full py-3 px-6 rounded-xl text-sm font-medium text-white transition-all duration-150 shadow-lg hover:shadow-xl hover:scale-[1.02]" style={{
                    background: 'var(--squad-gradient)'
                  }}>
                    {squadBtnText}
                  </button>
                </Link>
                <p className="text-center text-xs text-[var(--subtle)] mt-2.5">
                  {squadFooter}
                </p>
              </div>
            </div>
          </div>

          {/* Greeting Card - Position 3 (Beginner-Friendly) */}
          <div className="relative group bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 transition-all duration-300 hover:border-[var(--amber)] hover:shadow-xl hover:-translate-y-1 animate-slide-in delay-300">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-[var(--amber)]/0 group-hover:bg-[var(--amber)]/5 transition-all duration-300 -z-10 blur-xl"></div>
            
            {/* Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--amber)] text-white text-xs font-semibold rounded-full shadow-md">
                <Sparkles className="w-3 h-3" />
                {greetingBadge}
              </span>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="w-11 h-11 mb-3 rounded-xl bg-[var(--amber)]/10 flex items-center justify-center text-2xl">{greetingEmoji}</div>
                <h3 className="text-lg lg:text-xl font-bold text-[var(--foreground)] mb-1">
                  {greetingName}
                </h3>
                <p className="text-sm text-[var(--amber)] font-medium mb-2">
                  {greetingTagline}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: greetingDesc }} />
              </div>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{greetingF1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{greetingF2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-sm">{greetingF3}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--amber)] flex-shrink-0 mt-0.5 fill-[var(--amber)]" />
                  <span className="text-[var(--muted)] text-sm">{greetingF4}</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-1">
                <Link href={greetingBtnLink}>
                  <Button variant="primary" fullWidth className="!bg-[var(--amber)] hover:!bg-[#D97706] active:!bg-[#B45309]">
                    {greetingBtnText}
                  </Button>
                </Link>
                <p className="text-center text-xs text-[var(--subtle)] mt-2.5">
                  {greetingFooter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
