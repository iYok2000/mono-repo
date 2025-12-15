"use client";

import { HealthDashboard } from "@/components/health/HealthDashboard";

export default function HealthcheckPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
            Admin / Observability
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Service Health Dashboard
          </h1>
          <p className="text-sm text-(--color-muted)">
            ตรวจสอบสถานะ, latency และ endpoint ของบริการ Node และ Go พร้อมปุ่มรีเฟรชแบบเรียลไทม์
          </p>
        </header>

        <HealthDashboard />
      </div>
    </main>
  );
}
