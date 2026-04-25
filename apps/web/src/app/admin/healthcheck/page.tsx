"use client";

import { HealthDashboard } from "@/components/health/HealthDashboard";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";

function HealthcheckPage() {
  const { showModal, errorMessage, handleModalClose } = useUnauthorizedHandler();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
            Admin / Observability
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Service Health Dashboard
          </h1>
          <p className="text-sm text-(--color-muted)">
            ตรวจสอบสถานะ, latency และ endpoint ของบริการ Node และ Go พร้อมปุ่มรีเฟรชแบบเรียลไทม์
          </p>
        </div>

        <HealthDashboard />
    </div>
  );
}

export default withAuthentication(HealthcheckPage);
