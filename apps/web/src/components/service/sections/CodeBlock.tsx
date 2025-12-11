'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

interface CodeBlockProps {
  code: string;
  language: 'typescript' | 'tsx' | 'json';
  filename?: string;
}

export const CodeBlock = ({ code, language, filename }: CodeBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split('\n');
  const shouldTruncate = lines.length > 20;
  const displayedCode = shouldTruncate && !isExpanded
    ? lines.slice(0, 20).join('\n') + '\n...'
    : code;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2">
          <span className="text-sm font-medium text-zinc-700">{filename}</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600">
              {language}
            </span>
            <CopyButton text={code} size="sm" />
          </div>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4">
          <code className="text-sm text-zinc-800">{displayedCode}</code>
        </pre>
        {!filename && (
          <div className="absolute right-2 top-2">
            <CopyButton text={code} size="sm" />
          </div>
        )}
      </div>
      {shouldTruncate && (
        <div className="border-t border-zinc-200 bg-white px-4 py-2 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : `Show All (${lines.length} lines)`}
          </button>
        </div>
      )}
    </div>
  );
};
