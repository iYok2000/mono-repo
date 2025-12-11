import { ExportType } from './ExportType';
import type {
  VocExportData,
  CustomerGroupData,
  AreaSummaryData,
  QuarterlySummaryData,
  AnnualSummaryData,
} from './data';

export interface ExportTypeDataMap {
  [ExportType.VOC_DETAILS]: VocExportData;
  [ExportType.CUSTOMER_GROUP]: CustomerGroupData;
  [ExportType.AREA_SUMMARY]: AreaSummaryData;
  [ExportType.QUARTERLY_SUMMARY]: QuarterlySummaryData;
  [ExportType.ANNUAL_SUMMARY]: AnnualSummaryData;
}
