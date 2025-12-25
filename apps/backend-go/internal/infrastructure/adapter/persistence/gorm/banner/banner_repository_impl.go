package banner

import (
	"context"
	"fmt"

	"monorepo/backend-go/internal/core/domain/banner/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner/model"

	"gorm.io/gorm"
)

// bannerRepositoryImpl implements the BannerRepository interface (ADAPTER)
type bannerRepositoryImpl struct {
	db *gorm.DB
}

// NewBannerRepository creates a new banner repository instance
func NewBannerRepository(db *gorm.DB) repository.BannerRepository {
	return &bannerRepositoryImpl{
		db: db,
	}
}

// Create creates a new banner
func (r *bannerRepositoryImpl) Create(ctx context.Context, banner *model.BannerModel) error {
	return r.db.WithContext(ctx).Create(banner).Error
}

// Update updates an existing banner
func (r *bannerRepositoryImpl) Update(ctx context.Context, banner *model.BannerModel) error {
	return r.db.WithContext(ctx).Save(banner).Error
}

// Delete deletes a banner by ID
func (r *bannerRepositoryImpl) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.BannerModel{}, "id = ?", id).Error
}

// GetByID retrieves a banner by ID
func (r *bannerRepositoryImpl) GetByID(ctx context.Context, id string) (*model.BannerModel, error) {
	var banner model.BannerModel
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&banner).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &banner, nil
}

// List retrieves banners with optional filters
func (r *bannerRepositoryImpl) List(ctx context.Context, filters repository.ListFilters) ([]*model.BannerModel, error) {
	query := r.db.WithContext(ctx).Model(&model.BannerModel{})

	// Apply filters
	if filters.Status != nil {
		query = query.Where("is_active = ?", *filters.Status)
	}

	if filters.SegmentTier != nil {
		// JSONB contains filter - check if the array contains the specified tier
		query = query.Where("segment_tiers @> ?", fmt.Sprintf(`["%s"]`, *filters.SegmentTier))
	}

	if filters.StartDate != nil {
		query = query.Where("start_date >= ?", *filters.StartDate)
	}

	if filters.EndDate != nil {
		query = query.Where("end_date <= ?", *filters.EndDate)
	}

	// Order by priority (descending), then created_at (descending)
	query = query.Order("priority DESC, created_at DESC")

	var banners []*model.BannerModel
	err := query.Find(&banners).Error
	return banners, err
}

// UpdatePriorities batch updates banner priorities in a transaction
func (r *bannerRepositoryImpl) UpdatePriorities(ctx context.Context, updates []repository.PriorityUpdate) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, update := range updates {
			if err := tx.Model(&model.BannerModel{}).
				Where("id = ?", update.ID).
				Update("priority", update.Priority).Error; err != nil {
				return fmt.Errorf("update priority for banner %s: %w", update.ID, err)
			}
		}
		return nil
	})
}
