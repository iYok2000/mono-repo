"use client";

import { Button } from "@/components/ui/Button";
import { Check, Zap, Users, Heart, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";

export function SKUSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-[var(--card)]" id="pricing">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-soft)] rounded-full mb-4">
            <span className="text-[var(--primary)] text-sm font-medium">ของขวัญวันเกิด • ครบรอบ • อำลา • นามบัตร</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--foreground)] mb-4">
            เลือกแพ็กของขวัญที่เหมาะกับคุณ
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            คนส่วนใหญ่เลือก <strong className="text-[var(--primary)] font-semibold">Express</strong> — ของขวัญเร็ว ใช้ได้เลย ทั้ง 3 แบบมี NFC + QR สำรอง
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Express Card */}
          <div className="relative group bg-[var(--card)] rounded-2xl border-2 border-[var(--border)] p-8 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-2xl hover:-translate-y-2 animate-slide-in">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/5 transition-all duration-300 -z-10 blur-xl"></div>
            
            {/* Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full shadow-md">
                <Zap className="w-3 h-3" />
                เร็วสุด
              </span>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
                  GyByte Express
                </h3>
                <p className="text-lg text-[var(--primary)] font-medium mb-3">
                  ⭐ ตัวเลือกยอดนิยม — ของขวัญเร็ว ใช้ได้เลย
                </p>
                <p className="text-base text-[var(--muted)] leading-relaxed">
                  สำหรับวันเกิด ครบรอบ เซอร์ไพรส์ — ทำเสร็จไวในวันเดียว เหมาะสำหรับของขวัญแทนใจ 1 คน
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">ตั้งเวลาเปิด + ใส่รหัสผ่านได้</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">ใช้ลิงก์จาก Google Drive ของคุณ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">ครอบ NFC + QR สำรองทุกชิ้น</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5 fill-[var(--primary)]" />
                  <span className="text-[var(--muted)] text-base">เหมาะสำหรับเซอร์ไพรส์ 1 คน</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-4">
                <Link href="/create/express">
                  <Button variant="primary" fullWidth>
                    สั่งของขวัญด่วน Express
                  </Button>
                </Link>
                <p className="text-center text-sm text-[var(--subtle)] mt-3">
                  พร้อมใช้ใน 10 นาที • เหมาะสำหรับของขวัญฉุกเฉิน
                </p>
              </div>
            </div>
          </div>

          {/* Squad Card - Position 2 */}
          <div className="relative group bg-[var(--card)] rounded-2xl border-2 border-transparent p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-in delay-200" style={{ 
            background: 'var(--squad-gradient)',
            backgroundClip: 'padding-box',
            // borderImage: 'var(--squad-gradient) 1'
          }}>
            {/* Inner white background with gradient border effect */}
            <div className="absolute inset-[2px] bg-[var(--card)] rounded-2xl -z-10"></div>
            
            {/* Gradient overlay for subtle tint */}
            <div className="absolute inset-[2px] rounded-2xl -z-10 opacity-60" style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))'
            }}></div>
            
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-20" style={{
              background: 'var(--squad-gradient)',
              filter: 'blur(20px)'
            }}></div>
            
            {/* Popular Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-white text-xs font-semibold rounded-full shadow-md" style={{
                background: 'var(--squad-gradient)'
              }}>
                <Users className="w-3 h-3" />
                ทำหมู่
              </span>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Header */}
              <div>
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
                  GyByte Squad
                </h3>
                <p className="text-lg font-medium mb-3" style={{
                  background: 'var(--squad-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Group Video Gift — อัดคลิปอวยพรจากเพื่อนหลายคน
                </p>
                <p className="text-base text-[var(--muted)] leading-relaxed mb-3">
                  เหมาะสำหรับ <strong>วันอำลาเพื่อน</strong>, <strong>วันแต่งงาน</strong>, หรือ<strong>ครบรอบพิเศษของหมู่คณะ</strong> — เมื่อมีเพื่อน 7–10 คนที่อยากส่งคลิปอวยพรรวมกัน
                </p>
                <p className="text-base text-[var(--muted)] leading-relaxed">
                  เราจะรวบรวมคลิปจากทุกคน แล้ว<strong>ตัดต่อให้เป็นวิดีโอเดียว</strong>ที่ดูแล้วประทับใจ พร้อมส่งมอบในรูปแบบ NFC card ที่พร้อมเปิดดู
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">มีหน้าสถานะติดตามว่าใครส่งคลิปแล้ว</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">เราตัดต่อให้ + เพิ่มเพลงประกอบ + ส่ง Final</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--violet)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">Use-case: อำลา / แต่งงาน / ครบรอบหมู่คณะ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[var(--violet)] flex-shrink-0 mt-0.5 fill-[var(--violet)]" />
                  <span className="text-[var(--muted)] text-base">รองรับ 7–10 คน (ขยายได้ตามจำนวนเพื่อน)</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-4">
                <Link href="/create/squad">
                  <button className="w-full py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium text-white transition-all duration-150 shadow-lg hover:shadow-xl hover:scale-[1.02]" style={{
                    background: 'var(--squad-gradient)'
                  }}>
                    เริ่มสร้าง Squad Pack
                  </button>
                </Link>
                <p className="text-center text-sm text-[var(--subtle)] mt-3">
                  ใช้เวลา 3–5 วัน • เหมาะสำหรับของขวัญแบบมีส่วนร่วม
                </p>
              </div>
            </div>
          </div>

          {/* Greeting Card - Position 3 (Beginner-Friendly) */}
          <div className="relative group bg-[var(--card)] rounded-2xl border-2 border-[var(--border)] p-8 transition-all duration-300 hover:border-[var(--amber)] hover:shadow-2xl hover:-translate-y-2 animate-slide-in delay-300">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-[var(--amber)]/0 group-hover:bg-[var(--amber)]/5 transition-all duration-300 -z-10 blur-xl"></div>
            
            {/* Badge */}
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--amber)] text-white text-xs font-semibold rounded-full shadow-md">
                <Sparkles className="w-3 h-3" />
                เริ่มต้นเบาๆ
              </span>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="text-5xl mb-4">💌</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
                  Greeting Card
                </h3>
                <p className="text-lg text-[var(--amber)] font-medium mb-3">
                  ใช้แทนการ์ดกระดาษ — ราคาประหยัด ทำง่าย
                </p>
                <p className="text-base text-[var(--muted)] leading-relaxed">
                  เหมาะสำหรับ<strong>ของขวัญทั่วไป</strong> เช่น วันเกิดเพื่อนร่วมงาน ส่งกำลังใจ หรือใช้เป็น<strong>นามบัตรส่วนตัว</strong>ที่มีข้อความอวยพร
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">เทมเพลตนามบัตรให้เลือก (ทำเสร็จไว)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">ใส่ชื่อ IG Line@ เบอร์ รูปภาพ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)] text-base">เพิ่มวิดีโออวยพรสั้นๆ หรือข้อความ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[var(--amber)] flex-shrink-0 mt-0.5 fill-[var(--amber)]" />
                  <span className="text-[var(--muted)] text-base">ใช้แทนการ์ดกระดาษ — ราคาถูกสุด</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-4">
                <Link href="/create/greeting">
                  <Button variant="primary" fullWidth className="!bg-[var(--amber)] hover:!bg-[#D97706] active:!bg-[#B45309]">
                    เลือกเทมเพลต Greeting
                  </Button>
                </Link>
                <p className="text-center text-sm text-[var(--subtle)] mt-3">
                  เริ่มต้นง่าย • เหมาะสำหรับของขวัญทั่วไป
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto animate-fade-in delay-400">
          <h3 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8">
            เลือกอันไหนให้เหมาะกับตัวเอง?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Express Quick Guide - Position 1 */}
            <div className="bg-[var(--primary-soft)] rounded-xl p-6 border border-[var(--primary)]/20 transition-all duration-300 hover:border-[var(--primary)]/40 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md">
                  <span className="text-xl">⚡</span>
                </div>
                <h4 className="text-xl font-bold text-[var(--foreground)]">Express</h4>
              </div>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                <strong>คนส่วนใหญ่เลือกตัวนี้</strong> — ของขวัญเร็ว ใช้ได้เลย ไม่มีเวลาทำคนเดียวได้
              </p>
            </div>

            {/* Squad Quick Guide - Position 2 */}
            <div className="rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
              borderColor: 'rgba(139, 92, 246, 0.2)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{
                  background: 'var(--squad-gradient)'
                }}>
                  <span className="text-xl">👥</span>
                </div>
                <h4 className="text-xl font-bold text-[var(--foreground)]">Squad</h4>
              </div>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                เพื่อนหลายคนส่งคลิปรวมกัน — เราตัดต่อให้ เหมาะกับอำลา/แต่งงาน
              </p>
            </div>

            {/* Greeting Quick Guide - Position 3 */}
            <div className="bg-[var(--amber)]/10 rounded-xl p-6 border border-[var(--amber)]/20 transition-all duration-300 hover:border-[var(--amber)]/40 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center shadow-md">
                  <span className="text-xl">💌</span>
                </div>
                <h4 className="text-xl font-bold text-[var(--foreground)]">Greeting</h4>
              </div>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                เริ่มต้นเบาๆ ของขวัญทั่วไป ใช้แทนการ์ดกระดาษ ราคาถูก
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
