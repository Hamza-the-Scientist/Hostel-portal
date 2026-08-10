# Architecture Decision Records — Sindh University Dormitory Portal

## ADR-001: Primary Key Strategy
**Decision:** Use `INT UNSIGNED AUTO_INCREMENT` for all PKs (except AuditLogs which use `BIGINT UNSIGNED`).
**Rationale:** MySQL performs best with integer clustered indexes. UUIDs cause page fragmentation and are harder to read in admin UIs. The system is internal to one university — integer IDs are sufficient.
**Tradeoff:** Less portable if records are merged across systems, but that scenario is out of scope.

---

## ADR-002: Soft-Delete Pattern
**Decision:** Soft-delete via `IsDeleted BIT(1) DEFAULT 0` + `DeletedAt DATETIME NULL` on: Users, Students, Hostels, Rooms, Beds, Allocations, Complaints.
**Rationale:** Audit requirements for a university system mean records cannot be permanently destroyed. Hard deletes on junction/lookup tables (e.g. HostelImages, ComplaintAttachments) where rows have no independent lifecycle meaning.
**Tradeoff:** All queries must include `WHERE IsDeleted = 0` filters — enforced via global EF Core query filters.

---

## ADR-003: One Active Allocation Per Student/Bed (MySQL Constraint)
**Decision:** Use composite `UNIQUE INDEX (StudentId, IsActive)` and `UNIQUE INDEX (BedId, IsActive)` on the `Allocations` table.
**Rationale:** MySQL does not support partial (filtered) unique indexes like PostgreSQL. The composite unique with the `IsActive` flag is the canonical MySQL workaround: when IsActive = 1, uniqueness is enforced; when IsActive = 0, multiple historical rows are allowed per student/bed.
**Tradeoff:** Requires careful application-layer handling when deactivating allocations (must set IsActive = 0 before creating a new one).

---

## ADR-004: One Active Application Per Student Per Cycle
**Decision:** `UNIQUE INDEX (StudentId, AcademicYearId)` on `Applications`.
**Rationale:** Prevents duplicate applications at the DB level. Withdrawn applications are handled by status tracking in `ApplicationStatusHistory` — a withdrawn application keeps its row (soft state), so a new application in the same cycle requires admin intervention or explicit withdrawal first.
**Alternative considered:** Soft-delete on Applications — rejected because withdrawn/rejected applications must remain auditable.

---

## ADR-005: Target Framework net9.0 with .NET 10 SDK
**Decision:** Target `net9.0` despite the installed SDK being 10.0.300.
**Rationale:** EF Core 9 + Pomelo MySQL 9.x are the latest stable, production-ready versions. EF Core 10 is not yet released as stable. The .NET 10 SDK can build and run `net9.0` targets without issue.
**Review:** Upgrade to `net10.0` + EF Core 10 in a future phase once stable.

---

## ADR-006: Angular Standalone Components
**Decision:** Use Angular 18+ standalone component architecture (no NgModules).
**Rationale:** Angular's official recommendation since v17. Reduces boilerplate, enables better tree-shaking. Lazy loading is done via `loadComponent` / `loadChildren` route syntax.
**Impact:** No `app.module.ts`. Providers configured in `app.config.ts`.

---

## ADR-007: JWT Secret in appsettings / Environment Variables Only
**Decision:** JWT secret, DB credentials, and email credentials stored exclusively in `appsettings.Development.json` (git-ignored) or environment variables. Never in committed source.
**Pattern:** `builder.Configuration` reads from environment variables automatically (ASP.NET Core default config chain). `appsettings.Development.json` is a local convenience file.

---

## ADR-008: Database Schema Name
**Decision:** Schema/database name is `sindh_dormitory_portal`.
**Rationale:** Clear, URL-safe, descriptive. Avoids spaces and special characters.
