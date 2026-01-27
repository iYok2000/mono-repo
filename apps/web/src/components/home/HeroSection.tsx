"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Play } from "lucide-react";
import Link from "next/link";
import { BsPeople } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Pre-title Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-soft)] rounded-full">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse-led"></span>
              <span className="text-[var(--primary)] text-sm font-medium">
                ของขวัญความทรงจำ • Digital Gift to Thailand
              </span>
            </div>

            {/* Main Heading with Green Highlight */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-[var(--primary)]">
                  ของขวัญความทรงจำแบบ NFC
                </span>
                <br />
                <span className="text-[var(--foreground)]">
                  ที่เปิดด้วยคลิปหรือข้อความแทนใจ
                </span>
              </h1>

              <p className="text-base lg:text-lg text-[var(--muted)] leading-relaxed max-w-xl font-normal">
                ของขวัญวิดีโอที่แตะการ์ดแล้วเปิดได้ทันที — เหมาะสำหรับวันเกิด
                ครบรอบ และทุกโอกาสพิเศษ
              </p>
            </div>

            {/* Micro-proof Badges */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <p className="text-base text-[var(--muted)] font-normal leading-relaxed">
                  มี QR สำรอง สแกนได้ทุกเครื่อง
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <p className="text-base text-[var(--muted)] font-normal leading-relaxed">
                  ไฟล์อยู่ใน Google Drive ของคุณ—คุมสิทธิ์เอง
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <p className="text-base text-[var(--muted)] font-normal leading-relaxed">
                  ตั้งเวลาเปิด + ใส่รหัส ได้
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Button icon={<Play className="w-4 h-4" />} variant="large">
                สั่งของขวัญด่วน
              </Button>

              <Button variant="secondary">Squad 7-10 คน</Button>

              <Button icon={<Play className="w-4 h-4" />} variant="link">
                ดูตัวอย่างของขวัญ
              </Button>
            </div>

            {/* Anchor Links */}
            <div className="flex items-center gap-2 pt-4 text-sm">
              <span className="text-[var(--primary)]">•</span>
              <a
                href="#how-it-works"
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
              >
                วิธีทำงาน
              </a>
              <span className="text-[var(--primary)]">•</span>
              <a
                href="#faq"
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Right: Mascot "Byte" */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in delay-300">
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[var(--primary-soft)] rounded-full blur-3xl animate-pulse-led"></div>

              {/* Mascot Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Simple Byte Mascot - Dark rounded character with LED eye */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Body */}
                    <div className="w-64 h-64 bg-[var(--byte-body)] rounded-[3rem] shadow-2xl flex items-center justify-center">
                      {/* LED Eye/Screen */}
                      <div className="w-32 h-32 bg-[var(--byte-led)] rounded-2xl animate-pulse-led shadow-lg shadow-[var(--primary)]/50 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-xl"></div>
                      </div>
                    </div>

                    {/* Antenna/NFC Symbol */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-[var(--primary)] rounded-full animate-pulse-led"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating NFC Icon */}
                <div className="absolute top-10 right-0 animate-bounce">
                  <div className="bg-[var(--card)] shadow-lg rounded-xl px-3 py-2 border border-[var(--border)]">
                    <span className="text-2xl">📱</span>
                  </div>
                </div>

                {/* Floating QR Code Icon */}
                <div
                  className="absolute bottom-20 left-0 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="bg-[var(--card)] shadow-lg rounded-xl px-3 py-2 border border-[var(--border)]">
                    <span className="text-2xl">🔲</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none"></div>
    </section>
  );
}
