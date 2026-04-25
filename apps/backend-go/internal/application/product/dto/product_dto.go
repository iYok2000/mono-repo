package dto

// ProductDTO is a data transfer object for Product
type ProductDTO struct {
	ID          string   `json:"id"`
	CategoryID  string   `json:"category_id"`
	Title       string   `json:"title"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
	Description string   `json:"description,omitempty"`
}

// ProductDetailDTO is a data transfer object with full details
type ProductDetailDTO struct {
	ID          string   `json:"id"`
	CategoryID  string   `json:"category_id"`
	Title       string   `json:"title"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
	Description string   `json:"description"`

	// New content fields - support markdown and rich content
	MainContent string `json:"main_content,omitempty"`
	HowToUse    string `json:"how_to_use,omitempty"`
	Reference   string `json:"reference,omitempty"`
	Example     string `json:"example,omitempty"`
}
