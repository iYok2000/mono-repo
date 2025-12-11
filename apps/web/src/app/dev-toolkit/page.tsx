import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/cx";
import { TagBadge } from "@/components/dev/TagBadge";

type ServiceStatus = "recommended" | "new" | "coming-soon";

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  status?: ServiceStatus;
  image?: string;
  tags?: string[];
};

const STATUS_RIBBON: Record<
  Exclude<ServiceStatus, "coming-soon">,
  { label: string; className: string }
> = {
  recommended: {
    label: "Recommended",
    className: "bg-[var(--color-primary)] text-[var(--background)] shadow-md",
  },
  new: {
    label: "New",
    className:
      "bg-sky-600 text-white shadow-md dark:bg-sky-500 dark:text-[var(--background)]",
  },
};

const COMING_SOON_RIBBON = {
  label: "Coming soon",
  className:
    "bg-[var(--color-button)] text-[var(--color-muted)] border border-[var(--color-border)] shadow-md",
};

const services: ServiceItem[] = [
  {
    id: "export-csv-xlsx",
    title: "Export CSV/XLSX",
    category: "Export & Import",
    description:
      "ทดสอบดาวน์โหลดข้อมูลเป็น CSV หรือ XLSX พร้อมตัวเลือกตั้งชื่อไฟล์",
    status: "recommended",
    tags: ["export"],
    image: "https://placehold.co/600x300?text=Export+CSV+XLSX",
  },
  {
    id: "export-pdf",
    title: "Export PDF",
    category: "Export & Import",
    description: "แม่แบบทดลองการสร้าง PDF เพื่อตรวจสอบฟอนต์และเค้าโครง",
    status: "new",
    tags: ["export"],
    image: "https://placehold.co/600x300?text=Export+PDF",
  },
  {
    id: "import-xlsx",
    title: "Import XLSX",
    category: "Export & Import",
    description: "อัปโหลดไฟล์ XLSX และพรีวิวข้อมูลก่อนบันทึก",
    tags: ["import"],
    image: "https://placehold.co/600x300?text=Import+XLSX",
  },
  {
    id: "theme-switch",
    title: "Theme Switch Playground",
    category: "Theme & UI",
    description: "ลองสลับธีมและดูการเปลี่ยนแปลงของสีพื้นผิว/คอนเทนต์",
    status: "recommended",
    tags: ["ui"],
    image: "https://placehold.co/600x300?text=Theme+Switch",
  },
  {
    id: "table-export",
    title: "Table with Export Button",
    category: "Theme & UI",
    description: "ตัวอย่างตารางพร้อมปุ่ม Export ฝังใน UI จริง",
    tags: ["ui"],
    image: "https://placehold.co/600x300?text=Table+Export",
  },
  {
    id: "coming-soon-1",
    title: "Coming soon…",
    category: "อื่น ๆ ในอนาคต",
    description:
      "เตรียมเพิ่ม service ใหม่ เช่น Monitoring mock, Form validations, playground อื่น ๆ",
    status: "coming-soon",
    tags: ["roadmap"],
    image: "https://placehold.co/600x300?text=Coming+Soon",
  },
];

const recommended = services.filter((item) => item.status === "recommended");

const ServiceCard = ({ item }: { item: ServiceItem }) => {
  const isComingSoon = item.status === "coming-soon";
  const detailHref = isComingSoon ? "#" : `/dev-toolkit/${item.id}`;

  const statusRibbon =
    item.status === "coming-soon"
      ? COMING_SOON_RIBBON
      : item.status
      ? STATUS_RIBBON[item.status]
      : null;

  const ctaClass = cx(
    "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    isComingSoon
      ? "border-[var(--color-border)] bg-[var(--color-button)] text-[var(--color-muted)] cursor-not-allowed opacity-70"
      : "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--background)] hover:opacity-90",
    isComingSoon && "pointer-events-none"
  );

  return (
    <Card
      variant="default"
      padding="sm"
      className="relative h-full overflow-hidden bg-[var(--color-surface)] text-[var(--foreground)]"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <Link
            href={detailHref}
            aria-disabled={isComingSoon}
            tabIndex={isComingSoon ? -1 : 0}
            className={ctaClass}
          >
            {isComingSoon ? "กำลังมา" : "เปิดดู"}
          </Link>
        </div>
      }
    >
      {statusRibbon && (
        <div className="pointer-events-none absolute -right-7 top-5 rotate-[30deg]">
          <span
            className={cx(
              "flex w-[140px] items-center justify-center px-3 py-0.5 text-[9px] leading-none text-center font-semibold uppercase tracking-wide whitespace-nowrap",
              statusRibbon.className
            )}
          >
            {statusRibbon.label}
          </span>
        </div>
      )}

      <div className="space-y-2 text-sm leading-relaxed">
        <h3 className="text-base font-semibold">{item.title}</h3>
        <p className="text-[13px] text-[var(--color-muted)]">
          {item.description}
        </p>
      </div>
    </Card>
  );
};

export default function DevToolkitPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
            Dev Tools
          </p>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dev Toolkit</h1>
            <p className="max-w-3xl text-base text-[var(--color-muted)]">
              รวม service และ demo ที่ทีมใช้ลองฟีเจอร์ เช่น export/import/theme
              พร้อมลิงก์ไปหน้าทดสอบย่อย
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended</h2>
            <p className="text-sm text-[var(--color-muted)]">
              ลองอันนี้ก่อนเพื่อเห็น flow หลัก
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">All Services</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
