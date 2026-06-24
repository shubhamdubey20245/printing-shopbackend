import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Billing from '@/pages/Billing'
import Inventory from '@/pages/Inventory'
import Purchases from '@/pages/Purchases'
import Sales from '@/pages/Sales'
import Customers from '@/pages/Customers'
import Doctors from '@/pages/Doctors'
import AICenter from '@/pages/AICenter'
import Reports from '@/pages/Reports'
import Stores from '@/pages/Stores'
import Settings from '@/pages/Settings'
import PrintInvoicePage from '@/pages/PrintInvoicePage'

import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/print/:id" element={
            <ProtectedRoute>
              <PrintInvoicePage />
            </ProtectedRoute>
          } />

          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/ai-center" element={<AICenter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}



// admin