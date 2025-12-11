/**
 * Button Component
 *
 * Reusable button component with multiple variants and sizes.
 * Follows existing Tailwind patterns from the codebase.
 *
 * Security: React auto-escapes all content. Type-safe props prevent misuse.
 * Accessibility: Proper ARIA attributes, keyboard navigation support.
 */

import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Is the button in a loading state? */
  loading?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Icon to display before text */
  icon?: React.ReactNode;

  /** Icon to display after text */
  iconAfter?: React.ReactNode;

  /** Children content */
  children: React.ReactNode;
}

/**
 * Get variant-specific classes
 */
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--background)] border-[var(--color-primary)] hover:opacity-90",
    secondary:
      "bg-[var(--color-button)] text-[var(--foreground)] border-[var(--color-border)] hover:bg-[var(--color-surface)]",
    outline:
      "bg-transparent text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-surface-alt)]",
    ghost:
      "bg-transparent text-[var(--color-muted)] border-transparent hover:bg-[var(--color-surface-alt)]",
  };
  return variants[variant];
};

/**
 * Get size-specific classes
 */
const getSizeClasses = (size: ButtonSize): string => {
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return sizes[size];
};

/**
 * Reusable Button Component
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * @example
 * <Button variant="outline" loading disabled>
 *   Loading...
 * </Button>
 */
export const Button = ({
  variant = "primary",
  size = "md",
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

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={cx(
        // Base styles
        "inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",

        // Variant styles
        getVariantClasses(variant),

        // Size styles
        getSizeClasses(size),

        // State styles
        isDisabled && "cursor-not-allowed opacity-60",
        !isDisabled && "hover:-translate-y-0.5 hover:shadow-md",

        // Full width
        fullWidth && "w-full",

        // Custom className
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
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
      {!loading && icon}
      {children}
      {!loading && iconAfter}
    </button>
  );
};
