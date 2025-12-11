import type { ExportConfig, ExportOptions } from './types';
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
  let csvContent = csvLines.join('\n');

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
};
