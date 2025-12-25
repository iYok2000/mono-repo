"use client";

import { SegmentTierSelector } from "./SegmentTierSelector";

interface BannerFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSegments: string[];
  onSegmentsChange: (segments: string[]) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const BannerFilter: React.FC<BannerFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedSegments,
  onSegmentsChange,
  selectedStatus,
  onStatusChange,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ค้นหา
          </label>
          <input
            type="text"
            placeholder="ค้นหารหัส หรือ URL..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-secondary) bg-background text-foreground"
          />
        </div>

        {/* Segment Tier Filter */}
        <SegmentTierSelector
          selectedSegments={selectedSegments}
          onChange={onSegmentsChange}
        />

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            สถานะ
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-secondary) bg-background text-foreground"
          >
            <option value="all">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ปิด</option>
          </select>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between pt-2 border-t border-(--color-border)">
        <p className="text-sm text-(--color-muted)">
          แสดง {filteredCount} จาก {totalCount} รายการ
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-(--color-secondary) hover:underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>
    </div>
  );
};
