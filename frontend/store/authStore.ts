import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  tokens: {
    access: string | null
    refresh: string | null
  }
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: {
        access: null,
        refresh: null,
      },
      setTokens: (access, refresh) => 
        set({ tokens: { access, refresh } }),
      clearTokens: () => 
        set({ tokens: { access: null, refresh: null } }),
    }),
    {
      name: 'auth-storage',
    }
  )
)