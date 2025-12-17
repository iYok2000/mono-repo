package query

import (
	"context"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// GetCategoryQuery represents the query to get a category by ID
type GetCategoryQuery struct {
	ID string
}

// GetCategoryHandler handles the get category query
type GetCategoryHandler struct {
	repo repository.CategoryRepository
}

// NewGetCategoryHandler creates a new GetCategoryHandler
func NewGetCategoryHandler(repo repository.CategoryRepository) *GetCategoryHandler {
	return &GetCategoryHandler{repo: repo}
}

// Handle executes the get category query
func (h *GetCategoryHandler) Handle(ctx context.Context, query GetCategoryQuery) (*dto.CategoryDTO, error) {
	category, err := h.repo.GetByID(ctx, query.ID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get category", err)
	}

	if category == nil {
		return nil, apperrors.NewNotFoundError("category", query.ID)
	}

	result := dto.CategoryToDTO(category)
	return &result, nil
}
