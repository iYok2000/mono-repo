import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface PreviewSectionProps {
  children: ReactNode;
}

export const PreviewSection = ({ children }: PreviewSectionProps) => {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-bold uppercase tracking-wide text-zinc-900">
        1. Live Preview
      </h2>
      <div className="space-y-4">{children}</div>
    </Card>
  );
};
