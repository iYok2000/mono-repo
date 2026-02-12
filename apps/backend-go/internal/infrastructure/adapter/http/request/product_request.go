package request

// CreateProductRequest represents the HTTP request for creating a product
type CreateProductRequest struct {
	ID          string   `json:"id" binding:"required,min=1,max=100"`
	CategoryID  string   `json:"category_id" binding:"required"`
	Title       string   `json:"title" binding:"required,min=1,max=255"`
	Status      string   `json:"status" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
	Image       string   `json:"image"`
	Description string   `json:"description" binding:"required"`

	// New content fields - optional for backward compatibility
	MainContent string `json:"main_content"`
	HowToUse    string `json:"how_to_use"`
	Reference   string `json:"reference"`
	Example     string `json:"example"`
}

// UpdateProductRequest represents the HTTP request for updating a product
type UpdateProductRequest struct {
	CategoryID  string   `json:"category_id" binding:"required"`
	Title       string   `json:"title" binding:"required,min=1,max=255"`
	Status      string   `json:"status" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
	Image       string   `json:"image"`
	Description string   `json:"description" binding:"required"`

	// New content fields - optional for backward compatibility
	MainContent string `json:"main_content"`
	HowToUse    string `json:"how_to_use"`
	Reference   string `json:"reference"`
	Example     string `json:"example"`
}
