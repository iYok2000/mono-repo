package query

import (
	"context"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// ListServicesQuery represents the query to list all services
type ListServicesQuery struct {
	// Future: add filtering, pagination, sorting
}

// ListServicesHandler handles the list services query
type ListServicesHandler struct {
	repo repository.ServiceRepository
}

// NewListServicesHandler creates a new ListServicesHandler
func NewListServicesHandler(repo repository.ServiceRepository) *ListServicesHandler {
	return &ListServicesHandler{repo: repo}
}

// Handle executes the list services query
func (h *ListServicesHandler) Handle(ctx context.Context, query ListServicesQuery) ([]dto.ServiceItemDTO, error) {
	services, err := h.repo.ListServices(ctx)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to list services", err)
	}

	return dto.ServiceItemsToDTO(services), nil
}
