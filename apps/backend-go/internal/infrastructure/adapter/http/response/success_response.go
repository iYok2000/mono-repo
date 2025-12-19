package response

// SuccessResponse is a generic wrapper for successful API responses
// This provides a consistent response format across all endpoints
type SuccessResponse[T any] struct {
	Data T `json:"data"`
}

// NewSuccessResponse creates a new success response with data
func NewSuccessResponse[T any](data T) SuccessResponse[T] {
	return SuccessResponse[T]{
		Data: data,
	}
}

// NewSuccessResponseWithMessage creates a success response with a message
type SuccessMessageResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

// NewMessageResponse creates a success message response
func NewMessageResponse(message string, data ...any) SuccessMessageResponse {
	resp := SuccessMessageResponse{
		Message: message,
	}
	if len(data) > 0 {
		resp.Data = data[0]
	}
	return resp
}
