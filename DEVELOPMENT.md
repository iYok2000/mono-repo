# Development Setup Guide

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd mono-repo

# 2. Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# 3. Complete setup (installs dependencies + runs migrations)
make setup

# 4. Start development
make rundev
```

### Subsequent Runs
```bash
make rundev
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `make install` | Install dependencies only |
| `make setup` | Complete first-time setup (dependencies + migrations) |
| `make rundev` | Start development (auto-runs migrations if needed) |
| `make db-migrate` | Run database migrations manually |
| `make db-reset` | Reset database and re-run migrations |
| `make docker-dev` | Run everything in Docker |
| `make stop` | Stop all Docker containers |
| `make clean` | Stop containers and remove volumes |

## 🔑 Default Credentials

### Admin Account
- **URL**: http://localhost:3000/admin/auth/login
- **Username**: `superadmin`
- **Password**: `Admin123!@#`
- ⚠️ You'll be required to change password on first login

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: Check your `.env` file
- **User**: Check your `.env` file

## 🛠️ What `make setup` Does

1. ✅ Installs all pnpm dependencies
2. ✅ Starts PostgreSQL in Docker
3. ✅ Waits for PostgreSQL to be ready
4. ✅ Runs database migrations
5. ✅ Creates admin authentication tables
6. ✅ Creates default admin account

## 🔧 What `make rundev` Does

1. ✅ Starts PostgreSQL in Docker
2. ✅ Checks if migrations are needed (auto-runs if missing)
3. ✅ Starts Next.js frontend (port 3000)
4. ✅ Starts Go backend (port 8080)

## 📊 Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Backend Health**: http://localhost:8080/health
- **PostgreSQL**: localhost:5432

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5432
lsof -i :8080
lsof -i :3000

# Stop services and restart
make stop
make rundev
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs mono-repo-postgres

# Reset database
make db-reset
```

### Forgot Admin Password
```bash
# Reset to default password
docker exec -i mono-repo-postgres psql -U <your-db-user> -d <your-db-name> -c "UPDATE admin_users SET password_hash = '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIj.KM3K6i', must_change_password = true, failed_login_attempts = 0, locked_until = NULL WHERE username = 'superadmin';"

# Password is now: Admin123!@#
```

## 📚 More Documentation

- [Admin Authentication](project_context/ADMIN_AUTH_README.md)
- [Banner Management](project_context/BANNER_MANAGEMENT.md)
- [Dev Toolkit](project_context/devtoolkit-management.md)
