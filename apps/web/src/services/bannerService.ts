import { goApi } from "@/lib/axios";
import type {
  Banner,
  CreateBannerDTO,
  UpdateBannerDTO,
  PriorityUpdate,
} from "@/types/banner";

export interface ListBannersParams {
  status?: boolean;
  segment_tier?: string;
  start_date?: string;
  end_date?: string;
}

export const getBanners = async (
  params?: ListBannersParams
): Promise<Banner[]> => {
  const response = await goApi.get<Banner[]>("/api/banners", { params });
  return Array.isArray(response.data) ? response.data : [];
};

export const getBannerById = async (id: string): Promise<Banner> => {
  const response = await goApi.get<Banner>(`/api/banners/${id}`);
  return response.data;
};

export const createBanner = async (
  data: CreateBannerDTO
): Promise<Banner> => {
  const response = await goApi.post<Banner>("/api/banners", data);
  return response.data;
};

export const updateBanner = async (
  id: string,
  data: UpdateBannerDTO
): Promise<Banner> => {
  const response = await goApi.put<Banner>(`/api/banners/${id}`, data);
  return response.data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await goApi.delete(`/api/banners/${id}`);
};

export const updateBannerOrder = async (
  updates: PriorityUpdate[]
): Promise<void> => {
  await goApi.post("/api/banners/reorder", { updates });
};
