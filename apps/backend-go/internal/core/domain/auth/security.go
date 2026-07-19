package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const (
	// Password requirements
	MinPasswordLength = 8
	MaxPasswordLength = 128
	BcryptCost        = 12

	// Account locking
	MaxFailedAttempts = 5
	LockoutDuration   = 15 * time.Minute

	// JWT expiration
	// Session is capped at 10 minutes: both access and refresh tokens expire
	// 10 minutes after login. The refresh handler reuses the same refresh token,
	// so a session can never extend past its original 10-minute window.
	AccessTokenDuration  = 10 * time.Minute
	RefreshTokenDuration = 10 * time.Minute

	// Session
	MaxActiveSessions = 5
)

var (
	ErrInvalidCredentials = errors.New("invalid username or password")
	ErrAccountLocked      = errors.New("account is locked due to too many failed attempts")
	ErrAccountInactive    = errors.New("account is inactive")
	ErrInvalidToken       = errors.New("invalid or expired token")
	ErrSessionExpired     = errors.New("session has expired")
	ErrSessionRevoked     = errors.New("session has been revoked")
)

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	if len(password) < MinPasswordLength {
		return "", fmt.Errorf("password must be at least %d characters", MinPasswordLength)
	}
	if len(password) > MaxPasswordLength {
		return "", fmt.Errorf("password must not exceed %d characters", MaxPasswordLength)
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(password), BcryptCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// CheckPasswordHash compares a password with a hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateSecureToken generates a cryptographically secure random token
func GenerateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

// JWTClaims represents the claims in a JWT token
type JWTClaims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateAccessToken generates a JWT access token
func GenerateAccessToken(user *AdminUser, jwtSecret string) (string, string, error) {
	jti, err := GenerateSecureToken(16)
	if err != nil {
		return "", "", err
	}

	expirationTime := time.Now().Add(AccessTokenDuration)
	claims := &JWTClaims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			ID:        jti,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}

	return tokenString, jti, nil
}

// GenerateRefreshToken generates a secure refresh token
func GenerateRefreshToken() (string, error) {
	return GenerateSecureToken(32)
}

// ValidateAccessToken validates and parses a JWT access token
func ValidateAccessToken(tokenString, jwtSecret string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, ErrInvalidToken
	}

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, ErrInvalidToken
}

// ValidatePasswordStrength validates password complexity
func ValidatePasswordStrength(password string) error {
	if len(password) < MinPasswordLength {
		return fmt.Errorf("password must be at least %d characters long", MinPasswordLength)
	}
	if len(password) > MaxPasswordLength {
		return fmt.Errorf("password must not exceed %d characters", MaxPasswordLength)
	}

	var (
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasNumber = true
		case char >= '!' && char <= '/':
			hasSpecial = true
		case char >= ':' && char <= '@':
			hasSpecial = true
		case char >= '[' && char <= '`':
			hasSpecial = true
		case char >= '{' && char <= '~':
			hasSpecial = true
		}
	}

	if !hasUpper {
		return errors.New("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return errors.New("password must contain at least one lowercase letter")
	}
	if !hasNumber {
		return errors.New("password must contain at least one number")
	}
	if !hasSpecial {
		return errors.New("password must contain at least one special character")
	}

	return nil
}
