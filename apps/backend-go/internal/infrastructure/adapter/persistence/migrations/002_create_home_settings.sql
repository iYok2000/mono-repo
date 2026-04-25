-- Migration: Home Section Settings
-- Description: Store visibility settings for landing page sections

CREATE TABLE IF NOT EXISTS home_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Default section visibility (all enabled)
INSERT INTO home_settings (key, value)
VALUES (
    'section_visibility',
    '{
        "hero": true,
        "what_is_it": true,
        "sku": true,
        "how_it_works": true,
        "occasions": true,
        "why_nfc": true,
        "why_us": true,
        "preview": true,
        "faq": true,
        "final_cta": true
    }'
)
ON CONFLICT (key) DO NOTHING;
