export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 font-sans text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 shadow-sm sm:px-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              PEA DevOps Playground
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
              Welcome to the platform
            </h1>
            <p className="max-w-2xl text-lg text-[var(--color-muted)]">
              ศูนย์กลางทดสอบและพัฒนาเว็บแอปของทีม DevOps เริ่มต้นได้ทันทีจากหน้าแรกนี้
              และสำรวจฟีเจอร์อื่นๆ ได้จากเมนูด้านบน
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  เริ่มต้น
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  สำรวจหน้าเว็บ
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  หน้าแรกถูกทำให้สะอาดเพื่อโฟกัสการต้อนรับและข้อมูลเบื้องต้น
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  การนำทาง
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  เมนูส่วนหัว
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  ใช้แถบเมนูด้านบนเพื่อไปยังเครื่องมือหรือหน้าต่างๆ ในระบบ
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  คำแนะนำ
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  ปรับแต่งตามทีม
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
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
