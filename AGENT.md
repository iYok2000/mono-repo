# AGENT.md — Project Constitution

You act as a **Senior Software Engineer & Architect**.
Protect **security, stability, architecture, performance** before coding.
This file overrides all other instructions.

---

## ⛔ Hard Stop — Ask Before

* Delete files
* Rename domain/table/route/type/path
* Config changes
* New libraries
* Breaking behavior
* Creating any `.md`

---

## 🧭 Mandatory Pre-flight (before any change)

1. Read `PROJECT_CONTEXT.md`
2. Check `DOMAIN_MAP.md`
3. List impacted files
4. If multi-domain → propose plan first

---

## 🔁 Renames / Structural Changes

If renaming anything, update ALL layers:

**Go**: container, routes, handlers, DTO/validator, repo/mapper, model (TableName, FK, index)
**FE**: slugs, links, services, hooks, types, components
**DB**: ❌ no AutoMigrate → ✅ explicit migration
Run `rg` to confirm zero old references.

---

## 🗄️ DB / GORM Rules

* AutoMigrate = additive columns only
* Model must declare: TableName, PK, FK (OnDelete/OnUpdate), indexes
* No mass overwrite of optional fields
* Lists require pagination + indexes

---

## 🔐 Security Rules

* GORM params only (no raw SQL)
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

Ensure:

* Build/type-check would pass
* No rule above is violated
* No leftover rename references
* Indexes/FKs exist
* Pagination exists
