export interface Category {
  id: string;
  name_en: string;
  name_th: string;
}

export interface CreateCategoryInput {
  id: string;
  name_en: string;
  name_th: string;
}

export interface UpdateCategoryInput {
  name_en: string;
  name_th: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}