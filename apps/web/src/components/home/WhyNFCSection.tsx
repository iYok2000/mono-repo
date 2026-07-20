"use client";

import { memo } from "react";

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

export const WhyNFCSection = memo(function WhyNFCSection({ settings }: WhyNFCSectionProps) {
  const title = settings?.title || "ทำไมต้องเป็นของขวัญความทรงจำแบบ NFC?";
  const subtitle =
    settings?.subtitle ||
    "เพราะเป็นมากกว่าการ์ดธรรมดา — เป็นประสบการณ์พิเศษที่ผู้รับจะจดจำได้ตลอดไป";

  // Content from admin panel (why_nfc.benefit_1..4).
  const benefits = [
    {
      title: settings?.benefit_1_title || "ไม่ต้องโหลดแอป",
      description:
        settings?.benefit_1_description || "เปิดผ่านเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม",
    },
    {
      title: settings?.benefit_2_title || "เปิดได้ทันทีด้วยมือถือ",
      description:
        settings?.benefit_2_description || "แตะการ์ดครั้งเดียว วิดีโอเปิดอัตโนมัติภายใน 1 วินาที",
    },
    {
      title: settings?.benefit_3_title || "ว้าวและทันสมัย",
      description:
        settings?.benefit_3_description || "เทคโนโลยี NFC ที่ดูเจ๋งและแตกต่าง สร้างความประทับใจ",
    },
    {
      title: settings?.benefit_4_title || "เก็บไว้ได้ตลอด",
      description:
        settings?.benefit_4_description || "การ์ดคุณภาพดี เก็บไว้เป็นของที่ระลึก เปิดดูซ้ำได้เรื่อยๆ",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-6 bg-(--card)">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-lg text-(--muted) leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-background border border-(--border) hover:border-(--primary) hover:shadow-(--shadow-md) hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-1.5 rounded-full bg-(--primary) mb-5" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-base text-(--muted) leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
