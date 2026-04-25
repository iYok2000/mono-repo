"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal, ModalType } from "@/components/ui/Modal";
import { LoadingFallback, PageSuspense } from "@/components/ui/LoadingFallback";
import { BannerList } from "./_components/BannerList";
import { BannerFilter } from "./_components/BannerFilter";
import { AppPreviewModal } from "./_components/AppPreviewModal";
import * as bannerService from "@/services/bannerService";
import { useBanner } from "./_hooks/useBanner";
import { useBannerFilter } from "./_hooks/useBannerFilter";
import type { Banner } from "@/types/banner";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";

function BannerContent() {
  const router = useRouter();
  const { showModal: showUnauthorizedModal, errorMessage: unauthorizedErrorMessage, handleModalClose: handleUnauthorizedModalClose } = useUnauthorizedHandler();
  const { banners, loading, error, refreshBanners } = useBanner();

  // Filter hook
  const {
    searchQuery,
    selectedSegments,
    selectedStatus,
    setSearchQuery,
    setSelectedSegments,
    setSelectedStatus,
    filteredBanners,
    hasActiveFilters,
    clearFilters,
  } = useBannerFilter(banners);

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

  const [showAppPreview, setShowAppPreview] = useState(false);

  const showModal = (type: ModalType, title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleEdit = (banner: Banner) => {
    router.push(`/admin/banner/edit/${banner.id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await bannerService.deleteBanner(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
      showModal("success", "สำเร็จ", "ลบ Banner สำเร็จแล้ว");
      refreshBanners();
    } catch (error: unknown) {
      setDeleteConfirm({ show: false, id: null });
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "เกิดข้อผิดพลาดในการลบ Banner";
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Get the banner to update
      const banner = banners.find((b) => b.id === id);
      if (!banner) return;

      // Update banner with toggled status
      await bannerService.updateBanner(id, {
        ...banner,
        is_active: !currentStatus,
      });

      showModal(
        "success",
        "สำเร็จ",
        `${!currentStatus ? "เปิด" : "ปิด"}ใช้งาน Banner สำเร็จแล้ว`
      );
      refreshBanners();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Banner";
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  const handleReorder = async (bannerId: string, newPriority: number) => {
    try {
      // Find the dragged banner
      const draggedBanner = filteredBanners.find((b) => b.id === bannerId);
      if (!draggedBanner) return;

      const oldPriority = draggedBanner.priority;

      // Calculate all priority updates needed
      const updates = filteredBanners.map((banner) => {
        if (banner.id === bannerId) {
          // The dragged banner gets the new priority
          return { id: banner.id, priority: newPriority };
        } else if (oldPriority < newPriority) {
          // Moving down: shift banners between old and new position up
          if (banner.priority > oldPriority && banner.priority <= newPriority) {
            return { id: banner.id, priority: banner.priority - 1 };
          }
        } else if (oldPriority > newPriority) {
          // Moving up: shift banners between new and old position down
          if (banner.priority >= newPriority && banner.priority < oldPriority) {
            return { id: banner.id, priority: banner.priority + 1 };
          }
        }
        // No change for other banners
        return { id: banner.id, priority: banner.priority };
      });

      // Send bulk update to backend
      await bannerService.updateBannerOrder(updates);

      // Refresh the banner list
      await refreshBanners();

      showModal("success", "สำเร็จ", "เรียงลำดับ Banner สำเร็จแล้ว");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "เกิดข้อผิดพลาดในการเรียงลำดับ Banner";
      showModal("error", "เกิดข้อผิดพลาด", message);
    }
  };

  if (loading) {
    return <LoadingFallback message="กำลังโหลดข้อมูล Banner..." />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">จัดการ Banner</h1>
          <p className="mt-1 text-sm text-(--muted)">
            สร้าง แก้ไข และจัดการ Banner สำหรับระบบ
          </p>
        </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAppPreview(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              ดูตัวอย่างแอพ
            </Button>
            <Link href="/admin/banner/create">
              <Button>+ เพิ่ม Banner</Button>
            </Link>
          </div>
        </div>

        <BannerFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSegments={selectedSegments}
          onSegmentsChange={setSelectedSegments}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          totalCount={banners.length}
          filteredCount={filteredBanners.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <BannerList
          banners={filteredBanners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onReorder={handleReorder}
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
          message="คุณต้องการลบ Banner นี้ใช่หรือไม่?"
          type="warning"
          confirmText="ลบ"
          cancelText="ยกเลิก"
          onConfirm={confirmDelete}
          showCancel={true}
        />

        <AppPreviewModal
          banners={banners}
          isOpen={showAppPreview}
          onClose={() => setShowAppPreview(false)}
        />
        
        {/* Unauthorized Modal */}
        <Modal
          isOpen={showUnauthorizedModal}
          onClose={handleUnauthorizedModalClose}
          type="warning"
          title="⚠️ Session หมดอายุ"
          message={unauthorizedErrorMessage}
          confirmText="เข้าสู่ระบบใหม่"
        />
      </div>
    </div>
  );
}

function BannerPageWrapper() {
  return (
    <PageSuspense
      fallback={<LoadingFallback message="กำลังโหลดข้อมูล Banner..." />}
    >
      <BannerContent />
    </PageSuspense>
  );
}

export default withAuthentication(BannerPageWrapper);
