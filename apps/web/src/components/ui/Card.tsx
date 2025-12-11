/**
 * Card Component
 *
 * Base card component following existing design patterns.
 * Provides consistent styling for content containers.
 *
 * Security: Safe HTML rendering, no dangerouslySetInnerHTML.
 * Accessibility: Semantic HTML with proper heading hierarchy.
 */

import { cx } from "@/lib/cx";

export type CardVariant = "default" | "bordered" | "elevated" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  /** Card visual variant */
  variant?: CardVariant;

  /** Padding size */
  padding?: CardPadding;

  /** Optional header */
  header?: React.ReactNode;

  /** Optional footer */
  footer?: React.ReactNode;

  /** Main content */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /** Make card interactive (clickable) */
  onClick?: () => void;

  /** Hover effect */
  hover?: boolean;
}

/**
 * Get variant-specific classes
 */
const getVariantClasses = (variant: CardVariant): string => {
  const variants: Record<CardVariant, string> = {
    default:
      "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm text-[var(--color-foreground)]",
    bordered:
      "rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-foreground)]",
    elevated:
      "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg text-[var(--color-foreground)]",
    flat:
      "rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-foreground)]",
  };
  return variants[variant];
};

/**
 * Get padding-specific classes
 */
const getPaddingClasses = (padding: CardPadding): string => {
  const paddings: Record<CardPadding, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return paddings[padding];
};

/**
 * Card Component
 *
 * @example
 * <Card header={<h3>Title</h3>}>
 *   <p>Content goes here</p>
 * </Card>
 *
 * @example
 * <Card variant="elevated" hover onClick={handleClick}>
 *   <p>Clickable card</p>
 * </Card>
 */
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

  const Component = isInteractive ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cx(
        // Base styles
        "w-full",

        // Variant styles
        getVariantClasses(variant),

        // Padding (only if no header/footer, otherwise use section padding)
        !header && !footer && getPaddingClasses(padding),

        // Interactive styles
        isInteractive && "cursor-pointer text-left transition-all",
        (isInteractive || hover) && "hover:-translate-y-1 hover:shadow-xl",
        isInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",

        // Custom className
        className
      )}
      {...(isInteractive && { type: "button" })}
    >
      {header && (
        <div
          className={cx(
            "border-b border-[var(--color-border)]",
            getPaddingClasses(padding)
          )}
        >
          {header}
        </div>
      )}

      <div className={cx((header || footer) && getPaddingClasses(padding))}>
        {children}
      </div>

      {footer && (
        <div
          className={cx(
            "border-t border-[var(--color-border)]",
            getPaddingClasses(padding)
          )}
        >
          {footer}
        </div>
      )}
    </Component>
  );
};
