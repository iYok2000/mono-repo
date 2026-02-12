// Product types matching backend API

export interface Product {
  id: string;
  category_id: string;
  title: string;
  status: ProductStatus;
  tags: string[];
  image: string;
  description?: string;
}

export interface ProductDetail {
  id: string;
  category_id: string;
  title: string;
  status: ProductStatus;
  tags: string[];
  image: string;
  description: string;

  // New content fields - support markdown and rich content
  main_content?: string;
  how_to_use?: string;
  reference?: string;
  example?: string;
}

export type ProductStatus = "recommended" | "new" | "coming_soon" | "default";

export const PRODUCT_STATUSES = [
  "recommended",
  "new",
  "coming_soon",
  "default",
] as const;

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  recommended: "แนะนำ",
  new: "ใหม่",
  coming_soon: "เร็วๆ นี้",
  default: "ปกติ",
};

// Import PREDEFINED_TAGS from single source of truth
// To add/remove tags, edit tagMeta.ts only
export { PREDEFINED_TAGS, type PredefinedTag } from "@/config/tagMeta";
