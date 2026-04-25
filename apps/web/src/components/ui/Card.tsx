import { cx } from "@/lib/cx";

export type CardVariant = "default" | "bordered" | "elevated" | "flat" | "glass" | "premium";
export type CardPadding = "none" | "xs" | "sm" | "md" | "lg";

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
    // Default - Clean with subtle border
    default: [
      "bg-[var(--card)] rounded-2xl",
      "border border-[var(--border)]",
      "shadow-[var(--shadow-sm)]",
    ].join(" "),
    
    // Bordered - Primary accent border
    bordered: [
      "bg-[var(--card)] rounded-2xl",
      "border-2 border-[var(--primary)]/20",
      "shadow-[var(--shadow-sm)]",
    ].join(" "),
    
    // Elevated - Prominent shadow
    elevated: [
      "bg-[var(--card)] rounded-2xl",
      "border border-[var(--border)]",
      "shadow-[var(--shadow-md)]",
    ].join(" "),
    
    // Flat - No border, muted background
    flat: [
      "bg-[var(--surface-muted)] rounded-2xl",
      "border border-transparent",
    ].join(" "),
    
    // Glass - Glassmorphism effect
    glass: [
      "bg-[var(--glass-bg)] rounded-2xl",
      "border border-[var(--glass-border)]",
      "backdrop-blur-xl",
      "shadow-[var(--glass-shadow)]",
    ].join(" "),
    
    // Premium - Dark mode optimized with glow
    premium: [
      "bg-[var(--card)] rounded-2xl",
      "border border-[var(--primary)]/10",
      "shadow-[var(--shadow-lg)]",
      "relative overflow-hidden",
    ].join(" "),
  };
  return variants[variant];
};

const getPaddingClasses = (padding: CardPadding): string => {
  const paddings: Record<CardPadding, string> = {
    none: "",
    xs: "p-3",
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
    ? "cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
    : "";
  
  const hoverClass = (isInteractive || hover) 
    ? "hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 hover:border-[var(--primary)]/20" 
    : "";

  const Component = isInteractive ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cx(
        "w-full flex flex-col overflow-hidden",
        "will-change-transform",
        variantClass,
        !hasHeader && !hasFooter && paddingClass,
        baseInteractive,
        hoverClass,
        className
      )}
      {...(isInteractive && { type: "button" })}
    >
      {/* Premium card shine effect */}
      {variant === "premium" && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
          }}
        />
      )}
      
      {hasHeader && (
        <div className={cx("border-b border-[var(--border)]", paddingClass)}>
          {header}
        </div>
      )}

      <div className={cx("flex-1", (hasHeader || hasFooter) && paddingClass)}>
        {children}
      </div>

      {hasFooter && (
        <div className={cx("mt-auto border-t border-[var(--border)]", paddingClass)}>
          {footer}
        </div>
      )}
    </Component>
  );
};
