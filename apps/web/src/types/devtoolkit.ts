// DevToolkit types matching backend API

export interface DevToolkit {
  id: string;
  category_id: string;
  title: string;
  status: ToolkitStatus;
  tags: string[];
  image: string;
  description?: string;
}

export interface DevToolkitDetail {
  id: string;
  category_id: string;
  title: string;
  status: ToolkitStatus;
  tags: string[];
  image: string;
  description: string;
}

export type ToolkitStatus = "recommended" | "new" | "coming_soon" | "default";

export const TOOLKIT_STATUSES = [
  "recommended",
  "new",
  "coming_soon",
  "default",
] as const;

export const TOOLKIT_STATUS_LABELS: Record<ToolkitStatus, string> = {
  recommended: "แนะนำ",
  new: "ใหม่",
  coming_soon: "เร็วๆ นี้",
  default: "ปกติ",
};

// Import PREDEFINED_TAGS from single source of truth
// To add/remove tags, edit tagMeta.ts only
export { PREDEFINED_TAGS, type PredefinedTag } from "@/config/tagMeta";
