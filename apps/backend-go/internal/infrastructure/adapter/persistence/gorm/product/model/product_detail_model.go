package model

// ProductDetailModel is the GORM model for product_details table
type ProductDetailModel struct {
	ID        uint   `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ProductID string `gorm:"column:product_id;size:100;uniqueIndex;not null" json:"product_id"`

	// Legacy field - kept for backward compatibility
	Description string `gorm:"column:description;type:text;not null" json:"description"`

	// New content fields - support markdown and rich content
	MainContent string `gorm:"column:main_content;type:text" json:"main_content"`
	HowToUse    string `gorm:"column:how_to_use;type:text" json:"how_to_use"`
	Reference   string `gorm:"column:reference;type:text" json:"reference"`
	Example     string `gorm:"column:example;type:text" json:"example"`
}

// TableName specifies the table name for GORM
func (ProductDetailModel) TableName() string {
	return "product_details"
}
