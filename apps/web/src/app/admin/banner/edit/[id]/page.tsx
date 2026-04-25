"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BannerForm } from "../../_components/BannerForm";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";
import { getBannerById, updateBanner } from "@/services/bannerService";
import { Banner, UpdateBannerDTO, CreateBannerDTO } from "@/types/banner";
import { Modal } from "@/components/ui/Modal";

function EditBannerPage() {
  const { showModal: showUnauthorizedModal, errorMessage: unauthorizedErrorMessage, handleModalClose: handleUnauthorizedModalClose } = useUnauthorizedHandler();
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const data = await getBannerById(bannerId);
        setBanner(data);
      } catch (err: unknown) {
        console.error("Failed to fetch banner:", err);
        const error = err as any;
        setError(error?.response?.data?.message || "Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    if (bannerId) {
      fetchBanner();
    }
  }, [bannerId]);

  const handleSubmit = async (data: CreateBannerDTO | UpdateBannerDTO) => {
    try {
      await updateBanner(bannerId, data as UpdateBannerDTO);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/admin/banner");
      }, 1500);
    } catch (error: unknown) {
      console.error("Failed to update banner:", error);
      const err = error as any;
      setErrorMessage(
        err?.response?.data?.message || "Failed to update banner"
      );
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    router.push("/admin/banner");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary) mx-auto"></div>
          <p className="mt-4 text-(--color-muted)">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !banner) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">เกิดข้อผิดพลาด</h3>
        <p className="text-red-700 dark:text-red-300 mb-4">{error || "ไม่พบ Banner"}</p>
        <button onClick={() => router.push("/admin/banner")} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          กลับหน้ารายการ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">แก้ไข Banner</h1>
          <p className="mt-1 text-sm text-(--muted)">แก้ไขข้อมูล Banner</p>
        </div>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← กลับ
          </button>
        </div>

        <div className="bg-(--color-surface) rounded-lg border border-(--color-border) p-6">
          <BannerForm
            mode="edit"
            initialData={banner}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>

        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="สำเร็จ"
          message="แก้ไข Banner สำเร็จแล้ว"
          confirmText="ตกลง"
        />

        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          title="เกิดข้อผิดพลาด"
          message={errorMessage}
          confirmText="ตกลง"
        />
        <Modal
          isOpen={showUnauthorizedModal}
          onClose={handleUnauthorizedModalClose}
          type="warning"
          title="⚠️ Session หมดอายุ"
          message={unauthorizedErrorMessage}
          confirmText="เข้าสู่ระบบใหม่"
        />
    </div>
  );
}

export default withAuthentication(EditBannerPage);
