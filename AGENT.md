# AI Agent Rules

## 🎯 Core Rules

**MUST DO:**
- Follow software engineering best practices (security, performance first)
- Read `project_context.md` before starting tasks
- Balance good design vs over-engineering
- ASK before: deleting files, config changes, new libraries, breaking changes

**STRICT RULES:**
1. ❌ NO file deletion without confirmation
2. ❌ NO config changes without approval  
3. ❌ NO new libraries without explanation
4. ❌ NO breaking existing functionality
5. ❌ NO creating .md files without permission
6. ✅ ALWAYS analyze impact first

**Documentation Rules:**
- ❌ NEVER create .md files without user approval
- ✅ If approved, ONLY create in `project_context/` folder
- ✅ ALWAYS check if topic already exists in existing files first
- ✅ Read `PROJECT_CONTEXT.md` to see all documented features
- ✅ Ask: "Should I document this?" before creating new files

## 📋 Code Standards

**Quality:**
- Error handling: comprehensive, not excessive
- Naming: camelCase (JS/TS), PascalCase (components)
- Comments: brief, only where needed
- Files: reasonably sized, well-organized

## 🔒 Security (MANDATORY)

### ⚠️ Critical Security Checklist

**BEFORE writing/modifying ANY code, CHECK these vulnerabilities:**

1. ✅ **SQL Injection** - GORM parameterized queries only (NEVER raw SQL)
2. ✅ **XSS (Cross-Site Scripting)** - HTML escape all user inputs
3. ✅ **CSRF (Cross-Site Request Forgery)** - Token validation on state-changing requests
4. ✅ **Brute Force** - Rate limiting + account locking implemented
5. ✅ **API Key/Secret Leaks** - NO secrets in code, use env vars only
6. ✅ **Directory Traversal** - Validate file paths, no `../` allowed
7. ✅ **Command Injection** - NEVER pass user input to system commands
8. ✅ **Authentication** - Verify user session/token on protected endpoints

### Input Validation Pattern

**CRITICAL: ALL user inputs MUST be validated**

```go
// ❌ BAD: Raw input
model := &Model{Title: cmd.Title}

// ✅ GOOD: Validate first
validator := validation.NewContentValidator()
title, err := validator.ValidateAndSanitizeTitle(cmd.Title)
if err != nil { return apperrors.NewValidationError("title", err.Error()) }
model := &Model{Title: title}
```

**Required Protections:**
1. **XSS**: HTML escape, remove dangerous tags (`<script>`, event handlers)
2. **SQL Injection**: GORM parameterized queries only (NEVER `fmt.Sprintf()` in queries)
3. **Length**: Enforce max limits (prevent DoS)
4. **Format**: URL, email, ID validation
5. **Path Traversal**: Block `../`, `..\\`, validate file paths

**Validation Layers:**
- HTTP: Gin binding (`binding:"required,max=255"`)
- Handler: ContentValidator (mandatory)
- Repository: Parameterized queries

**Available Validators:**
```go
validator.ValidateAndSanitizeTitle(input)
validator.ValidateAndSanitizeDescription(input)
validator.SanitizeMainContent(input) // Markdown
validator.ValidateImageURL(input)
validator.ValidateAndSanitizeID(input)
validator.ValidateTags(tags)
```

### CSRF Protection

**Status**: ✅ Implemented in middleware
- CSRF token header: `X-CSRF-Token`
- Token validation on POST/PUT/PATCH/DELETE
- SameSite cookie policy

### Brute Force Protection

**Status**: ✅ Implemented
- Max failed login attempts: 5
- Account lock duration: 30 minutes
- Automatic unlock after timeout
- Failed attempts tracking per user

**Code Location**: `internal/core/domain/auth/service.go`

### API Secret Management

**RULES:**
- ❌ NEVER hardcode secrets/keys in code
- ✅ ALWAYS use environment variables
- ✅ Use `.env` for local dev (gitignored)
- ✅ Validate secrets exist on startup

```go
// ✅ GOOD
jwtSecret := os.Getenv("JWT_SECRET")
if jwtSecret == "" {
    log.Fatal("JWT_SECRET is required")
}

// ❌ BAD
const jwtSecret = "my-secret-key-123"
```

### Directory Traversal Prevention

```go
// ❌ BAD: Directory traversal risk
filePath := "/uploads/" + userInput

// ✅ GOOD: Validate and sanitize
func ValidateFilePath(input string) (string, error) {
    // Block directory traversal
    if strings.Contains(input, "..") {
        return "", errors.New("invalid path")
    }
    // Whitelist allowed characters
    if !regexp.MustCompile(`^[a-zA-Z0-9_\-\.]+$`).MatchString(input) {
        return "", errors.New("invalid filename")
    }
    return filepath.Clean(input), nil
}
```

### Command Injection Prevention

```go
// ❌ BAD: Command injection risk
cmd := exec.Command("sh", "-c", "ls "+userInput)

// ✅ GOOD: Use parameterized commands
cmd := exec.Command("ls", userInput)

// ✅ BETTER: Avoid system commands with user input entirely
// Use native Go libraries instead (os.ReadDir, etc.)
```

## 🗄️ Database Query Rules

### Index Strategy

