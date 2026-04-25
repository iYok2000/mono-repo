"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { InteractiveByte, ByteMood } from "./InteractiveByte";

type GiftCategory = "lover" | "friend" | "family" | "colleague" | "general";

interface CategoryOption {
  id: GiftCategory;
  label: string;
  emoji: string;
  byteMood: ByteMood;
  byteSpeech: string;
}

interface ByteCategorySelectorProps {
  className?: string;
  onSelect?: (category: GiftCategory) => void;
  selectedCategory?: GiftCategory | null;
}

const categories: CategoryOption[] = [
  { 
    id: "lover", 
    label: "ให้แฟน/คนรัก", 
    emoji: "💕",
    byteMood: "love",
    byteSpeech: "อุ๊ย~ โรแมนติก 💕"
  },
  { 
    id: "friend", 
    label: "ให้เพื่อน", 
    emoji: "🎉",
    byteMood: "excited",
    byteSpeech: "เย้! ปาร์ตี้เลย 🎉"
  },
  { 
    id: "family", 
    label: "ให้ครอบครัว", 
    emoji: "🏠",
    byteMood: "happy",
    byteSpeech: "อบอุ่นจัง 🥰"
  },
  { 
    id: "colleague", 
    label: "ให้เพื่อนร่วมงาน", 
    emoji: "💼",
    byteMood: "thinking",
    byteSpeech: "โปรเฟสชันแนล 👔"
  },
  { 
    id: "general", 
    label: "อื่นๆ", 
    emoji: "🎁",
    byteMood: "default",
    byteSpeech: "มาเลือกกัน! 🎁"
  },
];

// Category Button Component
const CategoryButton = memo(function CategoryButton({
  category,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onLeave,
}: {
  category: CategoryOption;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200 w-full text-left
        ${isSelected 
          ? "bg-[var(--primary)] text-white shadow-lg" 
          : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]/50"
        }
        ${isHovered && !isSelected ? "scale-[1.02] shadow-md" : ""}
      `}
      style={{
        boxShadow: isSelected ? "0 8px 30px rgba(16, 185, 129, 0.3)" : undefined,
      }}
    >
      <span className="text-xl">{category.emoji}</span>
      <span className="font-medium">{category.label}</span>
      
      {isSelected && (
        <div className="ml-auto">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
});

// Main Component
export function ByteCategorySelector({
  className = "",
  onSelect,
  selectedCategory: controlledCategory,
}: ByteCategorySelectorProps) {
  const [internalSelected, setInternalSelected] = useState<GiftCategory | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<GiftCategory | null>(null);
  const [byteMood, setByteMood] = useState<ByteMood>("default");
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  const selectedCategory = controlledCategory ?? internalSelected;

  // Get current category for Byte's mood
  const currentCategory = useMemo(() => {
    const categoryId = hoveredCategory || selectedCategory;
    return categories.find(c => c.id === categoryId);
  }, [hoveredCategory, selectedCategory]);

  const handleCategoryHover = useCallback((category: CategoryOption) => {
    setHoveredCategory(category.id);
    setByteMood(category.byteMood);
    setSpeechBubble(category.byteSpeech);
  }, []);

  const handleCategoryLeave = useCallback(() => {
    setHoveredCategory(null);
    
    // Revert to selected category's mood or default
    const selected = categories.find(c => c.id === selectedCategory);
    setByteMood(selected?.byteMood || "default");
    setSpeechBubble(null);
  }, [selectedCategory]);

  const handleCategorySelect = useCallback((category: CategoryOption) => {
    setInternalSelected(category.id);
    setByteMood(category.byteMood);
    setSpeechBubble(category.byteSpeech);
    onSelect?.(category.id);

    // Clear speech after a moment
    setTimeout(() => setSpeechBubble(null), 2000);
  }, [onSelect]);

  return (
    <div className={`flex flex-col lg:flex-row gap-8 items-center ${className}`}>
      {/* Category Options */}
      <div className="flex-1 w-full max-w-md space-y-3">
        <h3 className="text-h4 mb-4">เลือกประเภทของขวัญ</h3>
        
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            isHovered={hoveredCategory === category.id}
            onClick={() => handleCategorySelect(category)}
            onHover={() => handleCategoryHover(category)}
            onLeave={handleCategoryLeave}
          />
        ))}
      </div>

      {/* Interactive Byte */}
      <div className="relative flex-shrink-0">
        {/* Speech Bubble */}
        {speechBubble && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
            <div className="bg-[var(--card)] px-4 py-2 rounded-xl shadow-lg border border-[var(--border)] whitespace-nowrap">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {speechBubble}
              </p>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--card)] border-r border-b border-[var(--border)] rotate-45" />
          </div>
        )}

        <div 
          className={`
            transition-transform duration-500 ease-out
            ${currentCategory?.id === "lover" ? "animate-byte-wiggle" : ""}
          `}
        >
          <InteractiveByte
            size="lg"
            followMouse={true}
            initialMood={byteMood}
          />
        </div>

        {/* Decorative Hearts for Lover Category */}
        {(hoveredCategory === "lover" || selectedCategory === "lover") && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            <span className="absolute -top-4 -left-4 text-xl animate-gentle-float" style={{ animationDelay: "0s" }}>💕</span>
            <span className="absolute -top-2 -right-6 text-lg animate-gentle-float" style={{ animationDelay: "0.3s" }}>❤️</span>
            <span className="absolute -bottom-2 -left-6 text-lg animate-gentle-float" style={{ animationDelay: "0.6s" }}>💗</span>
          </div>
        )}
      </div>
    </div>
  );
}

export type { GiftCategory };
