"use client";

interface WhyUsSettings {
  title?: string;
  subtitle?: string;
  feature_1_title?: string;
  feature_1_description?: string;
  feature_2_title?: string;
  feature_2_description?: string;
  feature_3_title?: string;
  feature_3_description?: string;
}

interface WhyUsSectionProps {
  settings?: WhyUsSettings;
}

export function WhyUsSection({ settings }: WhyUsSectionProps) {
  const title = settings?.title || "ทำไมต้องเรา?";
  const subtitle = settings?.subtitle || "6 เหตุผลที่คุณควรเลือก GyByte";

  const reasons = [
    {
      icon: "⚡",
      title: settings?.feature_1_title || "ทำเสร็จเร็ว",
      description: settings?.feature_1_description || "ไม่ต้องรอนาน Express ใช้แค่ 5 นาที Squad รอแค่เพื่อนส่งครบ",
    },
    {
      icon: "🔒",
      title: settings?.feature_2_title || "ปลอดภัย",
      description: settings?.feature_2_description || "ไฟล์อยู่กับคุณใน Google Drive คุณคุมสิทธิ์เอง",
    },
    {
      icon: "📱",
      title: settings?.feature_3_title || "ใช้งานง่าย",
      description: settings?.feature_3_description || "ไม่ต้องโหลดแอป สแกนแล้วเปิดได้ทันที บนมือถือทุกรุ่น",
    },
    {
      icon: "🎨",
      title: "ปรับแต่งได้",
      description: "เลือกธีม ตั้งเวลาเปิด ใส่รหัส ทำได้ตามต้องการ",
    },
    {
      icon: "💯",
      title: "มี QR สำรอง",
      description: "NFC ใช้ไม่ได้ก็สแกน QR ได้ รับประกันเปิดได้แน่นอน",
    },
    {
      icon: "🤝",
      title: "เหมาะกับทุกโอกาส",
      description: "วันเกิด นามบัตร ของขวัญพิเศษ ใช้ได้หมด",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24" id="why-us">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            {title}
          </h2>
          <p className="text-lg text-[var(--muted)]">
            {subtitle}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 hover:shadow-[var(--shadow-md)]"
            >
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {reason.title}
              </h3>
              <p className="text-[var(--muted)] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
