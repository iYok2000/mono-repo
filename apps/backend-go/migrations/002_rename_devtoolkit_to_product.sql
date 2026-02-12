-- Migration: Rename dev_toolkits to products
-- Date: 2026-02-02
-- Description: Rename tables and add performance indexes

-- Rename main table
ALTER TABLE IF EXISTS dev_toolkits RENAME TO products;

-- Rename detail table
ALTER TABLE IF EXISTS dev_toolkit_details RENAME TO product_details;

-- Update foreign key column name in detail table
ALTER TABLE IF EXISTS product_details 
    RENAME COLUMN toolkit_id TO product_id;

-- Update foreign key constraint
ALTER TABLE IF EXISTS product_details
    DROP CONSTRAINT IF EXISTS dev_toolkit_details_toolkit_id_fkey;

ALTER TABLE IF EXISTS product_details
    ADD CONSTRAINT product_details_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id, status);

-- Add index on tags for JSONB queries (if using PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);

-- Update sequence name if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'dev_toolkit_details_id_seq') THEN
        ALTER SEQUENCE dev_toolkit_details_id_seq RENAME TO product_details_id_seq;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE products IS 'Product catalog for developer tools and services';
COMMENT ON TABLE product_details IS 'Extended product information including markdown content';
COMMENT ON INDEX idx_products_category_id IS 'Performance index for category filtering';
COMMENT ON INDEX idx_products_status IS 'Performance index for status filtering';
COMMENT ON INDEX idx_products_tags IS 'GIN index for JSONB tag queries';
