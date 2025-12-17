package errors

import "fmt"

// DomainError is the interface for all domain errors
type DomainError interface {
	error
	Code() string
	Message() string
}

// NotFoundError represents a resource not found error
type NotFoundError struct {
	Resource string
	ID       string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with id '%s' not found", e.Resource, e.ID)
}

func (e *NotFoundError) Code() string {
	return CodeNotFound
}

func (e *NotFoundError) Message() string {
	return e.Error()
}

func NewNotFoundError(resource, id string) *NotFoundError {
	return &NotFoundError{Resource: resource, ID: id}
}

// ValidationError represents a validation error
type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	if e.Field != "" {
		return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Msg)
	}
	return fmt.Sprintf("validation error: %s", e.Msg)
}

func (e *ValidationError) Code() string {
	return CodeValidation
}

func (e *ValidationError) Message() string {
	return e.Error()
}

func NewValidationError(field, message string) *ValidationError {
	return &ValidationError{Field: field, Msg: message}
}

func NewValidationErrorSimple(message string) *ValidationError {
	return &ValidationError{Msg: message}
}

// ConflictError represents a conflict error (e.g., duplicate resource)
type ConflictError struct {
	Resource string
	Msg      string
}

func (e *ConflictError) Error() string {
	return fmt.Sprintf("conflict with %s: %s", e.Resource, e.Msg)
}

func (e *ConflictError) Code() string {
	return CodeConflict
}

func (e *ConflictError) Message() string {
	return e.Error()
}

func NewConflictError(resource, message string) *ConflictError {
	return &ConflictError{Resource: resource, Msg: message}
}

// InternalError represents an internal server error
type InternalError struct {
	Msg string
	Err error
}

func (e *InternalError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("internal error: %s (caused by: %v)", e.Msg, e.Err)
	}
	return fmt.Sprintf("internal error: %s", e.Msg)
}

func (e *InternalError) Code() string {
	return CodeInternal
}

func (e *InternalError) Message() string {
	return e.Msg
}

func (e *InternalError) Unwrap() error {
	return e.Err
}

func NewInternalError(message string, err error) *InternalError {
	return &InternalError{Msg: message, Err: err}
}

// BadRequestError represents a bad request error
type BadRequestError struct {
	Msg string
}

func (e *BadRequestError) Error() string {
	return fmt.Sprintf("bad request: %s", e.Msg)
}

func (e *BadRequestError) Code() string {
	return CodeBadRequest
}

func (e *BadRequestError) Message() string {
	return e.Msg
}

func NewBadRequestError(message string) *BadRequestError {
	return &BadRequestError{Msg: message}
}
