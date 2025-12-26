package model

import (
	"time"

	"gorm.io/datatypes"
)

// BannerModel represents the GORM database model for banners
type BannerModel struct {
	ID           string         `gorm:"column:id;primaryKey;size:100" json:"id"`
	ImageTH      string         `gorm:"column:image_th;size:500;not null" json:"image_th"`
	ImageEN      string         `gorm:"column:image_en;size:500;not null" json:"image_en"`
	URLTH        string         `gorm:"column:url_th;size:2048;not null" json:"url_th"`
	URLEN        string         `gorm:"column:url_en;size:2048;not null" json:"url_en"`
	SegmentTiers datatypes.JSON `gorm:"column:segment_tiers;type:jsonb;not null;default:'[]'::jsonb;index:,type:gin" json:"segment_tiers"`
	StartDate    time.Time      `gorm:"column:start_date;not null;index:idx_banner_date_range" json:"start_date"`
	EndDate      time.Time      `gorm:"column:end_date;not null;index:idx_banner_date_range,priority:2" json:"end_date"`
	IsActive     bool           `gorm:"column:is_active;not null;default:true;index:idx_banner_active_priority" json:"is_active"`
	Priority     int            `gorm:"column:priority;not null;default:0;index:idx_banner_active_priority,priority:2;index:idx_banner_priority_created" json:"priority"`
	CreatedAt    time.Time      `gorm:"column:created_at;autoCreateTime;index:idx_banner_priority_created,priority:2" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

// TableName specifies the custom table name for BannerModel
func (BannerModel) TableName() string {
	return "banners"
}
