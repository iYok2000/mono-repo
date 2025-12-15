import type { Template, TemplateCategory, TemplateTag } from "@/types/template";

let templateRegistry: Map<string, Template> = new Map();

export const initializeTemplates = (templates: Template[]): void => {
  templateRegistry = new Map(templates.map((t) => [t.slug, t]));
};

const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

export const getAllTemplates = (): Template[] => {
  return Array.from(templateRegistry.values());
};

export const getTemplateBySlug = (slug: string): Template | null => {
  if (!slug || typeof slug !== "string") {
    console.warn("Invalid slug provided to getTemplateBySlug:", slug);
    return null;
  }

  if (!isValidSlug(slug)) {
    console.warn("Invalid slug format:", slug);
    return null;
  }

  return templateRegistry.get(slug) || null;
};

export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  if (!Object.values(TemplateCategory).includes(category)) {
    console.warn("Invalid category:", category);
    return [];
  }

  return getAllTemplates().filter((template) => template.category === category);
};

export const getTemplatesByTag = (tag: TemplateTag): Template[] => {
  if (!Object.values(TemplateTag).includes(tag)) {
    console.warn("Invalid tag:", tag);
    return [];
  }

  return getAllTemplates().filter((template) => template.tags.includes(tag));
};

export const getTemplatesByTags = (tags: TemplateTag[]): Template[] => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return getAllTemplates();
  }

  const validTags = tags.filter((tag) => Object.values(TemplateTag).includes(tag));
  if (validTags.length === 0) {
    return [];
  }

  return getAllTemplates().filter((template) =>
    validTags.every((tag) => template.tags.includes(tag))
  );
};

export const searchTemplates = (query: string): Template[] => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return getAllTemplates();
  }

  const sanitizedQuery = query.trim().toLowerCase();

  if (sanitizedQuery.length > 100) {
    console.warn("Query too long:", sanitizedQuery.length);
    return [];
  }

  return getAllTemplates().filter((template) => {
    const titleMatch = template.title.toLowerCase().includes(sanitizedQuery);
    const shortDescMatch = template.shortDescription.toLowerCase().includes(sanitizedQuery);
    const longDescMatch = template.longDescription.toLowerCase().includes(sanitizedQuery);

    return titleMatch || shortDescMatch || longDescMatch;
  });
};

export const getFeaturedTemplates = (): Template[] => {
  return getAllTemplates().filter((template) => template.featured === true);
};

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

  if (options.category) {
    results = results.filter((t) => t.category === options.category);
  }

  if (options.tags && options.tags.length > 0) {
    results = results.filter((t) => options.tags!.every((tag) => t.tags.includes(tag)));
  }

  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const query = options.searchQuery.trim().toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query) ||
        t.longDescription.toLowerCase().includes(query)
    );
  }

  if (options.featuredOnly) {
    results = results.filter((t) => t.featured === true);
  }

  return results;
};
