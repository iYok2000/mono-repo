# CLAUDE.md

> AI Agent Rules & Responsibilities

## 🎯 Core Responsibilities

As an AI agent for this project, you MUST:

1. **Write, Review, Debug, Create Features, and Explain Code**

   - Follow software engineering best practices
   - Balance between good design and avoiding over-engineering
   - Always assess and evaluate before implementing
   - Research best practices for security and performance FIRST

2. **Maintain Context Awareness**
   - Read `project_context.md` to understand project structure and business logic
   - Remember what you've done and WHY
   - Ensure changes don't break existing functionality

## 📋 Code Guidelines

### File Management

- **NEVER delete files** without explicit user confirmation
- **ALWAYS ask before creating new files** or show examples first
- Suggest file separation when it improves organization
- Keep files reasonably sized (not too long)
- **NEVER create unrelated files** to the given task

### Configuration Changes

- **ALWAYS ask before modifying critical configs**
- Explain the impact of any config change
- Get user confirmation for package.json, tsconfig, vite.config, etc.

### Dependencies & Libraries

- **ALWAYS ask before adding new libraries**
- Provide clear reasoning: why this library? what problem does it solve?
- Consider bundle size and security implications

### Code Quality Standards

- **Error handling**: Comprehensive but not excessive
- **Security & Performance**: Top priority, follow researched best practices
- **Naming conventions**: Use universal/standard conventions (camelCase for JS/TS, PascalCase for components, etc.)
- **Comments**: Brief, descriptive only where needed - not everything
- **Code length**: Keep functions and files manageable

### Security Best Practices (MANDATORY)

**CRITICAL RULE: ALL string fields MUST be validated and sanitized**

#### Backend (Go) - Input Validation & Sanitization

- **ALWAYS use ContentValidator** for any string input from users, APIs, or external sources
- **NEVER directly use raw user input** in database operations, responses, or business logic
- **MANDATORY protections** for every string field:
  1. ✅ **XSS Protection**: HTML escaping, dangerous tag removal
  2. ✅ **SQL Injection Prevention**: Use GORM parameterized queries (never raw SQL)
  3. ✅ **Length Validation**: Enforce maximum length limits
  4. ✅ **Format Validation**: Validate data format (URL, email, ID format, etc.)

**Example - REQUIRED pattern for all command handlers:**
```go
// ❌ BAD: Using raw input directly
func (h *CreateHandler) Handle(ctx context.Context, cmd CreateCommand) error {
    model := &Model{
        Title: cmd.Title,  // DANGEROUS! No validation/sanitization
        Content: cmd.Content,
    }
    return h.repo.Create(ctx, model)
}

// ✅ GOOD: Always validate and sanitize
func (h *CreateHandler) Handle(ctx context.Context, cmd CreateCommand) error {
    // MANDATORY: Use ContentValidator
    validator := validation.NewContentValidator()

    // Validate and sanitize EVERY string field
    sanitizedTitle, err := validator.ValidateAndSanitizeTitle(cmd.Title)
    if err != nil {
        return apperrors.NewValidationError("title", err.Error())
    }

    sanitizedContent, err := validator.SanitizeMainContent(cmd.Content)
    if err != nil {
        return apperrors.NewValidationError("content", err.Error())
    }

    // Now safe to use
    model := &Model{
        Title: sanitizedTitle,
        Content: sanitizedContent,
    }
    return h.repo.Create(ctx, model)
}
```

#### Frontend (React/Next.js) - Client-Side Validation

- **Client validation is for UX only**, NOT security
- **Backend validation is the primary defense**
- Still provide client-side validation for:
  - Better user experience
  - Immediate feedback
  - Reduced unnecessary API calls

**Example:**
```tsx
// Client-side validation (UX only)
const validateForm = () => {
  const errors = {};
  if (!title.trim()) errors.title = "Required";
  if (title.length > 255) errors.title = "Too long";
  return errors;
};

// Backend will re-validate for security
await api.createToolkit(formData); // Backend validates again
```

#### Mandatory Validation Locations

**MUST validate at these layers:**

1. **HTTP Request Layer** (`internal/infrastructure/adapter/http/request/`)
   - Gin binding validation (`binding:"required,min=1,max=255"`)
   - Basic format checks

2. **Command/Query Handler Layer** (`internal/application/*/command/`, `internal/application/*/query/`)
   - **ContentValidator usage (MANDATORY)**
   - Business logic validation
   - Sanitization before passing to repository

3. **Repository Layer** (`internal/infrastructure/adapter/persistence/`)
   - Use GORM parameterized queries (automatic SQL injection protection)
   - Never use raw SQL with string concatenation

#### Content Validation Reference

**Location**: `internal/application/[module]/validation/content_validator.go`

**Available validators (use these for ALL string inputs):**
```go
validator := validation.NewContentValidator()

// For titles, names, short text
sanitized, err := validator.ValidateAndSanitizeTitle(input)

// For descriptions, summaries
sanitized, err := validator.ValidateAndSanitizeDescription(input)

// For markdown content (removes dangerous HTML)
sanitized, err := validator.SanitizeMainContent(input)
sanitized, err := validator.SanitizeHowToUse(input)
sanitized, err := validator.SanitizeReference(input)
sanitized, err := validator.SanitizeExample(input)

// For URLs
sanitized, err := validator.ValidateImageURL(input)

// For IDs (alphanumeric + dash/underscore only)
sanitized, err := validator.ValidateAndSanitizeID(input)

// For tag arrays
sanitized, err := validator.ValidateTags(tags)
```

#### When to Create New Validators

If you're adding a new feature with string fields:
1. Check if existing validators cover your use case
2. If not, add new methods to `content_validator.go`
3. Follow the same pattern: validate length, format, and sanitize
4. Document the max length and validation rules