**When to add:**
- WHERE clauses (frequent)
- ORDER BY columns
- JOIN conditions
- JSONB with `@>` queries

**When NOT to add:**
- Display fields (URLs, descriptions)
- Primary keys (auto-indexed)
- Unused in queries

**Types:**
```go
// Composite
IsActive bool `gorm:"index:idx_name"`
Priority int `gorm:"index:idx_name,priority:2"`

// GIN (JSONB)
Tags datatypes.JSON `gorm:"index:,type:gin"`
```

**Naming:** `idx_[table]_[columns]`

### GORM Best Practices

```go
// ❌ Redundant Select() with all columns
Select("id, name, email, created_at")

// ✅ Let GORM auto-select or select only needed
db.Model(&Model{})  // All
Select("id, name")  // Optimization

// ❌ SQL Injection risk
fmt.Sprintf(`["%s"]`, input)

// ✅ Safe escaping
tierJSON, _ := json.Marshal([]string{input})
query.Where("tags @> ?", tierJSON)

// ❌ Slow bulk update
for _, item := range items {
    db.Where("id = ?", item.ID).Update("status", item.Status)
}

// ✅ Fast CASE WHEN
caseStmt := "CASE id WHEN ? THEN ? ... END"
db.Where("id IN ?", ids).Update("status", gorm.Expr(caseStmt, args...))

// ✅ Always use context
db.WithContext(ctx).Find(&models)
```

**Checklist:**
- [ ] Indexed columns in WHERE/ORDER BY?
- [ ] No `fmt.Sprintf()` in queries?
- [ ] `json.Marshal()` for JSONB?
- [ ] Bulk updates use CASE WHEN?
- [ ] No redundant Select()?
- [ ] WithContext() everywhere?

## ⚛️ React/TypeScript Rules

**Controlled Components:**
```tsx
// ❌ BAD
<select><option selected>...</option></select>

// ✅ GOOD
<select value={val} onChange={handler}>...</select>
```

**No Circular Imports:**
- Types in dedicated modules
- Import direction: service → types (not reverse)

**Regex Escaping:**
```typescript
// ❌ BAD
.replace(/(<li.*</li>)+/g, "")

// ✅ GOOD
.replace(/(<li.*<\/li>)+/g, "")  // Escape </
```

## 🔄 Shared Code Changes (CRITICAL)

**RULE: Code used in multiple places = HIGH RISK**

When modifying:
- Shared utilities/helpers
- Common types/interfaces
- Reusable components
- Base classes/services
- API contracts
- Database schemas

**MANDATORY Process:**

1. **Identify ALL Usages**
   - Search entire codebase for references
   - List every file that imports/uses it
   - Understand context in each location

2. **Assess Complete Impact**
   - What breaks if this changes?
   - What errors will appear (TypeScript/compiler/runtime)?
   - What edge cases exist in each usage?
   - Are there different usage patterns?

3. **Fix ALL Instances**
   - Update EVERY affected file
   - Handle ALL error cases
   - Test each location works correctly
   - DO NOT leave any location broken

4. **Verify Completion**
   - No TypeScript/compiler errors
   - No IDE errors shown
   - No runtime errors possible
   - All tests pass

**Example - Type Changes:**
```typescript
// ❌ WRONG: Change in 11 files, miss error handling
catch (error: any) { }  →  catch (error: unknown) { }
// Forgot: const message = error.response?.data?.message  // Type error!

// ✅ CORRECT: Change type AND all usages
catch (error: unknown) {
    const err = error as ApiError;
    const message = err.response?.data?.message || "Error";
}
```

**Consequences of Incomplete Changes:**
- ❌ IDE shows red squiggly lines everywhere
- ❌ TypeScript errors block development
- ❌ Runtime crashes in production
- ❌ User loses trust in code quality
- ❌ Wastes hours fixing preventable issues

**Checklist:**
- [ ] Searched all usages codebase-wide?
- [ ] Listed affected files completely?
- [ ] Analyzed error cases in each location?
- [ ] Fixed ALL files (not 10/11, ALL)?
- [ ] Verified zero IDE/TypeScript errors?
- [ ] Tested changes work in all contexts?
- [ ] Prevented recurrence of same issue?

**Golden Rule:** If it's used in N places, fix ALL N places. No exceptions.

## 📝 Documentation

**Location:**
- `PROJECT_CONTEXT.md` - Main overview + links
- `project_context/[feature].md` - Individual features

**Creation Rules:**
- ❌ NEVER create .md without user permission
- ✅ Check existing files in `project_context/` first
- ✅ Check if topic covered in other files
- ✅ Only create in `project_context/` folder if approved

**When to update:**
- NEW features: ASK "Should I document?" → Create in `project_context/`
- EXISTING features: Update relevant file after changes

**Format:** Overview, Why, How, Code examples, Dependencies
**Naming:** `kebab-case.md`

## 💬 Communication

- Concise but complete
- Mix English/Thai naturally
- Show code when helpful
- ASK when uncertain
- Explain trade-offs

## 🔍 Before Changes

1. Aligns with architecture?
2. Security implications?
3. Performance impact?
4. Breaks existing features?
5. Simplest solution?
6. Should ask user first?

---

**Remember:** Think before acting. Ask when uncertain. Prioritize stability and quality.
