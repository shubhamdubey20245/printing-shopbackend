# Graph Report - C:\Users\DELL\printing-shopdb\backend  (2026-06-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 376 nodes · 520 edges · 69 communities (50 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fa310ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Analytics and Category Management|Analytics and Category Management]]
- [[_COMMUNITY_Sequelize Database Models|Sequelize Database Models]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_Customer and Medicine Management|Customer and Medicine Management]]
- [[_COMMUNITY_Database Schema Definitions|Database Schema Definitions]]
- [[_COMMUNITY_Purchase Order Management|Purchase Order Management]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Billing and Sales Processing|Billing and Sales Processing]]
- [[_COMMUNITY_Environment and Build Config|Environment and Build Config]]
- [[_COMMUNITY_Model Migration Sync Tools|Model Migration Sync Tools]]
- [[_COMMUNITY_Model Comparison Utilities|Model Comparison Utilities]]
- [[_COMMUNITY_Database Environment Credentials|Database Environment Credentials]]
- [[_COMMUNITY_Dashboard and Statistics|Dashboard and Statistics]]
- [[_COMMUNITY_Supplier Management|Supplier Management]]
- [[_COMMUNITY_Authentication and Registration|Authentication and Registration]]
- [[_COMMUNITY_Migration Schema Management|Migration Schema Management]]
- [[_COMMUNITY_Migration Generation Scripts|Migration Generation Scripts]]
- [[_COMMUNITY_Migration Repair Utilities|Migration Repair Utilities]]
- [[_COMMUNITY_Database Connection Testing|Database Connection Testing]]
- [[_COMMUNITY_Sales Status Migrations|Sales Status Migrations]]
- [[_COMMUNITY_RBAC Seed Migrations|RBAC Seed Migrations]]
- [[_COMMUNITY_Path Configuration|Path Configuration]]
- [[_COMMUNITY_Medicine Model Definition|Medicine Model Definition]]
- [[_COMMUNITY_Permission Model Definition|Permission Model Definition]]
- [[_COMMUNITY_Purchase Order Model Definition|Purchase Order Model Definition]]
- [[_COMMUNITY_Database Fix Script|Database Fix Script]]
- [[_COMMUNITY_Tenant Table Migration|Tenant Table Migration]]
- [[_COMMUNITY_User Table Migration|User Table Migration]]
- [[_COMMUNITY_Role Table Migration|Role Table Migration]]
- [[_COMMUNITY_Permission Table Migration|Permission Table Migration]]
- [[_COMMUNITY_Role Permissions Migration|Role Permissions Migration]]
- [[_COMMUNITY_User Roles Migration|User Roles Migration]]
- [[_COMMUNITY_Category Table Migration|Category Table Migration]]
- [[_COMMUNITY_Customer Table Migration|Customer Table Migration]]
- [[_COMMUNITY_Supplier Table Migration|Supplier Table Migration]]
- [[_COMMUNITY_Medicine Table Migration|Medicine Table Migration]]
- [[_COMMUNITY_Purchase Order Migration|Purchase Order Migration]]
- [[_COMMUNITY_Purchase Order Items Migration|Purchase Order Items Migration]]
- [[_COMMUNITY_Sales Table Migration|Sales Table Migration]]

## God Nodes (most connected - your core abstractions)
1. `AuthRequest` - 18 edges
2. `compilerOptions` - 14 edges
3. `development` - 7 edges
4. `test` - 7 edges
5. `production` - 7 edges
6. `Tenants Table` - 7 edges
7. `development` - 6 edges
8. `test` - 6 edges
9. `production` - 6 edges
10. `getCustomers()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Category Model` --implements--> `Categories Table`  [INFERRED]
  all_models.txt → all_migrations.txt
- `Customer Model` --implements--> `Customers Table`  [INFERRED]
  all_models.txt → all_migrations.txt
- `Notification Model` --references--> `Users Table`  [EXTRACTED]
  all_models.txt → all_migrations.txt
- `getCustomers()` --calls--> `getPaginationOptions()`  [EXTRACTED]
  src/modules/customers/customerController.ts → src/utils/pagination.ts
- `getCustomers()` --calls--> `getSearchQuery()`  [EXTRACTED]
  src/modules/customers/customerController.ts → src/utils/pagination.ts

## Import Cycles
- None detected.

## Communities (69 total, 19 thin omitted)

