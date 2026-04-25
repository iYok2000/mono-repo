import { cx } from "@/lib/cx";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "violet"
  | "glow";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onRemove?: () => void;
  pulse?: boolean;
}

const getVariantClasses = (variant: BadgeVariant): string => {
  const variants: Record<BadgeVariant, string> = {
    default: [
      "bg-[var(--surface-muted)] text-[var(--foreground)]",
      "border border-[var(--border)]",
    ].join(" "),
    
    primary: [
      "bg-[var(--primary-soft)] text-[var(--primary)]",
      "border border-[var(--primary)]/20",
    ].join(" "),
    
    success: [
      "bg-[rgba(16,185,129,0.1)] text-[var(--success)]",
      "border border-[var(--success)]/20",
    ].join(" "),
    
    warning: [
      "bg-[rgba(251,191,36,0.1)] text-[var(--warning)]",
      "border border-[var(--warning)]/20",
    ].join(" "),
    
    error: [
      "bg-[rgba(239,68,68,0.1)] text-[var(--error)]",
      "border border-[var(--error)]/20",
    ].join(" "),
    
    violet: [
      "bg-[rgba(139,92,246,0.1)] text-[var(--violet)]",
      "border border-[var(--violet)]/20",
    ].join(" "),
    
    outline: [
      "bg-transparent text-[var(--muted)]",
      "border border-[var(--border)]",
    ].join(" "),
    
    glow: [
      "bg-[var(--primary)] text-white",
      "border border-transparent",
      "shadow-[0_0_12px_var(--byte-glow)]",
    ].join(" "),
  };
  return variants[variant];
};

const getSizeClasses = (size: BadgeSize): string => {
  const sizes: Record<BadgeSize, string> = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-0.5 text-xs",
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
  pulse = false,
}: BadgeProps) => {
  const isInteractive = Boolean(onClick) || Boolean(onRemove);

  const Component = isInteractive ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        "transition-all duration-150",

        getVariantClasses(variant),
        getSizeClasses(size),

        isInteractive && "cursor-pointer hover:scale-105 active:scale-100",
        isInteractive && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2",
        
        pulse && "animate-pulse",

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
