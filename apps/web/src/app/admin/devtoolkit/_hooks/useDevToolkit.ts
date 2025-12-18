import { useState, useEffect, useCallback } from "react";
import * as toolkitService from "@/services/toolkitService";
import * as categoryService from "@/services/categoryService";
import type { DevToolkit } from "@/types/devtoolkit";
import type { Category } from "@/services/category/types";

export const useDevToolkit = () => {
  const [toolkits, setToolkits] = useState<DevToolkit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [toolkitsData, categoriesData] = await Promise.all([
        toolkitService.getToolkits(),
        categoryService.getCategories(),
      ]);
      setToolkits(toolkitsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshToolkits = useCallback(async () => {
    try {
      const data = await toolkitService.getToolkits();
      setToolkits(data);
    } catch (err) {
      console.error("Error refreshing toolkits:", err);
    }
  }, []);

  return {
    toolkits,
    categories,
    loading,
    error,
    refreshToolkits,
  };
};
