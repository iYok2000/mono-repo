import { Card } from "@/components/ui/Card";

export const EmptyState = () => {
  return (
    <Card className="p-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-(--color-muted) opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      <p className="mt-4 text-lg font-medium text-(--color-muted)">
        ไม่มีข้อมูลหมวดหมู่
      </p>
      <p className="mt-1 text-sm text-(--color-muted)">
        คลิกปุ่ม "+ เพิ่มหมวดหมู่" ด้านบนเพื่อเริ่มต้น
      </p>
    </Card>
  );
};
