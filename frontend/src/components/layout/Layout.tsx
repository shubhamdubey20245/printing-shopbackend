import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAppStore } from '@/store/useAppStore'
import CommandPalette from '@/components/common/CommandPalette'
import AICopilot from '@/components/common/AICopilot'
import ToastContainer from '@/components/common/Toast'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function Layout() {
  const { isSidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }
    
    // Initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  const mainSidebarWidth = isSidebarCollapsed ? 72 : 240
  const marginLeft = mainSidebarWidth
  const marginRight = 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="print:hidden">
        <Sidebar />
      </div>

      <motion.div
        animate={{ marginLeft, marginRight }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="transition-all print:!ml-0 print:!mr-0"
      >
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="pt-16 min-h-screen print:!pt-0 print:!min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="p-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      <CommandPalette />
      <AICopilot />
      <ToastContainer />
    </div>
  )
}
