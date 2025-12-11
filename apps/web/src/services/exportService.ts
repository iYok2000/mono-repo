import type { VocExportData } from './export/types';

const deriveColumns = (rows: VocExportData[]): string[] => {
  const columnSet = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => columnSet.add(key));
  });
  return Array.from(columnSet);
};

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const stringValue =
    typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "boolean"
      ? String(value)
      : JSON.stringify(value);

  const needsQuotes = /[",\n]/.test(stringValue);
  const escaped = stringValue.replace(/"/g, '""');

  return needsQuotes ? `"${escaped}"` : escaped;
};

const jsonToCsv = (rows: VocExportData[], columns: string[]): string => {
  const header = columns.join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsvValue(row[col as keyof VocExportData])).join(",")
  );
  return [header, ...lines].join("\n");
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const generateFilename = (customName?: string): string => {
  const date = new Date().toISOString().slice(0, 10);
  return customName || `export-${date}.csv`;
};

export const exportToCsv = (
  rows: VocExportData[],
  filename?: string
): void => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No data to export");
  }

  const columns = deriveColumns(rows);
  const csvContent = jsonToCsv(rows, columns);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  downloadBlob(blob, generateFilename(filename));
};

export { ExportType } from './export/types';

export type {
  VocExportData,
  ExportConfig,
  ExportOptions,
  ColumnConfig,
  ExportTypeDataMap,
} from './export/types';

export { exportWithType, exportConfigRegistry } from './export';
export { vocDetailsConfig } from './export/configs';
