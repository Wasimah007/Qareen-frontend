// ─── Verdict Types ──────────────────────────────────────────────────────────
export type VerdictType = 'halal' | 'haram' | 'makruh' | 'mubah' | 'obligatory' | 'recommended' | 'scholarly' | 'unknown'

export interface VerdictConfig {
  label: string
  bg: string
  text: string
  border: string
  icon: string
  badgeBg: string
}

// ─── Citations ───────────────────────────────────────────────────────────────
export interface QuranCitation {
  surah: string
  ayah: string
  arabic?: string
  text: string
  translation_language?: string
}

export interface HadithCitation {
  collection: string
  number: string
  narrator?: string
  text: string
  grade?: string
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface GuidanceResponse {
  id: string
  verdict: string
  verdict_type: VerdictType
  explanation: string
  category: string
  suggested_action?: string
  authenticity?: string
  quran_citation?: QuranCitation
  hadith_citation?: HadithCitation
  sources: string[]
  is_scholar_verified: boolean
  disclaimer: string
  created_at: string
}

export interface WaswasaResponse {
  id: string
  fiqh_principle: string
  calming_verse: QuranCitation
  hadith: HadithCitation
  dhikr: string
  dhikr_translation: string
  advice: string
  steps: string[]
  disclaimer: string
  created_at: string
}

export interface QuestionHistoryItem {
  id: string
  question_text: string
  verdict?: string
  verdict_type?: VerdictType
  category?: string
  is_scholar_verified: boolean
  is_saved: boolean
  is_waswasa: boolean
  created_at: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string
  token_type: string
  user_id: string
  username: string
  role: string
  subscription: string
}

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  preferred_language: string
  preferred_madhhab: string
  role: string
  subscription: string
  is_active: boolean
  created_at: string
}

// ─── Language ────────────────────────────────────────────────────────────────
export type Language = 'en' | 'ar' | 'ur' | 'fr' | 'tr'
export type TextDirection = 'ltr' | 'rtl'
