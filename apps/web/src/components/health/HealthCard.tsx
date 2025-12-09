import { cx } from "../../lib/cx";
import { ServiceHealth } from "../../services/healthService";

type Props = {
  health: ServiceHealth;
};

const statusStyle = (status: ServiceHealth["status"]) => {
  if (status === "healthy") {
    return {
      chip: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    };
  }
  return {
    chip: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  };
};

export function HealthCard({ health }: Props) {
  const styles = statusStyle(health.status);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">Service</p>
          <h2 className="text-lg font-semibold text-zinc-900">
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

      <p className="mt-3 text-sm text-zinc-700">{health.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-zinc-600">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Ping</p>
          <p className="font-medium text-zinc-900">
            {health.latencyMs ? `${health.latencyMs} ms` : "n/a"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Checked at
          </p>
          <p className="font-medium text-zinc-900">
            {new Date(health.checkedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="col-span-2 space-y-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Endpoint
          </p>
          <p className="font-mono text-xs text-zinc-700">{health.endpoint}</p>
        </div>
      </div>
    </div>
  );
}
