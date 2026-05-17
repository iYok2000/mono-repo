# DOMAIN_MAP.md — Domain Ownership & File Locations

Use this to identify **which files to edit** for each domain.
If a task touches more than one domain → STOP and propose a plan first.

---

## Auth Domain

**Purpose**: Admin authentication, JWT sessions, account locking

| Layer | Path |
|-------|------|
| Tables | `admin_users`, `admin_sessions`, `admin_login_logs`, `admin_password_reset_tokens` |
| Routes | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/refresh`, `/api/auth/change-password` |
| BE Domain | `internal/core/domain/auth/` (repository.go, security.go, service.go) |
| BE Migration | `internal/infrastructure/adapter/persistence/migrations/001_create_admin_users.sql` |
| BE Middleware | `internal/infrastructure/adapter/http/middleware/auth_middleware.go` |
| FE Context | `src/contexts/AuthContext.tsx` |
| FE Pages | `src/app/admin/auth/` |
| FE HOC | `src/hoc/withAuthentication` |

Default credentials: `superadmin` / `Admin123!@#`

---

## Product Domain

**Purpose**: Product + Category CRUD

| Layer | Path |
|-------|------|
| Tables | `products`, `product_details`, `dev_toolkit_categories` |
| Routes | `/api/products/*`, `/api/categories/*` |
| BE Application | `internal/application/product/command\|query\|validation/` |
| BE Domain | `internal/core/domain/product/` |
| BE Persistence | `internal/infrastructure/adapter/persistence/gorm/product/` |
| BE Handler | `internal/infrastructure/adapter/http/handler/product_handler.go`, `category_handler.go` |
| FE Service | `src/services/categoryService.ts` |
| FE Pages | `src/app/admin/product/`, `src/app/admin/category/`, `src/app/project/` |

---

## Banner Domain

**Purpose**: Homepage carousel banners with drag-drop reorder

| Layer | Path |
|-------|------|
| Tables | `banners` |
| Routes | `/api/banners/*`, `/api/banners/reorder` |
| BE Application | `internal/application/banner/command\|query/` |
| BE Domain | `internal/core/domain/banner/` |
| BE Persistence | `internal/infrastructure/adapter/persistence/gorm/banner/` |
| BE Handler | `internal/infrastructure/adapter/http/handler/banner_handler.go` |
| FE Service | `src/services/bannerService.ts` |
| FE Pages | `src/app/admin/banner/` |
| FE Component | `src/components/banner/` |

---

## HomeSettings Domain

**Purpose**: Homepage section content + visibility control

| Layer | Path |
|-------|------|
| Tables | `home_settings` (single row, id='default') |
| Routes — Content | `GET\|PUT /api/home-settings` |
| Routes — Visibility | `GET\|PUT /api/settings/home-sections` |
| BE Application | `internal/application/homesettings/dto\|command\|query\|mapper/` |
| BE Domain | `internal/core/domain/homesettings/` |
| BE Persistence | `internal/infrastructure/adapter/persistence/gorm/homesettings/` |
| BE Handlers | `internal/infrastructure/adapter/http/handler/homesettings_handler.go` (content), `settings_handler.go` (visibility) |
| FE Service — Content | `src/services/homeSettings/homeSettingsService.ts` |
| FE Service — Visibility | `src/services/settingsService.ts` |
| FE Types | `src/types/homeSettings.ts` (types + SECTION_METADATA) |
| FE Admin — Dashboard | `src/app/admin/page.tsx` (quick toggles) |
| FE Admin — Editor | `src/app/admin/home-settings/page.tsx` (full content editor) |
| FE Admin Components | `src/components/admin/homeSettings/` (SectionEditor, ContentField, SectionToggle) |
| FE Homepage | `src/app/page.tsx` → `src/components/home/*.tsx` |

**Sections**: hero, what_is_it, sku, how_it_works, occasions, why_nfc, why_us, preview, faq, final_cta

---

## Shared / Cross-cutting

| What | Path |
|------|------|
| DI Container | `internal/container/container.go` — wire ALL repos + handlers |
| Route Registration | `internal/infrastructure/adapter/http/routes/routes.go` — ALL routes |
| Axios Config | `src/lib/axios/config.ts` — API base URLs |
| UI Components | `src/components/ui/` — Button, Modal, Accordion, Switch, etc. |
| Rate Limiter | `internal/infrastructure/adapter/http/middleware/rate_limiter.go` |
