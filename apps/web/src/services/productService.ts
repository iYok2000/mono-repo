import { goApi } from "@/lib/axios";
import type { Product, ProductDetail } from "@/types/product";

export interface CreateProductDTO {
  id: string;
  category_id: string;
  title: string;
  status: string;
  tags: string[];
  image: string;
  description: string;

  // New content fields
  main_content?: string;
  how_to_use?: string;
  reference?: string;
  example?: string;
}

export interface UpdateProductDTO {
  category_id: string;
  title: string;
  status: string;
  tags: string[];
  image: string;
  description: string;

  // New content fields
  main_content?: string;
  how_to_use?: string;
  reference?: string;
  example?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await goApi.get<Product[]>("/api/products");
  return Array.isArray(response.data) ? response.data : [];
};

export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await goApi.get<ProductDetail>(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: CreateProductDTO
): Promise<Product> => {
  const response = await goApi.post<Product>("/api/products", data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductDTO
): Promise<Product> => {
  const response = await goApi.put<Product>(`/api/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await goApi.delete(`/api/products/${id}`);
};
