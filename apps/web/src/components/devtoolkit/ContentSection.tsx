import { memo } from "react";
import { renderMarkdown } from "@/utils/markdown";
import { CodeExample } from "@/components/admin/CodeExample";

interface ContentSectionProps {
  id: string;
  title: string;
  icon: string;
  content: string | undefined;
  isCodeExample?: boolean;
}

/**
 * Reusable section component for toolkit detail page
 * Memoized to prevent unnecessary re-renders
 */
export const ContentSection = memo(function ContentSection({
  id,
  title,
  icon,
  content,
  isCodeExample = false,
}: ContentSectionProps) {
  if (!content) return null;

  return (
    <section data-section={id} className="scroll-mt-24 mt-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-bold text-foreground m-0">{title}</h2>
      </div>
      <div className="h-0.5 w-12 bg-linear-to-r from-(--color-primary) to-(--color-secondary) rounded-full mb-2.5" />

      {isCodeExample ? (
        <div className="not-prose">
          <CodeExample code={content} title="Code Example" />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      )}
    </section>
  );
});
