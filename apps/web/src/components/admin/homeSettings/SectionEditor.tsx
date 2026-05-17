import { ReactNode } from "react";
import { ContentField } from "./ContentField";
import { SectionToggle } from "./SectionToggle";
import type { SectionSettings } from "@/types/homeSettings";

interface SectionEditorProps<T extends SectionSettings> {
  sectionName: string;
  description: string;
  sectionData: T;
  onUpdate: (data: T) => void;
  children?: ReactNode;
}

export function SectionEditor<T extends SectionSettings>({
  sectionName,
  description,
  sectionData,
  onUpdate,
  children,
}: SectionEditorProps<T>) {
  const handleToggle = (enabled: boolean) => {
    onUpdate({ ...sectionData, enabled });
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-foreground">{sectionName}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="ml-4 shrink-0">
          <SectionToggle
            enabled={sectionData.enabled}
            onToggle={handleToggle}
            sectionName="แสดงผล"
          />
        </div>
      </div>

      {/* Disabled banner */}
      {!sectionData.enabled && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
          <span>⚠️</span>
          <span>Section นี้ถูกซ่อนอยู่ — แก้ไขเนื้อหาได้ แต่จะไม่แสดงในหน้าเว็บจนกว่าจะเปิด</span>
        </div>
      )}

      {/* Section Content - Always visible for editing */}
      <div className={`space-y-4 p-4 rounded-lg border transition-opacity ${
        sectionData.enabled
          ? "bg-background/50 border-border"
          : "bg-muted/20 border-dashed border-border/60 opacity-80"
      }`}>
        {children}
      </div>
    </div>
  );
}

/**
 * Helper to render fields from section data
 */
interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  helperText?: string;
  type?: "text" | "checkbox";
}

export function renderFields<T extends SectionSettings>(
  sectionData: T,
  fields: FieldConfig[],
  onUpdate: (data: T) => void
) {
  return fields.map((field) => (
    <ContentField
      key={field.key}
      label={field.label}
      value={(sectionData as any)[field.key] || (field.type === "checkbox" ? false : "")}
      onChange={(value) =>
        onUpdate({ ...sectionData, [field.key]: value })
      }
      placeholder={field.placeholder}
      multiline={field.multiline}
      rows={field.rows}
      required={field.required}
      helperText={field.helperText}
      type={field.type}
    />
  ));
}
