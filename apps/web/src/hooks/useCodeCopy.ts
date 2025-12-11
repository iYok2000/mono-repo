/**
 * useCodeCopy Hook
 *
 * React hook for copy-to-clipboard functionality with state management.
 * Provides visual feedback for copy operations.
 *
 * Security: Uses secure Clipboard API with proper error handling.
 */

'use client';

import { useState, useCallback } from 'react';

export interface UseCodeCopyOptions {
  /** Duration to show "copied" state in milliseconds */
  copiedDuration?: number;

  /** Callback when copy succeeds */
  onSuccess?: (text: string) => void;

  /** Callback when copy fails */
  onError?: (error: Error, text: string) => void;
}

/**
 * Copy text to clipboard securely
 *
 * Security: Uses navigator.clipboard.writeText (secure API).
 * Falls back to execCommand for older browsers.
 */
const copyToClipboard = async (text: string): Promise<void> => {
  // Modern Clipboard API (preferred)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn('Clipboard API failed, using fallback:', err);
    }
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);

  try {
    textArea.select();
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('execCommand copy failed');
    }
  } finally {
    document.body.removeChild(textArea);
  }
};

/**
 * Hook for copy-to-clipboard functionality
 *
 * @param options - Configuration options
 * @returns Copy state and function
 *
 * @example
 * const { copied, error, copyToClipboard } = useCodeCopy();
 *
 * <button onClick={() => copyToClipboard(codeString)}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 */
export const useCodeCopy = (options: UseCodeCopyOptions = {}) => {
  const { copiedDuration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Copy text to clipboard with state management
   */
  const copy = useCallback(
    async (text: string) => {
      // Input validation
      if (!text || typeof text !== 'string') {
        const err = new Error('Invalid text to copy');
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

        // Reset copied state after duration
        setTimeout(() => {
          setCopied(false);
        }, copiedDuration);

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to copy';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage), text);

        // Clear error after duration
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

  /**
   * Reset state manually
   */
  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    /** Is text currently copied? */
    copied,

    /** Error message if copy failed */
    error,

    /** Is copy operation in progress? */
    isLoading,

    /** Copy text to clipboard */
    copyToClipboard: copy,

    /** Reset state */
    reset,
  };
};
