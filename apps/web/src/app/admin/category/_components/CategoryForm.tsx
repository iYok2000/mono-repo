import { Card } from "@/components/ui/Card";
import { FormActionButtons } from "@/components/admin/FormActionButtons";

interface FormData {
  id: string;
  name_en: string;
  name_th: string;
}

interface FormErrors {
  id: string;
  name_en: string;
  name_th: string;
}

interface CategoryFormProps {
  formData: FormData;
  formErrors: FormErrors;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof FormData, value: string) => void;
  onClearError: (field: keyof FormErrors) => void;
}

export const CategoryForm = ({
  formData,
  formErrors,
  editingId,
  onSubmit,
  onCancel,
  onChange,
  onClearError,
}: CategoryFormProps) => {
  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">
          {editingId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
        </h3>

        {!editingId && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              รหัสหมวดหมู่ (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => {
                onChange("id", e.target.value);
                if (formErrors.id) onClearError("id");
              }}
              className={`w-full rounded-lg border ${
                formErrors.id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-(--color-border) focus:ring-(--color-primary)"
              } bg-(--color-surface) px-4 py-2 text-foreground focus:outline-none focus:ring-2`}
              placeholder="เช่น tech, education"
              disabled={!!editingId}
            />
            {formErrors.id && (
              <p className="mt-1 text-sm text-red-500">{formErrors.id}</p>
            )}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            ชื่อภาษาอังกฤษ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name_en}
            onChange={(e) => {
              onChange("name_en", e.target.value);
              if (formErrors.name_en) onClearError("name_en");
            }}
            className={`w-full rounded-lg border ${
              formErrors.name_en
                ? "border-red-500 focus:ring-red-500"
                : "border-(--color-border) focus:ring-(--color-primary)"
            } bg-(--color-surface) px-4 py-2 text-foreground focus:outline-none focus:ring-2`}
            placeholder="Technology"
          />
          {formErrors.name_en && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name_en}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            ชื่อภาษาไทย <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name_th}
            onChange={(e) => {
              onChange("name_th", e.target.value);
              if (formErrors.name_th) onClearError("name_th");
            }}
            className={`w-full rounded-lg border ${
              formErrors.name_th
                ? "border-red-500 focus:ring-red-500"
                : "border-(--color-border) focus:ring-(--color-primary)"
            } bg-(--color-surface) px-4 py-2 text-foreground focus:outline-none focus:ring-2`}
            placeholder="เทคโนโลยี"
          />
          {formErrors.name_th && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name_th}</p>
          )}
        </div>

        <FormActionButtons
          mode={editingId ? "edit" : "create"}
          onCancel={onCancel}
          entityName="หมวดหมู่"
        />
      </form>
    </Card>
  );
};
