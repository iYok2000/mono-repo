"use client";

import { memo } from "react";

interface WhatIsItSettings {
  title?: string;
  subtitle?: string;
  feature_1_title?: string;
  feature_1_description?: string;
  feature_2_title?: string;
  feature_2_description?: string;
  feature_3_title?: string;
  feature_3_description?: string;
}

interface WhatIsItSectionProps {
  settings?: WhatIsItSettings;
}

export const WhatIsItSection = memo(function WhatIsItSection({ settings }: WhatIsItSectionProps) {
  const title = settings?.title || "การ์ดความทรงจำ NFC คืออะไร?";
  const subtitle =
    settings?.subtitle ||
    "การ์ดของขวัญที่ซ่อนวิดีโอหรือข้อความพิเศษไว้ภายใน เพียงแตะกับโทรศัพท์ก็เปิดชมได้ทันที เหมาะสำหรับเก็บความทรงจำ ส่งความรู้สึก หรือเซอร์ไพรส์คนสำคัญ";

  const features = [
    {
      title: settings?.feature_1_title || "แตะเดียวเปิดได้เลย",
      description:
        settings?.feature_1_description ||
        "ไม่ต้องพิมพ์ URL ไม่ต้องสแกน QR แค่แตะการ์ดกับมือถือก็เปิดดูได้ทันที",
    },
    {
      title: settings?.feature_2_title || "เก็บวิดีโอและข้อความ",
      description:
        settings?.feature_2_description ||
        "อัปโหลดคลิปวิดีโอ รูปภาพ หรือข้อความพิเศษไว้ในการ์ดใบเดียว",
    },
    {
      title: settings?.feature_3_title || "ของขวัญที่เก็บไว้ได้นาน",
      description:
        settings?.feature_3_description ||
        "การ์ดที่มีความหมาย เปิดดูซ้ำได้เรื่อยๆ เก็บความทรงจำไว้ตลอดไป",
    },
  ];

  return (
    <section className="py-24 px-6 bg-(--card)">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-(--muted) leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-background border border-(--border) transition-all duration-300 hover:border-(--primary) hover:-translate-y-1 hover:shadow-(--shadow-md)"
            >
              <div className="w-10 h-1.5 rounded-full bg-(--primary) mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-(--muted) leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
