import { Switch } from "@/components/ui/Switch";

interface SectionToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  sectionName: string;
}

export function SectionToggle({ enabled, onToggle, sectionName }: SectionToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${sectionName}`}
      />
      <span className={`text-sm font-medium ${enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
        {enabled ? "เปิด" : "ปิด"}
      </span>
    </div>
  );
}
