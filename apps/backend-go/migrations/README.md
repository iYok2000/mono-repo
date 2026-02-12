# Database Migrations

This directory contains SQL migration scripts for database schema changes.

## ⚠️ IMPORTANT: Before Running Migrations

Always backup your database before running any migration:

```bash
pg_dump -U postgres -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Migration Files

### 002_rename_devtoolkit_to_product.sql

**Purpose**: Rename `dev_toolkits` → `products` and add performance indexes

**What it does**:
- Renames `dev_toolkits` table to `products`
- Renames `dev_toolkit_details` table to `product_details`
- Updates foreign key column `toolkit_id` → `product_id`
- Adds performance indexes:
  - `idx_products_category_id` - Fast category filtering
  - `idx_products_status` - Fast status filtering
  - `idx_products_category_status` - Composite index for combined queries
  - `idx_products_tags` - GIN index for JSONB tag searches

**When to run**: After deploying code changes that renamed devtoolkit → product

**Rollback**: Use `002_rename_devtoolkit_to_product_rollback.sql`

## Running Migrations

### Method 1: Using psql (Recommended)

```bash
# Connect to database
psql -U postgres -d your_database

# Run migration
\i /path/to/migrations/002_rename_devtoolkit_to_product.sql

# Verify
\dt                    # List tables
\di                    # List indexes
SELECT * FROM products LIMIT 5;
```

### Method 2: Using psql from command line

```bash
psql -U postgres -d your_database -f apps/backend-go/migrations/002_rename_devtoolkit_to_product.sql
```

### Method 3: Using golang-migrate (Production)

```bash
# Install
brew install golang-migrate

# Run migration
migrate -path ./migrations \
        -database "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" \
        up

# Rollback if needed
migrate -path ./migrations \
        -database "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" \
        down
```

## Verification

After running migration, verify the changes:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'product_details');

-- Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- Check foreign key
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'product_details';

-- Test query performance (should use index)
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 'some-category';
EXPLAIN ANALYZE SELECT * FROM products WHERE status = 'active';
```

## Rollback Procedure

If something goes wrong:

```bash
# Restore from backup
psql -U postgres -d your_database < backup_YYYYMMDD_HHMMSS.sql

# Or run rollback script
psql -U postgres -d your_database -f apps/backend-go/migrations/002_rename_devtoolkit_to_product_rollback.sql
```

## Migration Naming Convention

Format: `{version}_{description}.sql`

- `001_initial_schema.sql` - Initial database setup
- `002_rename_devtoolkit_to_product.sql` - This migration
- `003_add_user_roles.sql` - Future migration example

## Production Checklist

Before running in production:

- [ ] Backup database
- [ ] Test migration on staging environment first
- [ ] Schedule maintenance window if needed
- [ ] Have rollback script ready
- [ ] Verify application code is compatible
- [ ] Monitor database performance after migration
- [ ] Check foreign key constraints still work
- [ ] Verify data integrity

## Troubleshooting

### Error: relation "dev_toolkits" does not exist

The migration has already been run. Check if `products` table exists:
```sql
\dt products
```

### Error: relation "products" already exists

The migration has already been run. Verify with:
```sql
SELECT * FROM products LIMIT 1;
```

### Performance issues after migration

Check if indexes are being used:
```sql
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 'test';
```

Should show `Index Scan using idx_products_category_id`

### Foreign key violation errors

Check if foreign key constraint was created correctly:
```sql
SELECT * FROM information_schema.table_constraints 
WHERE constraint_name = 'product_details_product_id_fkey';
```

## Notes

- GORM AutoMigrate does NOT handle table renames - run SQL manually
- Indexes improve query performance but slightly slow down writes
- GIN indexes on JSONB (tags) may take time to build on large tables
- Always test migrations on a copy of production data first
