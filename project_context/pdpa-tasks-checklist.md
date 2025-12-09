# PDPA SaaS Admin Backend - Implementation Tasks

> **Temporary checklist** - Delete this file when all tasks are completed

---

## Phase 0: Setup & Configuration

- [ ] **Update `internal/config/config.go`**
  - [ ] Add database configuration fields (Host, Port, User, Password, DBName)
  - [ ] Add PDPA-specific config (DSR_SLA_DAYS, BREACH_NOTIFICATION_HOURS)

- [ ] **Update `.env`**
  - [ ] Add DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
  - [ ] Add DSR_SLA_DAYS=30, BREACH_NOTIFICATION_HOURS=72

---

## Phase 1: Models & Mock Data (Days 2-3)

- [ ] **Create 5 Model Files**
  - [ ] `internal/model/tenant.go` - Tenant with DPO info
  - [ ] `internal/model/pdpa_policy.go` - Policy versioning
  - [ ] `internal/model/consent_purpose.go` - GPD/SPD purposes
  - [ ] `internal/model/dsr_request.go` - 30-day SLA tracking
  - [ ] `internal/model/data_breach.go` - 72-hour notification tracking

- [ ] **Create Mock Data**
  - [ ] `internal/mock/tenant_mock.go` - 2-3 sample tenants
  - [ ] `internal/mock/pdpa_policy_mock.go` - Sample policies
  - [ ] `internal/mock/consent_purpose_mock.go` - Sample purposes
  - [ ] `internal/mock/dsr_request_mock.go` - Sample requests
  - [ ] `internal/mock/data_breach_mock.go` - Sample breaches

- [ ] **Create Repository Interfaces**
  - [ ] `internal/repository/tenant_repository.go` - Interface + Mock implementation
  - [ ] `internal/repository/pdpa_policy_repository.go` - Interface + Mock
  - [ ] `internal/repository/consent_purpose_repository.go` - Interface + Mock
  - [ ] `internal/repository/dsr_request_repository.go` - Interface + Mock
  - [ ] `internal/repository/data_breach_repository.go` - Interface + Mock

---

## Phase 2: Service Layer (Days 4-5)

- [ ] **Create Service Layer**
  - [ ] `internal/service/tenant_service.go` - CRUD + validation
  - [ ] `internal/service/pdpa_policy_service.go` - Version management
  - [ ] `internal/service/consent_purpose_service.go` - GPD/SPD validation
  - [ ] `internal/service/dsr_request_service.go` - SLA calculation (30 days)
  - [ ] `internal/service/data_breach_service.go` - Notification check (72 hours)

- [ ] **Implement Business Logic**
  - [ ] Auto-calculate DSR due dates (received_at + 30 days)
  - [ ] Validate data categories (GPD vs SPD)
  - [ ] Enforce policy versioning rules
  - [ ] Calculate breach notification deadlines

---

## Phase 3: Handlers, Middleware & Routes (Days 6-7)

- [ ] **Create Middleware**
  - [ ] `internal/middleware/tenant.go` - TenantResolver (X-Tenant-Code header)
  - [ ] `internal/middleware/auth.go` - DummyAuth (Bearer token with prefix check)

- [ ] **Create Handlers**
  - [ ] `internal/handler/tenant_handler.go` - CRUD endpoints
  - [ ] `internal/handler/pdpa_policy_handler.go` - Policy management
  - [ ] `internal/handler/consent_purpose_handler.go` - Purpose management
  - [ ] `internal/handler/dsr_request_handler.go` - DSR tracking
  - [ ] `internal/handler/data_breach_handler.go` - Breach logging

- [ ] **Register Routes**
  - [ ] Update `cmd/api/main.go` to register PDPA routes
  - [ ] Apply middleware pipeline: CORS → Auth → TenantResolver → Handler
  - [ ] Group routes under `/api/v1/pdpa/`

- [ ] **Testing with Mock Data**
  - [ ] Test all endpoints with Postman/cURL
  - [ ] Verify tenant isolation works
  - [ ] Check SLA and notification calculations
  - [ ] Validate GPD/SPD categorization

---

## Phase 4: PostgreSQL Integration (Days 8-10)

- [ ] **Database Connection**
  - [ ] Create `internal/database/connection.go` - GORM connection
  - [ ] Test connection with ping

- [ ] **Create Database Repositories**
  - [ ] `internal/repository/tenant_repository_db.go` - PostgreSQL implementation
  - [ ] `internal/repository/pdpa_policy_repository_db.go`
  - [ ] `internal/repository/consent_purpose_repository_db.go`
  - [ ] `internal/repository/dsr_request_repository_db.go`
  - [ ] `internal/repository/data_breach_repository_db.go`

- [ ] **Auto-Migrations**
  - [ ] Create `internal/database/migrate.go` - AutoMigrate all models
  - [ ] Run migration on startup
  - [ ] Verify table structures

- [ ] **Seed Data**
  - [ ] Create `internal/database/seed.go` - Optional seeding
  - [ ] Seed sample tenants, policies, purposes

- [ ] **Switch from Mock to DB**
  - [ ] Update `cmd/api/main.go` to use DB repositories
  - [ ] Remove or comment out mock repositories
  - [ ] Test all endpoints with real database

- [ ] **Final Testing**
  - [ ] Full end-to-end testing with PostgreSQL
  - [ ] Verify multi-tenancy isolation
  - [ ] Check all business logic (SLA, notifications)
  - [ ] Test error handling

---

## Phase 5: Documentation & Cleanup

- [ ] **Update Project Context**
  - [ ] Create `project_context/pdpa-backend.md`
  - [ ] Document architecture, models, endpoints
  - [ ] Add reference in `PROJECT_CONTEXT.md`

- [ ] **API Documentation**
  - [ ] Document all endpoints with examples
  - [ ] Add Postman collection or OpenAPI spec

- [ ] **Delete This File** ✅
  - [ ] Remove `project_context/pdpa-tasks-checklist.md` when done

---

## Summary

**Total Tasks:** 19 main tasks
**Timeline:** ~10 days
**Approach:** Mock data first → PostgreSQL last
**Testing:** After each phase

**Key Features:**
- ✅ Multi-tenant architecture
- ✅ Thai PDPA compliance (GPD/SPD, 30-day DSR SLA, 72-hour breach notification)
- ✅ Dummy auth for MVP
- ✅ Clean architecture (Repository pattern)
- ✅ Incremental development

---

**Start with Phase 0, then proceed sequentially through each phase. Good luck! 🚀**
