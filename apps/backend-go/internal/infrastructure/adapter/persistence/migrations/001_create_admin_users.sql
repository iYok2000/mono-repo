-- Migration: Create Admin Users and Authentication Tables
-- Description: Secure admin authentication system with session management and audit logging

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin', -- admin, super_admin
    is_active BOOLEAN NOT NULL DEFAULT true,
    must_change_password BOOLEAN NOT NULL DEFAULT false,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES admin_users(id),
    updated_by INT REFERENCES admin_users(id)
);

-- Admin Sessions Table (for JWT refresh tokens and session management)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    admin_user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    access_token_jti VARCHAR(255) NOT NULL, -- JWT ID for access token
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMP,
    revoked_reason VARCHAR(255)
);

-- Admin Login History Table (for audit and security monitoring)
CREATE TABLE IF NOT EXISTS admin_login_history (
    id SERIAL PRIMARY KEY,
    admin_user_id INT REFERENCES admin_users(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    login_status VARCHAR(20) NOT NULL, -- success, failed_password, failed_locked, failed_inactive
    failure_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
    id SERIAL PRIMARY KEY,
    admin_user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_admin_users_username ON admin_users(username) WHERE is_active = true;
CREATE INDEX idx_admin_users_email ON admin_users(email) WHERE is_active = true;
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(admin_user_id) WHERE is_revoked = false;
CREATE INDEX idx_admin_sessions_refresh_token ON admin_sessions(refresh_token_hash) WHERE is_revoked = false;
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at) WHERE is_revoked = false;
CREATE INDEX idx_admin_login_history_user_id ON admin_login_history(admin_user_id);
CREATE INDEX idx_admin_login_history_created_at ON admin_login_history(created_at DESC);
CREATE INDEX idx_admin_password_reset_tokens_user ON admin_password_reset_tokens(admin_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin user (password: Admin123!@# - MUST BE CHANGED)
-- Password hash for 'Admin123!@#' using bcrypt cost 12
INSERT INTO admin_users (username, email, password_hash, full_name, role, must_change_password) 
VALUES (
    'superadmin',
    'admin@localhost.local',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIj.KM3K6i', -- Admin123!@#
    'Super Administrator',
    'super_admin',
    true -- Force password change on first login
) ON CONFLICT (username) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE admin_users IS 'Admin users with secure password hashing and account locking';
COMMENT ON TABLE admin_sessions IS 'Active admin sessions with JWT refresh tokens';
COMMENT ON TABLE admin_login_history IS 'Audit log of all admin login attempts';
COMMENT ON TABLE admin_password_reset_tokens IS 'Secure password reset tokens with expiration';
