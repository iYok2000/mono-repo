import { useState } from "react";
import type { DevToolkit } from "@/types/devtoolkit";
import type { Category } from "@/services/category/types";

type FormData = {
  id: string;
  category_id: string;
  title: string;
  status: DevToolkit["status"];
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

export const useToolkitForm = (categories: Category[]) => {
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

  const setEditMode = (toolkit: DevToolkit) => {
    // Find matching category by id, name_en, or name_th
    let categoryId = toolkit.category_id;
    const matchedCategory = categories.find(
      (cat) =>
        cat.id === toolkit.category_id ||
        cat.name_en === toolkit.category_id ||
        cat.name_th === toolkit.category_id
    );

    if (matchedCategory) {
      categoryId = matchedCategory.id;
    }

    setEditingId(toolkit.id);
    setFormData({
      id: toolkit.id,
      category_id: categoryId,
      title: toolkit.title,
      status: toolkit.status,
      tags: toolkit.tags || [],
      image: toolkit.image || "",
      description: toolkit.description || "",
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
