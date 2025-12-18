import { DecorativeImage } from "@/components/decorative";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12 font-sans text-foreground">
      <DecorativeImage variant="theme-main" opacity={0.05} zIndex={0} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 shadow-sm">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
              Playground
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Welcome to the platform
            </h1>
            <p className="max-w-2xl text-lg text-(--color-muted)">
              ศูนย์กลางทดสอบและพัฒนาเว็บแอปของทีม DevOps
              เริ่มต้นได้ทันทีจากหน้าแรกนี้ และสำรวจฟีเจอร์อื่นๆ
              ได้จากเมนูด้านบน
            </p>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
              <div className="rounded-xl sm:rounded-2xl border border-(--color-border) bg-(--color-surface-alt) px-4 py-4 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-primary)">
                  เริ่มต้น
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  สำรวจหน้าเว็บ
                </h3>
                <p className="mt-1 text-sm text-(--color-muted)">
                  หน้าแรกถูกทำให้สะอาดเพื่อโฟกัสการต้อนรับและข้อมูลเบื้องต้น
                </p>
              </div>
              <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-alt) px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-secondary)">
                  การนำทาง
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  เมนูส่วนหัว
                </h3>
                <p className="mt-1 text-sm text-(--color-muted)">
                  ใช้แถบเมนูด้านบนเพื่อไปยังเครื่องมือหรือหน้าต่างๆ ในระบบ
                </p>
              </div>
              <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-alt) px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-primary)">
                  คำแนะนำ
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  ปรับแต่งตามทีม
                </h3>
                <p className="mt-1 text-sm text-(--color-muted)">
                  เพิ่มลิงก์หรือข้อมูลของทีมได้ใน Header และหน้าแรกตามต้องการ
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
