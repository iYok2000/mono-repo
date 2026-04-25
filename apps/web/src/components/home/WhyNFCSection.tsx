"use client";

import { Smartphone, Zap, Sparkles, Clock } from "lucide-react";

const benefits = [
  {
    icon: Smartphone,
    title: "ไม่ต้องโหลดแอป",
    description: "เปิดผ่านเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม",
  },
  {
    icon: Zap,
    title: "เปิดได้ทันทีด้วยมือถือ",
    description: "แตะการ์ดครั้งเดียว วิดีโอเปิดอัตโนมัติภายใน 1 วินาที",
  },
  {
    icon: Sparkles,
    title: "ว้าวและทันสมัย",
    description: "เทคโนโลยี NFC ที่ดูเจ๋งและแตกต่าง สร้างความประทับใจ",
  },
  {
    icon: Clock,
    title: "เก็บไว้ได้ตลอด",
    description: "การ์ดคุณภาพดี เก็บไว้เป็นของที่ระลึก เปิดดูซ้ำได้เรื่อยๆ",
  },
];

interface WhyNFCSettings {
  title?: string;
  subtitle?: string;
  benefit_1_title?: string;
  benefit_1_description?: string;
  benefit_2_title?: string;
  benefit_2_description?: string;
  benefit_3_title?: string;
  benefit_3_description?: string;
  benefit_4_title?: string;
  benefit_4_description?: string;
}

interface WhyNFCSectionProps {
  settings?: WhyNFCSettings;
}

export function WhyNFCSection({ settings }: WhyNFCSectionProps) {
  const title = settings?.title || "ทำไมต้องเป็นของขวัญความทรงจำแบบ NFC?";
  const subtitle = settings?.subtitle || "เพราะเป็นมากกว่าการ์ดธรรมดา — เป็นประสบการณ์พิเศษที่ผู้รับจะจดจำได้ตลอดไป";
  
  // Use settings for benefits if provided, otherwise use defaults
  const benefitsData = [
    {
      icon: Smartphone,
      title: settings?.benefit_1_title || "ไม่ต้องโหลดแอป",
      description: settings?.benefit_1_description || "เปิดผ่านเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม",
    },
    {
      icon: Zap,
      title: settings?.benefit_2_title || "เปิดได้ทันทีด้วยมือถือ",
      description: settings?.benefit_2_description || "แตะการ์ดครั้งเดียว วิดีโอเปิดอัตโนมัติภายใน 1 วินาที",
    },
    {
      icon: Sparkles,
      title: settings?.benefit_3_title || "ว้าวและทันสมัย",
      description: settings?.benefit_3_description || "เทคโนโลยี NFC ที่ดูเจ๋งและแตกต่าง สร้างความประทับใจ",
    },
    {
      icon: Clock,
      title: settings?.benefit_4_title || "เก็บไว้ได้ตลอด",
      description: settings?.benefit_4_description || "การ์ดคุณภาพดี เก็บไว้เป็นของที่ระลึก เปิดดูซ้ำได้เรื่อยๆ",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--card)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            {title}
          </h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-6 p-8 glass-panel rounded-2xl shadow-(--shadow-sm) hover:border-(--primary) hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[var(--primary-soft)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-[var(--primary)]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-base text-[var(--muted)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
