"use client";

import { useState } from "react";
import { exportToCsv, VocExportData } from "../services/exportService";
import { exportWithType, ExportType, ExportTypeDataMap, ExportOptions } from "../services/export";

type Status = "idle" | "loading" | "success" | "error";

export const useDataExport = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const exportData = (rows: VocExportData[], filename?: string) => {
    setStatus("loading");
    setMessage("Preparing file...");

    try {
      exportToCsv(rows, filename);
      setStatus("success");
      setMessage("Export ready");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Export failed");
    }
  };

  const exportDataWithType = <T extends ExportType>(
    type: T,
    data: ExportTypeDataMap[T][],
    options?: ExportOptions
  ) => {
    setStatus("loading");
    setMessage("Preparing file...");

    try {
      exportWithType(type, data, options);
      setStatus("success");
      setMessage("Export ready");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Export failed");
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
  };

  return {
    status,
    message,
    exportData,
    exportDataWithType,
    reset,
  };
};
