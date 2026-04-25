# 🚀 Deployment Guide

> คู่มือการ deploy สำหรับทุกคน รวมถึง junior developer

## 📋 Table of Contents

- [เข้าใจ Migration Scripts](#-เข้าใจ-migration-scripts)
- [First Time Deployment](#-first-time-deployment)
- [Regular Deployment](#-regular-deployment)
- [Emergency Rollback](#-emergency-rollback)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 เข้าใจ Migration Scripts

### Migration คืออะไร?

**Migration** = การเปลี่ยนแปลง database schema (โครงสร้างตาราง)

ตัวอย่าง:
- เปลี่ยนชื่อตาราง `dev_toolkits` → `products`
- เพิ่ม column ใหม่
- ลบ column เก่า
- เปลี่ยน data type

### เมื่อไหร่ต้องรัน Migration?

#### ✅ ต้องรัน (ครั้งเดียวต่อ environment):

```
┌─────────────────────────────────────────────────────────────┐
│  คุณหรือทีม pull code ใหม่ที่มีการเปลี่ยน database schema  │
│  แต่ local database ของคุณยังเป็นโครงสร้างเก่าอยู่          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                   ต้องรัน Migration!
```

**กรณีที่ต้องรัน:**

1. **Local Development**
   ```bash
   # Developer A เปลี่ยนโครงสร้าง database และ push code
   # Developer B (คุณ) pull code มา
   # → ต้องรัน migration ใน local database ของคุณ
   ```

2. **Deploy ไปยัง Staging/Production**
   ```bash
   # Deploy code version ใหม่ที่คาดหวัง schema ใหม่
   # → ต้องรัน migration บน server ก่อนหรือหลัง deploy
   ```

3. **Setup Environment ใหม่จาก backup เก่า**
   ```bash
   # Restore database จาก backup ที่มี schema เก่า
   # → ต้องรัน migration เพื่ออัพเดต schema
   ```

#### ❌ ไม่ต้องรัน:

- ❌ ทุกครั้งที่ start server (รันแค่ครั้งเดียว!)
- ❌ Database ใหม่ที่สร้างด้วย schema ล่าสุดอยู่แล้ว
- ❌ หลังจากรัน migration สำเร็จไปแล้ว

### Rollback คืออะไร?

**Rollback** = ย้อนกลับการเปลี่ยนแปลง database

```
Migration: dev_toolkits → products
Rollback:  products → dev_toolkits
```

**เมื่อไหร่ใช้:**
- 🔴 Deploy แล้วเจอ bug ร้ายแรง ต้องย้อนกลับไป code เก่า
- 🔴 Migration ผิดพลาด ต้องแก้แล้วรันใหม่
- 🟡 Testing เพื่อให้แน่ใจว่า migration + rollback ทำงานได้

---

## 🆕 First Time Deployment

### 1️⃣ เตรียมความพร้อม

```bash
# Clone repository
git clone <repository-url>
cd mono-repo

# Install dependencies
pnpm install

# Copy environment files
cp apps/backend-go/.env.example apps/backend-go/.env
cp apps/web/.env.example apps/web/.env

# Edit .env files with your credentials
```

### 2️⃣ Setup Database

#### Option A: สร้าง Database ใหม่ (แนะนำ)

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Create database
docker exec -i mono-repo-postgres psql -U postgres -c "CREATE DATABASE your_database;"

# Application จะสร้างตารางให้เองตอน start (ใช้ schema ล่าสุด)
# ✅ ไม่ต้องรัน migration!
```

#### Option B: Restore จาก Backup เก่า

```bash
# Restore backup
psql -U postgres -d your_database < backup.sql

# ⚠️ ต้องรัน migration! (ไปยัง step 3)
```

### 3️⃣ Run Migration (ถ้า restore จาก backup เก่า)

```bash
# 1. Backup ก่อนเสมอ!
docker exec mono-repo-postgres pg_dump -U postgres your_database > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migration
docker exec -i mono-repo-postgres psql -U postgres -d your_database -f /app/migrations/002_rename_devtoolkit_to_product.sql

# หรือจาก host machine
psql -U postgres -d your_database -f apps/backend-go/migrations/002_rename_devtoolkit_to_product.sql

# 3. Verify
psql -U postgres -d your_database -c "\dt"  # ต้องเห็น products, product_details
```

### 4️⃣ Start Application

```bash
# Start all services
make rundev

# หรือ
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f web
```

### 5️⃣ Verify Deployment

```bash
# Test backend
curl http://localhost:8080/health

# Test frontend
open http://localhost:3000

# Test API
curl http://localhost:8080/api/products
```

✅ **Done!** First deployment เสร็จสมบูรณ์

---

## 🔄 Regular Deployment

### สำหรับ Code Changes ธรรมดา (ไม่มี Migration)

```bash
# 1. Pull latest code
git pull origin main

# 2. Install new dependencies (ถ้ามี)
pnpm install

# 3. Rebuild & Restart
docker-compose down
docker-compose up -d --build

# 4. Check logs
docker-compose logs -f
```

### สำหรับ Code + Migration Changes

#### 🟢 Strategy A: Migration ก่อน Deploy (Zero Downtime)

```bash
# 1. Backup database
docker exec mono-repo-postgres pg_dump -U postgres your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migration (database พร้อมสำหรับ code ใหม่)
docker exec -i mono-repo-postgres psql -U postgres -d your_database -f /app/migrations/XXX_migration.sql

# 3. Pull & Deploy code
git pull origin main
docker-compose up -d --build

# 4. Verify
curl http://localhost:8080/api/products
```

**ข้อดี:** Database พร้อมก่อน code ใหม่มาถึง
**ข้อเสีย:** ถ้า migration เปลี่ยนอะไรที่ code เก่าใช้ไม่ได้ จะ error ชั่วคราว

#### 🟡 Strategy B: Deploy ก่อน Migration (Downtime)

```bash
# 1. Maintenance mode
docker-compose down

# 2. Backup
docker exec mono-repo-postgres pg_dump -U postgres your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Pull code
git pull origin main

# 4. Run migration
psql -U postgres -d your_database -f apps/backend-go/migrations/XXX_migration.sql

# 5. Start services
docker-compose up -d --build

# 6. Verify
curl http://localhost:8080/health
```

**ข้อดี:** ปลอดภัย ไม่มี conflict ระหว่าง code เก่ากับ schema ใหม่
**ข้อเสี่ย:** Service down ระหว่างดำเนินการ

---

## 🆘 Emergency Rollback

### เมื่อไหร่ต้อง Rollback?

- 🔴 Deploy แล้ว production มีปัญหาร้ายแรง
- 🔴 Migration ทำงานผิดพลาด
- 🔴 Data corruption หรือ data loss

### Step-by-Step Rollback

```bash
# 1. หยุด services ทันที
docker-compose down

# 2. Restore database จาก backup
psql -U postgres -d your_database < backup_YYYYMMDD_HHMMSS.sql

# หรือใช้ rollback script (ถ้ามี)
psql -U postgres -d your_database -f apps/backend-go/migrations/XXX_rollback.sql

# 3. Checkout code version เก่า
git log --oneline  # ดู commit history
git checkout <commit-hash-before-deploy>

# หรือ revert
git revert <bad-commit-hash>

# 4. Rebuild
docker-compose up -d --build

# 5. Verify
curl http://localhost:8080/health
docker-compose logs -f

# 6. แจ้งทีมและเริ่ม debug
```

### Post-Rollback

```bash
# 1. Investigate ว่าเกิดอะไรขึ้น
docker-compose logs backend > error_logs.txt

# 2. Fix issue ใน development
# 3. Test migration ใน staging ก่อน
# 4. Re-deploy เมื่อแน่ใจแล้ว
```

---

## 🔧 Troubleshooting

### ❌ Error: "relation 'products' does not exist"

**สาเหตุ:** Code ใหม่หาตาราง `products` แต่ database ยังเป็น `dev_toolkits`

**แก้ไข:**
```bash
# รัน migration
psql -U postgres -d your_database -f apps/backend-go/migrations/002_rename_devtoolkit_to_product.sql
```

---

### ❌ Error: "relation 'dev_toolkits' does not exist"

**สาเหตุ:** Database เป็น schema ใหม่แล้ว แต่ code ยังเป็นเวอร์ชันเก่า

**แก้ไข:**
```bash
# Option 1: Pull code ใหม่
git pull origin main
docker-compose up -d --build

# Option 2: Rollback database (ถ้าจำเป็น)
psql -U postgres -d your_database -f apps/backend-go/migrations/002_rename_devtoolkit_to_product_rollback.sql
```

---

### ❌ Migration Failed ระหว่างดำเนินการ

**สาเหตุ:** SQL syntax error, constraint violation, etc.

**แก้ไข:**
```bash
# 1. Check error message
docker-compose logs postgres

# 2. Restore จาก backup
psql -U postgres -d your_database < backup_before_migration.sql

# 3. แก้ไข migration script
# 4. Test ใน development ก่อน
psql -U postgres -d test_database -f apps/backend-go/migrations/XXX_migration.sql

# 5. รันใหม่เมื่อแน่ใจ
```

---

### ❌ Port Already in Use

```bash
# ดูว่าใครใช้ port อยู่
lsof -i :8080  # Backend port
lsof -i :3000  # Frontend port
lsof -i :5432  # PostgreSQL port

# Kill process
kill -9 <PID>

# หรือเปลี่ยน port ใน docker-compose.yml
```

---

### ❌ Out of Disk Space

```bash
# ดูพื้นที่
df -h

# Clean Docker images/containers
docker system prune -a --volumes

# Clean old backups
rm old_backup_*.sql
```

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Pull latest code: `git pull origin main`
- [ ] Read CHANGELOG หรือ release notes
- [ ] ตรวจสอบว่ามี migration ใหม่หรือไม่
- [ ] Backup database: `pg_dump`
- [ ] Test ใน staging environment
- [ ] แจ้งทีมก่อน deploy (ถ้าเป็น production)

### During Deployment

- [ ] Run migration (ถ้ามี)
- [ ] Deploy code: `docker-compose up -d --build`
- [ ] Monitor logs: `docker-compose logs -f`
- [ ] Test critical endpoints
- [ ] Check health: `/health`

### Post-Deployment

- [ ] Verify frontend works: `http://localhost:3000`
- [ ] Verify backend API works: `http://localhost:8080/api/*`
- [ ] Check database integrity
- [ ] Monitor error logs ใน 15-30 นาทีแรก
- [ ] แจ้งทีมว่า deploy เสร็จแล้ว

### If Something Goes Wrong

- [ ] Don't panic! 🧘
- [ ] Check logs first: `docker-compose logs`
- [ ] Rollback database: `psql < backup.sql`
- [ ] Rollback code: `git checkout <previous-commit>`
- [ ] Restart: `docker-compose up -d --build`
- [ ] Document what went wrong
- [ ] Fix in development before re-deploy

---

## 🎓 Tips for Junior Developers

### 1. Always Backup Before Migration

```bash
# Good habit: สร้าง backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec mono-repo-postgres pg_dump -U postgres your_database > backups/backup_${TIMESTAMP}.sql
echo "Backup saved: backups/backup_${TIMESTAMP}.sql"
```

### 2. Test Migration in Development First

```bash
# สร้าง test database
psql -U postgres -c "CREATE DATABASE test_migration;"

# Restore production backup
psql -U postgres -d test_migration < production_backup.sql

# Test migration
psql -U postgres -d test_migration -f migrations/XXX_migration.sql

# Verify
psql -U postgres -d test_migration -c "SELECT * FROM products LIMIT 5;"

# ถ้า OK แล้ว → ค่อยรันใน production
```

### 3. Keep Migration History

```bash
# สร้างไฟล์ MIGRATION_LOG.md
echo "## $(date)" >> MIGRATION_LOG.md
echo "- Ran: 002_rename_devtoolkit_to_product.sql" >> MIGRATION_LOG.md
echo "- Status: Success" >> MIGRATION_LOG.md
echo "- Backup: backup_20260202_143000.sql" >> MIGRATION_LOG.md
```

### 4. Use Version Control for Everything

```bash
# Commit migration scripts
git add migrations/
git commit -m "Add migration: rename devtoolkit to product"

# Tag releases
git tag -a v1.2.0 -m "Release v1.2.0 - Product management"
git push origin v1.2.0
```

### 5. Document Your Deployment

```bash
# Create deployment note
echo "# Deployment $(date)" > deployments/deploy_$(date +%Y%m%d).md
echo "- Code version: $(git rev-parse --short HEAD)" >> deployments/deploy_$(date +%Y%m%d).md
echo "- Migrations: 002_rename_devtoolkit_to_product.sql" >> deployments/deploy_$(date +%Y%m%d).md
echo "- Status: Success" >> deployments/deploy_$(date +%Y%m%d).md
```

---

## 📚 Related Documentation

- [Development Guide](DEVELOPMENT.md) - Local development setup
- [Migration Guide](apps/backend-go/migrations/README.md) - Detailed migration documentation
- [Admin Auth](project_context/ADMIN_AUTH_README.md) - Authentication system
- [Product Management](project_context/product-management.md) - Product features

---

## 🆘 Need Help?

1. Check [Troubleshooting](#-troubleshooting) section
2. Read error logs: `docker-compose logs -f`
3. Search in [DEVELOPMENT.md](DEVELOPMENT.md)
4. Ask senior developers (don't be shy!)
5. Document the solution for next time

---

**Happy Deploying! 🚀**
