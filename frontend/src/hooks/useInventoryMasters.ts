import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { PharmaCompany, SaltComposition, HsnSacMaster } from '@/types'

// ─── Companies ─────────────────────────────────────────────────────
export const useCompanies = () => {
  return useQuery({
    queryKey: ['inventory-companies'],
    queryFn: async () => {
      const { data } = await api.get('/inventory/companies')
      return data.data as PharmaCompany[]
    },
    staleTime: 5 * 60 * 1000
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (company: Partial<PharmaCompany>) => {
      const { data } = await api.post('/inventory/companies', company)
      return data.data as PharmaCompany
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-companies'] })
    }
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PharmaCompany> }) => {
      const res = await api.put(`/inventory/companies/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-companies'] })
    }
  })
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/inventory/companies/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-companies'] })
    }
  })
}

// ─── Salts ─────────────────────────────────────────────────────────
export const useSalts = () => {
  return useQuery({
    queryKey: ['inventory-salts'],
    queryFn: async () => {
      const { data } = await api.get('/inventory/salts')
      return data.data as SaltComposition[]
    },
    staleTime: 5 * 60 * 1000
  })
}

export const useCreateSalt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (salt: Partial<SaltComposition>) => {
      const { data } = await api.post('/inventory/salts', salt)
      return data.data as SaltComposition
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-salts'] })
    }
  })
}

export const useUpdateSalt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SaltComposition> }) => {
      const res = await api.put(`/inventory/salts/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-salts'] })
    }
  })
}

export const useDeleteSalt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/inventory/salts/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-salts'] })
    }
  })
}

// ─── HSN / SAC ─────────────────────────────────────────────────────
export const useHsnSac = () => {
  return useQuery({
    queryKey: ['inventory-hsn'],
    queryFn: async () => {
      const { data } = await api.get('/inventory/hsn-sac')
      return data.data as HsnSacMaster[]
    },
    staleTime: 5 * 60 * 1000
  })
}

export const useCreateHsnSac = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (hsn: Partial<HsnSacMaster>) => {
      const { data } = await api.post('/inventory/hsn-sac', hsn)
      return data.data as HsnSacMaster
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-hsn'] })
    }
  })
}

export const useUpdateHsnSac = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HsnSacMaster> }) => {
      const res = await api.put(`/inventory/hsn-sac/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-hsn'] })
    }
  })
}

export const useDeleteHsnSac = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/inventory/hsn-sac/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-hsn'] })
    }
  })
}
