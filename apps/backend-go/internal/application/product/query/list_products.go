package query

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/product/dto"
	"monorepo/backend-go/internal/core/domain/product/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/model"
	apperrors "monorepo/backend-go/pkg/errors"
)

// ListProductsHandler handles listing all products
type ListProductsHandler struct {
	repo repository.ServiceRepository
}

// NewListProductsHandler creates a new ListProductsHandler
func NewListProductsHandler(repo repository.ServiceRepository) *ListProductsHandler {
	return &ListProductsHandler{repo: repo}
}

// Handle executes the list products query
func (h *ListProductsHandler) Handle(ctx context.Context) ([]dto.ProductDTO, error) {
	// Get domain entities
	services, err := h.repo.ListServices(ctx)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to list products", err)
	}

	// Convert to DTOs
	dtos := make([]dto.ProductDTO, 0, len(services))
	for _, s := range services {
		// Parse tags from JSON
		var tags []string
		// Tags might be empty, handle gracefully
		if len(s.Tags()) > 0 {
			tags = s.Tags()
		}

		dtos = append(dtos, dto.ProductDTO{
			ID:          s.ID(),
			CategoryID:  s.Category(),
			Title:       s.Title(),
			Status:      s.Status().String(),
			Tags:        tags,
			Image:       s.Image(),
			Description: s.Description(),
		})
	}

	return dtos, nil
}

// GetProductHandler handles getting a single product by ID
type GetProductHandler struct {
	repo repository.ServiceRepository
}

// NewGetProductHandler creates a new GetProductHandler
func NewGetProductHandler(repo repository.ServiceRepository) *GetProductHandler {
	return &GetProductHandler{repo: repo}
}

// Handle executes the get product query
func (h *GetProductHandler) Handle(ctx context.Context, id string) (*dto.ProductDetailDTO, error) {
	product, err := h.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get product", err)
	}
	if product == nil {
		return nil, apperrors.NewNotFoundError("product", "product not found")
	}

	// Parse tags from JSON
	var tags []string
	if len(product.Tags) > 0 {
		if err := json.Unmarshal([]byte(product.Tags), &tags); err != nil {
			tags = []string{}
		}
	}

	// Get content fields from detail
	description := ""
	mainContent := ""
	howToUse := ""
	reference := ""
	example := ""
	if product.Detail != nil {
		description = product.Detail.Description
		mainContent = product.Detail.MainContent
		howToUse = product.Detail.HowToUse
		reference = product.Detail.Reference
		example = product.Detail.Example
	}

	return &dto.ProductDetailDTO{
		ID:          product.ID,
		CategoryID:  product.CategoryID,
		Title:       product.Title,
		Status:      product.Status,
		Tags:        tags,
		Image:       product.Image,
		Description: description,
		MainContent: mainContent,
		HowToUse:    howToUse,
		Reference:   reference,
		Example:     example,
	}, nil
}

// GetProductsByModel returns raw models (for internal use)
func GetProductsByModel(repo repository.ServiceRepository) func(ctx context.Context) ([]model.ProductModel, error) {
	return func(ctx context.Context) ([]model.ProductModel, error) {
		// This is a helper function if needed elsewhere
		return nil, nil
	}
}
