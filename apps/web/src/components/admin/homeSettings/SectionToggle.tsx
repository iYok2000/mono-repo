import { Switch } from "@/components/ui/Switch";

interface SectionToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  sectionName: string;
}

export function SectionToggle({ enabled, onToggle, sectionName }: SectionToggleProps) {
  return (
    <div
      className={
        "flex items-center justify-between p-4 rounded-2xl border transition-colors " +
        (enabled ? "bg-primary/5 border-primary/30" : "bg-card border-border")
      }
    >
      <div className="flex items-center gap-3">
        <span
          className={
            "inline-block w-2.5 h-2.5 rounded-full " +
            (enabled ? "bg-primary" : "bg-muted-foreground/40")
          }
        />
        <div>
          <h3 className="font-semibold text-foreground">{sectionName}</h3>
          <p className="text-sm text-muted-foreground">
            {enabled ? "แสดงในหน้าเว็บ" : "ซ่อนจากหน้าเว็บ"}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${sectionName}`}
      />
    </div>
  );
}
