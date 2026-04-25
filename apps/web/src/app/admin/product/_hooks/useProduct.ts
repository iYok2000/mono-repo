import { useState, useEffect, useCallback } from "react";
import * as productService from "@/services/productService";
import * as categoryService from "@/services/categoryService";
import type { Product } from "@/types/product";
import type { Category } from "@/services/category/types";

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run only once on mount

  const refreshProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refreshProducts,
  };
};
