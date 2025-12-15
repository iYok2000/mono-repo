import { Badge } from "@/components/ui/Badge";
import { tagMeta, type TagKey } from "@/config/tagMeta";

type Props = {
  tag: TagKey;
};

export const TagBadge = ({ tag }: Props) => {
  const meta = tagMeta[tag] ?? { label: tag };
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      size="sm"
      className={Icon ? "px-2 py-1" : "gap-1"}
    >
      {Icon ? (
        <Icon className="h-4 w-4" aria-label={meta.label} />
      ) : (
        meta.label
      )}
    </Badge>
  );
};
