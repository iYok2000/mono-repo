"use client";

import { useState, useEffect, useCallback } from "react";
import * as bannerService from "@/services/bannerService";
import type { Banner } from "@/types/banner";

export const useBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bannerService.getBanners();
      setBanners(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const refreshBanners = useCallback(async () => {
    try {
      const data = await bannerService.getBanners();
      setBanners(data);
    } catch (err: unknown) {
      console.error("Failed to refresh banners:", err);
    }
  }, []);

  return {
    banners,
    loading,
    error,
    refreshBanners,
  };
};
