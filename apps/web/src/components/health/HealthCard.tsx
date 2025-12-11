import { cx } from "../../lib/cx";
import { ServiceHealth } from "../../services/healthService";

type Props = {
  health: ServiceHealth;
};

const statusStyle = (status: ServiceHealth["status"]) => {
  if (status === "healthy") {
    return {
      chip:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",
      dot: "bg-emerald-500",
    };
  }
  return {
    chip:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800",
    dot: "bg-red-500",
  };
};

export function HealthCard({ health }: Props) {
  const styles = statusStyle(health.status);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm text-[var(--foreground)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Service
          </p>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {health.name}
          </h2>
        </div>
        <span
          className={cx(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
            styles.chip
          )}
        >
          <span className={cx("h-2 w-2 rounded-full", styles.dot)} />
          {health.status === "healthy" ? "Healthy" : "Unhealthy"}
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted)]">
        {health.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-[var(--color-muted)]">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Ping
          </p>
          <p className="font-medium text-[var(--foreground)]">
            {health.latencyMs ? `${health.latencyMs} ms` : "n/a"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Checked at
          </p>
          <p className="font-medium text-[var(--foreground)]">
            {new Date(health.checkedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="col-span-2 space-y-1">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Endpoint
          </p>
          <p className="font-mono text-xs text-[var(--color-muted)]">
            {health.endpoint}
          </p>
        </div>
      </div>
    </div>
  );
}
