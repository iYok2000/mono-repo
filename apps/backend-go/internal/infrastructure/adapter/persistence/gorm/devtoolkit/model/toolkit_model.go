package model

import "gorm.io/datatypes"

// DevToolkitModel is the GORM model for dev_toolkits table
type DevToolkitModel struct {
	ID         string         `gorm:"column:id;primaryKey;size:100" json:"id"`
	CategoryID string         `gorm:"column:category_id;size:50;not null;index:idx_toolkit_category_title" json:"category_id"`
	Title      string         `gorm:"column:title;size:255;not null;index:idx_toolkit_category_title,priority:2" json:"title"`
	Status     string         `gorm:"column:status;size:20;not null;default:default" json:"status"`
	Tags       datatypes.JSON `gorm:"column:tags;type:jsonb;not null;default:'[]'::jsonb;index:,type:gin" json:"tags"`
	Image      string         `gorm:"column:image" json:"image"`

	Category *CategoryModel         `gorm:"foreignKey:CategoryID;references:ID" json:"-"`
	Detail   *DevToolkitDetailModel `gorm:"foreignKey:ToolkitID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
}

// TableName specifies the table name for GORM
func (DevToolkitModel) TableName() string {
	return "dev_toolkits"
}
