"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal, ModalType } from "@/components/ui/Modal";
import { LoadingFallback, PageSuspense } from "@/components/ui/LoadingFallback";
import { ProductList } from "./_components/ProductList";
import * as productService from "@/services/productService";
import { mapProductError } from "./_utils/errorMapper";
import { useProduct } from "./_hooks/useProduct";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";

function ProductContent() {
  const router = useRouter();
  const { showModal: showUnauthorizedModal, errorMessage: unauthorizedError, handleModalClose } = useUnauthorizedHandler();
  // Data fetching with custom hook
  const { products, categories, loading, error, refreshProducts } =
    useProduct();

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
  const handleEdit = (product: any) => {
    router.push(`/admin/product/edit/${product.id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await productService.deleteProduct(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
      showModal("success", "สำเร็จ", "ลบ Product สำเร็จแล้ว");
      refreshProducts();
    } catch (error: unknown) {
      setDeleteConfirm({ show: false, id: null });
      const message = mapProductError(error);
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  if (loading) {
    return <LoadingFallback message="กำลังโหลดข้อมูล Product..." />;
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
    <main className="relative min-h-screen bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">จัดการ Product</h1>
            <p className="mt-2 text-(--color-muted)">
              สร้าง แก้ไข และจัดการเครื่องมือสำหรับนักพัฒนา
            </p>
          </div>
          <Link href="/admin/product/create">
            <Button>
            + เพิ่ม Product
          </Button>
        </Link>
      </header>

      <ProductList
        products={products}
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
        message="คุณต้องการลบ Product นี้ใช่หรือไม่?"
        type="warning"
        confirmText="ลบ"
        cancelText="ยกเลิก"
        onConfirm={confirmDelete}
        showCancel={true}
      />
      
      {/* Unauthorized Modal */}
      <Modal
        isOpen={showUnauthorizedModal}
        onClose={handleModalClose}
        type="warning"
        title="⚠️ Session หมดอายุ"
        message={unauthorizedError}
        confirmText="เข้าสู่ระบบใหม่"
      />
      </div>
    </main>
  );
}

function ProductPageWrapper() {
  return (
    <PageSuspense
      fallback={<LoadingFallback message="กำลังโหลดข้อมูล Product..." />}
    >
      <ProductContent />
    </PageSuspense>
  );
}

export default withAuthentication(ProductPageWrapper);
