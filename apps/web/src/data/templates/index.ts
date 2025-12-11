/**
 * Template Registry
 *
 * Central registry for all templates.
 * Initializes the template service with mock data.
 *
 * Security: Templates are statically defined and validated at build time.
 */

import { initializeTemplates } from '@/services/templateService';
import { dataExportTemplate } from './data-export';
import { mockAuthTemplate } from './mock-auth';
import { mockUploadTemplate } from './mock-upload';

/**
 * All available templates
 * Add new templates here
 */
export const allTemplates = [
  dataExportTemplate,
  mockAuthTemplate,
  mockUploadTemplate,
];

/**
 * Initialize template registry
 * Call this once at app startup
 */
export const initializeTemplateRegistry = () => {
  initializeTemplates(allTemplates);
};

// Auto-initialize on module load
// In future with database, remove this and call during server startup
if (typeof window !== 'undefined') {
  // Client-side initialization
  initializeTemplateRegistry();
} else {
  // Server-side initialization
  initializeTemplateRegistry();
}

// Named exports for convenience
export { dataExportTemplate } from './data-export';
export { mockAuthTemplate } from './mock-auth';
export { mockUploadTemplate } from './mock-upload';
