package request

import "time"

// CreateBannerRequest represents the HTTP request for creating a banner
type CreateBannerRequest struct {
	ImageTH      string    `json:"image_th" binding:"required"`
	ImageEN      string    `json:"image_en" binding:"required"`
	URLTH        string    `json:"url_th" binding:"required,url"`
	URLEN        string    `json:"url_en" binding:"required,url"`
	SegmentTiers []string  `json:"segment_tiers" binding:"required,min=1"`
	StartDate    time.Time `json:"start_date" binding:"required"`
	EndDate      time.Time `json:"end_date" binding:"required"`
	IsActive     bool      `json:"is_active"`
	Priority     int       `json:"priority" binding:"min=0"`
}

// UpdateBannerRequest represents the HTTP request for updating a banner
type UpdateBannerRequest struct {
	ImageTH      string    `json:"image_th" binding:"required"`
	ImageEN      string    `json:"image_en" binding:"required"`
	URLTH        string    `json:"url_th" binding:"required,url"`
	URLEN        string    `json:"url_en" binding:"required,url"`
	SegmentTiers []string  `json:"segment_tiers" binding:"required,min=1"`
	StartDate    time.Time `json:"start_date" binding:"required"`
	EndDate      time.Time `json:"end_date" binding:"required"`
	IsActive     bool      `json:"is_active"`
	Priority     int       `json:"priority" binding:"min=0"`
}
