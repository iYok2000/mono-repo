import { useState } from "react";

interface ContentFieldProps {
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  helperText?: string;
  type?: "text" | "checkbox";
}

export function ContentField({
  label,
  value,
  onChange,
  placeholder = "",
  multiline = false,
  rows = 3,
  required = false,
  helperText,
  type = "text",
}: ContentFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = `
    w-full px-4 py-2.5 rounded-lg
    border border-border bg-card text-foreground
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all duration-200
    ${isFocused ? "ring-2 ring-primary" : ""}
  `;

  if (type === "checkbox") {
    return (
      <div className="flex items-center space-x-3 py-2">
        <input
          type="checkbox"
          checked={typeof value === "boolean" ? value : false}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
        />
        <label className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
        {helperText && (
          <span className="text-xs text-muted-foreground ml-2">({helperText})</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
      )}
      
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
