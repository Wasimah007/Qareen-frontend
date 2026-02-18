/**
 * Qareen API client
 * All requests go through this module.
 */
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import type { GuidanceResponse, WaswasaResponse, QuestionHistoryItem, TokenResponse, User } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token into every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('qareen_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ detail: string }>) => {
    if (error.response?.status === 401) {
      Cookies.remove('qareen_token')
      if (typeof window !== 'undefined') window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  },
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function register(data: {
  email: string; username: string; password: string;
  full_name?: string; preferred_language?: string; preferred_madhhab?: string
}): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>('/auth/register', data)
  return res.data
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>('/auth/login', { email, password })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me')
  return res.data
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const res = await api.patch<User>('/auth/me', data)
  return res.data
}

// ─── Questions ───────────────────────────────────────────────────────────────
export async function askQuestion(data: {
  question_text: string; language?: string; madhhab?: string; is_waswasa?: boolean
}): Promise<GuidanceResponse> {
  const res = await api.post<GuidanceResponse>('/questions/ask', data)
  return res.data
}

export async function getHistory(page = 1, perPage = 20): Promise<QuestionHistoryItem[]> {
  const res = await api.get<QuestionHistoryItem[]>(`/questions/history?page=${page}&per_page=${perPage}`)
  return res.data
}

export async function getQuestion(id: string): Promise<GuidanceResponse> {
  const res = await api.get<GuidanceResponse>(`/questions/${id}`)
  return res.data
}

export async function toggleSave(id: string): Promise<{ saved: boolean }> {
  const res = await api.patch<{ saved: boolean }>(`/questions/${id}/save`)
  return res.data
}

// ─── Waswasa ─────────────────────────────────────────────────────────────────
export async function getWaswasaSupport(data: {
  thought_text: string; language?: string
}): Promise<WaswasaResponse> {
  const res = await api.post<WaswasaResponse>('/waswasa/calm', data)
  return res.data
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export async function getUnverifiedQuestions(): Promise<any[]> {
  const res = await api.get('/admin/questions/unverified')
  return res.data
}

export async function verifyQuestion(data: {
  question_id: string; is_verified: boolean; scholar_note?: string
}): Promise<any> {
  const res = await api.patch('/admin/questions/verify', data)
  return res.data
}

export async function getAdminStats(): Promise<any> {
  const res = await api.get('/admin/stats')
  return res.data
}
