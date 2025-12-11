/**
 * Template Service
 *
 * Service layer for template data operations.
 * Currently uses mock data, designed to easily migrate to database later.
 *
 * Security:
 * - Input validation on all public methods
 * - No dynamic code execution
 * - Type-safe returns
 *
 * Architecture: Service layer abstraction allows easy migration to database.
 * Just replace the implementation while keeping the same API.
 */

import type { Template, TemplateCategory, TemplateTag } from '@/types/template';

/**
 * Template registry - will be populated by mock data
 * In future: Replace with database queries
 */
let templateRegistry: Map<string, Template> = new Map();

/**
 * Initialize template registry with data
 * Called by mock data loader
 *
 * @param templates - Array of templates to register
 */
export const initializeTemplates = (templates: Template[]): void => {
  templateRegistry = new Map(templates.map((t) => [t.slug, t]));
};

/**
 * Validate slug format
 * Prevents path traversal and injection attacks
 *
 * @param slug - Template slug to validate
 * @returns true if valid
 */
const isValidSlug = (slug: string): boolean => {
  // Only allow lowercase letters, numbers, and hyphens
  return /^[a-z0-9-]+$/.test(slug);
};

/**
 * Get all templates
 *
 * @returns Array of all templates
 */
export const getAllTemplates = (): Template[] => {
  return Array.from(templateRegistry.values());
};

/**
 * Get template by slug
 *
 * @param slug - URL-friendly template identifier
 * @returns Template if found, null otherwise
 */
export const getTemplateBySlug = (slug: string): Template | null => {
  // Input validation
  if (!slug || typeof slug !== 'string') {
    console.warn('Invalid slug provided to getTemplateBySlug:', slug);
    return null;
  }

  if (!isValidSlug(slug)) {
    console.warn('Invalid slug format:', slug);
    return null;
  }

  return templateRegistry.get(slug) || null;
};

/**
 * Get templates by category
 *
 * @param category - Template category to filter by
 * @returns Array of templates in that category
 */
export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  // Input validation
  if (!Object.values(TemplateCategory).includes(category)) {
    console.warn('Invalid category:', category);
    return [];
  }

  return getAllTemplates().filter((template) => template.category === category);
};

/**
 * Get templates by tag
 *
 * @param tag - Template tag to filter by
 * @returns Array of templates with that tag
 */
export const getTemplatesByTag = (tag: TemplateTag): Template[] => {
  // Input validation
  if (!Object.values(TemplateTag).includes(tag)) {
    console.warn('Invalid tag:', tag);
    return [];
  }

  return getAllTemplates().filter((template) => template.tags.includes(tag));
};

/**
 * Get templates by multiple tags (AND logic)
 * Template must have ALL specified tags
 *
 * @param tags - Array of tags to filter by
 * @returns Array of templates with all tags
 */
export const getTemplatesByTags = (tags: TemplateTag[]): Template[] => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return getAllTemplates();
  }

  // Validate all tags
  const validTags = tags.filter((tag) => Object.values(TemplateTag).includes(tag));
  if (validTags.length === 0) {
    return [];
  }

  return getAllTemplates().filter((template) =>
    validTags.every((tag) => template.tags.includes(tag))
  );
};

/**
 * Search templates by query string
 * Searches in title, shortDescription, and longDescription
 *
 * Security: Query is safely used in string operations (no eval, no regex injection)
 *
 * @param query - Search query string
 * @returns Array of matching templates
 */
export const searchTemplates = (query: string): Template[] => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return getAllTemplates();
  }

  // Sanitize query: trim and lowercase
  const sanitizedQuery = query.trim().toLowerCase();

  // Prevent extremely long queries (DoS protection)
  if (sanitizedQuery.length > 100) {
    console.warn('Query too long:', sanitizedQuery.length);
    return [];
  }

  return getAllTemplates().filter((template) => {
    const titleMatch = template.title.toLowerCase().includes(sanitizedQuery);
    const shortDescMatch = template.shortDescription.toLowerCase().includes(sanitizedQuery);
    const longDescMatch = template.longDescription.toLowerCase().includes(sanitizedQuery);

    return titleMatch || shortDescMatch || longDescMatch;
  });
};

/**
 * Get featured templates
 *
 * @returns Array of featured templates
 */
export const getFeaturedTemplates = (): Template[] => {
  return getAllTemplates().filter((template) => template.featured === true);
};

/**
 * Get template statistics
 *
 * @returns Object with counts by category and tag
 */
export const getTemplateStats = () => {
  const templates = getAllTemplates();

  const byCategory: Record<TemplateCategory, number> = {
    [TemplateCategory.FRONTEND]: 0,
    [TemplateCategory.BACKEND]: 0,
    [TemplateCategory.FULLSTACK]: 0,
    [TemplateCategory.UTILITIES]: 0,
  };

  const byTag: Partial<Record<TemplateTag, number>> = {};

  templates.forEach((template) => {
    byCategory[template.category]++;

    template.tags.forEach((tag) => {
      byTag[tag] = (byTag[tag] || 0) + 1;
    });
  });

  return {
    total: templates.length,
    byCategory,
    byTag,
  };
};

/**
 * Advanced filter with multiple criteria
 *
 * @param options - Filter options
 * @returns Array of filtered templates
 */
export const filterTemplates = (options: {
  category?: TemplateCategory;
  tags?: TemplateTag[];
  searchQuery?: string;
  featuredOnly?: boolean;
}): Template[] => {
  let results = getAllTemplates();

  // Filter by category
  if (options.category) {
    results = results.filter((t) => t.category === options.category);
  }

  // Filter by tags (AND logic)
  if (options.tags && options.tags.length > 0) {
    results = results.filter((t) => options.tags!.every((tag) => t.tags.includes(tag)));
  }

  // Filter by search query
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const query = options.searchQuery.trim().toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query) ||
        t.longDescription.toLowerCase().includes(query)
    );
  }

  // Filter by featured
  if (options.featuredOnly) {
    results = results.filter((t) => t.featured === true);
  }

  return results;
};
