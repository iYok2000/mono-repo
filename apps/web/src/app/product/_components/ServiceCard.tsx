import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TagBadge } from "@/components/ui/TagBadge";
import { cx } from "@/lib/cx";
import { memo } from "react";
import type { ProductStatus } from "@/types/product";

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
  coming_soon: {
    label: "Coming soon",
    className:
      "bg-[var(--color-button)] text-[var(--color-muted)] border border-[var(--color-border)] shadow-md",
  },
} as const;

type RibbonStatus = keyof typeof STATUS_RIBBON;

export type ServiceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  status?: ProductStatus;
  tags?: string[];
  image?: string;
};

type Props = {
  item: ServiceItem;
};

const ServiceCardComponent = ({ item }: Props) => {
  const isComingSoon = item.status === "coming_soon";
  const detailHref = isComingSoon ? "#" : `/product/${item.id}/detail`;
  const ribbon =
    item.status && item.status !== "default"
      ? STATUS_RIBBON[item.status as RibbonStatus]
      : null;

  return (
    <Card
      variant="default"
      padding="xs"
      className="relative h-full min-h-[180px] overflow-hidden bg-(--color-surface) text-foreground hover:shadow-md transition-shadow"
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {item.tags?.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} size="xs" />
            ))}
            {item.tags && item.tags.length > 3 && (
              <span className="text-[10px] text-(--color-muted) font-medium">+{item.tags.length - 3}</span>
            )}
          </div>
          <Link
            href={detailHref}
            aria-disabled={isComingSoon}
            tabIndex={isComingSoon ? -1 : 0}
            className={cx(
              "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all w-full",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-1",
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
        <div className="pointer-events-none absolute -right-10 top-2.5 rotate-45 z-10">
          <span
            className={cx(
              "flex w-[140px] items-center justify-center px-3 py-2.5 text-[7.5px] leading-relaxed text-center font-bold uppercase tracking-wide whitespace-nowrap shadow-sm",
              ribbon.className
            )}
          >
            {ribbon.label}
          </span>
        </div>
      )}

      <div className={cx("space-y-1.5", ribbon ? "pr-10 pt-0.5" : "")}>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-xs text-(--color-muted) leading-relaxed line-clamp-3">{item.description}</p>
      </div>
    </Card>
  );
};

export const ServiceCard = memo(ServiceCardComponent);
