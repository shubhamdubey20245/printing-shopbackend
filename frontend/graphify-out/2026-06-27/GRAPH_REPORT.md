# Graph Report - C:\Users\DELL\printing-shopdb\frontend  (2026-06-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 250 nodes · 458 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fa310ad`
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
4. `useToast` - 9 edges
5. `cn()` - 8 edges
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
- `Billing()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/pages/Billing.tsx → src/utils/cn.ts

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (23): Modal(), ModalProps, stores, BillingActionKey, billingActions, SubAction, Layout(), pageVariants (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (31): dependencies, autoprefixer, axios, clsx, framer-motion, fuse.js, html2pdf.js, html5-qrcode (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (26): AICopilot(), initialMessages, quickActions, aiCopilotResponses, aiInsights, aiSearchResults, categoryData, customers (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (11): suggestionMap, useBillingAnalytics(), useCustomerStats(), useProcessReturn(), useSales(), KPICard(), Reports(), Sales() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (20): useCreateSale(), useCreateCategory(), useDeleteCategory(), useCompanies(), useCreateCompany(), useCreateHsnSac(), useDeleteCompany(), useDeleteHsnSac() (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (8): BarcodeScannerProps, InvoiceItem, PrintInvoiceProps, GlobalProduct, api, Billing(), InvoiceItem, BillingStore

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib, module (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (13): icons, ToastContainer(), CustomerForm(), useCreateCustomer(), useDeleteCustomer(), useUpdateCustomer(), useReceivePurchase(), ToastMessage (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.57
Nodes (5): useCreateDoctor(), useDeleteDoctor(), useUpdateDoctor(), Doctors(), Doctor

## Knowledge Gaps
- **79 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatCurrency()` connect `Community 3` to `Community 0`, `Community 2`, `Community 4`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `formatDate()` connect `Community 3` to `Community 4`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08392603129445235 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09475806451612903 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._