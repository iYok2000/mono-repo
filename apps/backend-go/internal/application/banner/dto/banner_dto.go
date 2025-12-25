package dto

import "time"

// BannerDTO represents the data transfer object for banner responses
type BannerDTO struct {
	ID           string    `json:"id"`
	ImageTH      string    `json:"image_th"`
	ImageEN      string    `json:"image_en"`
	URLTH        string    `json:"url_th"`
	URLEN        string    `json:"url_en"`
	SegmentTiers []string  `json:"segment_tiers"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	IsActive     bool      `json:"is_active"`
	Priority     int       `json:"priority"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
}
