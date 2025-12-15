"use client";

import { useState, useCallback } from "react";
import { cx } from "@/lib/cx";

export interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  copiedDuration?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
}

const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "-9999px";
  textArea.setAttribute("readonly", "");
  document.body.appendChild(textArea);

  try {
    textArea.select();
    const successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("execCommand copy failed");
    }
  } finally {
    document.body.removeChild(textArea);
  }
};

export const CopyButton = ({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  copiedDuration = 2000,
  size = "md",
  className,
  onCopy,
  onError,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      setError(null);
      await copyToClipboard(text);
      setCopied(true);
      onCopy?.();

      setTimeout(() => {
        setCopied(false);
      }, copiedDuration);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to copy";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));

      setTimeout(() => {
        setError(null);
      }, copiedDuration);
    }
  }, [text, copiedDuration, onCopy, onError]);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      aria-label={copied ? copiedLabel : label}
      aria-live="polite"
      className={cx(
        "inline-flex items-center gap-2 rounded-lg border font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : error
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-[var(--color-border)] bg-[var(--color-button)] text-[var(--foreground)] hover:bg-[var(--color-surface)]",
        copied && "cursor-default",
        sizeClasses[size],
        className
      )}
      type="button"
    >
      {copied ? (
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : error ? (
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
          <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
        </svg>
      )}
      <span>{copied ? copiedLabel : error ? "Error" : label}</span>
    </button>
  );
};
