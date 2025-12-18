# Category Management CRUD Page

จัดการหมวดหมู่สำหรับ DevToolkit

## Components

### `page.tsx`
หน้าหลักสำหรับ CRUD Category:
- แสดงฟอร์มเพิ่ม/แก้ไข
- แสดงตารางรายการ Categories
- Modal สำหรับ confirmation และ messages

### `_components/CategoryForm.tsx`
ฟอร์มสำหรับเพิ่ม/แก้ไข Category:
- ID (required, disabled เมื่อแก้ไข)
- ชื่อภาษาอังกฤษ (name_en)
- ชื่อภาษาไทย (name_th)

### `_components/CategoryList.tsx`
แสดงรายการ Categories แบบตาราง

### `_components/CategoryStats.tsx`
แสดงสถิติจำนวน Categories

### `_components/EmptyState.tsx`
แสดงเมื่อยังไม่มีข้อมูล

## API Integration

**Service:** `@/services/categoryService.ts`

**Endpoints:**
- `GET /api/categories` - List all
- `GET /api/categories/:id` - Get detail
- `POST /api/categories` - Create
- `PUT /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

## Design System

ใช้สีและ components เดียวกับ DevToolkit page
