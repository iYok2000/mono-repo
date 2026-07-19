# Product Management

> Last updated: 2026-07-19

## What
CMS for managing developer tools/products. CRUD with markdown content editor, code examples, predefined status/tags. ContentValidator for XSS prevention.

## Where

**Backend** (CQRS):
- Commands: `internal/application/product/command/` — create, update, delete
- Queries: `internal/application/product/query/` — list, get by ID
- Validation: `internal/application/product/validation/content_validator.go`
- DTOs: `internal/application/product/dto/product_dto.go`
- Domain: `internal/core/domain/product/entity/`, `valueobject/` (status, tags)
- Repo: `internal/infrastructure/adapter/persistence/gorm/product/`

**Frontend**:
- Admin: `app/admin/product/` — page (list), create/, edit/[id]/
- Public: `app/product/` — page (list), [id]/detail/
- Components: `components/admin/ContentEditor.tsx`, `CodeExample.tsx`, `AdminSidebar.tsx`
- Service: `services/productService.ts`
- Types: `types/product.ts`

## Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/products` | List all |
| GET | `/api/products/:id` | Get detail |
| POST | `/api/products` | Create |
| PUT | `/api/products/:id` | Update |
| DELETE | `/api/products/:id` | Delete |

## Categories

Categories group products (`products.category_id` → `dev_toolkit_categories`).

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/categories` | No | List |
| GET | `/api/categories/:id` | No | Get |
| POST | `/api/categories` | Yes | Create |
| PUT | `/api/categories/:id` | Yes | Update |
| DELETE | `/api/categories/:id` | Yes | Delete |

- Admin UI: `app/admin/category/`; FE service: `services/categoryService.ts`
- Table `dev_toolkit_categories`: id (VARCHAR PK), name_en, name_th

## DB Schema

**products**: id (VARCHAR PK), category_id (FK → `dev_toolkit_categories` — legacy name, not yet renamed), title, status, tags (JSONB), image
- Indexes: composite `idx_product_category_title` (category_id, title), GIN index on `tags`. No index on `status`.
**product_details**: id (SERIAL PK), product_id (UNIQUE FK → products), description, main_content (50KB), how_to_use (10KB), reference (5KB), example (20KB)

## Config (not in DB)

**Status** (`valueobject/service_status.go`): recommended, new, coming_soon, default
**Tags** (`valueobject/tags.go`): API, Authentication, Database, DevOps, Frontend, Backend, Testing, Monitoring, Security, Cloud, AI/ML, Mobile, Analytics, Performance, Documentation

## Migration Notes
- Rename status: `dev_toolkits` → `products` ✓ done, `dev_toolkit_details` → `product_details` ✓ done, but `dev_toolkit_categories` is STILL the legacy name (category rename NOT done yet)
- Remaining rename requires explicit SQL migration + full-layer update (see AGENT.md rules)
- FK: product_details → products with `OnDelete:CASCADE`; products.category_id → `dev_toolkit_categories`

## Security
- ContentValidator sanitizes ALL inputs (XSS: removes `<script>`, `<iframe>`, event handlers, `javascript:` URLs)
- 3-layer validation: Gin binding → Command handler (ContentValidator) → GORM parameterized queries
- FE validation = UX only
