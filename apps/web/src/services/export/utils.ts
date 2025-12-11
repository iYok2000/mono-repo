export const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const stringValue =
    typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "boolean"
      ? String(value)
      : JSON.stringify(value);

  const needsQuotes = /[",\n]/.test(stringValue);
  const escaped = stringValue.replace(/"/g, '""');

  return needsQuotes ? `"${escaped}"` : escaped;
};

export const generateFilename = (
  prefix: string = 'export',
  extension: string = 'csv'
): string => {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.${extension}`;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const addUtf8Bom = (content: string): string => {
  return '\uFEFF' + content;
};
