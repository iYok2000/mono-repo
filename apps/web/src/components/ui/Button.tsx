import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "large" | "small" | "pill" | "link" | "ghost";
export type ButtonSize = "default" | "small" | "large";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  children: React.ReactNode;
}

const getVariantClasses = (variant: ButtonVariant): string => {
  const variants: Record<ButtonVariant, string> = {
    // Primary Button (Main CTA) - Premium feel with glow
    primary: [
      "bg-[var(--primary)] text-white border-none",
      "hover:bg-[var(--primary-hover)] hover:-translate-y-0.5",
      "active:translate-y-0 active:scale-[0.98]",
      "py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium",
      "shadow-[0_4px_14px_rgba(16,185,129,0.25)]",
      "hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)]",
    ].join(" "),
    
    // Secondary Button (Outline) - Clean and subtle
    secondary: [
      "bg-[var(--surface)] text-[var(--foreground)]",
      "border border-[var(--border)]",
      "hover:border-[var(--border-hover)] hover:bg-[var(--surface-muted)]",
      "active:scale-[0.98]",
      "py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium",
    ].join(" "),
    
    // Ghost Button - Minimal
    ghost: [
      "bg-transparent text-[var(--muted)]",
      "hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
      "active:scale-[0.98]",
      "py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium",
    ].join(" "),
    
    // Large Button (Hero CTA) - Bold and prominent
    large: [
      "bg-[var(--primary)] text-white border-none",
      "hover:bg-[var(--primary-hover)] hover:-translate-y-1",
      "active:translate-y-0 active:scale-[0.98]",
      "py-4 px-8 rounded-2xl text-base font-semibold min-w-[200px]",
      "shadow-[0_8px_30px_rgba(16,185,129,0.3)]",
      "hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)]",
    ].join(" "),
    
    // Small Button (Product Card) - Compact
    small: [
      "bg-[var(--foreground)] text-[var(--card)]",
      "hover:bg-[var(--foreground-hover)]",
      "active:scale-[0.98]",
      "py-2 px-4 rounded-lg text-sm font-medium",
    ].join(" "),
    
    // Pill/Badge Button - Rounded
    pill: [
      "bg-[var(--surface)] text-[var(--muted)]",
      "border border-[var(--border)]",
      "hover:border-[var(--primary)]/50 hover:text-[var(--primary)]",
      "py-1.5 px-4 rounded-full text-[0.8125rem] font-medium",
    ].join(" "),
    
    // Link Button (Text Link) - Minimal with animation
    link: [
      "bg-transparent text-[var(--primary)] border-none",
      "hover:gap-2",
      "text-[0.9375rem] font-medium p-0",
      "underline-offset-4 hover:underline",
    ].join(" "),
  };
  return variants[variant];
};

const getSizeClasses = (size: ButtonSize): string => {
  // Size is now primarily controlled by variant, but this allows override if needed
  const sizes: Record<ButtonSize, string> = {
    default: "",
    small: "text-sm py-2 px-4",
    large: "text-base py-4 px-8",
  };
  return sizes[size];
};

export const Button = ({
  variant = "primary",
  size = "default",
  loading = false,
  fullWidth = false,
  icon,
  iconAfter,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const isLinkVariant = variant === "link";

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={cx(
        // Base styles with GPU acceleration
        "inline-flex items-center justify-center cursor-pointer",
        "transition-all duration-200 ease-out",
        "will-change-transform",
        
        // Gap handling
        isLinkVariant ? "gap-1" : "gap-2",
        
        // Focus states - accessible ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",

        // Variant styles
        getVariantClasses(variant),

        // Size overrides
        size !== "default" && getSizeClasses(size),

        // Disabled state
        isDisabled && "cursor-not-allowed opacity-50 pointer-events-none",

        // Full width
        fullWidth && "w-full",

        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className={cx(
            "animate-spin",
            variant === "small" || variant === "pill" ? "h-3.5 w-3.5" : "h-4 w-4"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && (
        <span className={cx(
          "inline-flex items-center text-current",
          variant === "link" ? "w-4 h-4" : "w-[18px] h-[18px]"
        )}>
          {icon}
        </span>
      )}
      {children}
      {!loading && iconAfter && (
        <span className={cx(
          "inline-flex items-center text-current",
          variant === "link" ? "w-4 h-4" : "w-[18px] h-[18px]"
        )}>
          {iconAfter}
        </span>
      )}
    </button>
  );
};
