/**
 * useTemplates Hook
 *
 * React hook for fetching and managing template data.
 * Currently synchronous (mock data), designed for async database calls later.
 *
 * Security: Uses service layer for all data access (centralized validation).
 */

'use client';

import { useMemo } from 'react';
import type { Template } from '@/types/template';
import { getAllTemplates, getTemplateBySlug, getFeaturedTemplates } from '@/services/templateService';

/**
 * Get all templates
 *
 * @returns Object with templates array
 *
 * @example
 * const { templates } = useTemplates();
 */
export const useTemplates = () => {
  const templates = useMemo(() => getAllTemplates(), []);

  return {
    templates,
    isLoading: false,
    error: null,
  };
};

/**
 * Get template by slug
 *
 * @param slug - Template slug
 * @returns Object with template data
 *
 * @example
 * const { template, isLoading } = useTemplate('data-export');
 */
export const useTemplate = (slug: string | null) => {
  const template = useMemo(() => {
    if (!slug) return null;
    return getTemplateBySlug(slug);
  }, [slug]);

  return {
    template,
    isLoading: false,
    error: template === null && slug ? 'Template not found' : null,
    notFound: template === null && slug !== null,
  };
};

/**
 * Get featured templates
 *
 * @returns Object with featured templates array
 *
 * @example
 * const { templates } = useFeaturedTemplates();
 */
export const useFeaturedTemplates = () => {
  const templates = useMemo(() => getFeaturedTemplates(), []);

  return {
    templates,
    isLoading: false,
    error: null,
  };
};
