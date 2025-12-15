import { ServiceCard } from "./_components/ServiceCard";
import { recommended, services } from "./_data/services";

export default function DevToolkitPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
            Dev Tools
          </p>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dev Toolkit</h1>
            <p className="max-w-3xl text-base text-[var(--color-muted)]">
              รวม service และ demo ที่ทีมใช้ลองฟีเจอร์ เช่น export/import/theme
              พร้อมลิงก์ไปหน้าทดสอบย่อย
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended</h2>
            <p className="text-sm text-[var(--color-muted)]">
              ลองอันนี้ก่อนเพื่อเห็น flow หลัก
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">All Services</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
