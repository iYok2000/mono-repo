import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "large" | "small" | "pill" | "link";
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
    // Primary Button (Main CTA) - Height: 44px
    primary:
      "bg-[var(--primary)] text-[var(--card)] border-none hover:bg-[var(--primary-hover)] active:bg-[var(--primary-hover)] py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium",
    
    // Secondary Button (Outline) - Height: 44px
    secondary:
      "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] py-3.5 px-6 rounded-xl text-[0.9375rem] font-medium",
    
    // Large Button (Hero CTA) - Height: 56px
    large:
      "bg-[var(--primary)] text-[var(--card)] border-none hover:bg-[var(--primary-hover)] py-3.5 px-8 rounded-xl text-[0.9375rem] font-medium min-w-[200px]",
    
    // Small Button (Product Card) - Height: 36px
    small:
      "bg-[var(--foreground)] text-[var(--card)] border-none hover:bg-[var(--foreground-hover)] py-2 px-4 rounded-lg text-sm font-medium",
    
    // Pill/Badge Button - Height: 32px
    pill:
      "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] py-1.5 px-3.5 rounded-full text-[0.8125rem] font-medium",
    
    // Link Button (Text Link)
    link:
      "bg-transparent text-[var(--primary)] border-none hover:gap-2 text-[0.9375rem] font-medium p-0",
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
        "inline-flex items-center justify-center transition-all duration-150 ease-in-out cursor-pointer",
        // Special gap handling for link variant (animated)
        isLinkVariant ? "gap-1" : "gap-2",
        
        // Focus states
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",

        getVariantClasses(variant),

        // Only apply size classes if size is not default
        size !== "default" && getSizeClasses(size),

        isDisabled && "cursor-not-allowed opacity-60",

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
