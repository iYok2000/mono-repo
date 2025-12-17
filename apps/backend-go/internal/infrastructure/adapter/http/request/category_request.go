package request

// CreateCategoryRequest represents the HTTP request for creating a category
type CreateCategoryRequest struct {
	ID     string `json:"id" binding:"required,min=1,max=50"`
	NameEn string `json:"name_en" binding:"required,min=1,max=100"`
	NameTh string `json:"name_th" binding:"required,min=1,max=100"`
}

// UpdateCategoryRequest represents the HTTP request for updating a category
type UpdateCategoryRequest struct {
	NameEn string `json:"name_en" binding:"required,min=1,max=100"`
	NameTh string `json:"name_th" binding:"required,min=1,max=100"`
}
