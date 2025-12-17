package query

import (
	"context"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// ListCategoriesQuery represents the query to list all categories
type ListCategoriesQuery struct {
	// Future: add filtering, pagination, sorting
}

// ListCategoriesHandler handles the list categories query
type ListCategoriesHandler struct {
	repo repository.CategoryRepository
}

// NewListCategoriesHandler creates a new ListCategoriesHandler
func NewListCategoriesHandler(repo repository.CategoryRepository) *ListCategoriesHandler {
	return &ListCategoriesHandler{repo: repo}
}

// Handle executes the list categories query
func (h *ListCategoriesHandler) Handle(ctx context.Context, query ListCategoriesQuery) ([]dto.CategoryDTO, error) {
	categories, err := h.repo.List(ctx)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to list categories", err)
	}

	return dto.CategoriesToDTO(categories), nil
}
