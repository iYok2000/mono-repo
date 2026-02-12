import type { Product } from "@/types/product";
import type { Category } from "@/services/category/types";

export type ProductWithCategory = Product & {
  category_name?: string;
  category_id_matched?: string; // ID ที่ match แล้ว
};

/**
 * Map category names to products and resolve category IDs
 */
export const mapProductsWithCategories = (
  products: Product[],
  categories: Category[]
): ProductWithCategory[] => {
  return products.map((product) => {
    // Find matching category by id, name_en, or name_th
    const matchedCategory = categories.find(
      (cat) =>
        cat.id === product.category_id ||
        cat.name_en === product.category_id ||
        cat.name_th === product.category_id
    );

    return {
      ...product,
      category_id_matched: matchedCategory?.id || product.category_id,
      category_name: matchedCategory?.name_th || "อื่นๆ",
    };
  });
};

/**
 * Group products by category name
 * Ensures unique categories only
 */
export const groupProductsByCategory = (
  products: ProductWithCategory[]
): Record<string, ProductWithCategory[]> => {
  return products.reduce((acc, product) => {
    const categoryName = product.category_name || "อื่นๆ";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, ProductWithCategory[]>);
};

/**
 * Get unique category sections for navigation
 */
export const getUniqueCategorySections = (
  productsByCategory: Record<string, ProductWithCategory[]>,
  includeRecommended: boolean = false
) => {
  const categorySections = Object.keys(productsByCategory)
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
