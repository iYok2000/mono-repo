package model

// DevToolkitDetailModel is the GORM model for dev_toolkit_details table
type DevToolkitDetailModel struct {
	ID        uint   `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ToolkitID string `gorm:"column:toolkit_id;size:100;uniqueIndex;not null" json:"toolkit_id"`

	Description string `gorm:"column:description;type:text;not null" json:"description"`

	// Future fields (uncomment when needed):
	// HowTo      string `gorm:"column:how_to;type:text"`
	// CodeSample string `gorm:"column:code_sample;type:text"`
}

// TableName specifies the table name for GORM
func (DevToolkitDetailModel) TableName() string {
	return "dev_toolkit_details"
}
