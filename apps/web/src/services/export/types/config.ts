import { ExportType } from './ExportType';

export interface ColumnConfig<T = any> {
  key: keyof T;
  header: string;
  subHeader?: string;
  group?: string;
  formatter?: (value: any, row: T) => string;
  order?: number;
}

export interface ExportConfig<T = any> {
  type: ExportType;
  name: string;
  columns: ColumnConfig<T>[];
  filenamePrefix?: string;
  transformData?: (data: T[]) => T[];
}
