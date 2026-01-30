"use client";

import { Smartphone, Video, Heart } from "lucide-react";

export function WhatIsItSection() {
  return (
    <section className="py-24 px-6 bg-[var(--card)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            การ์ดความทรงจำ NFC คืออะไร?
          </h2>
          <p className="text-lg lg:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mx-auto">
            การ์ดของขวัญที่ซ่อนวิดีโอหรือข้อความพิเศษไว้ภายใน เพียงแตะกับโทรศัพท์ก็เปิดชมได้ทันที เหมาะสำหรับเก็บความทรงจำ ส่งความรู้สึก หรือเซอร์ไพรส์คนสำคัญ
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
              แตะเดียวเปิดได้เลย
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              ไม่ต้องพิมพ์ URL ไม่ต้องสแกน QR แค่แตะการ์ดกับมือถือก็เปิดดูได้ทันที
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Video className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              เก็บวิดีโอและข้อความ
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              อัปโหลดคลิปวิดีโอ รูปภาพ หรือข้อความพิเศษไว้ในการ์ดใบเดียว
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              ของขวัญที่เก็บไว้ได้นาน
            </h3>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              การ์ดที่มีความหมาย เปิดดูซ้ำได้เรื่อยๆ เก็บความทรงจำไว้ตลอดไป
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
