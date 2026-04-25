"use client";

export function PreviewSection() {
  const examples = [
    {
      type: "Express",
      title: "การ์ดวันเกิด",
      image: "🎂",
      description: "ทำเสร็จใน 5 นาที พร้อมใช้ทันที",
      features: ["วิดีโออวยพร", "อัลบั้มรูป", "ข้อความพิเศษ"],
    },
    {
      type: "Squad",
      title: "การ์ดนามบัตร",
      image: "💼",
      description: "รวมคลิปจาก 10 คน เป็นวิดีโอเดียว",
      features: ["รวมวิดีโอ", "โปรไฟล์", "ติดต่อได้"],
    },
  ];

  return (
    <section className="relative py-16 lg:py-24" id="preview">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            ตัวอย่างการ์ด
          </h2>
          <p className="text-lg text-[var(--muted)]">
            ดูว่าจะออกมาหน้าตาแบบไหน
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl glass-panel shadow-(--shadow-sm) transition-all duration-300 hover:border-(--primary) hover:shadow-(--shadow-md)"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface-muted)] flex items-center justify-center">
                <span className="text-9xl">{example.image}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-semibold mb-2">
                    {example.type}
                  </span>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">
                    {example.title}
                  </h3>
                  <p className="text-[var(--muted)] mt-2">{example.description}</p>
                </div>
                <ul className="space-y-2">
                  {example.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <svg
                        className="w-4 h-4 text-[var(--primary)]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-3 rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                  ดูตัวอย่างเต็ม
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
