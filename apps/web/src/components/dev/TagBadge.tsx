import { Badge } from "@/components/ui/Badge";
import { tagMeta, type TagKey } from "@/config/tagMeta";

type Props = {
  tag: TagKey;
};

export const TagBadge = ({ tag }: Props) => {
  const meta = tagMeta[tag] ?? { label: tag };
  const Icon = meta.icon;

  return (
    <Badge variant="outline" size="sm" className="gap-1">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {meta.label}
    </Badge>
  );
};
