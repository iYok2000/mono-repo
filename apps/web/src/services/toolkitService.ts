import { goApi } from "@/lib/axios";
import type { DevToolkit, DevToolkitDetail } from "@/types/devtoolkit";

export interface CreateToolkitDTO {
  id: string;
  category_id: string;
  title: string;
  status: string;
  tags: string[];
  image: string;
  description: string;
}

export interface UpdateToolkitDTO {
  category_id: string;
  title: string;
  status: string;
  tags: string[];
  image: string;
  description: string;
}

export const getToolkits = async (): Promise<DevToolkit[]> => {
  const response = await goApi.get<DevToolkit[]>("/api/toolkits");
  return Array.isArray(response.data) ? response.data : [];
};

export const getToolkitById = async (id: string): Promise<DevToolkitDetail> => {
  const response = await goApi.get<DevToolkitDetail>(`/api/toolkits/${id}`);
  return response.data;
};

export const createToolkit = async (
  data: CreateToolkitDTO
): Promise<DevToolkit> => {
  const response = await goApi.post<DevToolkit>("/api/toolkits", data);
  return response.data;
};

export const updateToolkit = async (
  id: string,
  data: UpdateToolkitDTO
): Promise<DevToolkit> => {
  const response = await goApi.put<DevToolkit>(`/api/toolkits/${id}`, data);
  return response.data;
};

export const deleteToolkit = async (id: string): Promise<void> => {
  await goApi.delete(`/api/toolkits/${id}`);
};
