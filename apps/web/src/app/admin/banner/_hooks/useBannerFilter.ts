import { useState, useMemo } from "react";
import type { Banner } from "@/types/banner";

type StatusFilter = "all" | "active" | "inactive";

export interface BannerFilterState {
  searchQuery: string;
  selectedSegments: string[];
  selectedStatus: StatusFilter;
}

export const useBannerFilter = (banners: Banner[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const filteredBanners = useMemo(() => {
    return banners
      .filter((banner) => {
        // Search filter (ID or URL)
        const matchesSearch =
          searchQuery === "" ||
          banner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          banner.url_th?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          banner.url_en?.toLowerCase().includes(searchQuery.toLowerCase());

        // Segment tier filter (multiple selection)
        const matchesSegment =
          selectedSegments.length === 0 ||
          banner.segment_tiers.some((tier) => selectedSegments.includes(tier));

        // Status filter
        const matchesStatus =
          selectedStatus === "all" ||
          (selectedStatus === "active" && banner.is_active) ||
          (selectedStatus === "inactive" && !banner.is_active);

        return matchesSearch && matchesSegment && matchesStatus;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [banners, searchQuery, selectedSegments, selectedStatus]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedSegments.length > 0 ||
    selectedStatus !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSegments([]);
    setSelectedStatus("all");
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status as StatusFilter);
  };

  return {
    // State
    searchQuery,
    selectedSegments,
    selectedStatus,
    // Setters
    setSearchQuery,
    setSelectedSegments,
    setSelectedStatus: handleStatusChange,
    // Computed
    filteredBanners,
    hasActiveFilters,
    // Actions
    clearFilters,
  };
};
