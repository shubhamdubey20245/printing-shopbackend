import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  ChevronDown,
  Store,
  CheckCheck,
  AlertTriangle,
  Package,
  DollarSign,
  Trophy,
  Info,
  LogOut,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { stores } from '@/data/mockData'
import { cn } from '@/utils/cn'
import type { Notification } from '@/types'

const notifIcons = {
  expiry: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  stock: { icon: Package, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  payment: { icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  achievement: { icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  info: { icon: Info, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
}

function NotificationItem({ notif }: { notif: Notification }) {
  const { markNotificationRead } = useAppStore()
  const cfg = notifIcons[notif.type]
  const Icon = cfg.icon
  return (
    <div
      onClick={() => markNotificationRead(notif.id)}
      className={cn(
        'flex gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-white/5',
        !notif.read && 'bg-primary-50/50 dark:bg-primary-900/10'
      )}
    >
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
        <Icon className={cn('w-4 h-4', cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
            {notif.title}
          </p>
          {!notif.read && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {notif.message}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{notif.time}</p>
      </div>
    </div>
  )
}

export default function Topbar() {
  const {
    isDark, toggleDark,
    currentStoreId, setCurrentStore,
    notifications, markAllRead,
    setCommandOpen,
    currentUser,
    logout,
  } = useAppStore()

  const navigate = useNavigate()

  const [showNotifs, setShowNotifs] = useState(false)
  const [showStores, setShowStores] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length
  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0]

  return (
    <header
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-6 z-40 transition-all duration-300"
      style={{
        background: 'var(--sidebar-bg)',
        borderBottom: '1px solid var(--sidebar-border)',
        left: 'var(--sidebar-width, 240px)',
      }}
    >
      {/* Store Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowStores(!showStores)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Store className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium truncate max-w-40" style={{ color: 'var(--text-primary)' }}>
            {currentStore.name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <AnimatePresence>
          {showStores && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-10 left-0 w-72 rounded-2xl shadow-floating border overflow-hidden z-50"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="p-2">
                <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Your Stores
                </p>
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => { setCurrentStore(store.id); setShowStores(false) }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                      store.id === currentStoreId
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                      store.id === currentStoreId
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    )}>
                      {store.name.charAt(store.name.lastIndexOf('-') + 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{store.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{store.location}</p>
                    </div>
                    {store.id === currentStoreId && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-gray-100 dark:hover:bg-white/5"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <div className="flex items-center gap-0.5 ml-1">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-white/10"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-white/10 relative"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-2xl shadow-floating border overflow-hidden z-50"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between p-4 pb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Notifications {unreadCount > 0 && <span className="badge badge-primary ml-1">{unreadCount} new</span>}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary-500 font-medium flex items-center gap-1 hover:underline"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />Mark all read
                    </button>
                  )}
                </div>
                <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                  {notifications.map((n) => <NotificationItem key={n.id} notif={n} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 hover:bg-gray-100 dark:hover:bg-white/5 p-1 rounded-xl transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-white text-sm font-bold">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-medium leading-none" style={{ color: 'var(--text-primary)' }}>
                {currentUser?.name || 'User'}
              </div>
              <div className="text-xs mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
                {currentUser?.role || 'Guest'}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 rounded-2xl shadow-floating border overflow-hidden z-50"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="p-2">
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop */}
      {(showNotifs || showStores || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifs(false); setShowStores(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  )
}
