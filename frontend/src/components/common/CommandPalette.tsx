import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, Package, Users, BarChart3, ShoppingCart,
  ArrowUpRight, Zap, TrendingUp, FileText, Settings,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { medicines, customers } from '@/data/mockData'

const quickActions = [
  { label: 'New Bill', icon: ShoppingCart, to: '/billing', color: 'text-primary-500' },
  { label: 'Check Inventory', icon: Package, to: '/inventory', color: 'text-emerald-500' },
  { label: 'View Reports', icon: BarChart3, to: '/reports', color: 'text-violet-500' },
  { label: 'AI Center', icon: Zap, to: '/ai-center', color: 'text-amber-500' },
  { label: 'Sales History', icon: TrendingUp, to: '/sales', color: 'text-blue-500' },
  { label: 'Customers', icon: Users, to: '/customers', color: 'text-rose-500' },
  { label: 'Purchase Orders', icon: FileText, to: '/purchases', color: 'text-cyan-500' },
  { label: 'Settings', icon: Settings, to: '/settings', color: 'text-gray-500' },
]

export default function CommandPalette() {
  const { isCommandOpen, setCommandOpen } = useAppStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandOpen])

  useEffect(() => {
    if (isCommandOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isCommandOpen])

  const medicineResults = query.length > 1
    ? medicines.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        (m.genericName || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  const customerResults = query.length > 1
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
      ).slice(0, 3)
    : []

  const actionResults = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleNavigate = (to: string) => {
    navigate(to)
    setCommandOpen(false)
  }

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] rounded-2xl overflow-hidden shadow-floating"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <Search className="w-4.5 h-4.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicines, customers, actions..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <kbd className="text-xs px-1.5 py-0.5 rounded border font-mono" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                ESC
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {/* Quick Actions */}
              {!query && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {quickActions.map((action) => (
                      <button
                        key={action.to}
                        onClick={() => handleNavigate(action.to)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicine Results */}
              {medicineResults.length > 0 && (
                <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Medicines
                  </p>
                  {medicineResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleNavigate('/inventory')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.category} • Stock: {m.stock}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Customer Results */}
              {customerResults.length > 0 && (
                <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Customers
                  </p>
                  {customerResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleNavigate('/customers')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600">{c.name.charAt(0)}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.phone}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Page Navigation */}
              {query && actionResults.length > 0 && (
                <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Pages
                  </p>
                  {actionResults.map((action) => (
                    <button
                      key={action.to}
                      onClick={() => handleNavigate(action.to)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {query && medicineResults.length === 0 && customerResults.length === 0 && actionResults.length === 0 && (
                <div className="py-10 text-center">
                  <Search className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
