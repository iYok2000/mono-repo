"use client";

import { Badge } from "@/components/ui/Badge";
import type { Banner } from "@/types/banner";
import { SEGMENT_TIER_LABELS } from "@/config/segmentTiers";
import { useDragReorder } from "../_hooks/useDragReorder";

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onReorder: (bannerId: string, newPriority: number) => void;
}

export const BannerList: React.FC<BannerListProps> = ({
  banners,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}) => {
  const {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragReorder(banners, onReorder);
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-12 text-(--color-muted)">
        ไม่มี Banner
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-(--color-surface-alt) border-b border-(--color-border)">
            <th className="px-4 py-3 text-center text-sm font-medium text-foreground w-16">

            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-foreground w-32">
              รหัส
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-foreground w-40">
              ภาพตัวอย่าง
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-foreground w-48">
              Segment Tiers
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-foreground w-56">
              ระยะเวลา
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-foreground w-24">
              สถานะ
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-foreground w-20">
              ลำดับ
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-foreground w-44">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr
              key={banner.id}
              draggable
              onDragStart={(e) => handleDragStart(e, banner)}
              onDragOver={(e) => handleDragOver(e, banner)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, banner)}
              onDragEnd={handleDragEnd}
              className={`border-b border-(--color-border) transition-all cursor-move ${
                draggedItem?.id === banner.id
                  ? "opacity-50 bg-blue-50 dark:bg-blue-900"
                  : dragOverItem?.id === banner.id
                  ? "bg-blue-100 dark:bg-blue-800 border-t-2 border-t-blue-500"
                  : "hover:bg-(--color-surface-alt)"
              }`}
            >
              <td className="px-4 py-3 text-center">
                <svg
                  className="w-5 h-5 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                <div className="truncate max-w-[120px]" title={banner.id}>
                  {banner.id.replace('banner-', '')}
                </div>
              </td>
              <td className="px-4 py-3">
                <img
                  src={banner.image_th}
                  alt="Banner"
                  className="w-32 h-20 object-cover rounded border border-(--color-border)"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-banner.jpg';
                  }}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {banner.segment_tiers.slice(0, 2).map((tier) => (
                    <Badge key={tier} variant="default" className="text-xs">
                      {SEGMENT_TIER_LABELS[tier as keyof typeof SEGMENT_TIER_LABELS] || tier}
                    </Badge>
                  ))}
                  {banner.segment_tiers.length > 2 && (
                    <Badge variant="default" className="text-xs">
                      +{banner.segment_tiers.length - 2}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-(--color-muted)">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-(--color-muted) font-medium">เริ่ม:</span>
                    <span>{formatDate(banner.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-(--color-muted) font-medium">สิ้นสุด:</span>
                    <span>{formatDate(banner.end_date)}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onToggleStatus(banner.id, banner.is_active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-secondary) ${
                    banner.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={banner.is_active}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      banner.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </td>
              <td className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                {banner.priority}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(banner)}
                    className="p-2 rounded-md bg-(--color-secondary) hover:bg-teal-600 text-white transition-colors"
                    title="แก้ไข"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(banner.id)}
                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                    title="ลบ"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
