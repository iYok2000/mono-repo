"use client";

import { useState } from "react";
import {
  exportFromRows,
  ExportFormat,
  VocRow,
} from "../services/exportService";

type Status = "idle" | "loading" | "success" | "error";

export const useDataExport = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [format, setFormat] = useState<ExportFormat | null>(null);
  const [message, setMessage] = useState("");

  const exportData = async (
    fmt: ExportFormat,
    rows: VocRow[]
  ) => {
    setStatus("loading");
    setFormat(fmt);
    setMessage("Preparing file...");
    try {
      if (!rows || rows.length === 0) {
        throw new Error("No data to export");
      }
      exportFromRows(fmt, rows);
      setStatus("success");
      setMessage("Export ready");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Export failed");
    }
  };

  return {
    status,
    format,
    message,
    exportData,
    reset: () => setStatus("idle"),
  };
};
