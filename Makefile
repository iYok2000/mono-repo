.PHONY: help rundev docker-dev docker-prod stop clean logs install

# Default target
help:
	@echo "🚀 Available commands:"
	@echo ""
	@echo "  make rundev       - Run PostgreSQL in Docker + Apps with pnpm (Recommended)"
	@echo "  make docker-dev   - Run everything in Docker (Development)"
	@echo "  make docker-prod  - Run everything in Docker (Production)"
	@echo "  make stop         - Stop all Docker containers"
	@echo "  make clean        - Stop containers and remove volumes"
	@echo "  make logs         - Show Docker logs"
	@echo "  make install      - Install dependencies"
	@echo ""

# Hybrid mode: Docker Postgres + Native Apps (Recommended for development)
rundev:
	@echo "🐘 Starting PostgreSQL in Docker..."
	@docker compose up postgres -d --remove-orphans
	@echo "⏳ Waiting for PostgreSQL to be ready..."
	@sleep 3
	@docker compose exec postgres pg_isready -U devuser -d devtoolkit > /dev/null 2>&1 || sleep 2
	@echo "✅ PostgreSQL is ready!"
	@echo ""
	@echo "🚀 Starting applications with pnpm..."
	@echo "   - Next.js will be at http://localhost:3000"
	@echo "   - Go Backend will be at http://localhost:8080"
	@echo ""
	@pnpm dev

# Full Docker Development
docker-dev:
	@echo "🐳 Starting all services in Docker (Development mode)..."
	@docker compose up

# Full Docker Production
docker-prod:
	@echo "🐳 Starting all services in Docker (Production mode)..."
	@docker compose -f docker-compose.prod.yml up --build

# Stop all containers
stop:
	@echo "🛑 Stopping all Docker containers..."
	@docker compose down
	@docker compose -f docker-compose.prod.yml down 2>/dev/null || true
	@echo "✅ All containers stopped!"

# Clean everything (remove volumes)
clean:
	@echo "🧹 Cleaning up Docker containers and volumes..."
	@docker compose down -v
	@docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	@echo "✅ Cleanup complete!"

# Show logs
logs:
	@docker compose logs -f

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@pnpm install
	@echo "✅ Dependencies installed!"
