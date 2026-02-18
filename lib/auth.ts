/**
 * Zustand store for auth state.
 * Persists JWT in cookies so it survives page refreshes.
 */
import { create } from 'zustand'
import Cookies from 'js-cookie'
import type { User, TokenResponse } from '@/types'
import { getMe } from './api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setToken: (token: TokenResponse) => void
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get('qareen_token') || null,
  isLoading: false,

  setToken: (tokenRes: TokenResponse) => {
    Cookies.set('qareen_token', tokenRes.access_token, { expires: 7, sameSite: 'strict' })
    set({ token: tokenRes.access_token })
  },

  logout: () => {
    Cookies.remove('qareen_token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    const token = Cookies.get('qareen_token')
    if (!token) return
    set({ isLoading: true })
    try {
      const user = await getMe()
      set({ user })
    } catch {
      Cookies.remove('qareen_token')
      set({ user: null, token: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))
