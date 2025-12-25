"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal, ModalType } from "@/components/ui/Modal";
import { LoadingFallback, PageSuspense } from "@/components/ui/LoadingFallback";
import { ToolkitList } from "./_components/ToolkitList";
import * as toolkitService from "@/services/toolkitService";
import { mapToolkitError } from "./_utils/errorMapper";
import { useDevToolkit } from "./_hooks/useDevToolkit";

function DevToolkitContent() {
  const router = useRouter();
  // Data fetching with custom hook
  const { toolkits, categories, loading, error, refreshToolkits } =
    useDevToolkit();

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
  const handleEdit = (toolkit: any) => {
    router.push(`/admin/devtoolkit/edit/${toolkit.id}`);
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
        <Link href="/admin/devtoolkit/create">
          <Button className="bg-(--color-primary) hover:bg-green-600 text-white">
            + เพิ่ม Toolkit
          </Button>
        </Link>
      </div>

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
