"use client";

import { useState, useMemo, useCallback } from "react";
import type { Template, TemplateCategory, TemplateTag } from "@/types/template";
import { filterTemplates } from "@/services/templateService";

export interface UseTemplateFilterOptions {
  templates: Template[];
  initialCategory?: TemplateCategory;
  initialTags?: TemplateTag[];
  initialSearchQuery?: string;
}

export const useTemplateFilter = (options: UseTemplateFilterOptions) => {
  const { templates, initialCategory, initialTags = [], initialSearchQuery = "" } = options;

  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | undefined>(
    initialCategory
  );
  const [selectedTags, setSelectedTags] = useState<TemplateTag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const setCategory = useCallback((category: TemplateCategory | undefined) => {
    setSelectedCategory(category);
  }, []);

  const toggleTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  const addTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  const removeTag = useCallback((tag: TemplateTag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const setSearch = useCallback((query: string) => {
    const sanitized = query.trim().slice(0, 100);
    setSearchQuery(sanitized);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(undefined);
    setSelectedTags([]);
    setSearchQuery("");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Boolean(selectedCategory || selectedTags.length > 0 || searchQuery.trim().length > 0);
  }, [selectedCategory, selectedTags, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return filterTemplates({
      category: selectedCategory,
      tags: selectedTags,
      searchQuery,
    });
  }, [selectedCategory, selectedTags, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: templates.length,
      filtered: filteredTemplates.length,
      showing: `${filteredTemplates.length} of ${templates.length}`,
    };
  }, [templates.length, filteredTemplates.length]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<TemplateTag>();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [templates]);

  const availableCategories = useMemo(() => {
    const categorySet = new Set<TemplateCategory>();
    templates.forEach((template) => {
      categorySet.add(template.category);
    });
    return Array.from(categorySet).sort();
  }, [templates]);

  return {
    filteredTemplates,
    stats,
    selectedCategory,
    selectedTags,
    searchQuery,
    hasActiveFilters,
    availableTags,
    availableCategories,
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
