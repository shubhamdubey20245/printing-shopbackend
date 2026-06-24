import { motion, AnimatePresence } from 'framer-motion'
import {
  FilePlus,
  ScanLine,
  Save,
  FolderOpen,
  History,
  CreditCard,
  Printer,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useBillingStore } from '@/store/useBillingStore'
import { cn } from '@/utils/cn'

type BillingActionKey = 'newBill' | 'saveDraft' | 'loadDraft' | 'openScanner' | 'openRecentBills' | 'openCheckout' | 'printInvoice' | 'downloadPDF' | 'clearBill'

interface SubAction {
  id: string
  label: string
  icon: React.ElementType
  color: string
  hoverBg: string
  hoverText: string
  action: BillingActionKey
  dividerBefore?: boolean
}

const billingActions: SubAction[] = [
  {
    id: 'new',
    label: 'New Bill',
    icon: FilePlus,
    color: 'text-emerald-600 dark:text-emerald-400',
    hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    hoverText: 'group-hover:text-emerald-600',
    action: 'newBill',
  },
  {
    id: 'scan',
    label: 'Scan Barcode',
    icon: ScanLine,
    color: 'text-cyan-600 dark:text-cyan-400',
    hoverBg: 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20',
    hoverText: 'group-hover:text-cyan-600',
    action: 'openScanner',
  },
  {
    id: 'checkout',
    label: 'Checkout',
    icon: CreditCard,
    color: 'text-violet-600 dark:text-violet-400',
    hoverBg: 'hover:bg-violet-50 dark:hover:bg-violet-900/20',
    hoverText: 'group-hover:text-violet-600',
    action: 'openCheckout',
  },
  {
    id: 'save',
    label: 'Save Draft',
    icon: Save,
    color: 'text-amber-600 dark:text-amber-400',
    hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
    hoverText: 'group-hover:text-amber-600',
    action: 'saveDraft',
    dividerBefore: true,
  },
  {
    id: 'load',
    label: 'Load Draft',
    icon: FolderOpen,
    color: 'text-indigo-600 dark:text-indigo-400',
    hoverBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    hoverText: 'group-hover:text-indigo-600',
    action: 'loadDraft',
  },
  {
    id: 'recent',
    label: 'Recent Bills',
    icon: History,
    color: 'text-blue-600 dark:text-blue-400',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    hoverText: 'group-hover:text-blue-600',
    action: 'openRecentBills',
  },
  {
    id: 'pdf',
    label: 'Download PDF',
    icon: Download,
    color: 'text-teal-600 dark:text-teal-400',
    hoverBg: 'hover:bg-teal-50 dark:hover:bg-teal-900/20',
    hoverText: 'group-hover:text-teal-600',
    action: 'downloadPDF',
    dividerBefore: true,
  },
  {
    id: 'clear',
    label: 'Clear Bill',
    icon: Trash2,
    color: 'text-rose-600 dark:text-rose-400',
    hoverBg: 'hover:bg-rose-50 dark:hover:bg-rose-900/20',
    hoverText: 'group-hover:text-rose-600',
    action: 'clearBill',
    dividerBefore: true,
  },
]

export default function BillingSubSidebar() {
  const { isBillingSubSidebarCollapsed, toggleBillingSubSidebar } = useAppStore()
  const billingStore = useBillingStore()

  const width = isBillingSubSidebarCollapsed ? 56 : 200

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 h-full z-40 flex flex-col overflow-hidden"
      style={{
        background: 'var(--sidebar-bg)',
        borderLeft: '1px solid var(--sidebar-border)',
        right: 0,
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-3 flex-shrink-0 gap-2.5 overflow-hidden border-b"
        style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Receipt className="w-3.5 h-3.5 text-white" />
        </div>
        <AnimatePresence>
          {!isBillingSubSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Billing</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Quick Actions</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back to Sidebar Button */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <button
          onClick={() => window.location.href = '/'}
          className={cn(
            'w-full flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 py-2 rounded-xl transition-colors font-bold shadow-sm',
            isBillingSubSidebarCollapsed ? 'justify-center px-0' : 'justify-center px-4'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          {!isBillingSubSidebarCollapsed && <span>Back to Sidebar</span>}
        </button>
      </div>

      {/* Action Items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {billingActions.map((item) => {
          const fn = billingStore[item.action as keyof typeof billingStore]
          const handler = typeof fn === 'function' ? fn as () => void : undefined

          return (
            <div key={item.id}>
              {item.dividerBefore && (
                <div className="my-2 border-t" style={{ borderColor: 'var(--border)' }} />
              )}
              <button
                onClick={handler}
                title={isBillingSubSidebarCollapsed ? item.label : undefined}
                className={cn(
                  'group w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all duration-150 text-left',
                  item.hoverBg,
                  'hover:shadow-sm'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105',
                  'bg-white dark:bg-gray-800/60 shadow-sm border',
                  item.color
                )} style={{ borderColor: 'var(--border)' }}>
                  <item.icon className="w-4 h-4" />
                </div>

                <AnimatePresence>
                  {!isBillingSubSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'text-[13px] font-medium whitespace-nowrap transition-colors',
                        'text-gray-600 dark:text-gray-400',
                        item.hoverText
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleBillingSubSidebar}
        className="absolute -left-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10"
        style={{ borderColor: 'var(--border)' }}
      >
        {isBillingSubSidebarCollapsed
          ? <ChevronLeft className="w-3 h-3 text-gray-500" />
          : <ChevronRight className="w-3 h-3 text-gray-500" />
        }
      </button>
    </motion.aside>
  )
}
