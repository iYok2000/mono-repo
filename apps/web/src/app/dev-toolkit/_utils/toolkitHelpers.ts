import type { DevToolkit } from "@/types/devtoolkit";
import type { Category } from "@/services/category/types";

export type ToolkitWithCategory = DevToolkit & {
  category_name?: string;
  category_id_matched?: string; // ID ที่ match แล้ว
};

/**
 * Map category names to toolkits and resolve category IDs
 */
export const mapToolkitsWithCategories = (
  toolkits: DevToolkit[],
  categories: Category[]
): ToolkitWithCategory[] => {
  return toolkits.map((toolkit) => {
    // Find matching category by id, name_en, or name_th
    const matchedCategory = categories.find(
      (cat) =>
        cat.id === toolkit.category_id ||
        cat.name_en === toolkit.category_id ||
        cat.name_th === toolkit.category_id
    );

    return {
      ...toolkit,
      category_id_matched: matchedCategory?.id || toolkit.category_id,
      category_name: matchedCategory?.name_th || "อื่นๆ",
    };
  });
};

/**
 * Group toolkits by category name
 * Ensures unique categories only
 */
export const groupToolkitsByCategory = (
  toolkits: ToolkitWithCategory[]
): Record<string, ToolkitWithCategory[]> => {
  return toolkits.reduce((acc, toolkit) => {
    const categoryName = toolkit.category_name || "อื่นๆ";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(toolkit);
    return acc;
  }, {} as Record<string, ToolkitWithCategory[]>);
};

/**
 * Get unique category sections for navigation
 */
export const getUniqueCategorySections = (
  toolkitsByCategory: Record<string, ToolkitWithCategory[]>,
  includeRecommended: boolean = false
) => {
  const categorySections = Object.keys(toolkitsByCategory)
    .sort((a, b) => a.localeCompare(b, "th"))
    .map((categoryName) => ({
      id: categoryName.toLowerCase().replace(/\s+/g, "-"),
      label: categoryName,
    }));

  // Remove duplicates by id
  const uniqueSections = categorySections.filter(
    (section, index, self) =>
      index === self.findIndex((s) => s.id === section.id)
  );

  if (includeRecommended) {
    return [{ id: "recommended", label: "แนะนำ" }, ...uniqueSections];
  }

  return uniqueSections;
};
