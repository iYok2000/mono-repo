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
  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm " +
    "placeholder:text-muted-foreground/60 shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary " +
    "hover:border-primary/40 transition-all duration-200";

  if (type === "checkbox") {
    const checked = typeof value === "boolean" ? value : false;
    return (
      <label
        className={
          "flex items-center gap-3 py-3 px-4 rounded-xl border cursor-pointer transition-all duration-200 " +
          (checked
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-card hover:border-primary/30")
        }
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded-md border-border text-primary focus:ring-2 focus:ring-primary/40 accent-(--color-primary)"
        />
        <span className="text-sm font-medium text-foreground select-none">{label}</span>
        {helperText && (
          <span className="text-xs text-muted-foreground ml-auto">{helperText}</span>
        )}
      </label>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses + " resize-y leading-relaxed"}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
        />
      )}

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
