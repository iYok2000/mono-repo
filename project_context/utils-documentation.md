# Utility Functions Documentation

> รวมเอกสาร utility functions ทั้งหมดที่ใช้ใน web application

## 📂 Directory Structure

```
apps/web/src/
├── utils/                                    # Global utilities
│   └── markdown.ts                          # Markdown rendering
├── hooks/                                    # Custom React hooks
│   └── useScrollTracking.ts                 # Scroll tracking hooks
├── app/
│   ├── admin/devtoolkit/_utils/
│   │   └── errorMapper.ts                   # Error mapping
│   └── dev-toolkit/_utils/
│       └── toolkitHelpers.ts                # Toolkit helpers
└── services/export/
    └── utils.ts                             # Export/CSV utilities
```

---

## 🎨 Markdown Utilities

**Location**: [`apps/web/src/utils/markdown.ts`](../apps/web/src/utils/markdown.ts)

### renderMarkdown()

Converts markdown text to HTML with custom Tailwind styling. Uses **memoization** to cache results and avoid re-rendering the same content.

**Features**:
- ✅ Headers (`#`, `##`, `###`)
- ✅ Code blocks (` ``` `) and inline code (`` ` ``)
- ✅ Bold (`**text**`) and italic (`*text*`)
- ✅ Lists (`- item`)
- ✅ Links with external icon
- ✅ Paragraph formatting
- ✅ **Memoization** - caches rendered HTML for performance

**Usage**:
```tsx
import { renderMarkdown } from "@/utils/markdown";

const htmlContent = renderMarkdown("# Hello\n\nThis is **bold** text");

<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

**Performance**:
- First render: ~5-10ms (depending on content length)
- Cached renders: <1ms (instant)
- Cache is stored in-memory using `Map`

### clearMarkdownCache()

Clears the markdown rendering cache. Use if memory is a concern or you need to force re-rendering.

```tsx
import { clearMarkdownCache } from "@/utils/markdown";

clearMarkdownCache(); // Clears all cached markdown
```

---

## 🎣 Custom Hooks

**Location**: [`apps/web/src/hooks/useScrollTracking.ts`](../apps/web/src/hooks/useScrollTracking.ts)

### useScrollProgress()

Tracks scroll progress as percentage (0-100). Useful for progress bars.

**Features**:
- ✅ Throttled to 100ms (prevents excessive re-renders)
- ✅ Passive event listener (better performance)
- ✅ Auto-cleanup on unmount

**Usage**:
```tsx
import { useScrollProgress } from "@/hooks/useScrollTracking";

function ProgressBar() {
  const scrollProgress = useScrollProgress();

  return (
    <div className="h-1 bg-primary" style={{ width: `${scrollProgress}%` }} />
  );
}
```

### useActiveSection()

Detects which section is currently active based on scroll position.

**Parameters**:
- `offset` (default: `150`) - Pixels from top to trigger section change

**Usage**:
```tsx
import { useActiveSection } from "@/hooks/useScrollTracking";

function TableOfContents() {
  const activeSection = useActiveSection(150);

  return (
    <nav>
      <a className={activeSection === "intro" ? "active" : ""}>
        Introduction
      </a>
    </nav>
  );
}
```

### useScrollTracking()

Combined hook for both scroll progress and active section. **More efficient** than using both hooks separately.

**Usage**:
```tsx
import { useScrollTracking } from "@/hooks/useScrollTracking";

function Page() {
  const { scrollProgress, activeSection } = useScrollTracking();

  return (
    <>
      <ProgressBar progress={scrollProgress} />
      <TOC activeSection={activeSection} />
    </>
  );
}
```

**Performance**:
- Single scroll listener (vs 2 separate listeners)
- Single throttle function
- Reduced re-renders

---

## 🚨 Error Mapping

**Location**: [`apps/web/src/app/admin/devtoolkit/_utils/errorMapper.ts`](../apps/web/src/app/admin/devtoolkit/_utils/errorMapper.ts)

### mapToolkitError()

Maps backend error codes/messages to user-friendly Thai messages.

**Supported error codes**:
- `VALIDATION_ERROR` → detailed validation messages
- `DUPLICATE_ENTRY` → "รหัสนี้มีอยู่ในระบบแล้ว"
- `NOT_FOUND` → "ไม่พบข้อมูลที่ต้องการแก้ไข"
- `FOREIGN_KEY_CONSTRAINT` → "ไม่สามารถลบได้ เนื่องจากมีข้อมูลอื่นที่เชื่อมโยงอยู่"

**Usage**:
```tsx
import { mapToolkitError } from "@/app/admin/devtoolkit/_utils/errorMapper";

try {
  await createToolkit(data);
} catch (error) {
  const userMessage = mapToolkitError(error);
  toast.error(userMessage); // แสดง error ภาษาไทยที่เข้าใจง่าย
}
```

### getFieldError()

Gets specific field error for form validation.

**Usage**:
```tsx
import { getFieldError } from "@/app/admin/devtoolkit/_utils/errorMapper";

