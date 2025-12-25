package command

import (
	"context"
	"encoding/json"
	"time"

	"monorepo/backend-go/internal/application/banner/dto"
	"monorepo/backend-go/internal/application/banner/validation"
	"monorepo/backend-go/internal/core/domain/banner/repository"
	"monorepo/backend-go/internal/core/domain/banner/valueobject"
	apperrors "monorepo/backend-go/pkg/errors"

	"gorm.io/datatypes"
)

// UpdateBannerCommand represents the command to update a banner
type UpdateBannerCommand struct {
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

// UpdateBannerHandler handles the update banner command
type UpdateBannerHandler struct {
	repo      repository.BannerRepository
	validator *validation.BannerValidator
}

// NewUpdateBannerHandler creates a new UpdateBannerHandler
func NewUpdateBannerHandler(repo repository.BannerRepository) *UpdateBannerHandler {
	return &UpdateBannerHandler{
		repo:      repo,
		validator: validation.NewBannerValidator(),
	}
}

// Handle executes the update banner command
func (h *UpdateBannerHandler) Handle(ctx context.Context, cmd UpdateBannerCommand) (*dto.BannerDTO, error) {
	// Check if banner exists
	existing, err := h.repo.GetByID(ctx, cmd.ID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get banner", err)
	}
	if existing == nil {
		return nil, apperrors.NewNotFoundError("banner", "banner not found")
	}

	// Security Layer: Validate and sanitize ALL inputs

	// 1. Validate image paths
	sanitizedImageTH, err := h.validator.ValidateImagePath(cmd.ImageTH)
	if err != nil {
		return nil, apperrors.NewValidationError("image_th", err.Error())
	}

	sanitizedImageEN, err := h.validator.ValidateImagePath(cmd.ImageEN)
	if err != nil {
		return nil, apperrors.NewValidationError("image_en", err.Error())
	}

	// 2. Validate URLs
	sanitizedURLTH, err := h.validator.ValidateURL(cmd.URLTH)
	if err != nil {
		return nil, apperrors.NewValidationError("url_th", err.Error())
	}

	sanitizedURLEN, err := h.validator.ValidateURL(cmd.URLEN)
	if err != nil {
		return nil, apperrors.NewValidationError("url_en", err.Error())
	}

	// 3. Validate segment tiers
	sanitizedTiers, err := h.validator.ValidateSegmentTiers(
		cmd.SegmentTiers,
		valueobject.PredefinedSegmentTiers,
	)
	if err != nil {
		return nil, apperrors.NewValidationError("segment_tiers", err.Error())
	}

	// 4. Validate date range
	if err := h.validator.ValidateDateRange(cmd.StartDate, cmd.EndDate); err != nil {
		return nil, apperrors.NewValidationError("date_range", err.Error())
	}

	// 5. Validate priority
	if err := h.validator.ValidatePriority(cmd.Priority); err != nil {
		return nil, apperrors.NewValidationError("priority", err.Error())
	}

	// Marshal segment tiers to JSONB
	tiersJSON, err := json.Marshal(sanitizedTiers)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to marshal segment tiers", err)
	}

	// Update model with sanitized data
	existing.ImageTH = sanitizedImageTH
	existing.ImageEN = sanitizedImageEN
	existing.URLTH = sanitizedURLTH
	existing.URLEN = sanitizedURLEN
	existing.SegmentTiers = datatypes.JSON(tiersJSON)
	existing.StartDate = cmd.StartDate
	existing.EndDate = cmd.EndDate
	existing.IsActive = cmd.IsActive
	existing.Priority = cmd.Priority

	// Persist
	if err := h.repo.Update(ctx, existing); err != nil {
		return nil, apperrors.NewInternalError("failed to update banner", err)
	}

	// Return DTO
	return &dto.BannerDTO{
		ID:           existing.ID,
		ImageTH:      existing.ImageTH,
		ImageEN:      existing.ImageEN,
		URLTH:        existing.URLTH,
		URLEN:        existing.URLEN,
		SegmentTiers: sanitizedTiers,
		StartDate:    existing.StartDate,
		EndDate:      existing.EndDate,
		IsActive:     existing.IsActive,
		Priority:     existing.Priority,
		CreatedAt:    existing.CreatedAt,
		UpdatedAt:    existing.UpdatedAt,
	}, nil
}
