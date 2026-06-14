# Banner Management

> Last updated: 2026-04-28

## What
CRUD + drag-and-drop reorder for promotional banners. Multi-language (TH/EN), segment tier targeting, date-range scheduling, mobile preview.

## Where

**Backend** (CQRS):
- Commands: `internal/application/banner/command/` — create, update, delete, reorder
- Queries: `internal/application/banner/query/` — list (filtered), get by ID
- DTOs: `internal/application/banner/dto/`
- Validation: `internal/application/banner/validation/`

**Frontend**:
- Admin: `app/admin/banner/` — page, create, edit/[id]
- Components: `app/admin/banner/_components/` — BannerList, BannerFilter, BannerCarousel, AppPreviewModal, MobilePreview, SegmentTierSelector
- Hooks: `app/admin/banner/_hooks/` — useBanner, useBannerFilter, useDragReorder

## Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/banners` | List (with filters: search, segment, status) |
| GET | `/api/banners/:id` | Get by ID |
| POST | `/api/banners` | Create |
| PUT | `/api/banners/:id` | Update |
| DELETE | `/api/banners/:id` | Delete |
| POST | `/api/banners/reorder` | Bulk priority update |

## DB Schema

```sql
banners (
  id VARCHAR(255) PK,
  image_th, image_en VARCHAR(500) NOT NULL,
  url_th, url_en VARCHAR(500) NOT NULL,
  segment_tiers JSONB NOT NULL,
  start_date, end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER NOT NULL,
  created_at, updated_at TIMESTAMP
)
-- Indexes: is_active, priority, (start_date, end_date)
```

## Key Behavior
- Drag & drop recalculates priorities for all affected banners (shift up/down)
- Reorder uses single transaction (atomic bulk update)
- Filters: search (ID/URL), segment tier (multi-select checkbox), status (active/inactive/all)
- Mobile preview: phone mockup, auto-play carousel (3s), language toggle
- Security: all inputs validated + sanitized, GORM parameterized queries
