/**
 * Markdown rendering utility with simple memoization
 * Converts markdown text to HTML with custom styling
 */

const markdownCache = new Map<string, string>();

/**
 * Renders markdown to HTML with custom Tailwind classes
 * Uses memoization to avoid re-rendering the same content
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";

  // Check cache first
  if (markdownCache.has(text)) {
    return markdownCache.get(text)!;
  }

  let html = text;

  // Headers (smaller sizes for compact reading)
  html = html.replace(
    /^### (.+)$/gm,
    "<h3 class='text-base font-semibold mt-4 mb-2 text-(--color-foreground) border-b border-(--color-border) pb-1.5'>$1</h3>"
  );
  html = html.replace(
    /^## (.+)$/gm,
    "<h2 class='text-lg font-bold mt-5 mb-2.5 text-(--color-foreground) border-b border-(--color-border) pb-1.5'>$1</h2>"
  );
  html = html.replace(
    /^# (.+)$/gm,
    "<h1 class='text-xl font-bold mt-6 mb-3 text-(--color-foreground)'>$1</h1>"
  );

  // Code blocks
  html = html.replace(
    /```([^`]+)```/g,
    "<pre class='bg-gray-50 dark:bg-gray-900 border border-(--color-border) rounded-lg p-2 overflow-x-auto my-2'><code class='text-xs text-(--color-foreground)'>$1</code></pre>"
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    "<code class='bg-gray-100 dark:bg-gray-800 border border-(--color-border) rounded px-1 py-0.5 text-xs text-red-600 dark:text-red-400 font-mono'>$1</code>"
  );

  // Bold and italic
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    "<strong class='font-bold text-(--color-foreground)'>$1</strong>"
  );
  html = html.replace(
    /\*(.+?)\*/g,
    "<em class='italic text-blue-600 dark:text-blue-400'>$1</em>"
  );

  // Lists
  html = html.replace(
    /^- (.+)$/gm,
    "<li class='ml-4 text-(--color-foreground) leading-snug'>$1</li>"
  );
  html = html.replace(
    /(<li.*<\/li>\n?)+/g,
    "<ul class='my-1.5 list-disc list-inside marker:text-(--color-primary)'>$&</ul>"
  );

  // Links with external icon
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    "<a href='$2' class='text-(--color-primary) hover:text-(--color-secondary) font-medium underline decoration-2 underline-offset-2 transition-colors' target='_blank' rel='noopener noreferrer'>$1 <svg class='inline w-3 h-3 ml-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'/></svg></a>"
  );

  // Paragraphs (double line breaks)
  html = html.replace(
    /\n\n/g,
    "</p><p class='mb-2 text-(--color-foreground) leading-relaxed text-sm'>"
  );
  html = `<p class='mb-2 text-(--color-foreground) leading-relaxed text-sm'>${html}</p>`;

  // Single line breaks
  html = html.replace(/\n/g, "<br/>");

  // Cache the result
  markdownCache.set(text, html);

  return html;
}

/**
 * Clears the markdown cache (useful if memory is a concern)
 */
export function clearMarkdownCache(): void {
  markdownCache.clear();
}
