import { cx } from "@/lib/cx";

export type CardVariant = "default" | "bordered" | "elevated" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const getVariantClasses = (variant: CardVariant): string => {
  const variants: Record<CardVariant, string> = {
    default:
      "rounded-2xl border border-(--color-border) bg-(--color-surface) text-[var(--color-foreground)] shadow-sm",
    bordered:
      "rounded-2xl border border-(--color-primary) bg-(--color-surface) text-[var(--color-foreground)] shadow-sm",
    elevated:
      "rounded-2xl border border-(--color-border) bg-(--color-surface) text-[var(--color-foreground)] shadow-md",
    flat:
      "rounded-2xl border border-transparent bg-(--color-surface-alt) text-[var(--color-foreground)]",
  };
  return variants[variant];
};

const getPaddingClasses = (padding: CardPadding): string => {
  const paddings: Record<CardPadding, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return paddings[padding];
};

export const Card = ({
  variant = "default",
  padding = "md",
  header,
  footer,
  children,
  className,
  onClick,
  hover = false,
}: CardProps) => {
  const isInteractive = Boolean(onClick);
  const hasHeader = header !== undefined && header !== null;
  const hasFooter = footer !== undefined && footer !== null;
  const paddingClass = getPaddingClasses(padding);
  const variantClass = getVariantClasses(variant);
  const baseInteractive = isInteractive
    ? "cursor-pointer text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)"
    : "";
  const hoverClass =
    isInteractive || hover ? "hover:shadow-lg hover:border-(--color-border)" : "";

  const Component = isInteractive ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cx(
        "w-full flex flex-col overflow-hidden transition-colors",
        variantClass,
        !hasHeader && !hasFooter && paddingClass,
        baseInteractive,
        hoverClass,
        className
      )}
      {...(isInteractive && { type: "button" })}
    >
      {hasHeader && (
        <div
          className={cx("border-b border-(--color-border)", paddingClass)}
        >
          {header}
        </div>
      )}

      <div
        className={cx("flex-1", (hasHeader || hasFooter) && paddingClass)}
      >
        {children}
      </div>

      {hasFooter && (
        <div
          className={cx("mt-auto border-t border-(--color-border)", paddingClass)}
        >
          {footer}
        </div>
      )}
    </Component>
  );
};
