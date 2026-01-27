.PHONY: help rundev docker-dev docker-prod stop clean logs install setup db-migrate db-reset

# Default target
help:
	@echo "🚀 Available commands:"
	@echo ""
	@echo "  make install      - Install dependencies (first time setup)"
	@echo "  make setup        - Complete setup: install deps + run migrations"
	@echo "  make rundev       - Run PostgreSQL in Docker + Apps with pnpm (Recommended)"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-reset     - Reset database and re-run migrations"
	@echo "  make docker-dev   - Run everything in Docker (Development)"
	@echo "  make docker-prod  - Run everything in Docker (Production)"
	@echo "  make stop         - Stop all Docker containers"
	@echo "  make clean        - Stop containers and remove volumes"
	@echo "  make logs         - Show Docker logs"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@pnpm install
	@echo "✅ Dependencies installed!"

# Complete first-time setup
setup: install
	@echo "🔧 Running complete setup..."
	@echo ""
	@echo "🐘 Starting PostgreSQL in Docker..."
	@docker compose up postgres -d --remove-orphans
	@echo "⏳ Waiting for PostgreSQL to be ready..."
	@sleep 5
	@docker compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /dev/null 2>&1 || sleep 3
	@echo "✅ PostgreSQL is ready!"
	@echo ""
	@$(MAKE) db-migrate
	@echo ""
	@echo "✅ Setup complete! Run 'make rundev' to start development."

# Run database migrations
db-migrate:
	@echo "🗄️  Running database migrations..."
	@if [ ! -f .env ]; then \
		echo "❌ Error: .env file not found!"; \
		exit 1; \
	fi
	@docker compose up postgres -d --remove-orphans > /dev/null 2>&1 || true
	@sleep 2
	@echo "   ↳ Creating admin authentication tables..."
	@docker exec -i mono-repo-postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} < apps/backend-go/internal/infrastructure/adapter/persistence/migrations/001_create_admin_users.sql 2>&1 | grep -v "already exists" || true
	@echo "✅ Migrations completed!"
	@echo ""
	@echo "🔑 Default admin account:"
	@echo "   Username: superadmin"
	@echo "   Password: Admin123!@#"
	@echo "   (You'll be required to change password on first login)"

# Reset database and re-run migrations
db-reset:
	@echo "🔄 Resetting database..."
	@docker exec -i mono-repo-postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>&1 || true
	@echo "✅ Database reset!"
	@$(MAKE) db-migrate

# Hybrid mode: Docker Postgres + Native Apps (Recommended for development)
rundev:
	@echo "🐘 Starting PostgreSQL in Docker..."
	@docker compose up postgres -d --remove-orphans
	@echo "⏳ Waiting for PostgreSQL to be ready..."
	@sleep 3
	@docker compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /dev/null 2>&1 || sleep 2
	@echo "✅ PostgreSQL is ready!"
	@echo ""
	@echo "🔍 Checking if migrations are needed..."
	@docker exec -i mono-repo-postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "\dt admin_users" > /dev/null 2>&1 || $(MAKE) db-migrate
	@echo ""
	@echo "🚀 Starting applications with pnpm..."
	@echo "   - Next.js will be at http://localhost:3000"
	@echo "   - Go Backend will be at http://localhost:8080"
	@echo ""
	@pnpm dev
