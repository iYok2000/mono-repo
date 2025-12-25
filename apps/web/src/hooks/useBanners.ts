"use client";

import { useState, useEffect } from "react";
import * as bannerService from "@/services/bannerService";
import type { Banner } from "@/types/banner";

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bannerService.getBanners();
      
      // Filter only active banners and sort by priority
      const activeBanners = data
        .filter((banner) => banner.is_active)
        .sort((a, b) => b.priority - a.priority);
      
      setBanners(activeBanners);
    } catch (err: any) {
      console.error("Failed to fetch banners:", err);
      setError(err.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return { banners, loading, error, refreshBanners: fetchBanners };
};
