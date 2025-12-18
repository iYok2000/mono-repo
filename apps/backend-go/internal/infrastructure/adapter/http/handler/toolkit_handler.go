package handler

import (
	"net/http"

	"monorepo/backend-go/internal/application/devtoolkit/command"
	"monorepo/backend-go/internal/application/devtoolkit/query"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"

	"github.com/gin-gonic/gin"
)

// ToolkitHandler handles HTTP requests for toolkit resources
type ToolkitHandler struct {
	createToolkitHandler *command.CreateToolkitHandler
	updateToolkitHandler *command.UpdateToolkitHandler
	deleteToolkitHandler *command.DeleteToolkitHandler
	listToolkitsHandler  *query.ListToolkitsHandler
	getToolkitHandler    *query.GetToolkitHandler
}

// NewToolkitHandler creates a new ToolkitHandler
func NewToolkitHandler(
	createToolkitHandler *command.CreateToolkitHandler,
	updateToolkitHandler *command.UpdateToolkitHandler,
	deleteToolkitHandler *command.DeleteToolkitHandler,
	listToolkitsHandler *query.ListToolkitsHandler,
	getToolkitHandler *query.GetToolkitHandler,
) *ToolkitHandler {
	return &ToolkitHandler{
		createToolkitHandler: createToolkitHandler,
		updateToolkitHandler: updateToolkitHandler,
		deleteToolkitHandler: deleteToolkitHandler,
		listToolkitsHandler:  listToolkitsHandler,
		getToolkitHandler:    getToolkitHandler,
	}
}

// ListToolkits handles GET /toolkits
func (h *ToolkitHandler) ListToolkits(c *gin.Context) {
	ctx := c.Request.Context()

	dtos, err := h.listToolkitsHandler.Handle(ctx)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dtos)
}

// GetToolkit handles GET /toolkits/:id
func (h *ToolkitHandler) GetToolkit(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	dto, err := h.getToolkitHandler.Handle(ctx, id)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dto)
}

// CreateToolkit handles POST /toolkits
func (h *ToolkitHandler) CreateToolkit(c *gin.Context) {
	ctx := c.Request.Context()

	var req request.CreateToolkitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	cmd := command.CreateToolkitCommand{
		ID:          req.ID,
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Status:      req.Status,
		Tags:        req.Tags,
		Image:       req.Image,
		Description: req.Description,
	}

	dto, err := h.createToolkitHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusCreated, dto)
}

// UpdateToolkit handles PUT /toolkits/:id
func (h *ToolkitHandler) UpdateToolkit(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	var req request.UpdateToolkitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	cmd := command.UpdateToolkitCommand{
		ID:          id,
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Status:      req.Status,
		Tags:        req.Tags,
		Image:       req.Image,
		Description: req.Description,
	}

	dto, err := h.updateToolkitHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.JSON(http.StatusOK, dto)
}

// DeleteToolkit handles DELETE /toolkits/:id
func (h *ToolkitHandler) DeleteToolkit(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	cmd := command.DeleteToolkitCommand{ID: id}
	if err := h.deleteToolkitHandler.Handle(ctx, cmd); err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	c.Status(http.StatusNoContent)
}
