import type { ComponentType } from "react";
import {
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTypescript,
} from "react-icons/si";

export type TagKey = "ts" | "js" | "react" | "next" | string;

export type TagMeta = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

export const tagMeta: Record<TagKey, TagMeta> = {
  ts: { label: "TypeScript", icon: SiTypescript },
  js: { label: "JavaScript", icon: SiJavascript },
  react: { label: "React", icon: SiReact },
  next: { label: "Next.js", icon: SiNextdotjs },
};
