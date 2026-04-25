import { goApi } from "@/lib/axios";
import type { HomeSettings } from "./types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Get home page settings
 */
export const getHomeSettings = async (): Promise<HomeSettings> => {
  const response = await goApi.get<ApiResponse<HomeSettings>>("/api/home-settings");
  return response.data.data;
};

/**
 * Update home page settings
 */
export const updateHomeSettings = async (
  data: Partial<HomeSettings>
): Promise<HomeSettings> => {
  const response = await goApi.put<ApiResponse<HomeSettings>>("/api/home-settings", data);
  return response.data.data;
};

/**
 * Update specific section
 */
export const updateSection = async <K extends keyof HomeSettings>(
  sectionKey: K,
  sectionData: HomeSettings[K]
): Promise<HomeSettings> => {
  const response = await goApi.patch<ApiResponse<HomeSettings>>(
    `/api/home-settings/${sectionKey}`,
    sectionData
  );
  return response.data.data;
};

