import { ServiceCard } from "./_components/ServiceCard";
import { recommended, services } from "./_data/services";
import { DecorativeImage } from "@/components/decorative";

export default function DevToolkitPage() {
  const sections = [
    { id: "recommended", label: "Recommended" },
    { id: "all-services", label: "All Services" },
  ];

  return (
    <main className="relative min-h-screen bg-background px-6 py-10 text-foreground">
      <DecorativeImage variant="bottom-left" opacity={0.63} zIndex={0} />
      <DecorativeImage variant="top-right" opacity={0.6} zIndex={0} />
      <DecorativeImage variant="top-center" opacity={0.6} zIndex={0} />

      <div className="relative z-10 mx-auto flex w-full max-w-8xl gap-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-28 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
            <DecorativeImage
              variant="decoration"
              opacity={0.6}
              zIndex={0}
              width={100}
              className="absolute -top-1 -right-5"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
              Toolkit
            </p>
            <nav className="mt-3 space-y-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-2 text-(--color-muted) transition-colors hover:bg-(--color-surface-alt) hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex w-full flex-col gap-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--color-muted)">
              Dev Tools
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Dev Toolkit</h1>
              <p className="max-w-3xl text-base text-(--color-muted)">
                รวม service และ demo ที่ทีมใช้ลองฟีเจอร์ เช่น
                export/import/theme พร้อมลิงก์ไปหน้าทดสอบย่อย
              </p>
            </div>
          </header>

          <section id="recommended" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recommended</h2>
              <p className="text-sm text-(--color-muted)">
                ลองอันนี้ก่อนเพื่อเห็น flow หลัก
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommended.map((item) => (
                <ServiceCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section id="all-services" className="space-y-4">
            <h2 className="text-xl font-semibold">All Services</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {services.map((item) => (
                <ServiceCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