**Example - Adding new validator:**
```go
// In content_validator.go
const MaxEmailLength = 320 // RFC 5321

func (v *ContentValidator) ValidateEmail(email string) (string, error) {
    email = strings.TrimSpace(email)

    if email == "" {
        return "", fmt.Errorf("email: %w", ErrEmptyField)
    }

    if len(email) > MaxEmailLength {
        return "", fmt.Errorf("email: %w (max %d)", ErrFieldTooLong, MaxEmailLength)
    }

    // Validate email format
    emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    if !emailRegex.MatchString(email) {
        return "", fmt.Errorf("email: invalid format")
    }

    // HTML escape (defense in depth)
    email = html.EscapeString(email)

    return email, nil
}
```

### React Best Practices

- **Controlled Components**: Use `value` prop on `<select>`, `<input>`, `<textarea>` - NEVER use `selected` on `<option>` or `checked` on `<input type="checkbox">` directly
  ```tsx
  // ❌ BAD: Uncontrolled pattern (HTML way)
  <select>
    <option value="1" selected>Option 1</option>
  </select>
  
  // ✅ GOOD: Controlled component (React way)
  <select value={value} onChange={handleChange}>
    <option value="1">Option 1</option>
  </select>
  ```
- **State as Single Source of Truth**: React manages selection through state, not DOM attributes
- **Why**: Ensures consistency, prevents conflicts between React state and DOM state, avoids warnings

### Module Structure & Imports

- **NO circular dependencies**: NEVER create import cycles (A imports B, B imports A)
- **Type definitions location**: Place shared types/interfaces in dedicated type modules
- **Import direction**: Always import from type modules, never re-export from service modules back to types
- **Example of WRONG approach**:
  ```typescript
  // ❌ BAD: Circular dependency
  // exportService.ts exports VocExportData
  // types/data.ts: export type { VocExportData } from '../../exportService'
  // exportService.ts: import { ... } from './export/types'
  // Result: exportService → types → exportService (LOOP!)
  ```
- **Example of CORRECT approach**:
  ```typescript
  // ✅ GOOD: One-way import
  // types/data.ts: export interface VocExportData { ... }
  // exportService.ts: import type { VocExportData } from './export/types'
  // Result: exportService → types (NO LOOP)
  ```

### TypeScript/JavaScript Regex Patterns

- **ALWAYS escape forward slashes** (`/`) in regex patterns inside string literals
- **Why**: Unescaped `</` in string literal causes parsing error (looks like closing tag)
- **Examples**:
  ```typescript
  // ❌ BAD: Unescaped forward slash causes parse error
  html = html.replace(/(<li.*</li>\n?)+/g, "<ul>$&</ul>");
  
  // ✅ GOOD: Escape forward slash with backslash
  html = html.replace(/(<li.*<\/li>\n?)+/g, "<ul>$&</ul>");
  ```
- **Rule**: In regex inside `.replace()`, `.match()`, etc., write `<\/` not `</` for closing tags

## 🚫 Strict Rules (NEVER Break These)

1. **NO file deletion** unless explicitly instructed
2. **NO config changes** without user approval
3. **NO arbitrary modifications** - always analyze impact first
4. **NO new libraries** without asking and explaining
5. **NO breaking existing functionality** - verify compatibility before changes

## 📝 Documentation Requirements

### Project Context Structure

**Main file**: `PROJECT_CONTEXT.md` - Overview and links to feature docs  
**Feature docs**: `project_context/[feature-name].md` - Detailed feature documentation

### When Working on ANY Task:

1. **For NEW features** (not documented yet):

   - Ask clarifying questions FIRST
   - After implementation, create new file in `project_context/[feature-name].md`
   - Add reference link in main `PROJECT_CONTEXT.md`
   - Include:
     - Feature heading
     - Brief explanation and reasoning
     - Key code snippets or patterns
     - Why this approach was chosen

2. **For EXISTING features** (already documented):

   - Read existing context from `project_context/[feature-name].md` first
   - After modifications, ask: "Should I update the feature doc now?"
   - Update the relevant feature file to reflect current state

3. **File Organization Rules**:

   - One feature = One file in `project_context/`
   - File naming: `kebab-case.md` (e.g., `user-authentication.md`, `payment-system.md`)
   - Always add/update link in main `PROJECT_CONTEXT.md`
   - Keep each file focused on single feature or module

4. **Format for feature files** (`project_context/[feature-name].md`):

   ````markdown
   # Feature Name

   ## Overview

   Brief description of what this feature does

   ## Why

   Reasoning and business requirements

   ## How

   Technical implementation approach

   ## Code Examples

   ```typescript
   // Key code snippets or patterns
   ```
   ````

   ## Dependencies

   - Related features or packages

   ## Notes

   Important considerations, trade-offs, or gotchas

   ```

   ```

## 💬 Communication Style

- **Concise but detailed** explanations
- Mix English/Thai naturally
- Show code examples when helpful
- If uncertain, ASK before acting
- Explain trade-offs when presenting options

## 🔍 Before Making Changes

Always consider:

1. ✅ Does this align with project architecture?
2. ✅ Are there security implications?
3. ✅ What's the performance impact?
4. ✅ Will this break existing features?
5. ✅ Is this the simplest solution that works?
6. ✅ Should I ask the user first?

## 🧠 Context Maintenance

- **Read** `project_context.md` at the start of each task
- **Update** it after completing significant work
- **Preserve** the reasoning behind decisions
- **Ensure** both humans and AI can understand the context

---

**Remember**: Your role is to be a thoughtful, careful, and knowledgeable development partner - not just a code generator. Think before you act, ask when uncertain, and always prioritize project stability and quality.
