package auth

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Repository handles database operations for admin authentication
type Repository interface {
	// User operations
	GetUserByUsername(ctx context.Context, username string) (*AdminUser, error)
	GetUserByID(ctx context.Context, id int) (*AdminUser, error)
	UpdateUser(ctx context.Context, user *AdminUser) error
	IncrementFailedAttempts(ctx context.Context, userID int) error
	ResetFailedAttempts(ctx context.Context, userID int) error
	LockAccount(ctx context.Context, userID int, until time.Time) error
	UpdateLastLogin(ctx context.Context, userID int, ip string) error
	ChangePassword(ctx context.Context, userID int, newPasswordHash string) error

	// Session operations
	CreateSession(ctx context.Context, session *AdminSession) error
	GetSessionByRefreshToken(ctx context.Context, refreshTokenHash string) (*AdminSession, error)
	GetActiveSessionsByUserID(ctx context.Context, userID int) ([]*AdminSession, error)
	UpdateSessionActivity(ctx context.Context, sessionID int) error
	RevokeSession(ctx context.Context, sessionID int, reason string) error
	RevokeAllUserSessions(ctx context.Context, userID int, reason string) error
	CleanupExpiredSessions(ctx context.Context) error

	// Login history operations
	CreateLoginHistory(ctx context.Context, history *AdminLoginHistory) error
	GetLoginHistory(ctx context.Context, userID int, limit int) ([]*AdminLoginHistory, error)
}

// PostgresRepository implements Repository using PostgreSQL
type PostgresRepository struct {
	db *sql.DB
}

// NewPostgresRepository creates a new PostgreSQL repository
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

// GetUserByUsername retrieves a user by username
func (r *PostgresRepository) GetUserByUsername(ctx context.Context, username string) (*AdminUser, error) {
	user := &AdminUser{}
	query := `
		SELECT id, username, email, password_hash, full_name, role, is_active,
		       must_change_password, failed_login_attempts, locked_until,
		       last_login_at, last_login_ip, created_at, updated_at
		FROM admin_users
		WHERE username = $1
	`
	err := r.db.QueryRowContext(ctx, query, username).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.FullName,
		&user.Role, &user.IsActive, &user.MustChangePassword, &user.FailedLoginAttempts,
		&user.LockedUntil, &user.LastLoginAt, &user.LastLoginIP,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetUserByID retrieves a user by ID
func (r *PostgresRepository) GetUserByID(ctx context.Context, id int) (*AdminUser, error) {
	user := &AdminUser{}
	query := `
		SELECT id, username, email, password_hash, full_name, role, is_active,
		       must_change_password, failed_login_attempts, locked_until,
		       last_login_at, last_login_ip, created_at, updated_at
		FROM admin_users
		WHERE id = $1
	`
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.FullName,
		&user.Role, &user.IsActive, &user.MustChangePassword, &user.FailedLoginAttempts,
		&user.LockedUntil, &user.LastLoginAt, &user.LastLoginIP,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// UpdateUser updates user information
func (r *PostgresRepository) UpdateUser(ctx context.Context, user *AdminUser) error {
	query := `
		UPDATE admin_users 
		SET full_name = $1, email = $2, role = $3, is_active = $4, 
		    must_change_password = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $6
	`
	_, err := r.db.ExecContext(ctx, query,
		user.FullName, user.Email, user.Role, user.IsActive,
		user.MustChangePassword, user.ID,
	)
	return err
}

// IncrementFailedAttempts increments the failed login attempts counter
func (r *PostgresRepository) IncrementFailedAttempts(ctx context.Context, userID int) error {
	query := `
		UPDATE admin_users 
		SET failed_login_attempts = failed_login_attempts + 1
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, userID)
	return err
}

// ResetFailedAttempts resets the failed login attempts counter
func (r *PostgresRepository) ResetFailedAttempts(ctx context.Context, userID int) error {
	query := `
		UPDATE admin_users 
		SET failed_login_attempts = 0, locked_until = NULL
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, userID)
	return err
}

// LockAccount locks an account until the specified time
func (r *PostgresRepository) LockAccount(ctx context.Context, userID int, until time.Time) error {
	query := `
		UPDATE admin_users 
		SET locked_until = $1
		WHERE id = $2
	`
	_, err := r.db.ExecContext(ctx, query, until, userID)
	return err
}

// UpdateLastLogin updates the last login timestamp and IP
func (r *PostgresRepository) UpdateLastLogin(ctx context.Context, userID int, ip string) error {
	query := `
		UPDATE admin_users 
		SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = $1
		WHERE id = $2
	`
	_, err := r.db.ExecContext(ctx, query, ip, userID)
	return err
}

// ChangePassword updates the user's password hash
func (r *PostgresRepository) ChangePassword(ctx context.Context, userID int, newPasswordHash string) error {
	query := `
		UPDATE admin_users 
		SET password_hash = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`
	_, err := r.db.ExecContext(ctx, query, newPasswordHash, userID)
	return err
}

// CreateSession creates a new admin session
func (r *PostgresRepository) CreateSession(ctx context.Context, session *AdminSession) error {
	query := `
		INSERT INTO admin_sessions 
		(admin_user_id, refresh_token_hash, access_token_jti, ip_address, user_agent, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, last_activity_at
	`
	return r.db.QueryRowContext(ctx, query,
		session.AdminUserID, session.RefreshTokenHash, session.AccessTokenJTI,
		session.IPAddress, session.UserAgent, session.ExpiresAt,
	).Scan(&session.ID, &session.CreatedAt, &session.LastActivityAt)
}

// GetSessionByRefreshToken retrieves a session by refresh token hash
func (r *PostgresRepository) GetSessionByRefreshToken(ctx context.Context, refreshTokenHash string) (*AdminSession, error) {
	session := &AdminSession{}
	query := `
		SELECT id, admin_user_id, refresh_token_hash, access_token_jti, ip_address,
		       user_agent, expires_at, created_at, last_activity_at, is_revoked,
		       revoked_at, revoked_reason
		FROM admin_sessions
		WHERE refresh_token_hash = $1 AND is_revoked = false
	`
	err := r.db.QueryRowContext(ctx, query, refreshTokenHash).Scan(
		&session.ID, &session.AdminUserID, &session.RefreshTokenHash,
		&session.AccessTokenJTI, &session.IPAddress, &session.UserAgent,
		&session.ExpiresAt, &session.CreatedAt, &session.LastActivityAt,
		&session.IsRevoked, &session.RevokedAt, &session.RevokedReason,
	)
	if err == sql.ErrNoRows {
		return nil, ErrSessionExpired
	}
	if err != nil {
		return nil, err
	}
	return session, nil
}

// GetActiveSessionsByUserID retrieves all active sessions for a user
func (r *PostgresRepository) GetActiveSessionsByUserID(ctx context.Context, userID int) ([]*AdminSession, error) {
	query := `
		SELECT id, admin_user_id, refresh_token_hash, access_token_jti, ip_address,
		       user_agent, expires_at, created_at, last_activity_at, is_revoked,
		       revoked_at, revoked_reason
		FROM admin_sessions
		WHERE admin_user_id = $1 AND is_revoked = false AND expires_at > CURRENT_TIMESTAMP
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []*AdminSession
	for rows.Next() {
		session := &AdminSession{}
		err := rows.Scan(
			&session.ID, &session.AdminUserID, &session.RefreshTokenHash,
			&session.AccessTokenJTI, &session.IPAddress, &session.UserAgent,
			&session.ExpiresAt, &session.CreatedAt, &session.LastActivityAt,
			&session.IsRevoked, &session.RevokedAt, &session.RevokedReason,
		)
		if err != nil {
			return nil, err
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}

// UpdateSessionActivity updates the last activity timestamp
func (r *PostgresRepository) UpdateSessionActivity(ctx context.Context, sessionID int) error {
	query := `
		UPDATE admin_sessions 
		SET last_activity_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, sessionID)
	return err
}

