import { useState } from "react";
import type { Product } from "@/types/product";
import type { Category } from "@/services/category/types";

type FormData = {
  id: string;
  category_id: string;
  title: string;
  status: Product["status"];
  tags: string[];
  image: string;
  description: string;
};

type FormErrors = {
  id: string;
  category_id: string;
  title: string;
  description: string;
};

export const useProductForm = (categories: Category[]) => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    category_id: "",
    title: "",
    status: "default",
    tags: [],
    image: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    id: "",
    category_id: "",
    title: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      id: "",
      category_id: "",
      title: "",
      description: "",
    };
    let isValid = true;

    if (!editingId && !formData.id.trim()) {
      errors.id = "กรุณากรอกรหัส";
      isValid = false;
    }

    if (!formData.category_id.trim()) {
      errors.category_id = "กรุณาเลือกหมวดหมู่";
      isValid = false;
    }

    if (!formData.title.trim()) {
      errors.title = "กรุณากรอกชื่อ";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "กรุณากรอกคำอธิบาย";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const setEditMode = (product: Product) => {
    // Find matching category by id, name_en, or name_th
    let categoryId = product.category_id;
    const matchedCategory = categories.find(
      (cat) =>
        cat.id === product.category_id ||
        cat.name_en === product.category_id ||
        cat.name_th === product.category_id
    );

    if (matchedCategory) {
      categoryId = matchedCategory.id;
    }

    setEditingId(product.id);
    setFormData({
      id: product.id,
      category_id: categoryId,
      title: product.title,
      status: product.status,
      tags: product.tags || [],
      image: product.image || "",
      description: product.description || "",
    });
    setShowForm(true);
    setFormErrors({ id: "", category_id: "", title: "", description: "" });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      category_id: "",
      title: "",
      status: "default",
      tags: [],
      image: "",
      description: "",
    });
    setFormErrors({ id: "", category_id: "", title: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return {
    formData,
    setFormData,
    formErrors,
    editingId,
    showForm,
    setShowForm,
    validateForm,
    setEditMode,
    resetForm,
    handleTagToggle,
  };
};
