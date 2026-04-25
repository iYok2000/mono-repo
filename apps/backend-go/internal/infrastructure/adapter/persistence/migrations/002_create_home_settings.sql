-- Migration: Home Settings
-- NOTE: The home_settings table schema is managed by GORM AutoMigrate
-- (see internal/infrastructure/adapter/persistence/gorm/homesettings/migration.go)
-- This file is intentionally a no-op to avoid conflicting with GORM's schema.
-- GORM creates the table with id TEXT PRIMARY KEY DEFAULT 'default' and individual
-- *_enabled boolean columns for each landing page section.
SELECT 1; -- no-op

