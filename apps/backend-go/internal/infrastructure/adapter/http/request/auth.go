package request

// LoginRequest represents a login request payload
type LoginRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Password string `json:"password" validate:"required,min=8"`
}

// RefreshTokenRequest represents a token refresh request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// ChangePasswordRequest represents a password change request
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
}

// Validate validates the login request
func (r *LoginRequest) Validate() error {
	if r.Username == "" {
		return ErrValidation("username is required")
	}
	if len(r.Username) < 3 || len(r.Username) > 50 {
		return ErrValidation("username must be between 3 and 50 characters")
	}
	if r.Password == "" {
		return ErrValidation("password is required")
	}
	if len(r.Password) < 8 {
		return ErrValidation("password must be at least 8 characters")
	}
	return nil
}

// ValidationError represents a validation error
type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}

func ErrValidation(msg string) error {
	return &ValidationError{Message: msg}
}
