import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/services/category/types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-xs">
              {category.id}
            </Badge>
            <h3 className="text-lg font-semibold">
              {category.name_th}
            </h3>
          </div>
          <p className="mt-1 text-sm text-(--color-muted)">
            {category.name_en}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(category)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            แก้ไข
          </Button>
          <Button
            onClick={() => onDelete(category.id)}
            className="bg-red-500 hover:bg-red-600"
          >
            ลบ
          </Button>
        </div>
      </div>
    </Card>
  );
};
