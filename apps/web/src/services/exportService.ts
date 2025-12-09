import { utils, write } from "xlsx";

export type ExportFormat = "csv" | "xlsx";
export type VocRow = Record<string, unknown>;

const deriveColumns = (rows: VocRow[]) => {
  const seen: string[] = [];
  rows.forEach((row) => {
    Object.keys(row).forEach((k) => {
      if (!seen.includes(k)) seen.push(k);
    });
  });
  return seen;
};

const jsonToCsv = (rows: VocRow[], columns: string[]) => {
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s =
      typeof v === "string"
        ? v
        : typeof v === "number" || typeof v === "boolean"
        ? String(v)
        : JSON.stringify(v);
    const needsQuotes = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };
  const header = columns.join(",");
  const lines = rows.map((r) => columns.map((c) => esc(r[c])).join(","));
  return [header, ...lines].join("\n");
};

const jsonToXlsx = (rows: VocRow[], columns: string[]) => {
  const sheet = utils.json_to_sheet(rows, { header: columns });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, "Export");
  const buffer = write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const makeFilename = (fmt: ExportFormat) =>
  `export-${new Date().toISOString().slice(0, 10)}.${fmt}`;

export const exportFromRows = (format: ExportFormat, rows: VocRow[]) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No data to export");
  }
  const columns = deriveColumns(rows);

  if (format === "csv") {
    const csv = jsonToCsv(rows, columns);
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      makeFilename("csv")
    );
    return;
  }

  downloadBlob(jsonToXlsx(rows, columns), makeFilename("xlsx"));
};
