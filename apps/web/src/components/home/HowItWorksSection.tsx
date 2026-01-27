"use client";

export function HowItWorksSection() {
  const steps = {
    express: [
      {
        step: "1",
        title: "เลือกธีม + ใส่ข้อความ",
        description: "ธีมนามบัตร หรือการ์ดวันเกิด + ข้อความอวยพร",
        icon: "🎨",
      },
      {
        step: "2",
        title: "แปะลิงก์วิดีโอ/อัลบั้ม + ทดสอบลิงก์",
        description: "จาก Google Drive ของคุณ ระบบจะทดสอบให้",
        icon: "🔗",
      },
      {
        step: "3",
        title: "ได้ลิงก์/QR/NFC พร้อมให้ของขวัญ",
        description: "สำเร็จ! แชร์หรือพิมพ์ NFC การ์ดได้เลย",
        icon: "✨",
      },
    ],
    squad: [
      {
        step: "1",
        title: "สั่งชุดการ์ด 7–10 ใบ",
        description: "ลิงก์เฉพาะคน แจกให้เพื่อนแต่ละคน",
        icon: "👥",
      },
      {
        step: "2",
        title: "เพื่อนแต่ละคนแปะลิงก์คลิป + ข้อความ",
        description: "แต่ละคนอัปโหลดคลิปของตัวเอง + สถานะส่งแล้ว",
        icon: "📤",
      },
      {
        step: "3",
        title: "ครบแล้วเรารวม + ตัดต่อ → ส่ง Final ให้",
        description: "รวมทุกคลิปเป็นวิดีโอเดียว ส่ง Final ให้",
        icon: "🎬",
      },
    ],
  };

  return (
    <section className="relative py-16 lg:py-24 bg-[var(--surface-muted)]" id="how-it-works">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            ทำงานยังไง (ง่ายมาก)
          </h2>
        </div>

        {/* Express + Squad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Express */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-semibold text-sm">
              ⚡ Express
            </div>
            <div className="space-y-6">
              {steps.express.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[var(--muted)]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Squad */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-semibold text-sm">
              👥 Squad
            </div>
            <div className="space-y-6">
              {steps.squad.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[var(--muted)]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
