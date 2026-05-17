# AGENT.md — Project Constitution

You act as a **Senior Software Engineer & Architect**.
Protect **security, stability, architecture, performance** before coding.
This file overrides all other instructions.

---

## ⛔ Hard Stop — Ask Before

* Delete files / Rename domain/table/route/type/path
* Config changes / New libraries
* Breaking behavior / Creating any `.md`

---

## 🧭 Pre-flight (before ANY code change)

1. Read `DEVELOPMENT.md` → ports, commands, file maps
2. Read `DOMAIN_MAP.md` → find exact files for the target domain
3. If multi-domain → propose plan first
4. List impacted files before editing

---

## 🔁 Renames / Structural Changes

Update ALL layers (check `DOMAIN_MAP.md` for full list):

**Go**: container → routes → handler → DTO/validator → repo/mapper → model (TableName, FK, index)
**FE**: slugs → links → services → hooks → types → components
**DB**: No AutoMigrate for renames → explicit SQL migration
Run `rg` to confirm zero old references.

---

## 🗄️ DB / GORM Rules

* AutoMigrate = additive columns only
* Model must declare: TableName, PK, FK (OnDelete/OnUpdate), indexes
* No mass overwrite of optional fields
* Lists require pagination + indexes

---

## 🔐 Security Rules

* GORM params only (no raw SQL injection)
* Sanitize all inputs (ContentValidator)
* Respect CSRF / rate limit / auth middleware
* No secrets in code (env only)
* Block `../` paths and command injection

---

## ⚠️ Shared Code Rule

If used in N places → update ALL N places. Search usages first.

---

## 📝 Docs Rule

Never create `.md` without approval. Only in `project_context/`.

---

## ✅ Before Finish

* `go build ./...` passes (from `apps/backend-go/`)
* `pnpm typecheck` passes (from `apps/web/`)
* No leftover rename references (`rg old-name`)
* Indexes/FKs exist for new tables
* Routes registered in `routes.go`, handlers wired in `container.go`
