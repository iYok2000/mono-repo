package handler

import (
	"net/http"

	"monorepo/backend-go/internal/application/product/command"
	"monorepo/backend-go/internal/application/product/query"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"

	"github.com/gin-gonic/gin"
)

// ProductHandler handles HTTP requests for product resources
type ProductHandler struct {
	createProductHandler *command.CreateProductHandler
	updateProductHandler *command.UpdateProductHandler
	deleteProductHandler *command.DeleteProductHandler
	listProductsHandler  *query.ListProductsHandler
	getProductHandler    *query.GetProductHandler
}

// NewProductHandler creates a new ProductHandler
func NewProductHandler(
	createProductHandler *command.CreateProductHandler,
	updateProductHandler *command.UpdateProductHandler,
	deleteProductHandler *command.DeleteProductHandler,
	listProductsHandler *query.ListProductsHandler,
	getProductHandler *query.GetProductHandler,
) *ProductHandler {
	return &ProductHandler{
		createProductHandler: createProductHandler,
		updateProductHandler: updateProductHandler,
		deleteProductHandler: deleteProductHandler,
		listProductsHandler:  listProductsHandler,
		getProductHandler:    getProductHandler,
	}
}

// ListProducts handles GET /products
func (h *ProductHandler) ListProducts(c *gin.Context) {
	ctx := c.Request.Context()

	dtos, err := h.listProductsHandler.Handle(ctx)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dtos)
}

// GetProduct handles GET /products/:id
func (h *ProductHandler) GetProduct(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	dto, err := h.getProductHandler.Handle(ctx, id)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dto)
}

// CreateProduct handles POST /products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	ctx := c.Request.Context()

	var req request.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	cmd := command.CreateProductCommand{
		ID:          req.ID,
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Status:      req.Status,
		Tags:        req.Tags,
		Image:       req.Image,
		Description: req.Description,
		MainContent: req.MainContent,
		HowToUse:    req.HowToUse,
		Reference:   req.Reference,
		Example:     req.Example,
	}

	dto, err := h.createProductHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusCreated, dto)
}

// UpdateProduct handles PUT /products/:id
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	var req request.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	cmd := command.UpdateProductCommand{
		ID:          id,
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Status:      req.Status,
		Tags:        req.Tags,
		Image:       req.Image,
		Description: req.Description,
		MainContent: req.MainContent,
		HowToUse:    req.HowToUse,
		Reference:   req.Reference,
		Example:     req.Example,
	}

	dto, err := h.updateProductHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dto)
}

// DeleteProduct handles DELETE /products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	cmd := command.DeleteProductCommand{ID: id}
	if err := h.deleteProductHandler.Handle(ctx, cmd); err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.Status(http.StatusNoContent)
}
