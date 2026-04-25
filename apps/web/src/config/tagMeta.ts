import type { ComponentType } from "react";
import {
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiDocker,
  SiGraphql,
  SiNodedotjs,
} from "react-icons/si";
import {
  FiDatabase,
  FiLock,
  FiCloud,
  FiActivity,
  FiSmartphone,
  FiBarChart2,
  FiZap,
  FiFileText,
  FiBox,
  FiCheckCircle,
  FiKey,
  FiTrendingUp,
  FiCpu,
} from "react-icons/fi";

// Single source of truth for all tags
// Add/remove tags here - it will automatically sync everywhere
export const TAG_CONFIG = {
  // Main Product categories
  API: {
    label: "API",
    icon: SiGraphql,
    color: "text-purple-500",
  },
  Authentication: {
    label: "Authentication",
    icon: FiKey,
    color: "text-green-500",
  },
  Database: {
    label: "Database",
    icon: FiDatabase,
    color: "text-blue-500",
  },
  DevOps: {
    label: "DevOps",
    icon: SiDocker,
    color: "text-cyan-500",
  },
  Frontend: {
    label: "Frontend",
    icon: SiReact,
    color: "text-blue-400",
  },
  Backend: {
    label: "Backend",
    icon: SiNodedotjs,
    color: "text-green-600",
  },
  Testing: {
    label: "Testing",
    icon: FiCheckCircle,
    color: "text-emerald-500",
  },
  Monitoring: {
    label: "Monitoring",
    icon: FiActivity,
    color: "text-orange-500",
  },
  Security: {
    label: "Security",
    icon: FiLock,
    color: "text-red-500",
  },
  Cloud: {
    label: "Cloud",
    icon: FiCloud,
    color: "text-sky-500",
  },
  "AI/ML": {
    label: "AI/ML",
    icon: FiCpu,
    color: "text-yellow-500",
  },
  Mobile: {
    label: "Mobile",
    icon: FiSmartphone,
    color: "text-indigo-500",
  },
  Analytics: {
    label: "Analytics",
    icon: FiBarChart2,
    color: "text-pink-500",
  },
  Performance: {
    label: "Performance",
    icon: FiTrendingUp,
    color: "text-amber-500",
  },
  Documentation: {
    label: "Documentation",
    icon: FiFileText,
    color: "text-gray-500",
  },
  // Legacy tags for backward compatibility
  ts: { label: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
  js: { label: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  react: { label: "React", icon: SiReact, color: "text-cyan-400" },
  next: { label: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" },
  export: { label: "Export", icon: FiBox, color: "text-blue-500" },
  import: { label: "Import", icon: FiBox, color: "text-green-500" },
} as const;

// Export predefined tags for Product insert dropdown
export const PREDEFINED_TAGS = [
  "API",
  "Authentication",
  "Database",
  "DevOps",
  "Frontend",
  "Backend",
  "Testing",
  "Monitoring",
  "Security",
  "Cloud",
  "AI/ML",
  "Mobile",
  "Analytics",
  "Performance",
  "Documentation",
] as const;

export type PredefinedTag = (typeof PREDEFINED_TAGS)[number];

export type TagKey = PredefinedTag | "ts" | "js" | "react" | "next" | "export" | "import" | string;

export type TagMeta = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  color?: string;
};

// Export as tagMeta for backward compatibility
export const tagMeta: Record<TagKey, TagMeta> = TAG_CONFIG as any;
