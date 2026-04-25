"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BannerForm } from "../_components/BannerForm";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";
import { createBanner } from "@/services/bannerService";
import { CreateBannerDTO, UpdateBannerDTO } from "@/types/banner";
import { Modal } from "@/components/ui/Modal";

function CreateBannerPage() {
  const { showModal: showUnauthorizedModal, errorMessage: unauthorizedError, handleModalClose } = useUnauthorizedHandler();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (data: CreateBannerDTO | UpdateBannerDTO) => {
    try {
      await createBanner(data as CreateBannerDTO);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/admin/banner");
      }, 1500);
    } catch (error: unknown) {
      console.error("Failed to create banner:", error);
      const err = error as any;
      setErrorMessage(
        err?.response?.data?.message || "Failed to create banner"
      );
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    router.push("/admin/banner");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">เพิ่ม Banner</h1>
          <p className="mt-1 text-sm text-(--muted)">
            สร้าง Banner ใหม่สำหรับระบบ
          </p>
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
          <BannerForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>

        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="สำเร็จ"
          message="สร้าง Banner สำเร็จแล้ว"
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
    </div>
  );
}

export default withAuthentication(CreateBannerPage);
