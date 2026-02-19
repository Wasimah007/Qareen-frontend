'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ questions: 0, savedHadiths: 0, savedDuas: 0, dhikrTotal: 0 })
  const [tab, setTab] = useState<'profile'|'stats'|'about'>('profile')

  useEffect(() => {
    const u = localStorage.getItem('qareen_current_user')
    if (u) setUser(JSON.parse(u))
    // Compute stats
    const dhikrSessions = localStorage.getItem('qareen_dhikr_sessions')
    const savedHadiths = localStorage.getItem('qareen_saved_hadiths')
    const savedDuas = localStorage.getItem('qareen_saved_duas')
    const qHistory = localStorage.getItem('qareen_question_history')
    setStats({
      questions: qHistory ? JSON.parse(qHistory).length : 0,
      savedHadiths: savedHadiths ? JSON.parse(savedHadiths).length : 0,
      savedDuas: savedDuas ? JSON.parse(savedDuas).length : 0,
      dhikrTotal: dhikrSessions ? JSON.parse(dhikrSessions).reduce((a: number, b: any) => a + b.count, 0) : 0,
    })
  }, [])

  const logout = () => {
    localStorage.removeItem('qareen_current_user')
    router.push('/auth/login')
  }

  const avatar = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 pb-28">

        {/* Header card */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-6 mb-6 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl text-white mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #2d9e5f, #d4a853)' }}>
            {avatar}
          </div>
          <h1 className="font-display text-2xl text-[#f0ece0] mb-1">{user?.full_name || user?.username || 'Guest'}</h1>
          <p className="text-[#9ab8a4] text-[13px] mb-1">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 text-[#d4a853] capitalize">
              {user?.role || 'user'} · {user?.subscription || 'free'} plan
            </span>
          </div>
          {user?.preferred_madhhab && user.preferred_madhhab !== 'General' && (
            <p className="text-[12px] text-[#9ab8a4] mt-2">Madhhab: {user.preferred_madhhab}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{v:'profile',l:'Profile'},{v:'stats',l:'Stats'},{v:'about',l:'About'}].map(t => (
            <button key={t.v} onClick={() => setTab(t.v as any)}
              className="flex-1 py-2 rounded-xl text-[13px] border transition-all"
              style={{ background: tab===t.v ? '#d4a85322' : '#0f2d1c', border:`1px solid ${tab===t.v ? '#d4a853' : '#1e4a2e'}`, color: tab===t.v ? '#d4a853' : '#9ab8a4' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="space-y-3">
            {[
              { label:'Username', value: user?.username || '—' },
              { label:'Email',    value: user?.email || '—' },
              { label:'Full Name', value: user?.full_name || '—' },
              { label:'Madhhab',  value: user?.preferred_madhhab || 'General' },
              { label:'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en', { year:'numeric', month:'long', day:'numeric' }) : '—' },
            ].map(f => (
              <div key={f.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-[12px] text-[#9ab8a4] uppercase tracking-wider">{f.label}</span>
                <span className="text-[14px] text-[#f0ece0]">{f.value}</span>
              </div>
            ))}

            <div className="pt-4 space-y-3">
              <Link href="/settings"
                className="block w-full py-3 text-center rounded-xl text-[14px] border border-[#1e4a2e] text-[#9ab8a4] hover:text-[#f0ece0] no-underline transition-all">
                ⚙️ Settings
              </Link>
              {user ? (
                <button onClick={logout}
                  className="w-full py-3 rounded-xl text-[14px] border text-red-400 border-red-700/30 hover:bg-red-900/20 transition-all">
                  Sign Out
                </button>
              ) : (
                <Link href="/auth/login"
                  className="block w-full py-3 text-center rounded-xl text-[14px] text-white no-underline transition-all"
                  style={{ background:'linear-gradient(135deg,#2d9e5f,#3ec97a)' }}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'💬', label:'Questions Asked', value: stats.questions, color:'#2d9e5f' },
                { icon:'📿', label:'Total Dhikr',     value: stats.dhikrTotal.toLocaleString(), color:'#d4a853' },
                { icon:'📜', label:'Saved Hadiths',   value: stats.savedHadiths, color:'#3b82f6' },
                { icon:'🤲', label:'Saved Duas',      value: stats.savedDuas,    color:'#8b5cf6' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-display text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
                  <p className="text-[11px] text-[#9ab8a4]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-5">
              <p className="text-[12px] text-[#d4a853] uppercase tracking-widest mb-3">Plan Features</p>
              {[
                { feature:'Daily Questions', free:'5/day', premium:'Unlimited' },
                { feature:'Waswasa Tool',    free:'✓',     premium:'✓ + Priority' },
                { feature:'Scholar Verified',free:'—',     premium:'✓' },
                { feature:'History',         free:'Last 20', premium:'Unlimited' },
              ].map(p => (
                <div key={p.feature} className="flex justify-between py-2 border-b border-[#142d1e] last:border-0 text-[13px]">
                  <span className="text-[#9ab8a4]">{p.feature}</span>
                  <div className="flex gap-4">
                    <span className="text-[#9ab8a4]/60 w-16 text-center">{p.free}</span>
                    <span className="text-[#d4a853] w-16 text-center">{p.premium}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-4 text-[10px] mt-2 text-[#9ab8a4]/40">
                <span>FREE</span><span className="text-[#d4a853]">PREMIUM</span>
              </div>
            </div>
            <button className="w-full py-3.5 rounded-xl text-[14px] font-medium text-white transition-all"
              style={{ background:'linear-gradient(135deg,#d4a853,#c9943b)' }}>
              ✨ Upgrade to Premium — $7/month
            </button>
          </div>
        )}

        {/* About tab */}
        {tab === 'about' && (
          <div className="space-y-4">
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-5">
              <div className="text-center mb-4">
                <div className="font-display text-4xl text-[#d4a853] mb-1">Qareen</div>
                <div className="text-[12px] text-[#9ab8a4] italic">قرين — Constant Companion Against Waswasa</div>
              </div>
              <p className="text-[13px] text-[#9ab8a4] leading-relaxed mb-3">
                Qareen provides AI-powered Islamic ethical guidance rooted in Qur'an & authentic Hadith. 
                Every answer is cited. We never claim knowledge of the unseen.
              </p>
              {[
                { icon:'📖', text:'Always cited from Qur\'an & Hadith' },
                { icon:'🎓', text:'Scholar verification workflow' },
                { icon:'🌍', text:'5 languages with RTL support' },
                { icon:'🔒', text:'Your data stays on your device' },
                { icon:'⚖️', text:'Madhhab-aware responses' },
              ].map((f, i) => (
                <div key={i} className="flex gap-3 text-[13px] text-[#9ab8a4] mb-2">
                  <span>{f.icon}</span>{f.text}
                </div>
              ))}
            </div>

            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4">
              <p className="text-[12px] text-[#d4a853] uppercase tracking-widest mb-3">Disclaimer</p>
              <p className="text-[12px] text-[#9ab8a4] leading-relaxed">
                This application provides educational guidance only. It is NOT a substitute for a qualified Islamic scholar. 
                For personal rulings (fatwa), please consult a qualified scholar from a reputable institution.
              </p>
            </div>

            <div className="border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
              <p className="text-[#d4a853] text-lg text-right mb-2" style={{ fontFamily:'serif' }}>وَمَا أُوتِيتُم مِّن الْعِلْمِ إِلَّا قَلِيلًا</p>
              <p className="text-[13px] text-[#f0ece0] italic mb-1">"And you have been given of knowledge only a little."</p>
              <p className="text-[11px] text-[#9ab8a4]">— Qur'an 17:85</p>
            </div>

            <p className="text-center text-[11px] text-[#9ab8a4]/40">Developed by Waseem Reegoo · © 2026 Qareen</p>
          </div>
        )}
      </div>
    </div>
  )
}
