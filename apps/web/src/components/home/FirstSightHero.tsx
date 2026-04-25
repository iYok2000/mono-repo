"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  InteractiveByte, 
  ByteCardInteraction, 
  ByteCategorySelector,
  Card3DPreview,
  NFCCardFront,
  NFCCardBack,
} from "@/components/interactive";
import { ArrowRight, Play, Sparkles } from "lucide-react";

interface FirstSightHeroProps {
  variant?: "thai" | "international";
}

// Hero Text Content
const HeroText = memo(function HeroText() {
  return (
    <div className="space-y-6">
      {/* Badge */}
      <Badge variant="glow" size="md" pulse>
        <Sparkles className="w-3.5 h-3.5" />
        <span>ของขวัญความทรงจำ • Digital Gift</span>
      </Badge>

      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-display">
          <span className="text-gradient-emerald">ของขวัญวิดีโอแบบ NFC</span>
          <br />
          <span className="text-[var(--foreground)]">
            ที่เปิดคลิปความทรงจำได้ทันที
          </span>
        </h1>
        
        <p className="text-body-lg max-w-lg">
          แตะการ์ดเพียงครั้งเดียว ก็เปิดคลิป วิดีโอ หรือข้อความแทนใจได้ทันที — 
          ของขวัญสุดพิเศษสำหรับทุกโอกาส
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button variant="large" icon={<Play className="w-4 h-4" />}>
          สั่งของขวัญด่วน
        </Button>
        
        <Button variant="secondary">
          Squad 7-10 คน
        </Button>
        
        <Button variant="link" iconAfter={<ArrowRight className="w-4 h-4" />}>
          ดูตัวอย่างของขวัญ
        </Button>
      </div>
    </div>
  );
});

// Thai Version: Simple Demo
const ThaiDemo = memo(function ThaiDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 -z-10 blur-[100px] opacity-30"
        style={{
          background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
        }}
      />

      {showDemo ? (
        <ByteCardInteraction
          cardTitle="🎂 วันเกิดคุณแม่"
          hologramContent={{
            type: "video",
            content: "",
            title: "คลิปจากลูกๆ 💕",
          }}
          onInteraction={() => console.log("Card tapped!")}
        />
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Interactive Byte */}
          <div className="relative">
            <InteractiveByte size="lg" followMouse followScroll />
            
            {/* Instruction */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <p className="text-caption animate-pulse">
                เลื่อนเมาส์ดูสิ! 👆
              </p>
            </div>
          </div>

          {/* Demo Button */}
          <Button
            variant="secondary"
            onClick={() => setShowDemo(true)}
            icon={<Play className="w-4 h-4" />}
          >
            ลองสแกนจำลอง
          </Button>
        </div>
      )}
    </div>
  );
});

// International Version: 3D Card Preview
const InternationalDemo = memo(function InternationalDemo() {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 -z-10 blur-[100px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, var(--violet) 0%, var(--primary) 50%, transparent 70%)",
        }}
      />

      {/* 3D Card */}
      <Card3DPreview
        width={320}
        height={200}
        frontContent={
          <NFCCardFront title="Birthday Gift" logoEmoji="🎂" />
        }
        backContent={
          <NFCCardBack message="Scan QR if NFC unavailable" />
        }
      />

      {/* Floating Byte */}
      <div className="absolute -right-12 top-0 animate-float-parallax">
        <InteractiveByte size="sm" followMouse={false} />
      </div>
    </div>
  );
});

// Main Component
export function FirstSightHero({ variant = "thai" }: FirstSightHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <HeroText />
            <div className="h-[400px] bg-[var(--surface-muted)] rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 -z-20 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="animate-slide-up">
            <HeroText />
          </div>

          {/* Right: Interactive Demo */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            {variant === "thai" ? <ThaiDemo /> : <InternationalDemo />}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
    </section>
  );
}

// Category Selection Section (below hero)
export function CategorySelectionSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section className="py-20 bg-[var(--surface-muted)]/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2 mb-4">เลือกโอกาสพิเศษของคุณ</h2>
          <p className="text-body text-[var(--muted)]">
            Byte จะปรับอารมณ์ตามประเภทของขวัญที่คุณเลือก
          </p>
        </div>

        <ByteCategorySelector
          onSelect={(category) => setSelectedCategory(category)}
        />
      </div>
    </section>
  );
}
