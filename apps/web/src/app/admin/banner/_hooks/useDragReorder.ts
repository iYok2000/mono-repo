import { useState } from "react";
import type { Banner } from "@/types/banner";

export const useDragReorder = (
  banners: Banner[],
  onReorder: (bannerId: string, newPriority: number) => void
) => {
  const [draggedItem, setDraggedItem] = useState<Banner | null>(null);
  const [dragOverItem, setDragOverItem] = useState<Banner | null>(null);

  const handleDragStart = (e: React.DragEvent, banner: Banner) => {
    setDraggedItem(banner);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, banner: Banner) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItem && draggedItem.id !== banner.id) {
      setDragOverItem(banner);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetBanner: Banner) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetBanner.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Get current priority values
    const draggedPriority = draggedItem.priority;
    const targetPriority = targetBanner.priority;

    // Calculate new priority for dragged item
    const newPriority = targetPriority;

    // Call reorder callback
    onReorder(draggedItem.id, newPriority);

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};
