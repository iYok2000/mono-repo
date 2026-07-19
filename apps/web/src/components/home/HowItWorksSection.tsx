"use client";

import { memo } from "react";
import { StepCard } from "@/components/ui/StepCard";

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
  const title = settings?.title || "ใช้งานง่าย ในสามขั้นตอน";
  const subtitle = settings?.subtitle || "ไม่ต้องติดตั้งแอป ไม่ต้องสมัครสมาชิก";

  // All step content comes from admin panel settings (home_settings.step_1..3),
  // with sensible defaults so the section still renders before it's configured.
  const steps = [
    {
      number: 1,
      title: settings?.step_1_title || "สแกน QR หรือแตะการ์ด",
      description:
        settings?.step_1_description ||
        "เริ่มต้นด้วยการสแกน QR Code หรือแตะการ์ด NFC เพื่อเข้าสู่ระบบ",
    },
    {
      number: 2,
      title: settings?.step_2_title || "อัปโหลดวิดีโอหรือข้อความที่อยากส่ง",
      description:
        settings?.step_2_description ||
        "เลือกคลิปวิดีโอ รูปภาพ หรือพิมพ์ข้อความที่อยากส่งถึงคนพิเศษ",
    },
    {
      number: 3,
      title: settings?.step_3_title || "ส่งเป็นของขวัญ — แตะแล้วเปิดดูได้ทันที",
      description:
        settings?.step_3_description ||
        "เมื่อผู้รับแตะการ์ด วิดีโอหรือข้อความจะเปิดขึ้นมาทันที",
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 bg-background" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-(--muted) mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* 3 Steps */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={step.number * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
