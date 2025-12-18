import { Suspense } from "react";

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

export const LoadingFallback = ({
  message = "กำลังโหลด...",
  className = "",
}: LoadingFallbackProps) => {
  return (
    <div
      className={`flex items-center justify-center min-h-[60vh] ${className}`}
    >
      <div className="text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--color-primary) border-r-transparent"></div>
        <p className="text-(--color-muted)">{message}</p>
      </div>
    </div>
  );
};

export const PageSuspense = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>{children}</Suspense>
  );
};
