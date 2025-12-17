package entity

import (
	"fmt"
	"strings"

	"monorepo/backend-go/internal/core/domain/devtoolkit/valueobject"
)

// ServiceItem represents a developer toolkit service in the domain
type ServiceItem struct {
	id          string
	itemID      string
	title       string
	category    string
	description string
	status      valueobject.ServiceStatus
	tags        []string
	image       string
}

// NewServiceItem creates a new ServiceItem with validation
func NewServiceItem(
	id, itemID, title, category, description string,
	status valueobject.ServiceStatus,
	tags []string,
	image string,
) (*ServiceItem, error) {
	if err := validateServiceItemFields(id, title, category, status); err != nil {
		return nil, err
	}

	return &ServiceItem{
		id:          strings.TrimSpace(id),
		itemID:      strings.TrimSpace(itemID),
		title:       strings.TrimSpace(title),
		category:    strings.TrimSpace(category),
		description: strings.TrimSpace(description),
		status:      status,
		tags:        tags,
		image:       strings.TrimSpace(image),
	}, nil
}

// ReconstructServiceItem reconstructs a ServiceItem from persistence layer
func ReconstructServiceItem(
	id, itemID, title, category, description string,
	status valueobject.ServiceStatus,
	tags []string,
	image string,
) *ServiceItem {
	return &ServiceItem{
		id:          id,
		itemID:      itemID,
		title:       title,
		category:    category,
		description: description,
		status:      status,
		tags:        tags,
		image:       image,
	}
}

// Getters
func (s *ServiceItem) ID() string {
	return s.id
}

func (s *ServiceItem) ItemID() string {
	return s.itemID
}

func (s *ServiceItem) Title() string {
	return s.title
}

func (s *ServiceItem) Category() string {
	return s.category
}

func (s *ServiceItem) Description() string {
	return s.description
}

func (s *ServiceItem) Status() valueobject.ServiceStatus {
	return s.status
}

func (s *ServiceItem) Tags() []string {
	// Return copy to prevent external mutation
	tagsCopy := make([]string, len(s.tags))
	copy(tagsCopy, s.tags)
	return tagsCopy
}

func (s *ServiceItem) Image() string {
	return s.image
}

// UpdateStatus updates the service status with validation
func (s *ServiceItem) UpdateStatus(status valueobject.ServiceStatus) error {
	if !status.IsValid() {
		return fmt.Errorf("invalid service status: %s", status)
	}
	s.status = status
	return nil
}

// UpdateDetails updates service details with validation
func (s *ServiceItem) UpdateDetails(title, description string) error {
	title = strings.TrimSpace(title)
	description = strings.TrimSpace(description)

	if title == "" {
		return fmt.Errorf("service title cannot be empty")
	}

	if len(title) > 200 {
		return fmt.Errorf("service title too long (max 200 characters)")
	}

	s.title = title
	s.description = description
	return nil
}

// AddTag adds a tag to the service
func (s *ServiceItem) AddTag(tag string) error {
	tag = strings.TrimSpace(tag)
	if tag == "" {
		return fmt.Errorf("tag cannot be empty")
	}

	// Check if tag already exists
	for _, existingTag := range s.tags {
		if existingTag == tag {
			return fmt.Errorf("tag already exists: %s", tag)
		}
	}

	s.tags = append(s.tags, tag)
	return nil
}

// RemoveTag removes a tag from the service
func (s *ServiceItem) RemoveTag(tag string) {
	for i, existingTag := range s.tags {
		if existingTag == tag {
			s.tags = append(s.tags[:i], s.tags[i+1:]...)
			return
		}
	}
}

// validateServiceItemFields validates required fields
func validateServiceItemFields(id, title, category string, status valueobject.ServiceStatus) error {
	if strings.TrimSpace(id) == "" {
		return fmt.Errorf("service id is required")
	}

	if strings.TrimSpace(title) == "" {
		return fmt.Errorf("service title is required")
	}

	if strings.TrimSpace(category) == "" {
		return fmt.Errorf("service category is required")
	}

	if !status.IsValid() {
		return fmt.Errorf("invalid service status: %s", status)
	}

	if len(title) > 200 {
		return fmt.Errorf("service title too long (max 200 characters)")
	}

	return nil
}
