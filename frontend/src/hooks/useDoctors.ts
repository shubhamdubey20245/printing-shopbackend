import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Doctor } from '@/types'

export const useDoctors = (params?: { page?: number; limit?: number; search?: string; phone?: string }) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const { data } = await api.get('/doctors', { params })
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (doctor: Partial<Doctor>) => {
      const { data } = await api.post('/doctors', doctor)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    }
  })
}

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Doctor> }) => {
      const response = await api.put(`/doctors/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    }
  })
}

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/doctors/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    }
  })
}
