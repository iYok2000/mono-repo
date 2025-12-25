package auth

import (
	"context"
	"fmt"
	"time"
)

// Service handles business logic for admin authentication
type Service struct {
	repo      Repository
	jwtSecret string
}

// NewService creates a new authentication service
func NewService(repo Repository, jwtSecret string) *Service {
	return &Service{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

// LoginRequest represents a login request
type LoginRequest struct {
	Username  string
	Password  string
	IPAddress string
	UserAgent string
}

// LoginResponse represents a successful login response
type LoginResponse struct {
	AccessToken        string     `json:"access_token"`
	RefreshToken       string     `json:"refresh_token"`
	TokenType          string     `json:"token_type"`
	ExpiresIn          int        `json:"expires_in"`
	User               *AdminUser `json:"user"`
	MustChangePassword bool       `json:"must_change_password"`
}

// Login authenticates a user and creates a session
func (s *Service) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error) {
	// Record login attempt
	defer func() {
		// Create login history record (best effort, don't fail login if this fails)
		history := &AdminLoginHistory{
			Username:  req.Username,
			IPAddress: req.IPAddress,
			UserAgent: req.UserAgent,
		}
		_ = s.repo.CreateLoginHistory(ctx, history)
	}()

	// Get user by username
	user, err := s.repo.GetUserByUsername(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("database error: %w", err)
	}
	if user == nil {
		// Don't reveal if username exists
		_ = s.recordLoginFailure(ctx, nil, req, LoginStatusFailedPassword, "Invalid credentials")
		return nil, ErrInvalidCredentials
	}

	// Check if account can login
	canLogin, reason := user.CanLogin()
	if !canLogin {
		status := LoginStatusFailedLocked
		if !user.IsActive {
			status = LoginStatusFailedInactive
		}
		_ = s.recordLoginFailure(ctx, &user.ID, req, status, reason)

		if user.IsLocked() {
			return nil, ErrAccountLocked
		}
		return nil, ErrAccountInactive
	}

	// Verify password
	if !CheckPasswordHash(req.Password, user.PasswordHash) {
		// Increment failed attempts
		_ = s.repo.IncrementFailedAttempts(ctx, user.ID)
		user.FailedLoginAttempts++

		// Lock account if too many failed attempts
		if user.FailedLoginAttempts >= MaxFailedAttempts {
			lockUntil := time.Now().Add(LockoutDuration)
			_ = s.repo.LockAccount(ctx, user.ID, lockUntil)
			_ = s.recordLoginFailure(ctx, &user.ID, req, LoginStatusFailedLocked, "Account locked due to too many failed attempts")
			return nil, ErrAccountLocked
		}

		_ = s.recordLoginFailure(ctx, &user.ID, req, LoginStatusFailedPassword, "Invalid password")
		return nil, ErrInvalidCredentials
	}

	// Reset failed attempts on successful login
	if err := s.repo.ResetFailedAttempts(ctx, user.ID); err != nil {
		return nil, fmt.Errorf("failed to reset failed attempts: %w", err)
	}

	// Update last login
	if err := s.repo.UpdateLastLogin(ctx, user.ID, req.IPAddress); err != nil {
		return nil, fmt.Errorf("failed to update last login: %w", err)
	}

	// Generate tokens
	accessToken, jti, err := GenerateAccessToken(user, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshToken, err := GenerateRefreshToken()
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	refreshTokenHash, err := HashRefreshToken(refreshToken)
	if err != nil {
		return nil, fmt.Errorf("failed to hash refresh token: %w", err)
	}

	// Create session
	session := &AdminSession{
		AdminUserID:      user.ID,
		RefreshTokenHash: refreshTokenHash,
		AccessTokenJTI:   jti,
		IPAddress:        req.IPAddress,
		UserAgent:        req.UserAgent,
		ExpiresAt:        time.Now().Add(RefreshTokenDuration),
	}

	// Check active sessions limit
	activeSessions, err := s.repo.GetActiveSessionsByUserID(ctx, user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get active sessions: %w", err)
	}

	// Revoke oldest sessions if limit exceeded
	if len(activeSessions) >= MaxActiveSessions {
		oldestSession := activeSessions[len(activeSessions)-1]
		_ = s.repo.RevokeSession(ctx, oldestSession.ID, "Session limit exceeded")
	}

	if err := s.repo.CreateSession(ctx, session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	// Record successful login
	_ = s.recordLoginSuccess(ctx, user.ID, req)

	return &LoginResponse{
		AccessToken:        accessToken,
		RefreshToken:       refreshToken,
		TokenType:          "Bearer",
		ExpiresIn:          int(AccessTokenDuration.Seconds()),
		User:               user,
		MustChangePassword: user.MustChangePassword,
	}, nil
}

// RefreshToken refreshes an access token using a refresh token
func (s *Service) RefreshToken(ctx context.Context, refreshToken, ipAddress, userAgent string) (*LoginResponse, error) {
	// Hash the refresh token to find the session
	// Note: We need to check all active sessions since bcrypt hashes are unique each time
	// This is a limitation - in production, consider using a faster hash for refresh tokens
	session, err := s.repo.GetSessionByRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, err
	}

	// Verify refresh token hash
	if !CheckRefreshTokenHash(refreshToken, session.RefreshTokenHash) {
		return nil, ErrInvalidToken
	}

	// Check if session is expired
	if time.Now().After(session.ExpiresAt) {
		_ = s.repo.RevokeSession(ctx, session.ID, "Session expired")
		return nil, ErrSessionExpired
	}

	// Get user
	user, err := s.repo.GetUserByID(ctx, session.AdminUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return nil, ErrInvalidToken
	}

	// Check if user can still login
	canLogin, _ := user.CanLogin()
	if !canLogin {
		_ = s.repo.RevokeAllUserSessions(ctx, user.ID, "Account inactive or locked")
		return nil, ErrAccountInactive
	}

	// Generate new access token
	accessToken, _, err := GenerateAccessToken(user, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	// Update session activity
	if err := s.repo.UpdateSessionActivity(ctx, session.ID); err != nil {
		return nil, fmt.Errorf("failed to update session activity: %w", err)
	}

	return &LoginResponse{
		AccessToken:        accessToken,
		RefreshToken:       refreshToken, // Keep the same refresh token
		TokenType:          "Bearer",
		ExpiresIn:          int(AccessTokenDuration.Seconds()),
		User:               user,
		MustChangePassword: user.MustChangePassword,
	}, nil
}

// Logout revokes a session
func (s *Service) Logout(ctx context.Context, refreshToken string) error {
	session, err := s.repo.GetSessionByRefreshToken(ctx, refreshToken)
	if err != nil {
		return err
	}

	if !CheckRefreshTokenHash(refreshToken, session.RefreshTokenHash) {
		return ErrInvalidToken
	}

	return s.repo.RevokeSession(ctx, session.ID, "User logged out")
}

// LogoutAllSessions revokes all sessions for a user
func (s *Service) LogoutAllSessions(ctx context.Context, userID int) error {
	return s.repo.RevokeAllUserSessions(ctx, userID, "User logged out from all devices")
}

// VerifyAccessToken verifies and returns claims from an access token
func (s *Service) VerifyAccessToken(ctx context.Context, accessToken string) (*JWTClaims, error) {
	claims, err := ValidateAccessToken(accessToken, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	// Optionally, verify user still exists and is active
	user, err := s.repo.GetUserByID(ctx, claims.UserID)
	if err != nil {
		return nil, err
	}
	if user == nil || !user.IsActive {
		return nil, ErrAccountInactive
	}

	return claims, nil
}

// ChangePassword changes a user's password
func (s *Service) ChangePassword(ctx context.Context, userID int, currentPassword, newPassword string) error {
	// Get user
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return ErrInvalidCredentials
	}

	// Verify current password
	if !CheckPasswordHash(currentPassword, user.PasswordHash) {
		return ErrInvalidCredentials
	}

	// Validate new password strength
	if err := ValidatePasswordStrength(newPassword); err != nil {
		return err
	}

	// Hash new password
	newPasswordHash, err := HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update password
	if err := s.repo.ChangePassword(ctx, userID, newPasswordHash); err != nil {
		return fmt.Errorf("failed to change password: %w", err)
	}

	// Revoke all sessions to force re-login
	_ = s.repo.RevokeAllUserSessions(ctx, userID, "Password changed")

	return nil
}

// GetLoginHistory retrieves login history for a user
func (s *Service) GetLoginHistory(ctx context.Context, userID int, limit int) ([]*AdminLoginHistory, error) {
	return s.repo.GetLoginHistory(ctx, userID, limit)
}

// GetActiveSessions retrieves active sessions for a user
func (s *Service) GetActiveSessions(ctx context.Context, userID int) ([]*AdminSession, error) {
	return s.repo.GetActiveSessionsByUserID(ctx, userID)
}

// Helper functions

func (s *Service) recordLoginSuccess(ctx context.Context, userID int, req *LoginRequest) error {
	history := &AdminLoginHistory{
		AdminUserID: &userID,
		Username:    req.Username,
		IPAddress:   req.IPAddress,
		UserAgent:   req.UserAgent,
		LoginStatus: LoginStatusSuccess,
	}
	return s.repo.CreateLoginHistory(ctx, history)
}

func (s *Service) recordLoginFailure(ctx context.Context, userID *int, req *LoginRequest, status string, reason string) error {
	history := &AdminLoginHistory{
		AdminUserID:   userID,
		Username:      req.Username,
		IPAddress:     req.IPAddress,
		UserAgent:     req.UserAgent,
		LoginStatus:   status,
		FailureReason: &reason,
	}
	return s.repo.CreateLoginHistory(ctx, history)
}
