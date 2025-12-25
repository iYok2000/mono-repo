package repository

import (
	"context"
	"time"

	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner/model"
)

// ListFilters contains filter parameters for listing banners
type ListFilters struct {
	Status      *bool      // Filter by is_active
	SegmentTier *string    // Filter by segment tier (JSONB contains)
	StartDate   *time.Time // Filter by date range
	EndDate     *time.Time
}

// PriorityUpdate represents a priority update for a single banner
type PriorityUpdate struct {
	ID       string
	Priority int
}

// BannerRepository defines the interface for banner data access (PORT)
type BannerRepository interface {
	// CRUD operations
	Create(ctx context.Context, banner *model.BannerModel) error
	Update(ctx context.Context, banner *model.BannerModel) error
	Delete(ctx context.Context, id string) error
	GetByID(ctx context.Context, id string) (*model.BannerModel, error)

	// Query operations
	List(ctx context.Context, filters ListFilters) ([]*model.BannerModel, error)

	// Batch operations
	UpdatePriorities(ctx context.Context, updates []PriorityUpdate) error
}
