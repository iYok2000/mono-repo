"use client";

import { Smartphone, Video, Heart } from "lucide-react";

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

export function WhatIsItSection({ settings }: WhatIsItSectionProps) {
  const title = settings?.title || "การ์ดความทรงจำ NFC คืออะไร?";
  const subtitle = settings?.subtitle || "การ์ดของขวัญที่ซ่อนวิดีโอหรือข้อความพิเศษไว้ภายใน เพียงแตะกับโทรศัพท์ก็เปิดชมได้ทันที เหมาะสำหรับเก็บความทรงจำ ส่งความรู้สึก หรือเซอร์ไพรส์คนสำคัญ";
  const feature1Title = settings?.feature_1_title || "แตะเดียวเปิดได้เลย";
  const feature1Desc = settings?.feature_1_description || "ไม่ต้องพิมพ์ URL ไม่ต้องสแกน QR แค่แตะการ์ดกับมือถือก็เปิดดูได้ทันที";
  const feature2Title = settings?.feature_2_title || "เก็บวิดีโอและข้อความ";
  const feature2Desc = settings?.feature_2_description || "อัปโหลดคลิปวิดีโอ รูปภาพ หรือข้อความพิเศษไว้ในการ์ดใบเดียว";
  const feature3Title = settings?.feature_3_title || "ของขวัญที่เก็บไว้ได้นาน";
  const feature3Desc = settings?.feature_3_description || "การ์ดที่มีความหมาย เปิดดูซ้ำได้เรื่อยๆ เก็บความทรงจำไว้ตลอดไป";

  return (
    <section className="py-24 px-6 bg-[var(--card)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          
          {/* Feature 1 */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Smartphone className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              {feature1Title}
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              {feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Video className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              {feature2Title}
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              {feature2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              {feature3Title}
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              {feature3Desc}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
