# Graph Report - C:\Users\DELL\printing-shop\frontend  (2026-06-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 225 nodes · 388 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e2bf1a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `formatCurrency()` - 23 edges
2. `compilerOptions` - 20 edges
3. `formatDate()` - 13 edges
4. `cn()` - 8 edges
5. `useToast` - 7 edges
6. `Customers()` - 7 edges
7. `Medicine` - 7 edges
8. `Customer` - 6 edges
9. `Sales()` - 5 edges
10. `Notification` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Modal()` --calls--> `cn()`  [EXTRACTED]
  src/components/common/Modal.tsx → src/utils/cn.ts
- `ToastContainer()` --calls--> `useToast`  [EXTRACTED]
  src/components/common/Toast.tsx → src/hooks/useToast.ts
- `CustomerForm()` --references--> `Customer`  [EXTRACTED]
  src/components/customers/CustomerForm.tsx → src/types/index.ts
- `MedicineFormProps` --references--> `Medicine`  [EXTRACTED]
  src/components/inventory/MedicineForm.tsx → src/types/index.ts
- `Customers()` --calls--> `useToast`  [EXTRACTED]
  src/pages/Customers.tsx → src/hooks/useToast.ts

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (31): dependencies, autoprefixer, axios, clsx, framer-motion, fuse.js, html2pdf.js, html5-qrcode (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (24): AICopilot(), initialMessages, quickActions, aiCopilotResponses, aiInsights, aiSearchResults, categoryData, customers (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (19): BillingActionKey, billingActions, SubAction, Layout(), pageVariants, navItems, Sidebar(), notifIcons (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (11): suggestionMap, useBillingAnalytics(), useCustomerStats(), useProcessReturn(), useSales(), KPICard(), Reports(), Sales() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (8): BarcodeScannerProps, InvoiceItem, PrintInvoiceProps, GlobalProduct, api, Billing(), InvoiceItem, BillingStore

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib, module (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (9): Modal(), ModalProps, useCreateMedicine(), useDeleteMedicine(), useUpdateMedicine(), MedicineFormProps, Medicine, cn() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.23
Nodes (7): icons, ToastContainer(), useReceivePurchase(), ToastMessage, ToastStore, ToastType, useToast

### Community 8 - "Community 8"
Cohesion: 0.42
Nodes (6): CustomerForm(), useCreateCustomer(), useDeleteCustomer(), useUpdateCustomer(), Customers(), Customer

## Knowledge Gaps
- **77 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatCurrency()` connect `Community 3` to `Community 1`, `Community 4`, `Community 6`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09475806451612903 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1455026455026455 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._