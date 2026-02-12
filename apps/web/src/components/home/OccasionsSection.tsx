"use client";

import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Cake, Heart, GraduationCap, Gift, Sparkles, Users, Star, Zap, Crown, Trophy, MessageCircle, Award } from "lucide-react";

const iconMap: Record<string, any> = {
  cake: Cake,
  heart: Heart,
  sparkles: Sparkles,
  graduationcap: GraduationCap,
  gift: Gift,
  users: Users,
  star: Star,
  zap: Zap,
  crown: Crown,
  trophy: Trophy,
  messagecircle: MessageCircle,
  award: Award,
};

interface OccasionsSettings {
  title?: string;
  subtitle?: string;
  occasion_1?: string;
  occasion_1_icon?: string;
  occasion_2?: string;
  occasion_2_icon?: string;
  occasion_3?: string;
  occasion_3_icon?: string;
  occasion_4?: string;
  occasion_4_icon?: string;
  occasion_5?: string;
  occasion_5_icon?: string;
  occasion_6?: string;
  occasion_6_icon?: string;
  occasion_7?: string;
  occasion_7_icon?: string;
  occasion_8?: string;
  occasion_8_icon?: string;
  occasion_9?: string;
  occasion_9_icon?: string;
}

interface OccasionsSectionProps {
  settings?: OccasionsSettings;
}

export function OccasionsSection({ settings }: OccasionsSectionProps) {
  const title = settings?.title || "เหมาะกับทุกโอกาสพิเศษ";
  const subtitle = settings?.subtitle || "วันเกิด • วันครบรอบ • งานแต่ง • รับปริญญา • เซอร์ไพรส์แฟน • ขอบคุณลูกค้า — แค่แตะก็เปิดใจ";

  // Build occasions array from settings, filter out empty ones
  const occasions = [
    { label: settings?.occasion_1, icon: settings?.occasion_1_icon },
    { label: settings?.occasion_2, icon: settings?.occasion_2_icon },
    { label: settings?.occasion_3, icon: settings?.occasion_3_icon },
    { label: settings?.occasion_4, icon: settings?.occasion_4_icon },
    { label: settings?.occasion_5, icon: settings?.occasion_5_icon },
    { label: settings?.occasion_6, icon: settings?.occasion_6_icon },
    { label: settings?.occasion_7, icon: settings?.occasion_7_icon },
    { label: settings?.occasion_8, icon: settings?.occasion_8_icon },
    { label: settings?.occasion_9, icon: settings?.occasion_9_icon },
  ].filter(occasion => occasion.label && occasion.label.trim() !== "");

  // Fallback to defaults if no occasions
  const displayOccasions = occasions.length > 0 ? occasions : [
    { label: "วันเกิด", icon: "cake" },
    { label: "วันครบรอบ", icon: "heart" },
    { label: "งานแต่ง", icon: "sparkles" },
    { label: "รับปริญญา", icon: "graduationcap" },
    { label: "เซอร์ไพรส์แฟน", icon: "gift" },
    { label: "ขอบคุณลูกค้า", icon: "users" },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-[var(--muted)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Occasions Grid - Dynamic columns based on count */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 ${displayOccasions.length > 6 ? 'lg:grid-cols-4' : 'lg:grid-cols-6'}`}>
          {displayOccasions.map((occasion, index) => {
            const IconComponent = iconMap[occasion.icon?.toLowerCase() || ""] || Gift;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-16 h-16 mb-4 bg-[var(--primary-soft)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] text-center">
                  {occasion.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