### Community 0 - "Analytics and Category Management"
Cohesion: 0.09
Nodes (26): db, getCustomerHistory(), getMedicinePricing(), getMedicineTimeline(), router, db, getMedicineBatches(), getMedicinePurchaseHistory() (+18 more)

### Community 1 - "Sequelize Database Models"
Cohesion: 0.06
Nodes (35): author, dependencies, bcrypt, cors, dotenv, express, helmet, jsonwebtoken (+27 more)

### Community 2 - "Project Dependencies"
Cohesion: 0.17
Nodes (19): createCustomer(), db, deleteCustomer(), getCustomerById(), getCustomers(), getCustomerStats(), updateCustomer(), router (+11 more)

### Community 3 - "Customer and Medicine Management"
Cohesion: 0.11
Nodes (14): basename, db, fs, path, process, Sequelize, createPurchase(), db (+6 more)

### Community 4 - "Database Schema Definitions"
Cohesion: 0.22
Nodes (18): development, production, test, database, dialect, host, password, username (+10 more)

### Community 5 - "Purchase Order Management"
Cohesion: 0.13
Nodes (12): Categories Table, Customers Table, Medicines Table, Permissions Table, Roles Table, Suppliers Table, Tenants Table, User Roles Table (+4 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.15
Nodes (11): db, login(), registerTenant(), router, db, getExpiringMedicines(), getRecentBills(), getStats() (+3 more)

### Community 7 - "Billing and Sales Processing"
Cohesion: 0.14
Nodes (14): compilerOptions, allowJs, esModuleInterop, ignoreDeprecations, lib, module, moduleResolution, outDir (+6 more)

### Community 8 - "Environment and Build Config"
Cohesion: 0.15
Nodes (3): sequelize, Return, UserRole

### Community 9 - "Model Migration Sync Tools"
Cohesion: 0.31
Nodes (9): createSale(), db, getAnalytics(), getMedicineSalesHistory(), getSaleById(), getSales(), processReturn(), updateSale() (+1 more)

### Community 10 - "Model Comparison Utilities"
Cohesion: 0.31
Nodes (6): createDoctor(), deleteDoctor(), getDoctors(), updateDoctor(), router, Doctor

### Community 11 - "Database Environment Credentials"
Cohesion: 0.22
Nodes (7): fs, migrationFiles, migrationsDir, modelFiles, modelsDir, path, ts

### Community 12 - "Dashboard and Statistics"
Cohesion: 0.22
Nodes (6): fs, migrationFiles, migrationsDir, modelFiles, modelsDir, path

### Community 13 - "Supplier Management"
Cohesion: 0.39
Nodes (6): createCategory(), db, deleteCategory(), getCategories(), updateCategory(), router

### Community 14 - "Authentication and Registration"
Cohesion: 0.39
Nodes (6): createCompany(), db, deleteCompany(), getCompanies(), updateCompany(), router

### Community 15 - "Migration Schema Management"
Cohesion: 0.39
Nodes (6): createHsnSac(), db, deleteHsnSac(), getHsnSac(), updateHsnSac(), router

### Community 16 - "Migration Generation Scripts"
Cohesion: 0.43
Nodes (5): db, getGstReports(), getInventoryReports(), getSalesReports(), router

### Community 17 - "Migration Repair Utilities"
Cohesion: 0.33
Nodes (5): files, fs, migrationsDir, path, schemas

### Community 18 - "Database Connection Testing"
Cohesion: 0.33
Nodes (5): fs, migrationsDir, now, path, tables

### Community 20 - "RBAC Seed Migrations"
Cohesion: 0.40
Nodes (4): files, fs, migrationsDir, path

## Knowledge Gaps
- **130 isolated node(s):** `fs`, `path`, `ts`, `modelsDir`, `migrationsDir` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthRequest` connect `Analytics and Category Management` to `Project Dependencies`, `Customer and Medicine Management`, `TypeScript Configuration`, `Model Migration Sync Tools`, `Model Comparison Utilities`, `Supplier Management`, `Authentication and Registration`, `Migration Schema Management`, `Migration Generation Scripts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Billing and Sales Processing` to `Database Schema Definitions`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `fs`, `path`, `ts` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Analytics and Category Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09446693657219973 - nodes in this community are weakly interconnected._
- **Should `Sequelize Database Models` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Customer and Medicine Management` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Should `Purchase Order Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._