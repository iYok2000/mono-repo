# Banner Management System

## Overview

ระบบจัดการ Banner สำหรับแสดงโฆษณาและข้อมูลโปรโมชั่นในแอพพลิเคชัน รองรับหลายภาษา (TH/EN), การจัดกลุ่มผู้ใช้ตาม Segment Tier, และการจัดลำดับแบบ Drag & Drop

## Why

**Business Requirements:**
- ต้องการแสดง promotional banners ในแอพแบบ dynamic
- กำหนดกลุ่มเป้าหมาย (Segment Tiers) แยกต้าม user tier
- สามารถจัดการเนื้อหาแบบ multi-language (TH/EN)
- กำหนดระยะเวลาแสดงผล (start/end date)
- จัดลำดับ priority การแสดงผลได้ง่าย
- Preview ก่อนเผยแพร่

## Architecture

### Backend (Go - Hexagonal + CQRS)

```
internal/application/banner/
├── command/              # Write Operations
│   ├── create_banner.go      # สร้าง
│   ├── update_banner.go      # แก้ไข
│   ├── delete_banner.go      # ลบ
│   └── reorder_banners.go    # จัดลำดับ (Bulk Update)
│
├── query/                # Read Operations
│   ├── list_banners.go       # ดึงรายการ (with filters)
│   └── get_banner.go         # ดึง 1 รายการ
│
├── dto/                  # Data Transfer Objects
├── validation/           # Input Validation & Sanitization
```

**Pattern ที่ใช้:**
- **Hexagonal Architecture** - แยก Domain, Application, Infrastructure
- **CQRS** - แยก Command (Write) และ Query (Read)
- **Repository Pattern** - Interface สำหรับ data access
- **Dependency Injection** - ผ่าน Container

### Frontend (Next.js/React)

```
app/admin/banner/
├── page.tsx                    # Main page (list & management)
├── create/page.tsx             # Create form
├── edit/[id]/page.tsx          # Edit form
├── _components/
│   ├── BannerList.tsx          # Table with drag & drop
│   ├── BannerFilter.tsx        # Search & filters
│   ├── BannerCarousel.tsx      # Preview carousel
│   ├── AppPreviewModal.tsx     # Mobile app preview
│   ├── MobilePreview.tsx       # Phone mockup
│   └── SegmentTierSelector.tsx # Multi-select dropdown
└── _hooks/
    ├── useBanner.ts            # Data fetching
    ├── useBannerFilter.ts      # Filter logic
    └── useDragReorder.ts       # Drag & drop state
```

## Features

### 1. CRUD Operations
- **Create** - สร้าง banner ใหม่พร้อม validation
- **Read** - ดึงรายการแบบ filtered และ sorted
- **Update** - แก้ไขข้อมูล banner
- **Delete** - ลบ banner
- **Toggle Status** - เปิด/ปิดใช้งาน

### 2. Drag & Drop Reordering
- ลากเลื่อน row ในตารางเพื่อเรียงลำดับ
- Bulk update priorities แบบ atomic
- Visual feedback (highlight, opacity)
- Auto-recalculate priorities

### 3. Advanced Filtering
- **Search** - ค้นหาจาก ID หรือ URL
- **Segment Tier** - เลือกหลายกลุ่มพร้อมกัน (checkbox)
- **Status** - Active/Inactive/All
- **Clear filters** - ล้างตัวกรองทั้งหมด

### 4. Mobile Preview
- Preview แบบ phone mockup
- Auto-play carousel (3 seconds)
- Language toggle (TH/EN)
- แสดงเฉพาะ active banners
- Sorted by priority

### 5. Security (MANDATORY)
- **Input Validation** - ทุก field ต้องผ่าน validator
- **Sanitization** - HTML escape, XSS protection
- **SQL Injection Prevention** - GORM parameterized queries
- **Length Validation** - Max length checks

## API Endpoints

```
GET    /api/banners              # List all banners (with filters)
GET    /api/banners/:id          # Get banner by ID
POST   /api/banners              # Create new banner
PUT    /api/banners/:id          # Update banner
DELETE /api/banners/:id          # Delete banner
POST   /api/banners/reorder      # Bulk update priorities
```

### Request/Response Examples

**POST /api/banners**
```json
{
  "image_th": "/images/banner-th.jpg",
  "image_en": "/images/banner-en.jpg",
  "url_th": "https://example.com/promo-th",
  "url_en": "https://example.com/promo-en",
  "segment_tiers": ["tier1", "tier2"],
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "is_active": true,
  "priority": 1
}
```

**POST /api/banners/reorder**
```json
{
  "updates": [
    {"id": "banner-1", "priority": 3},
    {"id": "banner-2", "priority": 1},
    {"id": "banner-3", "priority": 2}
  ]
}
```

## Key Implementation Details

### 1. Drag & Drop Logic

