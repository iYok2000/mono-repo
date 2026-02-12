"use client";

interface FAQSettings {
  title?: string;
  subtitle?: string;
  faq_1_question?: string;
  faq_1_answer?: string;
  faq_2_question?: string;
  faq_2_answer?: string;
  faq_3_question?: string;
  faq_3_answer?: string;
  faq_4_question?: string;
  faq_4_answer?: string;
}

interface FAQSectionProps {
  settings?: FAQSettings;
}

export function FAQSection({ settings }: FAQSectionProps) {
  // Build FAQ array from settings
  const faqs = [
    {
      question: settings?.faq_1_question || "NFC สแกนไม่ได้ทำไง?",
      answer: settings?.faq_1_answer || "มี QR code สำรองทุกการ์ด สแกนได้แน่นอน",
    },
    {
      question: settings?.faq_2_question || "Google Drive ปลอดภัยไหม?",
      answer: settings?.faq_2_answer || "ไฟล์อยู่กับคุณ คุณคุมสิทธิ์เอง เราแค่ดึงลิงก์มาแสดง",
    },
    {
      question: settings?.faq_3_question || "ลิงก์เปิดไม่ได้?",
      answer: settings?.faq_3_answer || "มีระบบทดสอบลิงก์ก่อนใช้งาน และมีปุ่มสำรองเปิดในเบราว์เซอร์",
    },
    {
      question: settings?.faq_4_question || "ต้องโหลดแอปไหม?",
      answer: settings?.faq_4_answer || "ไม่ต้อง เปิดผ่านเว็บได้ทันที",
    },
  ].filter(faq => faq.question && faq.answer); // Only show FAQs with content

  const title = settings?.title || "คำถามที่พบบ่อย";
  const subtitle = settings?.subtitle || "ทุกอย่างที่คุณอยากรู้";

  return (
    <section className="relative py-16 lg:py-24" id="faq">
      <div className="mx-auto w-full max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            {title}
          </h2>
          <p className="text-lg text-[var(--muted)]">
            {subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-[var(--foreground)] group-open:text-[var(--primary)]">
                  {faq.question}
                </h3>
                <svg
                  className="w-5 h-5 text-[var(--muted)] transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-[var(--muted)] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
