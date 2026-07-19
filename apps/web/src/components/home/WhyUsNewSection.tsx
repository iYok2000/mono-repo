"use client";

import { memo } from "react";

interface WhyUsSettings {
  title?: string;
  subtitle?: string;
  feature_1_title?: string;
  feature_1_description?: string;
  feature_2_title?: string;
  feature_2_description?: string;
  feature_3_title?: string;
  feature_3_description?: string;
}

interface WhyUsSectionProps {
  settings?: WhyUsSettings;
}

export const WhyUsSection = memo(function WhyUsSection({ settings }: WhyUsSectionProps) {
  const title = settings?.title || "ทำไมต้องเรา?";
  const subtitle = settings?.subtitle || "เหตุผลที่คุณควรเลือก GyByte";

  // Only the 3 features that exist in the admin panel (why_us.feature_1..3).
  const reasons = [
    {
      title: settings?.feature_1_title || "ทำเสร็จเร็ว",
      description:
        settings?.feature_1_description ||
        "ไม่ต้องรอนาน Express ใช้แค่ 5 นาที Squad รอแค่เพื่อนส่งครบ",
    },
    {
      title: settings?.feature_2_title || "ปลอดภัย",
      description:
        settings?.feature_2_description ||
        "ไฟล์อยู่กับคุณใน Google Drive คุณคุมสิทธิ์เอง",
    },
    {
      title: settings?.feature_3_title || "ใช้งานง่าย",
      description:
        settings?.feature_3_description ||
        "ไม่ต้องโหลดแอป สแกนแล้วเปิดได้ทันที บนมือถือทุกรุ่น",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24" id="why-us">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
            {title}
          </h2>
          <p className="text-lg text-(--muted)">
            {subtitle}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-2xl bg-(--card) border border-(--border) hover:border-(--primary) transition-all duration-300 hover:shadow-(--shadow-md) hover:-translate-y-1"
            >
              <div className="w-10 h-1.5 rounded-full bg-(--primary) mb-5" />
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-(--primary) transition-colors duration-200">
                {reason.title}
              </h3>
              <p className="text-(--muted) leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
