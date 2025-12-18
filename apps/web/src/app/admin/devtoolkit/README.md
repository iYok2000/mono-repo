# DevToolkit CRUD Page

จัดการเครื่องมือสำหรับนักพัฒนา (Developer Toolkits)

## Components

### `page.tsx`
หน้าหลักสำหรับ CRUD DevToolkit:
- แสดงฟอร์มเพิ่ม/แก้ไข
- แสดงตารางรายการ Toolkits
- จัดการ state และ API calls
- Modal สำหรับ confirmation และ messages

### `_components/ToolkitForm.tsx`
ฟอร์มสำหรับเพิ่ม/แก้ไข Toolkit:
- ID (required, disabled เมื่อแก้ไข)
- Category (dropdown จาก categories API)
- Title (text input)
- Status (dropdown: recommended, new, coming_soon, default)
- Tags (multi-select buttons, 15 predefined tags)
- Image URL (optional)
- Description (textarea)

### `_components/ToolkitList.tsx`
แสดงรายการ Toolkits แบบตาราง:
- แสดง ID, ชื่อ, หมวดหมู่, สถานะ, tags
- ปุ่มแก้ไขและลบ
- Badge สำหรับแสดง status และ tags

## Features

✅ Create, Read, Update, Delete Toolkits  
✅ Form validation  
✅ Category selection (mandatory)  
✅ Status configuration  
✅ Tags multi-select  
✅ Confirmation modal for delete  
✅ Success/Error notifications  
✅ Responsive table layout  

## API Integration

**Service:** `@/services/toolkitService.ts`

**Endpoints:**
- `GET /api/toolkits` - List all
- `GET /api/toolkits/:id` - Get detail
- `POST /api/toolkits` - Create
- `PUT /api/toolkits/:id` - Update
- `DELETE /api/toolkits/:id` - Delete

## Types

**File:** `@/types/devtoolkit.ts`

```typescript
interface DevToolkit {
  id: string;
  category_id: string;
  title: string;
  status: "recommended" | "new" | "coming_soon" | "default";
  tags: string[];
  image: string;
  description?: string;
}
```

## Validation Rules

- ID: required (เมื่อสร้างใหม่)
- Category: required (ต้องมีอยู่ใน database)
- Title: required, max 255 chars
- Status: required (ต้องเป็นค่าที่กำหนด)
- Tags: required, ต้องอยู่ใน predefined list
- Description: required

## Design System

**Colors:**
- Edit button: `bg-(--color-secondary)` (Teal)
- Delete button: `bg-red-600`
- Primary button: `bg-(--color-primary)` (Green)

**Components:**
- Card, Button, Badge, Modal from `@/components/ui/`
- AdminSidebar from `@/components/admin/`
