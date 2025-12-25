export const SEGMENT_TIERS = ["silver", "gold", "diamond", "platinum"] as const;

export type SegmentTier = (typeof SEGMENT_TIERS)[number];

export const SEGMENT_TIER_LABELS: Record<SegmentTier, string> = {
  silver: "เงิน",
  gold: "ทอง",
  diamond: "เพชร",
  platinum: "แพลตินัม",
};
