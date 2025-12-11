/**
 * Data Export Template
 *
 * Real template showcasing the existing Data Export feature.
 * Code is copied as strings to avoid circular dependencies.
 */

import type { Template } from '@/types/template';
import { TemplateCategory, TemplateTag } from '@/types/template';

export const dataExportTemplate: Template = {
  id: 'data-export',
  slug: 'data-export',

  title: 'Data Export (CSV)',
  shortDescription:
    'RFC 4180 compliant CSV export with Thai language support, type safety, and configurable column headers.',
  longDescription: `A complete CSV export solution featuring multi-type export system with configuration-driven headers, type-safe implementation, and client-side generation for instant downloads.

Perfect for exporting large datasets with Thai/English bilingual support, UTF-8 BOM option for Excel compatibility, and a clean service-hook-component architecture.`,

  category: TemplateCategory.FRONTEND,
  tags: [
    TemplateTag.TYPESCRIPT,
    TemplateTag.REACT,
    TemplateTag.NEXTJS,
    TemplateTag.CSV,
    TemplateTag.EXPORT,
    TemplateTag.HOOK,
    TemplateTag.SERVICE,
    TemplateTag.COMPONENT,
  ],

  hasLiveDemo: true,
  demoComponent: 'DataExportDemo',

  codeFiles: [
    {
      filename: 'core.ts',
      language: 'typescript',
      path: 'services/export/core.ts',
      description: 'Core CSV generation logic with type-safe configuration',
      isMain: true,
      code: `import type { ExportConfig, ExportOptions } from './types';
import { escapeCsvValue, generateFilename, downloadBlob, addUtf8Bom } from './utils';

export const generateCsvContent = <T>(
  data: T[],
  config: ExportConfig<T>,
  options: ExportOptions = {}
): string => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data to export');
  }

  const transformedData = config.transformData ? config.transformData(data) : data;
  const headers = config.columns.map(col => col.header);

  const rows = transformedData.map(row => {
    return config.columns.map(col => {
      const value = row[col.key];
      const formattedValue = col.formatter ? col.formatter(value, row) : value;
      return escapeCsvValue(formattedValue);
    }).join(',');
  });

  const csvLines = [headers.join(','), ...rows];
  let csvContent = csvLines.join('\\n');

  if (options.includeBom) {
    csvContent = addUtf8Bom(csvContent);
  }

  return csvContent;
};

export const exportWithConfig = <T>(
  data: T[],
  config: ExportConfig<T>,
  options: ExportOptions = {}
): void => {
  const csvContent = generateCsvContent(data, config, options);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = options.filename ||
    generateFilename(config.filenamePrefix || config.type, 'csv');
  downloadBlob(blob, filename);
};`,
    },
    {
      filename: 'utils.ts',
      language: 'typescript',
      path: 'services/export/utils.ts',
      description: 'CSV utility functions for escaping, filename generation, and download',
      code: `export const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const stringValue =
    typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "boolean"
      ? String(value)
      : JSON.stringify(value);

  const needsQuotes = /[",\\n]/.test(stringValue);
  const escaped = stringValue.replace(/"/g, '""');

  return needsQuotes ? \`"\${escaped}"\` : escaped;
};

export const generateFilename = (
  prefix: string = 'export',
  extension: string = 'csv'
): string => {
  const date = new Date().toISOString().slice(0, 10);
  return \`\${prefix}-\${date}.\${extension}\`;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
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

export const addUtf8Bom = (content: string): string => {
  return '\\uFEFF' + content;
};`,
    },
    {
      filename: 'vocDetailsConfig.ts',
      language: 'typescript',
      path: 'services/export/configs/vocDetailsConfig.ts',
      description: 'Example configuration with Thai headers for VOC data export',
      code: `import type { ExportConfig, VocExportData } from '../types';
import { ExportType } from '../types';

export const vocDetailsConfig: ExportConfig<VocExportData> = {
  type: ExportType.VOC_DETAILS,
  name: 'รายละเอียดเสียงของลูกค้า',
  filenamePrefix: 'voc-details',

  columns: [
    { key: 'no', header: 'ลำดับ' },
    { key: 'vocNo', header: 'หมายเลขเคลม' },
    { key: 'peaOffice', header: 'หน่วยงาน' },
    { key: 'refNoPea', header: 'เลขที่อ้างอิง' },
    { key: 'customerName', header: 'ชื่อลูกค้า' },
    { key: 'customerCode', header: 'รหัสลูกค้า' },
    { key: 'channel', header: 'ช่องทาง' },
    { key: 'status', header: 'สถานะ' },
    // ... more columns
  ],
};`,
    },
    {
      filename: 'useDataExport.ts',
      language: 'typescript',
      path: 'hooks/useDataExport.ts',
      description: 'React hook for managing export state and operations',
      code: `"use client";

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

  return { status, message, exportData, exportDataWithType };
};`,
    },
    {
      filename: 'dataExportButton.tsx',
      language: 'tsx',
      path: 'components/export/dataExportButton.tsx',
      description: 'UI component with bilingual support and accessibility features',
      code: `"use client";

import { useDataExport } from "../../hooks/useDataExport";
import { VocExportData, ExportType } from "../../services/exportService";
import { cx } from "../../lib/cx";

type Props = {
  type: ExportType;
  data: VocExportData[];
  filename?: string;
};

export const DataExportButton = ({ type, data, filename }: Props) => {
  const { status, message, exportDataWithType } = useDataExport();

  const handleExport = () => {
    exportDataWithType(type, data, { filename });
  };

  const disabled = status === "loading" || !data || data.length === 0;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold tracking-tight">
          ดาวน์โหลดไฟล์ CSV
        </h2>

        <button
          onClick={handleExport}
          disabled={disabled}
          aria-label="Export data as CSV"
          className={cx(
            "rounded-2xl border px-4 py-3 transition",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          Export CSV
        </button>

        <div role="status" aria-live="polite">
          {status === "success" ? "ไฟล์พร้อมดาวน์โหลด" : message}
        </div>
      </div>
    </section>
  );
};`,
    },
  ],

  howToUse: `# Installation

No additional dependencies required. This feature uses built-in browser APIs.

# Basic Usage

\`\`\`typescript
import { DataExportButton } from "@/components/export/dataExportButton";
import { ExportType } from "@/services/export";

export default function Page() {
  const data = [...]; // Your data array

  return (
    <DataExportButton
      type={ExportType.VOC_DETAILS}
      data={data}
    />
  );
}
\`\`\`

# Custom Configuration

Create your own export configuration:

\`\`\`typescript
import type { ExportConfig } from "@/services/export/types";

export const myCustomConfig: ExportConfig<MyDataType> = {
  type: 'custom',
  name: 'My Custom Export',
  filenamePrefix: 'my-export',
  columns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'amount',
      header: 'Amount',
      formatter: (value) => \`฿\${value.toLocaleString()}\`
    },
  ],
};
\`\`\`

# Advanced Options

\`\`\`typescript
import { exportWithConfig } from "@/services/export";

exportWithConfig(data, myCustomConfig, {
  filename: 'custom-export-2025-12-11.csv',
  includeBom: true, // For Excel compatibility
});
\`\`\`

# With React Hook

\`\`\`typescript
import { useDataExport } from "@/hooks/useDataExport";

function MyComponent() {
  const { status, exportDataWithType } = useDataExport();

  const handleExport = () => {
    exportDataWithType(ExportType.VOC_DETAILS, data);
  };

  return (
    <button onClick={handleExport} disabled={status === "loading"}>
      {status === "loading" ? "Exporting..." : "Export CSV"}
    </button>
  );
}
\`\`\``,

  features: [
    'RFC 4180 compliant CSV formatting',
    'Type-safe with TypeScript generics',
    'Configuration-driven column headers',
    'Thai/English bilingual support',
    'Client-side generation (no server load)',
    'UTF-8 BOM option for Excel compatibility',
    'Custom formatters for each column',
    'Data transformation support',
    'Accessible UI with ARIA attributes',
    'Status feedback (idle, loading, success, error)',
    'Clean architecture (Service → Hook → Component)',
  ],

  dependencies: [
    {
      name: 'react',
      version: '19.2.0',
      type: 'runtime',
      required: true,
    },
    {
      name: 'next',
      version: '16.0.7',
      type: 'runtime',
      required: true,
    },
    {
      name: 'typescript',
      version: '^5',
      type: 'dev',
      required: true,
    },
  ],

  createdAt: '2025-12-09',
  updatedAt: '2025-12-11',
  author: 'AI Agent (Claude)',
  featured: true,
};
