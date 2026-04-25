import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
import type { Category } from "@/services/category/types";
import { PRODUCT_STATUS_LABELS } from "@/types/product";
import { Badge } from "@/components/ui/Badge";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductList = ({
  products,
  categories,
  onEdit,
  onDelete,
}: ProductListProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name_th || categoryId;
  };

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-(--color-muted)">ยังไม่มี Product</p>
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
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-(--color-surface) transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {product.id}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {product.title}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {getCategoryName(product.category_id)}
                </td>
                <td className="px-2 py-4 text-sm">
                  <Badge variant="primary">
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onEdit(product)}
                      className="bg-(--color-secondary) hover:opacity-90 px-3 py-1 text-sm text-white"
                    >
                      แก้ไข
                    </Button>
                    <Button
                      onClick={() => onDelete(product.id)}
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
