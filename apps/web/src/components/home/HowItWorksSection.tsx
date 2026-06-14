"use client";

import { memo } from "react";
import { Palette, Link, CheckCircle2, Users, Upload, Film } from "lucide-react";
import { StepCard } from "@/components/ui/StepCard";

const expressSteps = [
  {
    number: 1,
    title: "สแกน QR หรือแตะการ์ด",
    description: "เริ่มต้นด้วยการสแกน QR Code หรือแตะการ์ด NFC เพื่อเข้าสู่ระบบ",
    icon: Palette,
    delay: 100,
  },
  {
    number: 2,
    title: "อัปโหลดวิดีโอหรือข้อความที่อยากส่ง",
    description: "เลือกคลิปวิดีโอ รูปภาพ หรือพิมพ์ข้อความที่อยากส่งถึงคนพิเศษ",
    icon: Link,
    delay: 200,
  },
  {
    number: 3,
    title: "ส่งเป็นของขวัญ — แตะแล้วเปิดดูได้ทันที",
    description: "เมื่อผู้รับแตะการ์ด วิดีโอหรือข้อความจะเปิดขึ้นมาทันที",
    icon: CheckCircle2,
    delay: 300,
  },
];

const squadSteps = [
  {
    number: 1,
    title: "สั่งชุดการ์ด 7–10 ใบ",
    description: "ลิงก์เฉพาะคน แจกให้เพื่อนแต่ละคน",
    icon: Users,
    delay: 100,
  },
  {
    number: 2,
    title: "เพื่อนแต่ละคนแปะลิงก์คลิป + ข้อความ",
    description: "แต่ละคนอัปโหลดคลิปของตัวเอง + สถานะส่งแล้ว",
    icon: Upload,
    delay: 200,
  },
  {
    number: 3,
    title: "ครบแล้วเรารวม + ตัดต่อ → ส่ง Final ให้",
    description: "รวมทุกคลิปเป็นวิดีโอเดียว ส่ง Final ให้",
    icon: Film,
    delay: 300,
  },
];

interface HowItWorksSettings {
  title?: string;
  subtitle?: string;
  step_1_title?: string;
  step_1_description?: string;
  step_2_title?: string;
  step_2_description?: string;
  step_3_title?: string;
  step_3_description?: string;
}

interface HowItWorksSectionProps {
  settings?: HowItWorksSettings;
}

export const HowItWorksSection = memo(function HowItWorksSection({ settings }: HowItWorksSectionProps) {
  const title = settings?.title || "ใช้งานยังไง? แค่ 3 ขั้นตอนง่ายๆ";
  const subtitle = settings?.subtitle || "";

  return (
    <section className="py-32 px-6 bg-[var(--background)]" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-[var(--muted)] mt-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Express + Squad Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          
          {/* Express Cards */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-semibold text-sm mb-4">
              ⚡ Express (ด่วน)
            </div>
            <div className="grid gap-8">
              {expressSteps.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={step.delay}
                />
              ))}
            </div>
          </div>

          {/* Squad Cards */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-semibold text-sm mb-4">
              👥 Squad (7-10 คน)
            </div>
            <div className="grid gap-8">
              {squadSteps.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={step.delay}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
});
