"use client";

import * as React from "react";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, className = "", ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
          rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
          disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? "bg-green-500 focus:ring-green-500" : "bg-red-500 focus:ring-red-500"}
          ${className}
        `}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 
            transform rounded-full bg-white shadow-lg ring-0 
            transition-transform duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
