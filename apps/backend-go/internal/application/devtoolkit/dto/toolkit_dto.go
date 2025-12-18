package dto

// DevToolkitDTO is a data transfer object for DevToolkit
type DevToolkitDTO struct {
	ID          string   `json:"id"`
	CategoryID  string   `json:"category_id"`
	Title       string   `json:"title"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
	Description string   `json:"description,omitempty"`
}

// DevToolkitDetailDTO is a data transfer object with full details
type DevToolkitDetailDTO struct {
	ID          string   `json:"id"`
	CategoryID  string   `json:"category_id"`
	Title       string   `json:"title"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
	Description string   `json:"description"`
}
