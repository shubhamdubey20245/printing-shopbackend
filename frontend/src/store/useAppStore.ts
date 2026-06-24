import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, AppUser, Notification } from '@/types'

interface AppStore {
  // Theme
  isDark: boolean
  toggleDark: () => void

  // Auth
  token: string | null
  login: (user: AppUser, token: string) => void
  logout: () => void

  // Current user
  currentUser: AppUser | null
  setCurrentUser: (user: AppUser | null) => void

  // Current store
  currentStoreId: string
  setCurrentStore: (id: string) => void

  // Cart (billing)
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  updateDiscount: (id: string, discount: number) => void
  clearCart: () => void

  // Command palette
  isCommandOpen: boolean
  setCommandOpen: (open: boolean) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllRead: () => void

  // AI copilot
  isAICopilotOpen: boolean
  setAICopilotOpen: (open: boolean) => void

  // Sidebar
  isSidebarCollapsed: boolean
  toggleSidebar: () => void

  // Billing Sub-Sidebar
  isBillingSubSidebarCollapsed: boolean
  toggleBillingSubSidebar: () => void
}

const defaultUser: AppUser = {
  id: '1',
  name: 'Rajesh Sharma',
  role: 'owner',
  email: 'rajesh@mediflow.in',
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'expiry',
    title: '5 Medicines Expiring Soon',
    message: 'Amoxicillin, Cefixime, and 3 others expire within 30 days',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg stock is below minimum level (12 left)',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Outstanding Payment Due',
    message: 'City Hospital has ₹45,000 outstanding since 7 days',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'achievement',
    title: '🎉 Monthly Target Achieved!',
    message: 'You have achieved 105% of your monthly sales target',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'New Purchase Order',
    message: 'PO #4521 from Sun Pharma has been delivered',
    time: '1 day ago',
    read: true,
  },
]

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggleDark: () => {
        set((state) => {
          const next = !state.isDark
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDark: next }
        })
      },

      token: null,
      login: (user, token) => set({ currentUser: user, token }),
      logout: () => set({ currentUser: null, token: null }),

      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      currentStoreId: 'store-1',
      setCurrentStore: (id) => set({ currentStoreId: id }),

  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.id === item.id)
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        }
      }
      return { cart: [...state.cart, { ...item, quantity: 1, discount: 0 }] }
    }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((c) => c.id !== id) })),
  updateQuantity: (id, qty) =>
    set((state) => ({
      cart: state.cart.map((c) => (c.id === id ? { ...c, quantity: qty } : c)),
    })),
  updateDiscount: (id, discount) =>
    set((state) => ({
      cart: state.cart.map((c) => (c.id === id ? { ...c, discount } : c)),
    })),
  clearCart: () => set({ cart: [] }),

  isCommandOpen: false,
  setCommandOpen: (open) => set({ isCommandOpen: open }),

  notifications: defaultNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  isAICopilotOpen: false,
  setAICopilotOpen: (open) => set({ isAICopilotOpen: open }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isBillingSubSidebarCollapsed: false,
  toggleBillingSubSidebar: () => set((state) => ({ isBillingSubSidebarCollapsed: !state.isBillingSubSidebarCollapsed })),
    }),
    {
      name: 'mediflow-storage', // unique name
      partialize: (state) => ({ token: state.token, currentUser: state.currentUser, isDark: state.isDark }),
    }
  )
)
