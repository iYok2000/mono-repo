# PROJECT_CONTEXT.md

> Architecture overview. For **file maps & commands** → `DEVELOPMENT.md`. For **domain ownership** → `DOMAIN_MAP.md`.

---

## Stack

| Layer | Tech | Location |
|-------|------|----------|
| Frontend | Next.js 16 + TypeScript + Tailwind | `apps/web/` |
| Backend | Go + Gin v1.11 + GORM v2 | `apps/backend-go/` |
| Database | PostgreSQL 18.1 (Docker) | `postgres_data/` |
| Monorepo | pnpm workspaces + Turborepo | root `pnpm-workspace.yaml` |

**Ports**: FE `3000` / BE `8080` / DB `5432`

---

## Feature Index

Detailed docs in `project_context/`:

| Feature | Doc | Admin Page | Public Page |
|---------|-----|------------|-------------|
| Homepage Sections (content + visibility) | [home-section-settings.md](./project_context/home-section-settings.md) | `/admin`, `/admin/home-settings` | `/` |
| Banner Management | [BANNER_MANAGEMENT.md](./project_context/BANNER_MANAGEMENT.md) | `/admin/banner` | `/project` |
| Product/Category CRUD | [product-management.md](./project_context/product-management.md) | `/admin/product`, `/admin/category` | `/project` |
| Admin Auth (JWT) | [ADMIN_AUTH_README.md](./project_context/ADMIN_AUTH_README.md) | `/admin/auth` | — |
| Digital Business Card | [business-card.md](./project_context/business-card.md) | — | `/card/[slug]` |
| Data Export (CSV) | [data-export.md](./project_context/data-export.md) | Admin tables | — |
| Utils & Hooks | [utils-documentation.md](./project_context/utils-documentation.md) | — | — |
| Installation | [installation-guide.md](./project_context/installation-guide.md) | — | — |

---

## Architecture Patterns

### Backend (Go) — Clean Architecture + CQRS

```
core/domain/{feature}/    ← Entity + Repository interface (no framework deps)
application/{feature}/    ← Command/Query handlers + DTO + Mapper + Validation
infrastructure/adapter/   ← HTTP handlers, GORM repos, middleware
```

**New feature checklist**: Entity → Repo interface → DTO → Command/Query handler → Mapper → GORM repo + migration → HTTP handler → Wire in `container.go` → Register in `routes.go`

### Frontend (Next.js) — App Router

```
app/{route}/page.tsx      ← Page component
components/{domain}/      ← Domain-specific components
services/{domain}.ts      ← API call functions (axios)
types/{domain}.ts         ← TypeScript types
```

### Security

- **Backend**: ContentValidator per domain (`application/{feature}/validation/`) — XSS, length, format
- **Frontend**: Client validation = UX only, backend is source of truth
- **DB**: GORM parameterized queries only. No raw SQL string interpolation.
- **Auth**: JWT + rate limiting + account locking

### Migration

GORM AutoMigrate + raw SQL constraints in `persistence/gorm/{feature}/migration.go`.
- AutoMigrate = additive only (new tables/columns)
- Renames/drops = explicit SQL migration
- Register in `container.go` with `gormfeature.AutoMigrate(db)`

---

## API Endpoints Summary

| Method | Route | Auth | Domain |
|--------|-------|------|--------|
| POST | `/api/auth/login` | No | Auth |
| POST | `/api/auth/logout` | Yes | Auth |
| GET | `/api/auth/me` | Yes | Auth |
| GET | `/api/home-settings` | No | HomeSettings |
| PUT | `/api/home-settings` | Yes | HomeSettings |
| GET | `/api/settings/home-sections` | No | HomeSettings |
| PUT | `/api/settings/home-sections` | Yes | HomeSettings |
| GET/POST | `/api/banners` | Mixed | Banner |
| PUT/DELETE | `/api/banners/:id` | Yes | Banner |
| PUT | `/api/banners/reorder` | Yes | Banner |
| GET/POST | `/api/products` | Mixed | Product |
| GET/PUT/DELETE | `/api/products/:id` | Mixed | Product |
| GET/POST | `/api/categories` | Mixed | Product |

---

## DB Tables

| Table | Domain | Notes |
|-------|--------|-------|
| `admin_users` | Auth | Login creds, lock state |
| `home_settings` | HomeSettings | Single row (id='default'), all section content + visibility |
| `banners` | Banner | With `display_order` for sorting |
| `products` | Product | Main product info |
| `product_details` | Product | Extended content (markdown, code examples) |
| `dev_toolkit_categories` | Product | Category tree |
- Setup Docker for containerization
- Add search and pagination to Product list
- Image upload functionality
- Permission management

### Important Reminders

- **Security First**: ALL string inputs MUST use ContentValidator (XSS + SQL injection protection)
- **Next.js 16** with App Router in `apps/web/`
- **Golang Gin + gRPC** backend in `apps/backend-go/`
- **PostgreSQL** database with GORM ORM (use parameterized queries, never raw SQL)
- **Admin Pages** available at `/admin/category` and `/admin/product`
- **Content Management**: Create/edit pages at `/admin/product/create` and `/admin/product/edit/[id]`
- Run `pnpm install` at root after adding new dependencies
- Use TypeScript strict mode for type safety
- Backend API at `http://localhost:8080/api`
- Never use raw user input directly - always validate and sanitize first

Rename / Migration Guard
- Any rename (tables, routes, modules, types) must include:
  1) A migration plan: SQL/Go migration for rename/reindex/FK rewire plus data backfill
  2) A checklist: update DI container, routes, handlers, validators, repos/mappers, models (TableName/FK/index), FE slugs/services/types/links
  3) Repo-wide search (rg) to ensure zero references to the old name before merge
  4) Indexes on main queries (status, category_id, etc.) and FK constraints with OnDelete/OnUpdate
- Do not deploy if AutoMigrate is used instead of migrations for rename/drop


---

**Last Updated**: 2025-12-25
**Updated By**: AI Agent (Claude) - Added Banner Management System with Drag & Drop reordering, CQRS pattern, mobile preview, and bulk priority updates

