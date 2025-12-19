import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { DevToolkit } from "@/types/devtoolkit";
import type { Category } from "@/services/category/types";
import { TOOLKIT_STATUS_LABELS } from "@/types/devtoolkit";
import { Badge } from "@/components/ui/Badge";

interface ToolkitListProps {
  toolkits: DevToolkit[];
  categories: Category[];
  onEdit: (toolkit: DevToolkit) => void;
  onDelete: (id: string) => void;
}

export const ToolkitList = ({
  toolkits,
  categories,
  onEdit,
  onDelete,
}: ToolkitListProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name_th || categoryId;
  };

  if (toolkits.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-(--color-muted)">ยังไม่มี Toolkit</p>
      </Card>
    );
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
                ชื่อ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                หมวดหมู่
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                สถานะ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                แท็ก
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {toolkits.map((toolkit) => (
              <tr
                key={toolkit.id}
                className="hover:bg-(--color-surface) transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {toolkit.id}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {toolkit.title}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {getCategoryName(toolkit.category_id)}
                </td>
                <td className="px-2 py-4 text-sm">
                  <Badge variant="primary">
                    {TOOLKIT_STATUS_LABELS[toolkit.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {toolkit.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {toolkit.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{toolkit.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onEdit(toolkit)}
                      className="bg-(--color-secondary) hover:opacity-90 px-3 py-1 text-sm text-white"
                    >
                      แก้ไข
                    </Button>
                    <Button
                      onClick={() => onDelete(toolkit.id)}
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
