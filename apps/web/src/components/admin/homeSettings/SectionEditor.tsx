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
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{sectionName}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <SectionToggle
          enabled={sectionData.enabled}
          onToggle={handleToggle}
          sectionName="เปิด/ปิดการแสดงผล"
        />
      </div>

      {/* Section Content - Only show when enabled */}
      {sectionData.enabled && (
        <div className="space-y-4 p-4 bg-background/50 rounded-lg border border-border">
          {children}
        </div>
      )}
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
