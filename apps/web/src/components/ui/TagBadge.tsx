import { Badge } from "@/components/ui/Badge";
import { tagMeta, type TagKey } from "@/config/tagMeta";

type Props = {
  tag: TagKey;
  size?: "sm" | "xs";
};

export const TagBadge = ({ tag, size = "sm" }: Props) => {
  const meta = tagMeta[tag] ?? { label: tag };
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      size={size}
      className={Icon ? "px-2 py-1" : "gap-1"}
    >
      {Icon ? (
        <Icon className={size === "xs" ? "h-3 w-3" : "h-4 w-4"} aria-label={meta.label} />
      ) : (
        meta.label
      )}
    </Badge>
  );
};
