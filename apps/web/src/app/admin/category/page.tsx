"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { ModalType } from "@/components/ui/Modal";
import { CategoryStats } from "./_components/CategoryStats";
import { CategoryForm } from "./_components/CategoryForm";
import { CategoryList } from "./_components/CategoryList";
import * as categoryService from "@/services/categoryService";
import { CategoryServiceError } from "@/services/categoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState<categoryService.Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name_en: "",
    name_th: "",
  });
  const [formErrors, setFormErrors] = useState({
    id: "",
    name_en: "",
    name_th: "",
  });
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
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    categoryId: string | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const showModal = (type: ModalType, title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      console.log("Categories loaded:", data);
      setCategories(data);
    } catch (err) {
      showModal("error", "เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      console.error("Error loading categories:", err);
    }
  };

  const validateForm = () => {
    const errors = {
      id: "",
      name_en: "",
      name_th: "",
    };
    let isValid = true;

    if (!editingId && !formData.id.trim()) {
      errors.id = "กรุณากรอกรหัสหมวดหมู่";
      isValid = false;
    }

    if (!formData.name_en.trim()) {
      errors.name_en = "กรุณากรอกชื่อภาษาอังกฤษ";
      isValid = false;
    }

    if (!formData.name_th.trim()) {
      errors.name_th = "กรุณากรอกชื่อภาษาไทย";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, {
          name_en: formData.name_en,
          name_th: formData.name_th,
        });
        showModal("success", "แก้ไขสำเร็จ", "แก้ไขหมวดหมู่เรียบร้อยแล้ว");
      } else {
        await categoryService.createCategory({
          id: formData.id,
          name_en: formData.name_en,
          name_th: formData.name_th,
        });
        showModal("success", "สร้างสำเร็จ", "สร้างหมวดหมู่เรียบร้อยแล้ว");
      }

      await loadCategories();
      handleCancelForm();
    } catch (err) {
      console.error(err);
      if (err instanceof CategoryServiceError) {
        showModal("error", "เกิดข้อผิดพลาด", err.message);
      } else {
        showModal("error", "เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleEdit = (category: categoryService.Category) => {
    setEditingId(category.id);
    setFormData({
      id: category.id,
      name_en: category.name_en,
      name_th: category.name_th,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, categoryId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return;

    try {
      await categoryService.deleteCategory(deleteConfirm.categoryId);
      setDeleteConfirm({ isOpen: false, categoryId: null });
      showModal("success", "ลบสำเร็จ", "ลบหมวดหมู่เรียบร้อยแล้ว");
      await loadCategories();
    } catch (err) {
      console.error(err);
      setDeleteConfirm({ isOpen: false, categoryId: null });
      if (err instanceof CategoryServiceError) {
        showModal("error", "เกิดข้อผิดพลาด", err.message);
      } else {
        showModal("error", "เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ id: "", name_en: "", name_th: "" });
    setFormErrors({ id: "", name_en: "", name_th: "" });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearFormError = (field: keyof typeof formErrors) => {
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <main className="relative min-h-screen bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">จัดการหมวดหมู่</h1>
            <p className="mt-2 text-(--color-muted)">
              สร้าง แก้ไข และจัดการหมวดหมู่ต่างๆ ในระบบ
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "ยกเลิก" : "+ เพิ่มหมวดหมู่"}
          </Button>
        </header>

        {showForm && (
          <CategoryForm
            formData={formData}
            formErrors={formErrors}
            editingId={editingId}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            onChange={handleInputChange}
            onClearError={clearFormError}
          />
        )}

        <CategoryStats totalCategories={categories.length} />

        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmText="ตกลง"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, categoryId: null })}
        type="warning"
        title="ยืนยันการลบ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        confirmText="ลบ"
        cancelText="ยกเลิก"
        showCancel={true}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
