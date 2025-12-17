package model

// CategoryModel is the GORM model for dev_toolkit_categories table
type CategoryModel struct {
	ID     string `gorm:"column:id;primaryKey" json:"id"`
	NameEn string `gorm:"column:name_en;size:100;not null" json:"name_en"`
	NameTh string `gorm:"column:name_th;size:100;not null" json:"name_th"`

	Toolkits []DevToolkitModel `gorm:"foreignKey:CategoryID;references:ID" json:"-"`
}

// TableName specifies the table name for GORM
func (CategoryModel) TableName() string {
	return "dev_toolkit_categories"
}
