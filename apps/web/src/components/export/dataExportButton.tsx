"use client";

import { useDataExport } from "../../hooks/useDataExport";
import { VocExportData, ExportType, ExportTypeDataMap, ExportOptions } from "../../services/exportService";
import { cx } from "../../lib/cx";

type LegacyProps = {
  data: VocExportData[];
  filename?: string;
  type?: never;
  options?: never;
};

type TypedProps<T extends ExportType = ExportType> = {
  type: T;
  data: ExportTypeDataMap[T][];
  filename?: string;
  options?: ExportOptions;
};

type Props = LegacyProps | TypedProps;

export const DataExportButton = (props: Props) => {
  const { status, message, exportData, exportDataWithType } = useDataExport();

  const handleExport = () => {
    if (props.type) {
      const options: ExportOptions = {
        ...props.options,
        filename: props.filename || props.options?.filename,
      };
      exportDataWithType(props.type, props.data, options);
    } else {
      exportData(props.data as VocExportData[], props.filename);
    }
  };

  const disabled = status === "loading" || !props.data || props.data.length === 0;
  const isLoading = status === "loading";

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Data Export
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            ดาวน์โหลดไฟล์ CSV
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleExport}
          disabled={disabled}
          aria-label="Export data as CSV"
          aria-busy={isLoading}
          aria-disabled={disabled}
          className={cx(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition",
            isLoading
              ? "border-amber-300 bg-amber-50"
              : "border-zinc-200 bg-zinc-50 hover:-translate-y-0.5 hover:shadow-md",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="text-base font-semibold">Export CSV</span>
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
            {isLoading ? "Working..." : "Download"}
          </span>
        </button>
      </div>

      <div
        className="mt-4 rounded-2xl border px-4 py-3 text-sm"
        role="status"
        aria-live="polite"
      >
        {status === "loading"
          ? "กำลังเตรียมไฟล์..."
          : status === "success"
          ? "ไฟล์พร้อมดาวน์โหลด"
          : status === "error"
          ? message
          : !props.data || props.data.length === 0
          ? "ยังไม่มีข้อมูลสำหรับ export"
          : "กดปุ่มเพื่อดาวน์โหลด"}
      </div>
    </section>
  );
};
