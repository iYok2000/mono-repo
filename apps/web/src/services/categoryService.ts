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
  console.error("Full error object:", error);

  if (error instanceof AxiosError) {
    console.error("Axios error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
      code: error.code,
    });

    // Backend returned an error response
    if (error.response?.data) {
      const backendError = error.response.data as BackendError;
      throw new CategoryServiceError(
        backendError.code || "UNKNOWN_ERROR",
        backendError.message || "เกิดข้อผิดพลาด"
      );
    }

    // Network error or CORS issue
    if (error.code === "ERR_NETWORK" || !error.response) {
      throw new CategoryServiceError(
        "NETWORK_ERROR",
        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาตรวจสอบว่า Backend ทำงานอยู่"
      );
    }

    // Other axios errors
    throw new CategoryServiceError(
      "REQUEST_FAILED",
      `คำขอล้มเหลว: ${error.message}`
    );
  }

  // Unknown error
  throw new CategoryServiceError(
    "UNKNOWN_ERROR",
    error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
  );
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await goApi.get<ApiResponse<Category[]>>("/api/categories");
    console.log("Raw API response:", response.data);
    // Backend returns wrapped response: { data: [...] }
    if (!response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }
    return response.data.data;
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
    console.log("Creating category with input:", input);
    const response = await goApi.post<ApiResponse<Category>>(
      "/api/categories",
      input
    );
    console.log("Create category response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    if (!response.data || !response.data.data) {
      console.error("Invalid response format:", response.data);
      throw new CategoryServiceError(
        "CREATE_FAILED",
        "ไม่สามารถสร้างหมวดหมู่ได้ - รูปแบบข้อมูลไม่ถูกต้อง"
      );
    }

    console.log("Category created successfully:", response.data.data);
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
