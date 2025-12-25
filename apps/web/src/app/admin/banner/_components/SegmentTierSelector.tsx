"use client";

import { useState } from "react";
import { SEGMENT_TIERS, SEGMENT_TIER_LABELS } from "@/config/segmentTiers";

interface SegmentTierSelectorProps {
  selectedSegments: string[];
  onChange: (segments: string[]) => void;
}

export const SegmentTierSelector: React.FC<SegmentTierSelectorProps> = ({
  selectedSegments,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (tier: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedSegments, tier]);
    } else {
      onChange(selectedSegments.filter((t) => t !== tier));
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        Segment Tier
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-secondary) bg-background text-foreground text-left flex items-center justify-between"
      >
        <span className="text-sm">
          {selectedSegments.length === 0
            ? "เลือก Segment Tier"
            : `เลือกแล้ว ${selectedSegments.length} รายการ`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full border border-(--color-border) rounded-lg p-3 bg-background shadow-lg max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {SEGMENT_TIERS.map((tier) => (
              <label
                key={tier}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSegments.includes(tier)}
                  onChange={(e) => handleToggle(tier, e.target.checked)}
                  className="w-4 h-4 text-(--color-secondary) border-gray-300 rounded focus:ring-(--color-secondary)"
                />
                <span className="text-sm text-foreground">
                  {SEGMENT_TIER_LABELS[tier]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
