import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Receipt,
  Package,
  TrendingUp,
  Users,
  Bot,
  BarChart3,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  Pill,
  ArrowLeftRight,
  Activity,
  Stethoscope,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/purchases', icon: ArrowLeftRight, label: 'Purchases' },
  { to: '/sales', icon: TrendingUp, label: 'Sales' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/ai-center', icon: Bot, label: 'AI Center' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/stores', icon: Store, label: 'Stores' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore()
  const location = useLocation()

  const sidebarWidth = isSidebarCollapsed ? 72 : 240

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-50 flex flex-col"
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 flex-shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-primary">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-bold text-base gradient-text whitespace-nowrap">MediFlow</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">Pharmacy ERP</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn('sidebar-item', isActive && 'active')}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-5 rounded-full bg-primary-500 flex-shrink-0"
                />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Status indicator */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl overflow-hidden"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-primary-500">System Online</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Activity className="w-3 h-3" />
              <span>Last sync: Just now</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10"
        style={{ borderColor: 'var(--border)' }}
      >
        {isSidebarCollapsed
          ? <ChevronRight className="w-3 h-3 text-gray-500" />
          : <ChevronLeft className="w-3 h-3 text-gray-500" />
        }
      </button>
    </motion.aside>
  )
}
