"use client";

import { useEffect } from "react";
import { cx } from "@/lib/cx";

export type ModalType = "success" | "error" | "warning" | "info";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const MODAL_STYLES = {
  success: {
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconColor: "text-[var(--color-primary)]",
    iconBg: "bg-[var(--color-primary)]/10",
    buttonBg: "bg-[var(--color-primary)] hover:opacity-90",
  },
  error: {
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonBg: "bg-red-600 dark:bg-red-500 hover:opacity-90",
  },
  warning: {
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    buttonBg: "bg-orange-600 dark:bg-orange-500 hover:opacity-90",
  },
  info: {
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconColor: "text-[var(--color-secondary)]",
    iconBg: "bg-[var(--color-secondary)]/10",
    buttonBg: "bg-[var(--color-secondary)] hover:opacity-90",
  },
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
  onConfirm,
  showCancel = false,
}: ModalProps) => {
  const style = MODAL_STYLES[type];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-(--color-surface) shadow-lg border border-(--color-border)">
          <div className="flex flex-col items-center px-6 pt-8 pb-4">
            <div className={cx(
              "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
              style.iconBg,
              style.iconColor
            )}>
              {style.icon}
            </div>
            
            <h3 className="text-center text-xl font-bold text-foreground">
              {title}
            </h3>
            
            <p className="mt-2 text-center text-sm text-(--color-muted)">
              {message}
            </p>
          </div>

          <div className="flex gap-3 px-6 pb-6">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-(--color-surface-alt)"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={cx(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity",
                style.buttonBg
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
