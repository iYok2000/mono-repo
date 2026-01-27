"use client";

export function FAQSection() {
  const faqs = [
    {
      question: "NFC สแกนไม่ได้ทำไง?",
      answer: "มี QR code สำรองทุกการ์ด สแกนได้แน่นอน",
    },
    {
      question: "Google Drive ปลอดภัยไหม?",
      answer: "ไฟล์อยู่กับคุณ คุณคุมสิทธิ์เอง เราแค่ดึงลิงก์มาแสดง",
    },
    {
      question: "ลิงก์เปิดไม่ได้?",
      answer: "มีระบบทดสอบลิงก์ก่อนใช้งาน และมีปุ่มสำรองเปิดในเบราว์เซอร์",
    },
    {
      question: "ต้องโหลดแอปไหม?",
      answer: "ไม่ต้อง เปิดผ่านเว็บได้ทันที",
    },
    {
      question: "ใช้เวลานานแค่ไหน?",
      answer: "Express: 5 นาที | Squad: ขึ้นอยู่กับเพื่อนส่งครบเมื่อไหร่",
    },
    {
      question: "ราคาเท่าไหร่?",
      answer: "Express ฿199 | Squad ฿499 มี add-ons เพิ่มได้",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24" id="faq">
      <div className="mx-auto w-full max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            คำถามที่พบบ่อย
          </h2>
          <p className="text-lg text-[var(--muted)]">
            ทุกอย่างที่คุณอยากรู้
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
