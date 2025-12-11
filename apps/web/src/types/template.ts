/**
 * Template System Type Definitions
 *
 * Core types for the template gallery system.
 * Provides type-safe interfaces for templates, code files, and dependencies.
 *
 * Security: All types are strictly defined to prevent type-related vulnerabilities.
 * No 'any' types used. All inputs should be validated against these types.
 */

/**
 * Template categories for filtering and organization
 */
export enum TemplateCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  UTILITIES = 'utilities',
}

/**
 * Template tags for fine-grained filtering
 * Add new tags here as needed
 */
export enum TemplateTag {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  REACT = 'react',
  NEXTJS = 'nextjs',
  GO = 'go',
  NODE = 'node',
  EXPRESS = 'express',
  CSV = 'csv',
  XLSX = 'xlsx',
  EXPORT = 'export',
  IMPORT = 'import',
  HOOK = 'hook',
  SERVICE = 'service',
  COMPONENT = 'component',
  API = 'api',
  DATABASE = 'database',
  AUTH = 'auth',
}

/**
 * Represents a single code file within a template
 */
export interface CodeFile {
  /** Filename with extension (e.g., 'exportService.ts') */
  filename: string;

  /** Programming language for syntax highlighting */
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'go' | 'json' | 'markdown';

  /** The actual code content as a string */
  code: string;

  /** Optional description of what this file does */
  description?: string;

  /** Optional file path to show context (e.g., 'services/export/core.ts') */
  path?: string;

  /** Optional: Mark as the main/entry file */
  isMain?: boolean;
}

/**
 * Represents a package dependency
 */
export interface TemplateDependency {
  /** Package name (e.g., 'react') */
  name: string;

  /** Version or version range (e.g., '19.2.0', '^19.0.0') */
  version: string;

  /** Type of dependency */
  type: 'runtime' | 'dev' | 'peer';

  /** Is this dependency required or optional? */
  required: boolean;

  /** Optional installation notes */
  notes?: string;
}

/**
 * Main Template interface
 * Represents a complete code template with all metadata
 */
export interface Template {
  /** Unique identifier */
  id: string;

  /** URL-friendly slug (e.g., 'data-export') */
  slug: string;

  // Basic Info
  /** Display title (e.g., 'Data Export (CSV/XLSX)') */
  title: string;

  /** Short description for cards (1-2 lines, max 150 chars recommended) */
  shortDescription: string;

  /** Detailed description for detail page (can be longer, supports markdown) */
  longDescription: string;

  // Categorization
  /** Primary category for filtering */
  category: TemplateCategory;

  /** Tags for multi-dimensional filtering */
  tags: readonly TemplateTag[];

  // Demo
  /** Does this template have an interactive demo? */
  hasLiveDemo: boolean;

  /** Component name for the demo (must match component in demos/ folder) */
  demoComponent?: string;

  // Code
  /** All code files to display */
  codeFiles: readonly CodeFile[];

  // Documentation
  /** How to use this template (markdown content) */
  howToUse: string;

  /** List of key features (bullet points) */
  features: readonly string[];

  // Dependencies
  /** Required and optional dependencies */
  dependencies: readonly TemplateDependency[];

  // Metadata
  /** ISO 8601 date string */
  createdAt: string;

  /** ISO 8601 date string */
  updatedAt: string;

  /** Author name or identifier */
  author: string;

  // Optional
  /** External demo URL if available */
  demoUrl?: string;

  /** GitHub or source code URL */
  githubUrl?: string;

  /** Is this template featured? (for homepage) */
  featured?: boolean;
}

/**
 * Template filter criteria
 * Used for filtering templates in the gallery
 */
export interface TemplateFilter {
  /** Filter by category (undefined = all) */
  category?: TemplateCategory;

  /** Filter by multiple tags (empty array = all) */
  tags: TemplateTag[];

  /** Search query for title and description */
  searchQuery: string;

  /** Show only featured templates */
  featuredOnly?: boolean;
}

/**
 * Template statistics
 * For displaying counts and metrics
 */
export interface TemplateStats {
  /** Total number of templates */
  total: number;

  /** Number of templates matching current filters */
  filtered: number;

  /** Templates by category */
  byCategory: Record<TemplateCategory, number>;

  /** Templates by tag */
  byTag: Record<TemplateTag, number>;
}
