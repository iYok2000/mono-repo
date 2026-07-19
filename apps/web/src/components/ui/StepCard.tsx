import { LucideIcon } from "lucide-react";

export interface StepCardProps {
  /** Step number (1, 2, 3, etc.) */
  number: number;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Optional Lucide icon component. Omit to render the card without an icon. */
  icon?: LucideIcon;
  /** Optional delay for staggered animation (in ms) */
  delay?: number;
}

export function StepCard({ number, title, description, icon: Icon, delay = 0 }: StepCardProps) {
  return (
    <div
      className="step-card relative overflow-hidden transition-all duration-300 ease-out bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 hover:-translate-y-2 hover:border-[var(--primary)]/50 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animation: 'fadeInUp 0.8s ease-out forwards',
      }}
    >
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-gradient-to-br from-[var(--primary-soft)] to-transparent rounded-bl-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Large gradient number */}
        <div 
          className="text-[3.5rem] leading-none font-bold mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent"
          style={{ letterSpacing: '-0.02em' }}
        >
          {number}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          {description}
        </p>

        {/* Icon (only when provided) */}
        {Icon && (
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--primary-soft)] rounded-xl mt-6">
            <Icon className="w-6 h-6 text-[var(--primary)]" />
          </div>
        )}
      </div>
    </div>
  );
}
