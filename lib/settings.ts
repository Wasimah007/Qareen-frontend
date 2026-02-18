/**
 * Global app settings store.
 * Persists language, madhhab, theme to localStorage.
 */
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/types'

interface SettingsState {
  language: Language
  madhhab: string
  darkMode: boolean
  setLanguage: (lang: Language) => void
  setMadhhab: (madhhab: string) => void
  setDarkMode: (dark: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      madhhab: 'General',
      darkMode: true,
      setLanguage: (language) => set({ language }),
      setMadhhab: (madhhab) => set({ madhhab }),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    { name: 'qareen-settings' }
  )
)

export const LANGUAGES = [
  { code: 'en' as Language, label: 'English', native: 'English', dir: 'ltr' as const },
  { code: 'ar' as Language, label: 'Arabic',  native: 'العربية', dir: 'rtl' as const },
  { code: 'ur' as Language, label: 'Urdu',    native: 'اردو',    dir: 'rtl' as const },
  { code: 'fr' as Language, label: 'French',  native: 'Français', dir: 'ltr' as const },
  { code: 'tr' as Language, label: 'Turkish', native: 'Türkçe', dir: 'ltr' as const },
]

export const MADHHABS = ['General', "Hanafi", "Maliki", "Shafi'i", "Hanbali", "Jafari"]

export function getDir(lang: Language): 'ltr' | 'rtl' {
  return ['ar', 'ur'].includes(lang) ? 'rtl' : 'ltr'
}