**Frontend** (`handleReorder` in page.tsx):
```typescript
// Calculate priority updates when dragging
const updates = filteredBanners.map((banner) => {
  if (banner.id === bannerId) {
    return { id: banner.id, priority: newPriority };
  } else if (oldPriority < newPriority) {
    // Moving down: shift banners up
    if (banner.priority > oldPriority && banner.priority <= newPriority) {
      return { id: banner.id, priority: banner.priority - 1 };
    }
  } else if (oldPriority > newPriority) {
    // Moving up: shift banners down
    if (banner.priority >= newPriority && banner.priority < oldPriority) {
      return { id: banner.id, priority: banner.priority + 1 };
    }
  }
  return { id: banner.id, priority: banner.priority };
});
```

**Backend** (`reorder_banners.go`):
```go
// Batch update using repository method
func (h *ReorderBannersHandler) Handle(ctx context.Context, cmd ReorderBannersCommand) error {
    // Validate all banner IDs exist
    for _, update := range cmd.Updates {
        banner, err := h.repo.GetByID(ctx, update.ID)
        if err != nil || banner == nil {
            return errors
        }
    }

    // Batch update in single transaction
    return h.repo.UpdatePriorities(ctx, repoUpdates)
}
```

### 2. Filter State Management

**Custom Hook** (`useBannerFilter.ts`):
```typescript
export const useBannerFilter = (banners: Banner[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const filteredBanners = useMemo(() => {
    return banners
      .filter((banner) => {
        const matchesSearch = /* search logic */;
        const matchesSegment = /* segment logic */;
        const matchesStatus = /* status logic */;
        return matchesSearch && matchesSegment && matchesStatus;
      })
      .sort((a, b) => a.priority - b.priority); // Lower priority first
  }, [banners, searchQuery, selectedSegments, selectedStatus]);

  return { /* state and setters */ };
};
```

### 3. Component Architecture

**Separation of Concerns:**
- `BannerFilter` - Pure UI component (receives props)
- `useBannerFilter` - Business logic (filter algorithm)
- `page.tsx` - Orchestration (connects data & UI)

**Benefits:**
- ✅ Reusable components
- ✅ Testable logic
- ✅ Clear responsibilities
- ✅ Easy to maintain

## Database Schema

```sql
CREATE TABLE banners (
    id VARCHAR(255) PRIMARY KEY,
    image_th VARCHAR(500) NOT NULL,
    image_en VARCHAR(500) NOT NULL,
    url_th VARCHAR(500) NOT NULL,
    url_en VARCHAR(500) NOT NULL,
    segment_tiers JSONB NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_priority ON banners(priority);
CREATE INDEX idx_banners_dates ON banners(start_date, end_date);
```

## Dependencies

### Backend
- **Gin** - HTTP framework
- **GORM** - ORM for database
- **PostgreSQL** - Database
- Custom error handling (`pkg/errors`)

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- Native HTML5 Drag & Drop API

## Security Considerations

### Input Validation (MANDATORY)

**Backend Validation Chain:**
1. **HTTP Request Layer** - Gin binding validation
   ```go
   type CreateBannerRequest struct {
       ImageTH      string   `json:"image_th" binding:"required,max=500"`
       SegmentTiers []string `json:"segment_tiers" binding:"required,min=1"`
       Priority     int      `json:"priority" binding:"required,min=0"`
   }
   ```

2. **Command Handler** - Business validation & sanitization
   ```go
   sanitizedImageTH, err := h.validator.ValidateImagePath(cmd.ImageTH)
   sanitizedURLTH, err := h.validator.ValidateURL(cmd.URLTH)
   ```

3. **Repository Layer** - GORM parameterized queries (SQL injection prevention)

**Frontend Validation:**
- Client-side validation for UX only
- Backend re-validates everything (security layer)

## Performance Optimizations

1. **Bulk Updates** - Reorder API อัพเดทหลาย banners พร้อมกัน
2. **Indexed Queries** - Index บน is_active, priority, dates
3. **Memoization** - useMemo สำหรับ filtered data
4. **Optimistic UI** - Drag & drop แสดง feedback ทันที

## Testing Scenarios

### Manual Testing Checklist
- [ ] Create banner with valid data
- [ ] Create banner with invalid data (validation errors)
- [ ] Update banner information
- [ ] Delete banner
- [ ] Toggle banner status
- [ ] Drag & drop to reorder (priority updates correctly)
- [ ] Filter by search query
- [ ] Filter by segment tiers (multiple selection)
- [ ] Filter by status
- [ ] Preview in mobile mockup (both languages)
- [ ] Check banners display in correct priority order

## Notes

### Important Behaviors
- **Priority Sorting** - Lower number = higher priority (1 shows before 2)
- **Atomic Reorder** - ทุก priority update สำเร็จพร้อมกันหรือล้มทั้งหมด
- **Active Banners Only** - Mobile preview แสดงเฉพาะ is_active = true
- **CQRS Pattern** - Command และ Query แยกไฟล์กัน (เพื่อ scalability)

### Future Enhancements
- [ ] Image upload (ตอนนี้ใช้ URL)
- [ ] A/B Testing support
- [ ] Click tracking & analytics
- [ ] Schedule publishing (auto activate/deactivate)
- [ ] Banner templates
- [ ] Caching layer for high traffic

### Known Limitations
- Image hosting ต้องจัดการแยก (ไม่มี upload)
- ไม่มี version history
- ไม่มี approval workflow

## Related Features
- Segment Tier Management (for filtering)
- Multi-language support (TH/EN)
