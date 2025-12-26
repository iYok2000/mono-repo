"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal, ModalType } from "@/components/ui/Modal";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { CodeExample } from "@/components/admin/CodeExample";
import { FormActionButtons } from "@/components/admin/FormActionButtons";
import * as toolkitService from "@/services/toolkitService";
import { useDevToolkit } from "../_hooks/useDevToolkit";
import { TOOLKIT_STATUSES, TOOLKIT_STATUS_LABELS, PREDEFINED_TAGS } from "@/types/devtoolkit";

interface FormData {
  id: string;
  category_id: string;
  title: string;
  status: string;
  tags: string[];
  image: string;
  description: string;
  main_content: string;
  how_to_use: string;
  reference: string;
  example: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateDevToolkitPage() {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useDevToolkit();

  const [formData, setFormData] = useState<FormData>({
    id: "",
    category_id: "",
    title: "",
    status: "default",
    tags: [],
    image: "",
    description: "",
    main_content: "",
    how_to_use: "",
    reference: "",
    example: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.id.trim()) errors.id = "กรุณากรอกรหัส";
    if (!formData.category_id) errors.category_id = "กรุณาเลือกหมวดหมู่";
    if (!formData.title.trim()) errors.title = "กรุณากรอกชื่อ";
    if (!formData.description.trim()) errors.description = "กรุณากรอกคำอธิบาย";
    if (formData.tags.length === 0) errors.tags = "กรุณาเลือกอย่างน้อย 1 แท็ก";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Tag toggle
  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await toolkitService.createToolkit({
        id: formData.id.trim(),
        category_id: formData.category_id,
        title: formData.title.trim(),
        status: formData.status,
        tags: formData.tags,
        image: formData.image.trim(),
        description: formData.description.trim(),
        main_content: formData.main_content.trim(),
        how_to_use: formData.how_to_use.trim(),
        reference: formData.reference.trim(),
        example: formData.example.trim(),
      });

      setModal({
        isOpen: true,
        type: "success",
        title: "สำเร็จ",
        message: "เพิ่ม Toolkit สำเร็จแล้ว",
      });

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/devtoolkit");
      }, 1500);
    } catch (error: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: error?.response?.data?.message || "ไม่สามารถเพิ่ม Toolkit ได้",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary) mx-auto"></div>
          <p className="mt-4 text-(--color-muted)">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">เพิ่ม DevToolkit</h1>
            <p className="mt-2 text-(--color-muted)">
              สร้างเครื่องมือใหม่สำหรับนักพัฒนา
            </p>
          </div>
          <Link href="/admin/devtoolkit">
            <Button className="bg-gray-500 hover:bg-gray-600">
              ← กลับ
            </Button>
          </Link>
        </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-(--color-surface) rounded-lg border border-(--color-border) p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">ข้อมูลพื้นฐาน</h2>

          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              รหัส (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="เช่น vscode, docker, git"
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.id
                  ? "border-red-500"
                  : "border-(--color-border)"
              } focus:outline-none focus:ring-2 focus:ring-(--color-primary)`}
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
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.category_id
                  ? "border-red-500"
                  : "border-(--color-border)"
              } focus:outline-none focus:ring-2 focus:ring-(--color-primary)`}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_th}
                </option>
              ))}
            </select>
            {formErrors.category_id && (
              <p className="mt-1 text-sm text-red-500">{formErrors.category_id}</p>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น Visual Studio Code"
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.title
                  ? "border-red-500"
                  : "border-(--color-border)"
              } focus:outline-none focus:ring-2 focus:ring-(--color-primary)`}
              maxLength={255}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-(--color-border) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            >
              {TOOLKIT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {TOOLKIT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              แท็ก <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? "bg-(--color-primary) text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formErrors.tags && (
              <p className="mt-2 text-sm text-red-500">{formErrors.tags}</p>
            )}
            {formData.tags.length > 0 && (
              <p className="mt-2 text-sm text-(--color-muted)">
                เลือกแล้ว: {formData.tags.join(", ")}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL รูปภาพ
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.png"
              className="w-full px-4 py-2 rounded-md border border-(--color-border) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>

          {/* Description */}
          <ContentEditor
            label="คำอธิบายสั้น"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="คำอธิบายสั้นๆ เกี่ยวกับเครื่องมือนี้ สามารถใช้ markdown ได้"
            maxLength={5000}
            rows={3}
            error={formErrors.description}
            required={true}
            helpText="รองรับ Markdown สำหรับการจัดรูปแบบข้อความ"
          />
        </div>

        {/* Content Card */}
        <div className="bg-(--color-surface) rounded-lg border border-(--color-border) p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">เนื้อหาเพิ่มเติม</h2>

          {/* Main Content */}
          <ContentEditor
            label="เนื้อหาหลัก (Main Content)"
            value={formData.main_content}
            onChange={(value) => setFormData({ ...formData, main_content: value })}
            placeholder="เขียนบทความหรือเนื้อหาหลักเกี่ยวกับเครื่องมือนี้ สามารถใช้ markdown ได้"
            maxLength={50000}
            rows={12}
            helpText="รองรับ Markdown สำหรับการจัดรูปแบบข้อความ"
          />

          {/* How to Use */}
          <ContentEditor
            label="วิธีการใช้งาน (How to Use)"
            value={formData.how_to_use}
            onChange={(value) => setFormData({ ...formData, how_to_use: value })}
            placeholder="คำแนะนำการใช้งานหรือขั้นตอนต่างๆ"
            maxLength={10000}
            rows={8}
            helpText="อธิบายวิธีการใช้งานเครื่องมือนี้"
          />

          {/* Reference */}
          <ContentEditor
            label="เอกสารอ้างอิง (Reference)"
            value={formData.reference}
            onChange={(value) => setFormData({ ...formData, reference: value })}
            placeholder="ลิงก์หรือข้อมูลอ้างอิงต่างๆ"
            maxLength={5000}
            rows={6}
            helpText="เอกสารอ้างอิง ลิงก์ หรือข้อมูลเพิ่มเติม"
          />

          {/* Example */}
          <div className="space-y-2">
            <ContentEditor
              label="ตัวอย่างโค้ด (Example)"
              value={formData.example}
              onChange={(value) => setFormData({ ...formData, example: value })}
              placeholder="ตัวอย่างโค้ดหรือการใช้งาน"
              maxLength={20000}
              rows={10}
              helpText="ตัวอย่างโค้ดจะแสดงพร้อมปุ่ม Copy ในหน้าแสดงผล"
            />

            {/* Example Preview */}
            {formData.example && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  ตัวอย่างการแสดงผล:
                </p>
                <CodeExample code={formData.example} title="Example Code" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <FormActionButtons
          mode="create"
          isSubmitting={submitting}
          onCancel={() => router.push("/admin/devtoolkit")}
          entityName="DevToolkit"
        />
      </form>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
      </div>
    </main>
  );
}
