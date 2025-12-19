#!/bin/bash

set -e

echo "🚀 Deployment started"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${BLUE}📂 ${ROOT}${NC}"

mkdir -p "${ROOT}/logs"

# Install with npm (no symlink issues)
echo -e "${BLUE}📦 npm install${NC}"
npm install

# Build shared-types
echo -e "${BLUE}🔧 Build shared-types${NC}"
cd "${ROOT}/packages/shared-types"
npm run build

# Build Next.js
echo -e "${BLUE}🏗️ Build Next.js${NC}"
cd "${ROOT}/apps/web"
npm run build

# Build Go
echo -e "${BLUE}🏗️ Build Go${NC}"
cd "${ROOT}/apps/backend-go"
mkdir -p bin
go build -o bin/server cmd/server/main.go

cd "${ROOT}"

# Restart services
echo -e "${BLUE}🔄 Restart services${NC}"

pm2 delete backend-go 2>/dev/null || true
pm2 delete web 2>/dev/null || true

pm2 start apps/backend-go/bin/server \
    --name backend-go \
    --cwd "${ROOT}" \
    --log "${ROOT}/logs/backend-go.log" \
    --error "${ROOT}/logs/backend-go-error.log"

cd "${ROOT}/apps/web"
pm2 start npm \
    --name web \
    --cwd "${ROOT}/apps/web" \
    --log "${ROOT}/logs/web.log" \
    --error "${ROOT}/logs/web-error.log" \
    -- start

pm2 save
pm2 list

echo -e "${GREEN}✅ Deployed${NC}"
