"use client";

import { useState } from "react";
import { Banner, CreateBannerDTO, UpdateBannerDTO } from "@/types/banner";
import { SegmentSelector } from "./SegmentSelector";
import { MobilePreview } from "./MobilePreview";
import { FormActionButtons } from "@/components/admin/FormActionButtons";

interface BannerFormProps {
  initialData?: Banner;
  onSubmit: (data: CreateBannerDTO | UpdateBannerDTO) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
}

export const BannerForm: React.FC<BannerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [formData, setFormData] = useState({
    image_th: initialData?.image_th || "",
    image_en: initialData?.image_en || "",
    url_th: initialData?.url_th || "",
    url_en: initialData?.url_en || "",
    segment_tiers: initialData?.segment_tiers || [],
    start_date: initialData?.start_date
      ? initialData.start_date.split("T")[0]
      : "",
    end_date: initialData?.end_date ? initialData.end_date.split("T")[0] : "",
    is_active: initialData?.is_active ?? true,
    priority: initialData?.priority ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | string[] | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.image_th.trim()) {
      newErrors.image_th = "Thai image is required";
    }

    if (!formData.image_en.trim()) {
      newErrors.image_en = "English image is required";
    }

    if (!formData.url_th.trim()) {
      newErrors.url_th = "Thai URL is required";
    } else {
      try {
        new URL(formData.url_th);
      } catch {
        newErrors.url_th = "Invalid URL format";
      }
    }

    if (!formData.url_en.trim()) {
      newErrors.url_en = "English URL is required";
    } else {
      try {
        new URL(formData.url_en);
      } catch {
        newErrors.url_en = "Invalid URL format";
      }
    }

    if (formData.segment_tiers.length === 0) {
      newErrors.segment_tiers = "Please select at least one segment tier";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (formData.priority < 0) {
      newErrors.priority = "Priority must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        image_th: formData.image_th,
        image_en: formData.image_en,
        url_th: formData.url_th,
        url_en: formData.url_en,
        segment_tiers: formData.segment_tiers,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        is_active: formData.is_active,
        priority: formData.priority,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Thai Image Path *
        </label>
        <input
          type="text"
          value={formData.image_th}
          onChange={(e) => handleInputChange("image_th", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="/uploads/banners/image-th.jpg"
        />
        {errors.image_th && (
          <p className="text-sm text-red-600 mt-1">{errors.image_th}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Upload functionality will be added in Phase 3
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          English Image Path *
        </label>
        <input
          type="text"
          value={formData.image_en}
          onChange={(e) => handleInputChange("image_en", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="/uploads/banners/image-en.jpg"
        />
        {errors.image_en && (
          <p className="text-sm text-red-600 mt-1">{errors.image_en}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Thai URL *
        </label>
        <input
          type="url"
          value={formData.url_th}
          onChange={(e) => handleInputChange("url_th", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/th"
        />
        {errors.url_th && (
          <p className="text-sm text-red-600 mt-1">{errors.url_th}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          English URL *
        </label>
        <input
          type="url"
          value={formData.url_en}
          onChange={(e) => handleInputChange("url_en", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/en"
        />
        {errors.url_en && (
          <p className="text-sm text-red-600 mt-1">{errors.url_en}</p>
        )}
      </div>

      <SegmentSelector
        selected={formData.segment_tiers}
        onChange={(tiers) => handleInputChange("segment_tiers", tiers)}
        error={errors.segment_tiers}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange("start_date", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.start_date && (
            <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Date *
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.end_date && (
            <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="block text-sm font-medium text-foreground">
          Status
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => handleInputChange("is_active", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-foreground">
            {formData.is_active ? "Active" : "Inactive"}
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Priority
        </label>
        <input
          type="number"
          min="0"
          value={formData.priority}
          onChange={(e) =>
            handleInputChange("priority", parseInt(e.target.value) || 0)
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.priority && (
          <p className="text-sm text-red-600 mt-1">{errors.priority}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Higher priority banners are displayed first
        </p>
      </div>

        <FormActionButtons
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          entityName="Banner"
        />
      </form>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="bg-(--color-surface-alt) rounded-lg p-6 border border-(--color-border)">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            ตัวอย่างมือถือ
          </h3>
          <MobilePreview
            imageTh={formData.image_th}
            imageEn={formData.image_en}
            urlTh={formData.url_th}
            urlEn={formData.url_en}
            bannerId={initialData?.id}
          />
        </div>
      </div>
    </div>
  );
};
