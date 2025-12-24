"use client";

import { useState } from "react";

interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
}

/**
 * CodeExample - Display code with syntax highlighting and copy button
 * Security: Content is sanitized on backend before storage
 */
export function CodeExample({ code, language = "typescript", title }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!code) return null;

  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-t-md">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-gray-400">{language}</span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            copied
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600 opacity-0 group-hover:opacity-100"
          }`}
          type="button"
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </span>
          )}
        </button>

        <pre
          className={`p-4 ${title ? "" : "rounded-t-md"} rounded-b-md bg-gray-900 text-gray-100 overflow-x-auto text-sm leading-relaxed`}
          style={{ maxHeight: "500px" }}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
