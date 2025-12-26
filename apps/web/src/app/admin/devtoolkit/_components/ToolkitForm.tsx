import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/services/category/types";
import type { ToolkitStatus, PredefinedTag } from "@/types/devtoolkit";
import { TOOLKIT_STATUS_LABELS } from "@/types/devtoolkit";
import { cx } from "@/lib/cx";

interface ToolkitFormData {
  id: string;
  category_id: string;
  title: string;
  status: ToolkitStatus;
  tags: string[];
  image: string;
  description: string;
}

interface ToolkitFormProps {
  formData: ToolkitFormData;
  formErrors: {
    id: string;
    category_id: string;
    title: string;
    description: string;
  };
  categories: Category[];
  statuses: readonly ToolkitStatus[];
  availableTags: readonly string[];
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updater: (prev: ToolkitFormData) => ToolkitFormData) => void;
  onTagToggle: (tag: string) => void;
}

export const ToolkitForm = ({
  formData,
  formErrors,
  categories,
  statuses,
  availableTags,
  isEditing,
  onSubmit,
  onChange,
  onTagToggle,
}: ToolkitFormProps) => {
  const handleChange = (field: keyof ToolkitFormData, value: string | string[] | ToolkitStatus) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        {isEditing ? "แก้ไข Toolkit" : "เพิ่ม Toolkit ใหม่"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              รหัส <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              disabled={isEditing}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="เช่น vscode"
            />
            {formErrors.id && (
              <p className="mt-1 text-sm text-red-500">{formErrors.id}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category_id || ""}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_th} ({cat.name_en})
                </option>
              ))}
            </select>
            {formErrors.category_id && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.category_id}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ชื่อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none"
              placeholder="เช่น Visual Studio Code"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              สถานะ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value as ToolkitStatus)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {TOOLKIT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              URL รูปภาพ
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            แท็ก <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
                className={cx(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  formData.tags.includes(tag)
                    ? "bg-(--color-primary) text-white"
                    : "border border-(--color-border) text-(--color-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-(--color-muted)">
            เลือก: {formData.tags.join(", ") || "ยังไม่ได้เลือก"}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            คำอธิบาย <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-(--color-border) bg-(--color-button) px-4 py-2 text-foreground focus:border-(--color-primary) focus:outline-none resize-none"
            placeholder="อธิบายรายละเอียดของเครื่องมือนี้"
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-500">
              {formErrors.description}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-(--color-primary) text-white hover:opacity-90"
          >
            {isEditing ? "บันทึกการแก้ไข" : "เพิ่ม Toolkit"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
