import { cx } from "@/lib/cx";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onRemove?: () => void;
}

const getVariantClasses = (variant: BadgeVariant): string => {
  const variants: Record<BadgeVariant, string> = {
    default:
      "bg-[var(--color-button)] text-[var(--foreground)] border-[var(--color-border)]",
    primary:
      "bg-[var(--color-primary)] text-[var(--background)] border-[var(--color-primary)]",
    success:
      "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-800",
    warning:
      "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800",
    error:
      "bg-red-100 text-red-900 border-red-200 dark:bg-red-900/40 dark:text-red-100 dark:border-red-800",
    outline:
      "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]",
  };
  return variants[variant];
};

const getSizeClasses = (size: BadgeSize): string => {
  const sizes: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };
  return sizes[size];
};

export const Badge = ({
  variant = "default",
  size = "md",
  icon,
  children,
  className,
  onClick,
  onRemove,
}: BadgeProps) => {
  const isInteractive = Boolean(onClick) || Boolean(onRemove);

  const Component = isInteractive ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",

        getVariantClasses(variant),

        getSizeClasses(size),

        isInteractive && "cursor-pointer transition-all hover:scale-105",
        isInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",

        className
      )}
      {...(isInteractive && { type: "button" })}
    >
      {icon}
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full hover:bg-(--color-surface-alt) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
          aria-label="Remove"
          type="button"
        >
          <svg
            className="h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </Component>
  );
};
