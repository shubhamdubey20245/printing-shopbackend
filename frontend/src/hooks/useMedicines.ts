import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Medicine } from '@/types'

export const useMedicines = (
  params?: {
    page?: number
    limit?: number
    search?: string
    category_id?: string
  }
) => {
  return useQuery({
    queryKey: ['medicines', params],

    queryFn: async () => {
      const { data } = await api.get('/medicines', {
        params
      })
      return data
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    // IMPORTANT FIXES
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1
  })
}

export const useCreateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (medicine: Partial<Medicine>) => {
      const { data } = await api.post('/medicines', medicine)
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicines']
      })
    }
  })
}

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      data: Partial<Medicine>
    }) => {
      const response = await api.put(`/medicines/${id}`, data)
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicines']
      })
    }
  })
}

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/medicines/${id}`)
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicines']
      })
    }
  })
}