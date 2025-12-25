package command

import (
	"context"
	"encoding/json"
	"time"

	"monorepo/backend-go/internal/application/banner/dto"
	"monorepo/backend-go/internal/application/banner/validation"
	"monorepo/backend-go/internal/core/domain/banner/repository"
	"monorepo/backend-go/internal/core/domain/banner/valueobject"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner/model"
	apperrors "monorepo/backend-go/pkg/errors"

	"gorm.io/datatypes"
)

// CreateBannerCommand represents the command to create a banner
type CreateBannerCommand struct {
	ID           string
	ImageTH      string
	ImageEN      string
	URLTH        string
	URLEN        string
	SegmentTiers []string
	StartDate    time.Time
	EndDate      time.Time
	IsActive     bool
	Priority     int
}

// CreateBannerHandler handles the create banner command
type CreateBannerHandler struct {
	repo      repository.BannerRepository
	validator *validation.BannerValidator
}

// NewCreateBannerHandler creates a new CreateBannerHandler
func NewCreateBannerHandler(repo repository.BannerRepository) *CreateBannerHandler {
	return &CreateBannerHandler{
		repo:      repo,
		validator: validation.NewBannerValidator(),
	}
}

// Handle executes the create banner command
func (h *CreateBannerHandler) Handle(ctx context.Context, cmd CreateBannerCommand) (*dto.BannerDTO, error) {
	// Security Layer: Validate and sanitize ALL inputs

	// 1. Validate ID
	sanitizedID, err := h.validator.ValidateAndSanitizeID(cmd.ID)
	if err != nil {
		return nil, apperrors.NewValidationError("id", err.Error())
	}

	// 2. Validate image paths
	sanitizedImageTH, err := h.validator.ValidateImagePath(cmd.ImageTH)
	if err != nil {
		return nil, apperrors.NewValidationError("image_th", err.Error())
	}

	sanitizedImageEN, err := h.validator.ValidateImagePath(cmd.ImageEN)
	if err != nil {
		return nil, apperrors.NewValidationError("image_en", err.Error())
	}

	// 3. Validate URLs (XSS protection)
	sanitizedURLTH, err := h.validator.ValidateURL(cmd.URLTH)
	if err != nil {
		return nil, apperrors.NewValidationError("url_th", err.Error())
	}

	sanitizedURLEN, err := h.validator.ValidateURL(cmd.URLEN)
	if err != nil {
		return nil, apperrors.NewValidationError("url_en", err.Error())
	}

	// 4. Validate segment tiers
	sanitizedTiers, err := h.validator.ValidateSegmentTiers(
		cmd.SegmentTiers,
		valueobject.PredefinedSegmentTiers,
	)
	if err != nil {
		return nil, apperrors.NewValidationError("segment_tiers", err.Error())
	}

	// 5. Validate date range
	if err := h.validator.ValidateDateRange(cmd.StartDate, cmd.EndDate); err != nil {
		return nil, apperrors.NewValidationError("date_range", err.Error())
	}

	// 6. Validate priority
	if err := h.validator.ValidatePriority(cmd.Priority); err != nil {
		return nil, apperrors.NewValidationError("priority", err.Error())
	}

	// Marshal segment tiers to JSONB (SQL injection protection via GORM)
	tiersJSON, err := json.Marshal(sanitizedTiers)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to marshal segment tiers", err)
	}

	// Create model with sanitized data
	banner := &model.BannerModel{
		ID:           sanitizedID,
		ImageTH:      sanitizedImageTH,
		ImageEN:      sanitizedImageEN,
		URLTH:        sanitizedURLTH,
		URLEN:        sanitizedURLEN,
		SegmentTiers: datatypes.JSON(tiersJSON),
		StartDate:    cmd.StartDate,
		EndDate:      cmd.EndDate,
		IsActive:     cmd.IsActive,
		Priority:     cmd.Priority,
	}

	// Persist (using GORM parameterized queries - SQL injection safe)
	if err := h.repo.Create(ctx, banner); err != nil {
		return nil, apperrors.NewInternalError("failed to create banner", err)
	}

	// Return DTO
	return &dto.BannerDTO{
		ID:           banner.ID,
		ImageTH:      banner.ImageTH,
		ImageEN:      banner.ImageEN,
		URLTH:        banner.URLTH,
		URLEN:        banner.URLEN,
		SegmentTiers: sanitizedTiers,
		StartDate:    banner.StartDate,
		EndDate:      banner.EndDate,
		IsActive:     banner.IsActive,
		Priority:     banner.Priority,
		CreatedAt:    banner.CreatedAt,
		UpdatedAt:    banner.UpdatedAt,
	}, nil
}