try {
  await updateToolkit(id, data);
} catch (error) {
  const titleError = getFieldError(error, "title");
  if (titleError) {
    setFieldError("title", titleError);
  }
}
```

---

## 🧰 Toolkit Helpers

**Location**: [`apps/web/src/app/dev-toolkit/_utils/toolkitHelpers.ts`](../apps/web/src/app/dev-toolkit/_utils/toolkitHelpers.ts)

### mapToolkitsWithCategories()

Maps category names to toolkits and resolves category IDs.

**Features**:
- Matches by `id`, `name_en`, or `name_th`
- Adds `category_name` and `category_id_matched`
- Fallback to "อื่นๆ" if category not found

**Usage**:
```tsx
import { mapToolkitsWithCategories } from "@/app/dev-toolkit/_utils/toolkitHelpers";

const toolkitsWithCategories = mapToolkitsWithCategories(toolkits, categories);
```

### groupToolkitsByCategory()

Groups toolkits by category name. Ensures unique categories only.

**Usage**:
```tsx
import { groupToolkitsByCategory } from "@/app/dev-toolkit/_utils/toolkitHelpers";

const grouped = groupToolkitsByCategory(toolkitsWithCategories);
// { "Database": [...], "Cloud": [...], "อื่นๆ": [...] }
```

### getUniqueCategorySections()

Gets unique category sections for navigation. Automatically sorts by Thai alphabet.

**Parameters**:
- `includeRecommended` (default: `false`) - Add "แนะนำ" section at the beginning

**Usage**:
```tsx
import { getUniqueCategorySections } from "@/app/dev-toolkit/_utils/toolkitHelpers";

const sections = getUniqueCategorySections(grouped, true);
// [{ id: "recommended", label: "แนะนำ" }, { id: "database", label: "Database" }, ...]
```

---

## 📤 Export/CSV Utilities

**Location**: [`apps/web/src/services/export/utils.ts`](../apps/web/src/services/export/utils.ts)

### escapeCsvValue()

Escapes CSV values properly (handles quotes, newlines, commas).

**Usage**:
```tsx
import { escapeCsvValue } from "@/services/export/utils";

const escaped = escapeCsvValue('Hello, "World"');
// Returns: "Hello, ""World"""
```

### generateFilename()

Generates filename with date prefix.

**Parameters**:
- `prefix` (default: `"export"`)
- `extension` (default: `"csv"`)

**Usage**:
```tsx
import { generateFilename } from "@/services/export/utils";

const filename = generateFilename("toolkits", "csv");
// Returns: "toolkits-2025-01-15.csv"
```

### downloadBlob()

Triggers browser download for a Blob object.

**Usage**:
```tsx
import { downloadBlob } from "@/services/export/utils";

const blob = new Blob([csvContent], { type: "text/csv" });
downloadBlob(blob, "data.csv");
```

### addUtf8Bom()

Adds UTF-8 BOM to content (fixes Thai characters in Excel).

**Usage**:
```tsx
import { addUtf8Bom } from "@/services/export/utils";

const csvWithBom = addUtf8Bom(csvContent);
const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8" });
```

---

## 🎯 Best Practices

### When to Create New Utils

1. **Function is used in 3+ places** → Move to utils
2. **Pure function** (no side effects) → Good candidate
3. **Domain-specific logic** → Keep in feature folder (`_utils/`)
4. **Global helpers** → Move to `/src/utils/`

### Organization Rules

```
/src/utils/           # Global, reusable utilities (markdown, date, etc.)
/src/hooks/           # Custom React hooks
/app/[feature]/_utils/ # Feature-specific utilities
/services/[service]/utils.ts # Service-specific utilities
```

### Performance Tips

1. **Use memoization** for expensive computations (`renderMarkdown`)
2. **Throttle/debounce** event handlers (`useScrollTracking`)
3. **Cache results** when possible (Map, WeakMap)
4. **Lazy load** large utilities

### Testing Guidelines

```tsx
// Example test for utility function
describe("escapeCsvValue", () => {
  it("should escape quotes", () => {
    expect(escapeCsvValue('Hello "World"')).toBe('"Hello ""World"""');
  });

  it("should handle null/undefined", () => {
    expect(escapeCsvValue(null)).toBe("");
    expect(escapeCsvValue(undefined)).toBe("");
  });
});
```

---

## 📝 Adding New Utils

When adding a new utility:

1. **Create the file** in appropriate location
2. **Add JSDoc comments** explaining purpose
3. **Export functions** with clear names
4. **Update this documentation** with examples
5. **Write tests** if logic is complex

**Example**:
```tsx
/**
 * Formats a date to Thai Buddhist year
 * @param date - Date to format
 * @returns Formatted string (e.g., "15 ม.ค. 2568")
 */
export function formatThaiDate(date: Date): string {
  // Implementation
}
```

---

## 🔗 Related Documentation

- [Project Context](../PROJECT_CONTEXT.md)
- [DevToolkit Management](./devtoolkit-management.md)
- [Component Documentation](./components-documentation.md) _(if exists)_
