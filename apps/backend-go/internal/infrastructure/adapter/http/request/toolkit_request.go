package request

// CreateToolkitRequest represents the HTTP request for creating a toolkit
type CreateToolkitRequest struct {
	ID          string   `json:"id" binding:"required,min=1,max=100"`
	CategoryID  string   `json:"category_id" binding:"required"`
	Title       string   `json:"title" binding:"required,min=1,max=255"`
	Status      string   `json:"status" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
	Image       string   `json:"image"`
	Description string   `json:"description" binding:"required"`
}

// UpdateToolkitRequest represents the HTTP request for updating a toolkit
type UpdateToolkitRequest struct {
	CategoryID  string   `json:"category_id" binding:"required"`
	Title       string   `json:"title" binding:"required,min=1,max=255"`
	Status      string   `json:"status" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
	Image       string   `json:"image"`
	Description string   `json:"description" binding:"required"`
}
