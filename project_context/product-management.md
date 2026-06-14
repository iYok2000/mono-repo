# Product Management

> Last updated: 2026-04-28

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

## DB Schema

**products**: id (VARCHAR PK), category_id (FK → product_categories), title, status, tags (JSONB), image
**product_details**: id (SERIAL PK), product_id (UNIQUE FK → products), description, main_content (50KB), how_to_use (10KB), reference (5KB), example (20KB)

## Config (not in DB)

**Status** (`valueobject/service_status.go`): recommended, new, coming_soon, default
**Tags** (`valueobject/tags.go`): API, Authentication, Database, DevOps, Frontend, Backend, Testing, Monitoring, Security, Cloud, AI/ML, Mobile, Analytics, Performance, Documentation

## Migration Notes
- Legacy tables: `dev_toolkits`, `dev_toolkit_details`, `dev_toolkit_categories` → being renamed to `product*`
- Renames require explicit SQL migration + full-layer update (see AGENT.md rules)
- FK: product_details → products with `OnDelete:CASCADE`, index on `category_id`, `status`

## Security
- ContentValidator sanitizes ALL inputs (XSS: removes `<script>`, `<iframe>`, event handlers, `javascript:` URLs)
- 3-layer validation: Gin binding → Command handler (ContentValidator) → GORM parameterized queries
- FE validation = UX only
