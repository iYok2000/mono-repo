import { goApi } from "@/lib/axios";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  ApiResponse,
} from "./category/types";
import { AxiosError } from "axios";

export type { Category, CreateCategoryInput, UpdateCategoryInput, ApiResponse };

export interface BackendError {
  code: string;
  message: string;
}

export class CategoryServiceError extends Error {
  code: string;
  
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "CategoryServiceError";
  }
}

const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError && error.response?.data) {
    const backendError = error.response.data as BackendError;
    throw new CategoryServiceError(
      backendError.code || "UNKNOWN_ERROR",
      backendError.message || "เกิดข้อผิดพลาด"
    );
  }
  throw new CategoryServiceError("NETWORK_ERROR", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await goApi.get<Category[]>("/api/categories");
    console.log("Raw API response:", response.data);
    // Backend returns array directly, not wrapped in { data: [...] }
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return handleApiError(error);
  }
};

export const getCategory = async (id: string): Promise<Category> => {
  try {
    const response = await goApi.get<ApiResponse<Category>>(
      `/api/categories/${id}`
    );
    if (!response.data.data) {
      throw new CategoryServiceError("NOT_FOUND", "ไม่พบหมวดหมู่");
    }
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return handleApiError(error);
  }
};

export const createCategory = async (
  input: CreateCategoryInput
): Promise<Category> => {
  try {
    const response = await goApi.post<ApiResponse<Category>>(
      "/api/categories",
      input
    );
    if (!response.data.data) {
      throw new CategoryServiceError("CREATE_FAILED", "ไม่สามารถสร้างหมวดหมู่ได้");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return handleApiError(error);
  }
};

export const updateCategory = async (
  id: string,
  input: UpdateCategoryInput
): Promise<Category> => {
  try {
    const response = await goApi.put<ApiResponse<Category>>(
      `/api/categories/${id}`,
      input
    );
    if (!response.data.data) {
      throw new CategoryServiceError("UPDATE_FAILED", "ไม่สามารถแก้ไขหมวดหมู่ได้");
    }
    return response.data.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    return handleApiError(error);
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await goApi.delete(`/api/categories/${id}`);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return handleApiError(error);
  }
};
