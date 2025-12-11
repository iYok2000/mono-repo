/**
 * Demo-Specific Type Definitions
 *
 * Types for interactive template demos.
 * Each demo component can define its own state interface here.
 *
 * Security: State types ensure data integrity in demos.
 * All user inputs should be validated against these types.
 */

import type { VocExportData } from '@/services/exportService';

/**
 * Column configuration for the export demo
 * Represents a single column that can be selected
 */
export interface ColumnConfig {
  /** Column key from the data type */
  key: string;

  /** Display header (Thai or English) */
  header: string;

  /** Is this column selected for export? */
  selected: boolean;

  /** Optional description of what this column contains */
  description?: string;

  /** Optional: Is this a required column? */
  required?: boolean;
}

/**
 * State for the Data Export interactive demo
 * Manages column selection, filename, and export options
 */
export interface DataExportDemoState {
  /** Array of selected column keys */
  selectedColumns: readonly string[];

  /** Custom filename for the export (without extension) */
  filename: string;

  /** Include UTF-8 BOM for Excel compatibility */
  includeBom: boolean;

  /** Sample data for preview (first 5 rows) */
  previewData: readonly VocExportData[];

  /** Generated TypeScript config code as a string */
  generatedConfig: string;

  /** Is the config up-to-date with current selections? */
  configNeedsRegeneration: boolean;
}

/**
 * Export options for the demo
 * Mirrors the actual export service options
 */
export interface DemoExportOptions {
  /** Custom filename (without extension) */
  filename?: string;

  /** Include UTF-8 BOM */
  includeBom?: boolean;

  /** File format (future: support XLSX) */
  format?: 'csv' | 'xlsx';
}

/**
 * Demo component props interface
 * Base interface that all demo components should extend
 */
export interface DemoComponentProps {
  /** Optional initial configuration */
  initialConfig?: Record<string, unknown>;

  /** Callback when demo state changes (for analytics) */
  onStateChange?: (state: Record<string, unknown>) => void;

  /** Callback when user performs an action (for tracking) */
  onAction?: (action: string, metadata?: Record<string, unknown>) => void;
}

/**
 * Data Export Demo specific props
 */
export interface DataExportDemoProps extends DemoComponentProps {
  /** Optional: Override default preview data */
  previewData?: VocExportData[];

  /** Optional: Pre-select specific columns */
  preselectedColumns?: string[];
}
