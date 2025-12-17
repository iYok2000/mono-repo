package response

import (
	"net/http"

	apperrors "monorepo/backend-go/pkg/errors"
)

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// NewErrorResponse creates a new error response
func NewErrorResponse(code, message string) ErrorResponse {
	return ErrorResponse{
		Code:    code,
		Message: message,
	}
}

// HTTPStatusFromError maps domain errors to HTTP status codes
func HTTPStatusFromError(err error) int {
	switch err.(type) {
	case *apperrors.NotFoundError:
		return http.StatusNotFound
	case *apperrors.ValidationError:
		return http.StatusBadRequest
	case *apperrors.ConflictError:
		return http.StatusConflict
	case *apperrors.BadRequestError:
		return http.StatusBadRequest
	case *apperrors.InternalError:
		return http.StatusInternalServerError
	default:
		// Check if implements DomainError interface
		if domainErr, ok := err.(apperrors.DomainError); ok {
			switch domainErr.Code() {
			case apperrors.CodeNotFound:
				return http.StatusNotFound
			case apperrors.CodeValidation:
				return http.StatusBadRequest
			case apperrors.CodeConflict:
				return http.StatusConflict
			case apperrors.CodeBadRequest:
				return http.StatusBadRequest
			}
		}
		return http.StatusInternalServerError
	}
}

// ErrorResponseFromError creates an ErrorResponse from a domain error
func ErrorResponseFromError(err error) ErrorResponse {
	if domainErr, ok := err.(apperrors.DomainError); ok {
		return ErrorResponse{
			Code:    domainErr.Code(),
			Message: domainErr.Message(),
		}
	}

	return ErrorResponse{
		Code:    apperrors.CodeInternal,
		Message: "internal server error",
	}
}
