import { ExportType } from './types';
import type { ExportTypeDataMap, ExportOptions } from './types';
import { exportConfigRegistry } from './configs';
import { exportWithConfig } from './core';

export const exportWithType = <T extends ExportType>(
  type: T,
  data: ExportTypeDataMap[T][],
  options?: ExportOptions
): void => {
  const config = exportConfigRegistry.get(type);
  exportWithConfig(data, config, options);
};

export { ExportType } from './types';

export type {
  ExportConfig,
  ExportOptions,
  ColumnConfig,
  ExportTypeDataMap,
  VocExportData,
} from './types';

export { exportConfigRegistry } from './configs';
export { vocDetailsConfig } from './configs';

export { exportWithConfig, generateCsvContent } from './core';
export {
  escapeCsvValue,
  generateFilename,
  downloadBlob,
  addUtf8Bom,
} from './utils';
