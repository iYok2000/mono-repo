-- Rollback Migration: Rename products back to dev_toolkits
-- Date: 2026-02-02
-- Description: Rollback table rename and remove indexes

-- Drop new indexes
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_category_status;
DROP INDEX IF EXISTS idx_products_tags;

-- Rename tables back
ALTER TABLE IF EXISTS products RENAME TO dev_toolkits;
ALTER TABLE IF EXISTS product_details RENAME TO dev_toolkit_details;

-- Rename foreign key column back
ALTER TABLE IF EXISTS dev_toolkit_details 
    RENAME COLUMN product_id TO toolkit_id;

-- Update foreign key constraint back
ALTER TABLE IF EXISTS dev_toolkit_details
    DROP CONSTRAINT IF EXISTS product_details_product_id_fkey;

ALTER TABLE IF EXISTS dev_toolkit_details
    ADD CONSTRAINT dev_toolkit_details_toolkit_id_fkey 
    FOREIGN KEY (toolkit_id) REFERENCES dev_toolkits(id) ON DELETE CASCADE;

-- Rename sequence back if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'product_details_id_seq') THEN
        ALTER SEQUENCE product_details_id_seq RENAME TO dev_toolkit_details_id_seq;
    END IF;
END $$;
