# AGENT.md — Single Source of Truth

> Read this file FIRST. Do NOT read other docs until needed.
> Role: Senior Software Engineer & Architect.
> Priority: security > stability > architecture > performance > speed.

---

## 1. Hard Stops (ask before doing)

- Delete/rename files, domains, tables, routes, types, paths
- Config changes, new dependencies
- Breaking behavior changes
- Creating `.md` files

---

## 2. Workflow (every task)

1. Read this file (done)
2. Identify impacted domain(s) → check `DOMAIN_MAP.md` if multi-domain
3. List impacted files + reason
4. If multi-domain or structural → propose plan, wait for approval
5. Implement → Verify → Summarize changes + impacts

---

## 3. Rules

### Security
- GORM parameterized queries only (no raw SQL, no string concat)
- Sanitize ALL inputs — Go: `ContentValidator`, FE: DOMPurify
- Respect auth / CSRF / rate-limit middleware
- No secrets in code (env vars only)
- Block `../` path traversal, command injection, `javascript:` URLs
- FE validation = UX only; backend re-validates everything

### Database / GORM
- AutoMigrate = additive columns ONLY
- Rename / drop / constraint changes → explicit SQL migration file
- Model must declare: `TableName()`, PK, FK with `OnDelete`/`OnUpdate`, indexes
- No mass overwrite of optional fields — use selective update maps
- List endpoints require pagination + default limit + supporting indexes

### Renames
Update ALL layers in one pass:
- **Go**: container → routes → handler → DTO/validator → repo/mapper → model (TableName, FK, index)
- **FE**: slugs → links → services → hooks → types → components
- **DB**: explicit migration (NOT AutoMigrate)
- Run `rg <old-name>` to confirm zero leftover references

### Shared Code
If used in N places → update ALL N. Search usages with `rg` or grep before editing.

### Docs
Never create `.md` without approval. Feature docs go in `project_context/` only.

---

## 4. Verify Before Finishing

```bash
go build ./...        # Backend compiles
pnpm lint             # FE lint passes
pnpm typecheck        # FE types pass
rg <old-name>         # Zero leftover references (if rename)
```

---

## 5. When to Read Other Docs

| Need | File |
|------|------|
| Architecture / feature index | `PROJECT_CONTEXT.md` |
| Domain ownership check | `DOMAIN_MAP.md` |
| How to run / commands | `DEVELOPMENT.md` |
| Feature implementation detail | `project_context/<feature>.md` |
| UI design tokens | `project_context/design-tokens.md` |

---

## 6. Bad Examples (do NOT do these)

```go
// BAD: raw SQL string concat
db.Raw("SELECT * FROM users WHERE name = '" + name + "'")
// GOOD: parameterized
db.Where("name = ?", name).Find(&users)

// BAD: AutoMigrate for rename
db.AutoMigrate(&RenamedModel{})
// GOOD: explicit migration
// migrations/003_rename_x_to_y.sql
```

```typescript
// BAD: trust FE validation as security
if (formData.title) { submitToAPI(formData) }
// GOOD: FE validates for UX, backend ContentValidator validates for security
```
