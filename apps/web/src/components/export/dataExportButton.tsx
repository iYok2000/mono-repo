"use client";

import { useDataExport } from "../../hooks/useDataExport";
import { ExportFormat, VocRow } from "../../services/exportService";
import { cx } from "../../lib/cx";

type Props = {
  data: VocRow[];
};

export const DataExportButton = ({ data }: Props) => {
  const { status, format, message, exportData } = useDataExport();

  const run = (fmt: ExportFormat) => exportData(fmt, data);
  const disabled = status === "loading" || !data || data.length === 0;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Data Export
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            ดาวน์โหลดไฟล์ CSV / Excel
          </h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["csv", "xlsx"] as ExportFormat[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => run(fmt)}
            disabled={disabled}
            className={cx(
              "flex items-center justify-between rounded-2xl border px-4 py-3 transition",
              status === "loading" && format === fmt
                ? "border-amber-300 bg-amber-50"
                : "border-zinc-200 bg-zinc-50 hover:-translate-y-0.5",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <span className="text-base font-semibold">
              Export {fmt.toUpperCase()}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              {status === "loading" && format === fmt
                ? "Working..."
                : "Download"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border px-4 py-3 text-sm">
        {status === "loading"
          ? "กำลังเตรียมไฟล์..."
          : status === "success"
          ? "ไฟล์พร้อมดาวน์โหลด"
          : status === "error"
          ? message
          : !data || data.length === 0
          ? "ยังไม่มีข้อมูลสำหรับ export"
          : "กดปุ่มเพื่อดาวน์โหลด"}
      </div>
    </section>
  );
};
