# Utility Functions

> Last updated: 2026-04-28

## What
Reusable utils and hooks: markdown rendering, scroll tracking, error mapping (Thai), product helpers, CSV export.

## Where

| Utility | Path | Purpose |
|---------|------|---------|
| Markdown | `utils/markdown.ts` | Regex-based MD→HTML with Map cache (memoized) |
| Scroll tracking | `hooks/useScrollTracking.ts` | `useScrollProgress()` + `useActiveSection()`, throttled, passive listeners |
| Error mapper | `app/admin/product/_utils/errorMapper.ts` | Backend error codes → Thai messages, field-level errors |
| Product helpers | `app/product/_utils/toolkitHelpers.ts` | Category ID→name, group by category |
| CSV export | `services/export/utils.ts` | RFC 4180 CSV, UTF-8 BOM for Excel Thai support |

## Key Patterns
- **Markdown cache**: in-memory `Map<string, string>` — prevents re-render of same content
- **Scroll hooks**: `requestAnimationFrame` throttle, passive event listeners, auto-cleanup
- **Error mapping**: centralized `Record<string, string>` for error codes → Thai UX messages
- **CSV**: escapes quotes/commas/newlines, injects BOM `\uFEFF` for Thai chars in Excel
