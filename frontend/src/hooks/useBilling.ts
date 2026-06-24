import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await api.get('/billing/sales')
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export const useCreateSale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sale: any) => {
      const { data } = await api.post('/billing/sale', sale)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['billingAnalytics'] })
    }
  })
}

export const useBillingAnalytics = () => {
  return useQuery({
    queryKey: ['billingAnalytics'],
    queryFn: async () => {
      const { data } = await api.get('/billing/analytics/today')
      return data
    },
    refetchInterval: 60000 // Refetch every minute
  })
}

export const useCustomerStats = (customerId: string | null) => {
  return useQuery({
    queryKey: ['customerStats', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const { data } = await api.get(`/customers/${customerId}/stats`);
      return data;
    },
    enabled: !!customerId
  })
}

export const useProcessReturn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, returnItems }: { id: string, returnItems: any[] }) => {
      const { data } = await api.post(`/billing/sale/${id}/return`, { returnItems })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['billingAnalytics'] })
    }
  })
}
