import { ReactNode } from "react";

interface BodyLayoutProps {
  children: ReactNode;
  variant?: "default" | "wide" | "compact" | "full";
}

export function BodyLayout({ children, variant = "default" }: BodyLayoutProps) {
  const paddingClasses = {
    default: "px-4 lg:px-6",
    wide: "px-6 lg:px-8",
    compact: "px-3 lg:px-4",
    full: "p-0",
  };

  return (
    <div className={`w-full ${paddingClasses[variant]}`}>
      {children}
    </div>
  );
}
