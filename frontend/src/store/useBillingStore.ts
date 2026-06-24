import { create } from 'zustand'

/**
 * useBillingStore
 * A lightweight store of billing action callbacks.
 * Billing.tsx registers these on mount; BillingSubSidebar calls them.
 */
interface BillingStore {
  // Registered callbacks from Billing.tsx
  newBill: (() => void) | null
  saveDraft: (() => void) | null
  loadDraft: (() => void) | null
  openScanner: (() => void) | null
  openRecentBills: (() => void) | null
  openCheckout: (() => void) | null
  printInvoice: (() => void) | null
  downloadPDF: (() => void) | null
  clearBill: (() => void) | null

  // Registration helpers
  register: (actions: Partial<Omit<BillingStore, 'register' | 'unregister'>>) => void
  unregister: () => void
}

export const useBillingStore = create<BillingStore>((set) => ({
  newBill: null,
  saveDraft: null,
  loadDraft: null,
  openScanner: null,
  openRecentBills: null,
  openCheckout: null,
  printInvoice: null,
  downloadPDF: null,
  clearBill: null,

  register: (actions) => set((state) => ({ ...state, ...actions })),
  unregister: () =>
    set({
      newBill: null,
      saveDraft: null,
      loadDraft: null,
      openScanner: null,
      openRecentBills: null,
      openCheckout: null,
      printInvoice: null,
      downloadPDF: null,
      clearBill: null,
    }),
}))
