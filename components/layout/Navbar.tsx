'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { useSettingsStore, LANGUAGES, getDir } from '@/lib/settings'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { href: '/',           label: 'Home',       labelKey: 'nav.home'      },
  { href: '/ask',        label: 'Ask',        labelKey: 'nav.ask'       },
  { href: '/waswasa',    label: 'Waswasa',    labelKey: 'nav.waswasa'   },
  { href: '/dashboard',  label: 'Dashboard',  labelKey: 'nav.dashboard' },
  { href: '/settings',   label: 'Settings',   labelKey: 'nav.settings'  },
]

// Simple inline translation hook
function useT() {
  const { language } = useSettingsStore()
  const [translations, setTranslations] = useState<Record<string, any>>({})
  if (typeof window !== 'undefined' && Object.keys(translations).length === 0) {
    import(`@/public/locales/${language}/common.json`).then(m => setTranslations(m.default)).catch(() => {})
  }
  return (key: string, fallback = key) => {
    const parts = key.split('.')
    let val: any = translations
    for (const p of parts) val = val?.[p]
    return typeof val === 'string' ? val : fallback
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { language, setLanguage } = useSettingsStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const dir = getDir(language)

  const currentLang = LANGUAGES.find(l => l.code === language)

  return (
    <>
      <nav
        dir={dir}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#1e4a2e] h-16 px-4 md:px-8 flex items-center justify-between"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="font-display text-2xl text-gold-500 leading-none">
            {language === 'ar' ? 'قرين' : language === 'ur' ? 'قرین' : 'Qareen'}
          </span>
          <span className="hidden md:block text-[11px] text-[#9ab8a4] tracking-wider">
            {language === 'en' && 'Constant Companion'}
            {language === 'fr' && 'Compagnon Constant'}
            {language === 'tr' && 'Sürekli Yoldaş'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'px-3 py-1.5 rounded-full text-[13px] transition-all no-underline',
                pathname === item.href
                  ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                  : 'text-[#9ab8a4] hover:text-gold-400'
              )}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === 'admin' || user?.role === 'scholar' ? (
            <Link href="/admin" className="px-3 py-1.5 rounded-full text-[13px] text-[#9ab8a4] hover:text-gold-400 no-underline">
              Admin
            </Link>
          ) : null}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="px-3 py-1.5 rounded-full text-[12px] border border-[#1e4a2e] text-[#9ab8a4] hover:border-gold-500/50 transition-all"
            >
              {currentLang?.native}
            </button>
            {langOpen && (
              <div className="absolute top-10 right-0 bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-2 shadow-xl min-w-[140px] z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setLangOpen(false) }}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all',
                      l.code === language ? 'bg-gold-500/20 text-gold-400' : 'text-[#9ab8a4] hover:bg-[#142d1e]'
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-[12px] text-[#9ab8a4]">{user.username}</span>
              <button
                onClick={logout}
                className="p-2 rounded-full border border-[#1e4a2e] text-[#9ab8a4] hover:text-red-400 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/auth/login" className="px-3 py-1.5 rounded-full text-[13px] text-[#9ab8a4] border border-[#1e4a2e] hover:border-gold-500/50 no-underline transition-all">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-3 py-1.5 rounded-full text-[13px] btn-primary no-underline">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[#9ab8a4]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a1f14]/95 backdrop-blur-sm pt-16 flex flex-col p-6 md:hidden">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'py-4 text-xl font-display border-b border-[#1e4a2e] no-underline transition-colors',
                pathname === item.href ? 'text-gold-500' : 'text-[#f0ece0]'
              )}
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-6 flex gap-3">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 py-3 text-center rounded-full border border-[#1e4a2e] text-[#9ab8a4] no-underline">Sign In</Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1 py-3 text-center rounded-full btn-primary no-underline">Sign Up</Link>
            </div>
          )}
          {user && (
            <button onClick={() => { logout(); setMobileOpen(false) }} className="mt-6 py-3 text-red-400 border border-red-900/40 rounded-full">
              Sign Out
            </button>
          )}
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card border-t border-[#1e4a2e] flex justify-around py-2 pb-safe">
        {NAV_ITEMS.map(item => {
          const icons: Record<string, string> = { '/': '🕌', '/ask': '✦', '/waswasa': '🌙', '/dashboard': '📋', '/settings': '⚙️' }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1 no-underline transition-opacity',
                pathname === item.href ? 'opacity-100' : 'opacity-40'
              )}
            >
              <span className="text-lg">{icons[item.href]}</span>
              <span className={clsx('text-[9px]', pathname === item.href ? 'text-gold-500' : 'text-[#9ab8a4]')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
