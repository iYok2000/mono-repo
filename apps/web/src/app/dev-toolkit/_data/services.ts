import type { TagKey } from "@/config/tagMeta";

export type ServiceStatus = "recommended" | "new" | "coming-soon" | "default";

export type ServiceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  status?: ServiceStatus;
  tags?: TagKey[];
  image?: string;
};

export const services: ServiceItem[] = [
  {
    id: "export-csv-xlsx",
    title: "Export CSV/XLSX",
    category: "Export & Import",
    description:
      "ทดสอบดาวน์โหลดข้อมูลเป็น CSV หรือ XLSX พร้อมตัวเลือกตั้งชื่อไฟล์",
    status: "recommended",
    tags: ["export", "ts"],
    image: "https://placehold.co/600x300?text=Export+CSV+XLSX",
  },
  {
    id: "export-pdf",
    title: "Export PDF",
    category: "Export & Import",
    description: "แม่แบบทดลองการสร้าง PDF เพื่อตรวจสอบฟอนต์และเค้าโครง",
    status: "new",
    tags: ["export", "ts"],
    image: "https://placehold.co/600x300?text=Export+PDF",
  },
  {
    id: "import-xlsx",
    title: "Import XLSX",
    category: "Export & Import",
    description: "อัปโหลดไฟล์ XLSX และพรีวิวข้อมูลก่อนบันทึก",
    tags: ["import", "ts"],
    status: "default",
    image: "https://placehold.co/600x300?text=Import+XLSX",
  },
  {
    id: "theme-switch",
    title: "Theme Switch Playground",
    category: "Theme & UI",
    description: "ลองสลับธีมและดูการเปลี่ยนแปลงของสีพื้นผิว/คอนเทนต์",
    status: "recommended",
    tags: ["ui", "react", "next"],
    image: "https://placehold.co/600x300?text=Theme+Switch",
  },
  {
    id: "table-export",
    title: "Table with Export Button",
    category: "Theme & UI",
    description: "ตัวอย่างตารางพร้อมปุ่ม Export ฝังใน UI จริง",
    tags: ["ui", "react", "next", "ts"],
    status: "default",
    image: "https://placehold.co/600x300?text=Table+Export",
  },
  {
    id: "coming-soon-1",
    title: "Coming soon…",
    category: "Roadmap",
    description:
      "เตรียมเพิ่ม service ใหม่ เช่น Monitoring mock, Form validations, playground อื่น ๆ",
    status: "coming-soon",
    tags: ["roadmap"],
    image: "https://placehold.co/600x300?text=Coming+Soon",
  },
];

export const recommended = services.filter(
  (item) => item.status === "recommended"
);
