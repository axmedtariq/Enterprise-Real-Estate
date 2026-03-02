# 🏛️ Sovereign Database Governance & Migration Policy

To ensure military-grade stability and data integrity, the Sovereign Estate platform adheres to a **Strict Migration Protocol**. Manual alterations to the production database are **PROHIBITED**.

## 1. 📂 Automated Schema Evolution
The platform uses **Prisma Migrate** to manage all database changes. This allows for:
- **Version Control**: Every change is a committed `.sql` file in the repository.
- **Repeatability**: The exact same schema is deployed across Dev, Staging, and Production.
- **Rollback Safety**: Migrations are applied sequentially to ensure consistency.

## 2. 🚀 Deployment Workflow
1. **Local Development**: Run `npx prisma migrate dev` to create a new migration.
2. **Commit**: Add the new migration folder in `prisma/migrations` to Git.
3. **Rollout**: During the K8s rollout, the **db-migration InitContainer** will automatically run `npx prisma migrate deploy`.
4. **Validation**: The backend pod will only start if the migration succeeds.

## 🛡️ Database Protection Tiers

### 💾 Tier 1: Automated Backups (RTO)
- **Full Backups**: Executed daily at 01:00 AM. Stores a complete system snapshot.
- **Log Backups**: Executed every **15 minutes**.

### 🔍 Tier 2: Point-In-Time Recovery (PITR)
In the event of accidental data deletion, the DBA can restore the database to any 15-minute interval by replaying transaction logs against the last full backup.

### 🌎 Tier 3: High Availability (HA)
The SQL Server runs as a **StatefulSet** with persistent storage. 
- **Primary Service**: Handles all WRITE operations.
- **Headless Service**: Provides stable DNS for potential Read Replicas (Always On).

## 🚫 Restricted Operations
- **DRP (Direct Record Patching)**: BANNED. Use a script or administrative tool.
- **DDL (Manual Schema Change)**: BANNED. Must be done via Prisma Migrate.
- **Deletions**: All critical system deletions must be archived, not hard-deleted.

---
**The Sovereign Database is the core of our enterprise intelligence. PROTECT IT.**
