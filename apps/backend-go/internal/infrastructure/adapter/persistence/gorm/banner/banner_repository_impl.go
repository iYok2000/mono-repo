package banner

import (
	"context"
	"encoding/json"

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
		// JSONB contains filter - uses GIN index
		// Use json.Marshal for safe parameter binding
		tierJSON, _ := json.Marshal([]string{*filters.SegmentTier})
		query = query.Where("segment_tiers @> ?", tierJSON)
	}

	if filters.StartDate != nil {
		query = query.Where("start_date >= ?", *filters.StartDate)
	}

	if filters.EndDate != nil {
		query = query.Where("end_date <= ?", *filters.EndDate)
	}

	// Order by priority (descending), then created_at (descending) - uses composite index
	query = query.Order("priority DESC, created_at DESC")

	var banners []*model.BannerModel
	err := query.Find(&banners).Error
	return banners, err
}

// UpdatePriorities batch updates banner priorities in a transaction using bulk update
func (r *bannerRepositoryImpl) UpdatePriorities(ctx context.Context, updates []repository.PriorityUpdate) error {
	if len(updates) == 0 {
		return nil
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Build CASE WHEN statement for bulk update
		var ids []string
		var args []interface{}
		caseStmt := "CASE id "

		for _, update := range updates {
			ids = append(ids, update.ID)
			caseStmt += "WHEN ? THEN ? "
			args = append(args, update.ID, update.Priority)
		}
		caseStmt += "END"

		// Append ids for WHERE IN clause
		args = append(args, ids)

		// Single UPDATE query instead of N queries
		return tx.Model(&model.BannerModel{}).
			Where("id IN ?", ids).
			Update("priority", gorm.Expr(caseStmt, args...)).Error
	})
}
