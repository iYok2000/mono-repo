import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TagBadge } from "@/components/ui/TagBadge";
import { cx } from "@/lib/cx";
import type { ServiceItem } from "../_data/services";

const STATUS_RIBBON = {
  recommended: {
    label: "Recommended",
    className: "bg-[var(--color-primary)] text-[var(--background)] shadow-md",
  },
  new: {
    label: "New",
    className:
      "bg-sky-600 text-white shadow-md dark:bg-sky-500 dark:text-[var(--background)]",
  },
  "coming-soon": {
    label: "Coming soon",
    className:
      "bg-[var(--color-button)] text-[var(--color-muted)] border border-[var(--color-border)] shadow-md",
  },
} as const;

type Props = {
  item: ServiceItem;
};

export const ServiceCard = ({ item }: Props) => {
  const isComingSoon = item.status === "coming-soon";
  const detailHref = isComingSoon ? "#" : `/dev-toolkit/${item.id}`;
  const ribbon = item.status ? STATUS_RIBBON[item.status] : null;

  return (
    <Card
      variant="default"
      padding="sm"
      className="relative h-full overflow-hidden bg-(--color-surface) text-foreground"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <Link
            href={detailHref}
            aria-disabled={isComingSoon}
            tabIndex={isComingSoon ? -1 : 0}
            className={cx(
              "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isComingSoon
                ? "border-(--color-border) bg-(--color-button) text-(--color-muted) cursor-not-allowed opacity-70 pointer-events-none"
                : "border-(--color-primary) bg-(--color-primary) text-background hover:opacity-90"
            )}
          >
            {isComingSoon ? "กำลังมา" : "เปิดดู"}
          </Link>
        </div>
      }
    >
      {ribbon && (
        <div className="pointer-events-none absolute -right-7 top-5 rotate-30">
          <span
            className={cx(
              "flex w-[140px] items-center justify-center px-3 py-0.5 text-[9px] leading-none text-center font-semibold uppercase tracking-wide whitespace-nowrap",
              ribbon.className
            )}
          >
            {ribbon.label}
          </span>
        </div>
      )}

      <div className="space-y-2 text-sm leading-relaxed">
        <h3 className="text-base font-semibold">{item.title}</h3>
        <p className="text-[13px] text-(--color-muted)">{item.description}</p>
      </div>
    </Card>
  );
};
