"use client";

import { memo } from "react";
import Link from "next/link";

interface FinalCTASettings {
  title?: string;
  subtitle?: string;
  button_text?: string;
}

interface FinalCTASectionProps {
  settings?: FinalCTASettings;
}

export const FinalCTASection = memo(function FinalCTASection({ settings }: FinalCTASectionProps) {
  const title = settings?.title || 'พร้อมทำของขวัญที่\n"แตะแล้วเป็นความทรงจำ"\nไหม?';
  const subtitle = settings?.subtitle || "เริ่มสร้างการ์ดความทรงจำของคุณได้เลย ไม่ว่าจะเป็นของขวัญวันเกิด ครบรอบ หรือโมเมนต์พิเศษ";
  const buttonText = settings?.button_text || "เริ่มทำ Express";

  return (
    <section className="relative py-16 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] p-12 lg:p-16 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold text-white leading-tight" style={{ whiteSpace: 'pre-line' }}>
                {title}
              </h2>
              <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/create/express"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white text-[var(--primary)] hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--primary)] min-w-[200px]"
              >
                <span className="mr-2">⚡</span>
                {buttonText}
              </Link>
              <Link
                href="/create/squad"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--primary)] min-w-[200px]"
              >
                <span className="mr-2">👥</span>
                ทำ Squad 7–10 คน
              </Link>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ทำเสร็จภายใน 5 นาที</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ไม่ต้องโหลดแอป</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>มี QR สำรอง</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
