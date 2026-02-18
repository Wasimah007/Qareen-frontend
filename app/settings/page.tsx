'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import { useAuthStore } from '@/lib/auth'
import { useSettingsStore, LANGUAGES, MADHHABS, getDir } from '@/lib/settings'
import { updateMe } from '@/lib/api'
import { clsx } from 'clsx'

export default function SettingsPage() {
  const { user, fetchMe } = useAuthStore()
  const { language, madhhab, darkMode, setLanguage, setMadhhab, setDarkMode } = useSettingsStore()
  const dir = getDir(language)
  const [saving, setSaving] = useState(false)

  const handleSavePreferences = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateMe({ preferred_language: language, preferred_madhhab: madhhab })
      await fetchMe()
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save. Changes are saved locally.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div dir={dir} className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 pb-24">

        <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-[#f0ece0] mb-8">Settings</h1>

        {/* Language */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
          <div className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-4">Language</div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={clsx(
                  'px-4 py-2 rounded-full text-[13px] border transition-all',
                  language === l.code
                    ? 'bg-gold-500/20 border-gold-500/50 text-gold-400 font-medium'
                    : 'border-[#1e4a2e] text-[#9ab8a4] hover:border-gold-500/30'
                )}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        {/* Madhhab */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
          <div className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-4">Preferred Madhhab</div>
          <p className="text-[12px] text-[#9ab8a4]/70 mb-4 italic">
            This influences how differences between schools are presented — it does not restrict the answer.
          </p>
          <div className="flex flex-wrap gap-2">
            {MADHHABS.map(m => (
              <button
                key={m}
                onClick={() => setMadhhab(m)}
                className={clsx(
                  'px-4 py-2 rounded-full text-[13px] border transition-all',
                  madhhab === m
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-medium'
                    : 'border-[#1e4a2e] text-[#9ab8a4] hover:border-emerald-500/30'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
          <div className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-4">Theme</div>
          <div className="flex gap-3">
            {[
              { val: true,  label: '🌙 Dark',  desc: 'Easy on the eyes' },
              { val: false, label: '☀️ Light', desc: 'High contrast' },
            ].map(t => (
              <button
                key={String(t.val)}
                onClick={() => setDarkMode(t.val)}
                className={clsx(
                  'flex-1 py-3 px-4 rounded-xl border text-[13px] text-left transition-all',
                  darkMode === t.val
                    ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                    : 'border-[#1e4a2e] text-[#9ab8a4] hover:border-gold-500/20'
                )}
              >
                <div className="font-medium">{t.label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        {user && (
          <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
            <div className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-4">Account</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Username', value: user.username },
                { label: 'Role', value: user.role },
                { label: 'Subscription', value: user.subscription },
                { label: 'Member since', value: new Date(user.created_at).toLocaleDateString() },
              ].map(s => (
                <div key={s.label} className="bg-[#142d1e] rounded-xl p-3">
                  <div className="text-[10px] text-[#9ab8a4] uppercase tracking-wider mb-1">{s.label}</div>
                  <div className="text-[14px] text-[#f0ece0] capitalize font-medium">{s.value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full btn-primary py-3 rounded-xl text-[14px] font-medium disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Preferences to Account'}
            </button>
          </div>
        )}

        {/* Premium */}
        {user?.subscription === 'free' && (
          <div className="bg-gradient-to-br from-gold-900/30 to-emerald-900/20 border border-gold-500/30 rounded-2xl p-5 mb-4">
            <div className="text-[11px] text-gold-400 uppercase tracking-widest mb-3">Upgrade to Premium</div>
            <ul className="space-y-2 mb-5">
              {[
                'Unlimited questions per day',
                'Scholar-verified answers priority',
                'Advanced madhhab comparison',
                'Waswasa therapy module',
                'Offline mode',
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-[#f0ece0]">
                  <span className="text-gold-400">✦</span> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-3 text-center">
              <div className="flex-1 bg-gold-500/10 rounded-xl py-2 px-3">
                <div className="text-gold-400 font-display text-lg">$7</div>
                <div className="text-[10px] text-[#9ab8a4]">/month Global</div>
              </div>
              <div className="flex-1 bg-gold-500/10 rounded-xl py-2 px-3">
                <div className="text-gold-400 font-display text-lg">₹299</div>
                <div className="text-[10px] text-[#9ab8a4]">/month India</div>
              </div>
            </div>
            <button className="w-full mt-4 btn-primary py-3 rounded-xl text-[14px] font-medium">
              Upgrade Now
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-[#0f2d1c]/50 border border-[#1e4a2e]/50 rounded-xl p-4 text-center">
          <p className="text-[11px] text-[#9ab8a4]/60 italic leading-relaxed">
            ⚠️ Qareen provides educational guidance only and is not a substitute for a qualified Islamic scholar.
            Always consult a reliable scholar for personal rulings.
          </p>
        </div>
      </div>
    </div>
  )
}
