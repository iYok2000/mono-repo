import { Button } from "@/components/ui/Button";

interface FormActionButtonsProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
  onCancel: () => void;
  entityName?: string; // เช่น "หมวดหมู่", "Product", "Banner"
  submitText?: string; // Custom submit button text
  cancelText?: string; // Custom cancel button text
}

export const FormActionButtons = ({
  mode,
  isSubmitting = false,
  onCancel,
  entityName = "",
  submitText,
  cancelText = "ยกเลิก",
}: FormActionButtonsProps) => {
  const defaultSubmitText = isSubmitting
    ? "กำลังบันทึก..."
    : mode === "create"
      ? `สร้าง${entityName}`
      : "บันทึกการแก้ไข";

  return (
    <div className="flex gap-3">
      <Button type="submit" disabled={isSubmitting}>
        {submitText || defaultSubmitText}
      </Button>
      <Button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="bg-gray-500 hover:bg-gray-600"
      >
        {cancelText}
      </Button>
    </div>
  );
};
