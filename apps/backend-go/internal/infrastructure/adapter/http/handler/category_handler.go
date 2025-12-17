package handler

import (
	"net/http"

	"monorepo/backend-go/internal/application/devtoolkit/command"
	"monorepo/backend-go/internal/application/devtoolkit/query"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"

	"github.com/gin-gonic/gin"
)

// CategoryHandler handles HTTP requests for category resources
// This is an ADAPTER in Hexagonal Architecture - adapts HTTP to application layer
type CategoryHandler struct {
	createCategoryHandler *command.CreateCategoryHandler
	updateCategoryHandler *command.UpdateCategoryHandler
	deleteCategoryHandler *command.DeleteCategoryHandler
	listCategoriesHandler *query.ListCategoriesHandler
	getCategoryHandler    *query.GetCategoryHandler
}

// NewCategoryHandler creates a new CategoryHandler
func NewCategoryHandler(
	createCategoryHandler *command.CreateCategoryHandler,
	updateCategoryHandler *command.UpdateCategoryHandler,
	deleteCategoryHandler *command.DeleteCategoryHandler,
	listCategoriesHandler *query.ListCategoriesHandler,
	getCategoryHandler *query.GetCategoryHandler,
) *CategoryHandler {
	return &CategoryHandler{
		createCategoryHandler: createCategoryHandler,
		updateCategoryHandler: updateCategoryHandler,
		deleteCategoryHandler: deleteCategoryHandler,
		listCategoriesHandler: listCategoriesHandler,
		getCategoryHandler:    getCategoryHandler,
	}
}

// ListCategories handles GET /categories
func (h *CategoryHandler) ListCategories(c *gin.Context) {
	ctx := c.Request.Context()

	q := query.ListCategoriesQuery{}
	dtos, err := h.listCategoriesHandler.Handle(ctx, q)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Convert DTOs to HTTP response
	result := response.CategoriesToResponse(dtos)
	c.JSON(http.StatusOK, result)
}

// GetCategory handles GET /categories/:id
func (h *CategoryHandler) GetCategory(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	q := query.GetCategoryQuery{ID: id}
	dto, err := h.getCategoryHandler.Handle(ctx, q)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Convert DTO to HTTP response
	result := response.CategoryFromDTO(*dto)
	c.JSON(http.StatusOK, result)
}

// CreateCategory handles POST /categories
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req request.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", err.Error()))
		return
	}

	ctx := c.Request.Context()
	cmd := command.CreateCategoryCommand{
		ID:     req.ID,
		NameEn: req.NameEn,
		NameTh: req.NameTh,
	}

	dto, err := h.createCategoryHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Convert DTO to HTTP response
	result := response.CategoryFromDTO(*dto)
	c.JSON(http.StatusCreated, result)
}

// UpdateCategory handles PUT /categories/:id
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id := c.Param("id")

	var req request.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", err.Error()))
		return
	}

	ctx := c.Request.Context()
	cmd := command.UpdateCategoryCommand{
		ID:     id,
		NameEn: req.NameEn,
		NameTh: req.NameTh,
	}

	dto, err := h.updateCategoryHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Convert DTO to HTTP response
	result := response.CategoryFromDTO(*dto)
	c.JSON(http.StatusOK, result)
}

// DeleteCategory handles DELETE /categories/:id
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	ctx := c.Request.Context()

	cmd := command.DeleteCategoryCommand{ID: id}
	if err := h.deleteCategoryHandler.Handle(ctx, cmd); err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.Status(http.StatusNoContent)
}
