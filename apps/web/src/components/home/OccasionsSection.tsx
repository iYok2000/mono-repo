"use client";

import { Cake, Heart, GraduationCap, Gift, Sparkles, Users } from "lucide-react";

const occasions = [
  {
    icon: Cake,
    label: "วันเกิด",
  },
  {
    icon: Heart,
    label: "วันครบรอบ",
  },
  {
    icon: Sparkles,
    label: "งานแต่ง",
  },
  {
    icon: GraduationCap,
    label: "รับปริญญา",
  },
  {
    icon: Gift,
    label: "เซอร์ไพรส์แฟน",
  },
  {
    icon: Users,
    label: "ขอบคุณลูกค้า",
  },
];

export function OccasionsSection() {
  return (
    <section className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            เหมาะกับทุกโอกาสพิเศษ
          </h2>
          <p className="text-lg lg:text-xl text-[var(--muted)] leading-relaxed">
            วันเกิด • วันครบรอบ • งานแต่ง • รับปริญญา • เซอร์ไพรส์แฟน • ขอบคุณลูกค้า — แค่แตะก็เปิดใจ
          </p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {occasions.map((occasion, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 mb-4 bg-[var(--primary-soft)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <occasion.icon className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)] text-center">
                {occasion.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
