export interface Banner {
  id: string;
  image_th: string;
  image_en: string;
  url_th: string;
  url_en: string;
  segment_tiers: string[];
  start_date: string; // ISO 8601
  end_date: string;
  is_active: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBannerDTO {
  image_th: string;
  image_en: string;
  url_th: string;
  url_en: string;
  segment_tiers: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  priority: number;
}

export interface UpdateBannerDTO {
  image_th: string;
  image_en: string;
  url_th: string;
  url_en: string;
  segment_tiers: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  priority: number;
}

export interface PriorityUpdate {
  id: string;
  priority: number;
}
