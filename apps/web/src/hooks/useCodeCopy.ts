"use client";

import { useState, useCallback } from "react";

export interface UseCodeCopyOptions {
  copiedDuration?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: Error, text: string) => void;
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

export const useCodeCopy = (options: UseCodeCopyOptions = {}) => {
  const { copiedDuration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!text || typeof text !== "string") {
        const err = new Error("Invalid text to copy");
        setError(err.message);
        onError?.(err, text);
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        await copyToClipboard(text);

        setCopied(true);
        onSuccess?.(text);

        setTimeout(() => {
          setCopied(false);
        }, copiedDuration);

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to copy";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage), text);

        setTimeout(() => {
          setError(null);
        }, copiedDuration);

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [copiedDuration, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    copied,
    error,
    isLoading,
    copyToClipboard: copy,
    reset,
  };
};