// RevokeSession revokes a specific session
func (r *PostgresRepository) RevokeSession(ctx context.Context, sessionID int, reason string) error {
	query := `
		UPDATE admin_sessions 
		SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP, revoked_reason = $1
		WHERE id = $2
	`
	_, err := r.db.ExecContext(ctx, query, reason, sessionID)
	return err
}

// RevokeAllUserSessions revokes all sessions for a user
func (r *PostgresRepository) RevokeAllUserSessions(ctx context.Context, userID int, reason string) error {
	query := `
		UPDATE admin_sessions 
		SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP, revoked_reason = $1
		WHERE admin_user_id = $2 AND is_revoked = false
	`
	_, err := r.db.ExecContext(ctx, query, reason, userID)
	return err
}

// CleanupExpiredSessions removes expired sessions from the database
func (r *PostgresRepository) CleanupExpiredSessions(ctx context.Context) error {
	query := `
		DELETE FROM admin_sessions 
		WHERE expires_at < CURRENT_TIMESTAMP AND is_revoked = true
	`
	_, err := r.db.ExecContext(ctx, query)
	return err
}

// CreateLoginHistory creates a login history record
func (r *PostgresRepository) CreateLoginHistory(ctx context.Context, history *AdminLoginHistory) error {
	query := `
		INSERT INTO admin_login_history 
		(admin_user_id, username, ip_address, user_agent, login_status, failure_reason)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`
	return r.db.QueryRowContext(ctx, query,
		history.AdminUserID, history.Username, history.IPAddress,
		history.UserAgent, history.LoginStatus, history.FailureReason,
	).Scan(&history.ID, &history.CreatedAt)
}

// GetLoginHistory retrieves login history for a user
func (r *PostgresRepository) GetLoginHistory(ctx context.Context, userID int, limit int) ([]*AdminLoginHistory, error) {
	query := `
		SELECT id, admin_user_id, username, ip_address, user_agent,
		       login_status, failure_reason, created_at
		FROM admin_login_history
		WHERE admin_user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`
	rows, err := r.db.QueryContext(ctx, query, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []*AdminLoginHistory
	for rows.Next() {
		h := &AdminLoginHistory{}
		err := rows.Scan(
			&h.ID, &h.AdminUserID, &h.Username, &h.IPAddress,
			&h.UserAgent, &h.LoginStatus, &h.FailureReason, &h.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		history = append(history, h)
	}
	return history, nil
}

// HashRefreshToken hashes a refresh token for storage
func HashRefreshToken(token string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(token), BcryptCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash refresh token: %w", err)
	}
	return string(bytes), nil
}

// CheckRefreshTokenHash compares a refresh token with its hash
func CheckRefreshTokenHash(token, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(token))
	return err == nil
}
