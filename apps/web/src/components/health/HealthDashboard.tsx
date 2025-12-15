"use client";

import { useHealthChecks } from "../../hooks/useHealthChecks";
import { HealthCard } from "./HealthCard";
import { cx } from "../../lib/cx";

export const HealthDashboard = () => {
  const { data, loading, error, refresh } = useHealthChecks();

  return (
    <section className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm text-foreground">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
            Service Health
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Status dashboard
          </h2>
          <p className="text-sm text-(--color-muted)">
            Node / Go services with live status, latency, and endpoints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Refresh
          </button>
          <span
            className={cx(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              loading
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-700"
            )}
          >
            {loading ? "Loading" : "Live"}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((health) => (
          <HealthCard key={health.key} health={health} />
        ))}
      </div>
    </section>
  );
};
