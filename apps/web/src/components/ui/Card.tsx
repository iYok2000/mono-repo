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
      "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm text-[var(--color-foreground)]",
    bordered:
      "rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-foreground)]",
    elevated:
      "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg text-[var(--color-foreground)]",
    flat: "rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-foreground)]",
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

  const Component = isInteractive ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cx(
        "w-full",

        getVariantClasses(variant),

        !hasHeader && !hasFooter && getPaddingClasses(padding),

        isInteractive && "cursor-pointer text-left transition-all",
        (isInteractive || hover) && "hover:-translate-y-1 hover:shadow-xl",
        isInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)",

        className
      )}
      {...(isInteractive && { type: "button" })}
    >
      {hasHeader && (
        <div
          className={cx(
            "border-b border-(--color-border)",
            getPaddingClasses(padding)
          )}
        >
          {header}
        </div>
      )}

      <div
        className={cx((hasHeader || hasFooter) && getPaddingClasses(padding))}
      >
        {children}
      </div>

      {hasFooter && (
        <div
          className={cx(
            "border-t border-(--color-border)",
            getPaddingClasses(padding)
          )}
        >
          {footer}
        </div>
      )}
    </Component>
  );
};
