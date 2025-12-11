/**
 * useTemplateFilter Hook
 *
 * React hook for managing template filter state and logic.
 * Handles category, tags, and search filtering.
 *
 * Security: All filtering uses validated service layer methods.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Template, TemplateCategory, TemplateTag } from '@/types/template';
import { filterTemplates, getTemplateStats } from '@/services/templateService';

export interface UseTemplateFilterOptions {
  /** Initial templates to filter */
  templates: Template[];

  /** Initial category filter */
  initialCategory?: TemplateCategory;

  /** Initial tags filter */
  initialTags?: TemplateTag[];

  /** Initial search query */
  initialSearchQuery?: string;
}

/**
 * Hook for template filtering with state management
 *
 * @param options - Configuration options
 * @returns Filter state and control functions
 *
 * @example
 * const {
 *   filteredTemplates,
 *   selectedCategory,
 *   selectedTags,
 *   searchQuery,
 *   setCategory,
 *   toggleTag,
 *   setSearchQuery,
 *   clearFilters
 * } = useTemplateFilter({ templates });
 */
export const useTemplateFilter = (options: UseTemplateFilterOptions) => {
  const { templates, initialCategory, initialTags = [], initialSearchQuery = '' } = options;

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | undefined>(
    initialCategory
  );
  const [selectedTags, setSelectedTags] = useState<TemplateTag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  /**
   * Set category filter
   * Pass undefined to clear category filter
   */
  const setCategory = useCallback((category: TemplateCategory | undefined) => {
    setSelectedCategory(category);
  }, []);

  /**
   * Toggle tag in filter
   * Adds if not present, removes if present
   */
  const toggleTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  /**
   * Add tag to filter
   */
  const addTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  /**
   * Remove tag from filter
   */
  const removeTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  /**
   * Clear all tags
   */
  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  /**
   * Set search query with sanitization
   */
  const setSearch = useCallback((query: string) => {
    // Trim and limit length
    const sanitized = query.trim().slice(0, 100);
    setSearchQuery(sanitized);
  }, []);

  /**
   * Clear search query
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSelectedCategory(undefined);
    setSelectedTags([]);
    setSearchQuery('');
  }, []);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return Boolean(selectedCategory || selectedTags.length > 0 || searchQuery.trim().length > 0);
  }, [selectedCategory, selectedTags, searchQuery]);

  /**
   * Get filtered templates using service layer
   */
  const filteredTemplates = useMemo(() => {
    return filterTemplates({
      category: selectedCategory,
      tags: selectedTags,
      searchQuery,
    });
  }, [selectedCategory, selectedTags, searchQuery]);

  /**
   * Get statistics for current filter state
   */
  const stats = useMemo(() => {
    return {
      total: templates.length,
      filtered: filteredTemplates.length,
      showing: `${filteredTemplates.length} of ${templates.length}`,
    };
  }, [templates.length, filteredTemplates.length]);

  /**
   * Get all available tags from templates
   */
  const availableTags = useMemo(() => {
    const tagSet = new Set<TemplateTag>();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [templates]);

  /**
   * Get available categories from templates
   */
  const availableCategories = useMemo(() => {
    const categorySet = new Set<TemplateCategory>();
    templates.forEach((template) => {
      categorySet.add(template.category);
    });
    return Array.from(categorySet).sort();
  }, [templates]);

  return {
    // Filtered data
    filteredTemplates,
    stats,

    // Filter state
    selectedCategory,
    selectedTags,
    searchQuery,
    hasActiveFilters,

    // Available options
    availableTags,
    availableCategories,

    // Control functions
    setCategory,
    toggleTag,
    addTag,
    removeTag,
    clearTags,
    setSearchQuery: setSearch,
    clearSearch,
    clearFilters,
  };
};
