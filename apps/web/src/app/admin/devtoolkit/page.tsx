"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal, ModalType } from "@/components/ui/Modal";
import { LoadingFallback, PageSuspense } from "@/components/ui/LoadingFallback";
import { ToolkitForm } from "./_components/ToolkitForm";
import { ToolkitList } from "./_components/ToolkitList";
import * as toolkitService from "@/services/toolkitService";
import { TOOLKIT_STATUSES, PREDEFINED_TAGS } from "@/types/devtoolkit";
import { mapToolkitError } from "./_utils/errorMapper";
import { useDevToolkit } from "./_hooks/useDevToolkit";
import { useToolkitForm } from "./_hooks/useToolkitForm";

function DevToolkitContent() {
  // Data fetching with custom hook
  const { toolkits, categories, loading, error, refreshToolkits } =
    useDevToolkit();

  // Form management with custom hook
  const {
    formData,
    setFormData,
    formErrors,
    editingId,
    showForm,
    setShowForm,
    validateForm,
    setEditMode,
    resetForm,
    handleTagToggle,
  } = useToolkitForm(categories);

  // Modal states
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
    show: boolean;
    id: string | null;
  }>({
    show: false,
    id: null,
  });

  // Modal handlers
  const showModal = (type: ModalType, title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // CRUD handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await toolkitService.updateToolkit(editingId, {
          category_id: formData.category_id,
          title: formData.title,
          status: formData.status,
          tags: formData.tags,
          image: formData.image,
          description: formData.description,
        });
        showModal("success", "สำเร็จ", "แก้ไข Toolkit สำเร็จแล้ว");
      } else {
        await toolkitService.createToolkit({
          id: formData.id,
          category_id: formData.category_id,
          title: formData.title,
          status: formData.status,
          tags: formData.tags,
          image: formData.image,
          description: formData.description,
        });
        showModal("success", "สำเร็จ", "เพิ่ม Toolkit สำเร็จแล้ว");
      }

      resetForm();
      refreshToolkits();
    } catch (error: any) {
      const message = mapToolkitError(error);
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  const handleEdit = (toolkit: any) => {
    setEditMode(toolkit);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await toolkitService.deleteToolkit(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
      showModal("success", "สำเร็จ", "ลบ Toolkit สำเร็จแล้ว");
      refreshToolkits();
    } catch (error: any) {
      setDeleteConfirm({ show: false, id: null });
      const message = mapToolkitError(error);
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  // Loading and error states
  if (loading) {
    return <LoadingFallback message="กำลังโหลดข้อมูล DevToolkit..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            จัดการ DevToolkit
          </h1>
          <p className="mt-2 text-sm text-(--color-muted)">
            จัดการเครื่องมือสำหรับนักพัฒนา
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-(--color-primary) text-white"
        >
          {showForm ? "ยกเลิก" : "+ เพิ่ม Toolkit"}
        </Button>
      </div>

      {showForm && (
        <ToolkitForm
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          statuses={TOOLKIT_STATUSES}
          availableTags={PREDEFINED_TAGS}
          isEditing={!!editingId}
          onSubmit={handleSubmit}
          onChange={setFormData}
          onTagToggle={handleTagToggle}
        />
      )}

      <ToolkitList
        toolkits={toolkits}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <Modal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        title="ยืนยันการลบ"
        message="คุณต้องการลบ Toolkit นี้ใช่หรือไม่?"
        type="warning"
        confirmText="ลบ"
        cancelText="ยกเลิก"
        onConfirm={confirmDelete}
        showCancel={true}
      />
    </div>
  );
}

export default function DevToolkitPage() {
  return (
    <PageSuspense
      fallback={<LoadingFallback message="กำลังโหลดข้อมูล DevToolkit..." />}
    >
      <DevToolkitContent />
    </PageSuspense>
  );
}
