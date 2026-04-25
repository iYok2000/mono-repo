# START_HERE.md (Document.md) — AI Agent Operating Guide

## 0) Must-read (always)

AI MUST read these before any task:

1. `AGENT.md` — constitution (security, no destructive changes, no config/deps without approval, shared-code discipline)
2. `PROJECT_CONTEXT.md` — architecture + feature index + security patterns (ContentValidator / DOMPurify) + ports + shared code cautions
3. `DEVELOPMENT.md` — how to run + verify (go build, pnpm lint/typecheck, rg)

Optional when needed:

* `DOMAIN_MAP.md` — domain ownership (must consult before touching cross-domain code)

---

## 1) Non-negotiables (short)

* Security-first: validate/sanitize ALL inputs (Go: ContentValidator, FE: DOMPurify), no raw SQL, no secrets, respect auth/CSRF/rate-limit middleware
* Shared code: search all usages and update ALL; leave zero TS/Go build errors
* No destructive actions without approval: delete/config/deps/breaking changes
* Renames require full-layer updates + migrations; do not use AutoMigrate for rename/drop

> Source of truth for rules: `AGENT.md`

---

## 2) Task Workflow (always)

For EACH task:

1. Extract task-relevant constraints from the must-read files
2. Identify impacted domain(s) and components; list impacted files + why
3. Propose minimal safe plan; ASK before destructive/breaking/structural changes
4. Implement safely (transactions, strong typing, GORM tags for PK/FK/index)
5. Verify (or explain why not): `go build ./...`, `pnpm lint`, `pnpm typecheck`, `rg <old-name>`
6. Summarize changes + impacts + next steps (mention security/perf)

---

## 3) Mandatory Pre-flight (when applicable)

Use this when task includes any of these: rename/migration/shared-code/list endpoints.

* Renames: update Go+FE+DB layers; run `rg` to ensure zero old refs
* Migrations: forbid AutoMigrate for rename/drop; require explicit migration + backfill plan
* GORM: TableName, PK, FK OnDelete/OnUpdate, indexes/unique for WHERE/ORDER/JOIN fields
* Update safety: avoid overwriting optional fields; use selective update maps/columns
* Performance: list endpoints require pagination + default limit + supporting indexes; avoid heavy preload without bounds

---

## 4) Communication Style

* Concise, bilingual TH/EN OK
* Offer options when there are trade-offs
* Ask when ambiguous or high-risk

---

## 5) Token-efficient usage pattern (recommended)

### Session Bootstrap (do once per session)

AI: read `AGENT.md`, `PROJECT_CONTEXT.md`, `DEVELOPMENT.md` and produce a **short “Constitution Summary”** (10–20 bullets).
Then for every task, follow that summary unless asked to refresh it.

### Refresh rule (only when needed)

If the AI starts drifting, or after large changes: re-read the three files and refresh the summary.
