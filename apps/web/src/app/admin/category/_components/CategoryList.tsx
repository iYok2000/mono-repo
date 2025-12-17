import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "./EmptyState";
import type { Category } from "@/services/category/types";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-(--color-surface) border-b border-(--color-border)">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                รหัส
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                ชื่อภาษาอังกฤษ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                ชื่อภาษาไทย
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-(--color-surface) transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {category.id}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {category.name_en}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {category.name_th}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onEdit(category)}
                      className="bg-(--color-secondary) hover:opacity-90 px-3 py-1 text-sm text-white"
                    >
                      แก้ไข
                    </Button>
                    <Button
                      onClick={() => onDelete(category.id)}
                      className="bg-red-600 dark:bg-red-500 hover:opacity-90 px-3 py-1 text-sm text-white"
                    >
                      ลบ
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
