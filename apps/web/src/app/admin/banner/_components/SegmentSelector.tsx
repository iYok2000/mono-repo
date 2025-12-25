"use client";

import { SEGMENT_TIERS, SEGMENT_TIER_LABELS } from "@/config/segmentTiers";

interface SegmentSelectorProps {
  selected: string[];
  onChange: (tiers: string[]) => void;
  error?: string;
}

export const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  selected,
  onChange,
  error,
}) => {
  const handleToggle = (tier: string) => {
    if (selected.includes(tier)) {
      onChange(selected.filter((t) => t !== tier));
    } else {
      onChange([...selected, tier]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Segment Tiers *
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SEGMENT_TIERS.map((tier) => {
          const isSelected = selected.includes(tier);

          return (
            <button
              key={tier}
              type="button"
              onClick={() => handleToggle(tier)}
              className={`
                px-4 py-3 rounded-lg border-2 transition-colors font-medium
                ${
                  isSelected
                    ? "border-(--color-primary) bg-(--color-primary) text-white"
                    : "border-(--color-border) hover:border-(--color-primary) text-foreground"
                }
              `}
            >
              {SEGMENT_TIER_LABELS[tier] || tier}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-(--color-muted)">
        เลือกอย่างน้อย 1 tier
      </p>
    </div>
  );
};
