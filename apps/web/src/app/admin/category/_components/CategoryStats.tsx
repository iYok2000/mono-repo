import { Card } from "@/components/ui/Card";

interface CategoryStatsProps {
  totalCategories: number;
}

export const CategoryStats = ({ totalCategories }: CategoryStatsProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-(--color-muted)">
            จำนวนหมวดหมู่ทั้งหมดในระบบ
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-foreground">
              {totalCategories}
            </p>
            <p className="text-lg font-medium text-(--color-muted)">หมวดหมู่</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
