"use client";

import { useState } from "react";

interface ContentEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  rows?: number;
  helpText?: string;
  required?: boolean;
}

/**
 * ContentEditor - Textarea with markdown support and character count
 * Security: All content is sanitized on backend, this is just the input UI
 */
export function ContentEditor({
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
  maxLength,
  rows = 10,
  helpText,
  required = false,
}: ContentEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const characterCount = value.length;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  // Simple markdown preview (basic implementation)
  const renderMarkdownPreview = (text: string) => {
    if (!text) return "<p class='text-(--color-muted)'>No content</p>";

    // Basic markdown rendering (for preview only - NOT used for final display)
    // Final rendering will use a proper markdown library
    let html = text;

    // Headers
    html = html.replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2 class='text-xl font-semibold mt-6 mb-3'>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-8 mb-4'>$1</h1>");

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Lists
    html = html.replace(/^- (.+)$/gm, "<li class='ml-4'>• $1</li>");
    html = html.replace(/(<li.*<\/li>\n?)+/g, "<ul class='my-2'>$&</ul>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-(--color-primary) hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>");

    // Line breaks
    html = html.replace(/\n/g, "<br/>");

    return html;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs px-2 py-1 rounded border border-(--color-border) hover:bg-(--color-surface) transition-colors"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {helpText && (
        <p className="text-xs text-(--color-muted)">{helpText}</p>
      )}

      {showPreview ? (
        <div
          className="min-h-[200px] p-4 rounded-md border border-(--color-border) bg-(--color-surface) prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-4 py-3 rounded-md border ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-(--color-border) focus:ring-(--color-primary)"
          } focus:outline-none focus:ring-2 bg-background font-mono text-sm`}
          style={{ resize: "vertical" }}
        />
      )}

      <div className="flex items-center justify-between text-xs">
        <div>
          {error && <span className="text-red-500">{error}</span>}
        </div>
        <div className={`${isOverLimit ? "text-red-500" : "text-(--color-muted)"}`}>
          {characterCount}
          {maxLength && ` / ${maxLength}`}
        </div>
      </div>

      {!showPreview && (
        <div className="text-xs text-(--color-muted) space-y-1 bg-(--color-surface) p-3 rounded border border-(--color-border)">
          <p className="font-semibold text-foreground mb-2">รองรับ Markdown:</p>
          <ul className="ml-4 space-y-1">
            <li className="text-foreground">• <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-mono"># หัวข้อ</code> สำหรับหัวเรื่อง</li>
            <li className="text-foreground">• <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-mono">**ตัวหนา**</code> สำหรับตัวหนา</li>
            <li className="text-foreground">• <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-mono">*ตัวเอียง*</code> สำหรับตัวเอียง</li>
            <li className="text-foreground">• <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-mono">- รายการ</code> สำหรับรายการแบบจุด</li>
            <li className="text-foreground">• <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-mono">[ข้อความ](url)</code> สำหรับลิงก์</li>
          </ul>
        </div>
      )}
    </div>
  );
}
