'use client'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'

const DHIKR_LIST = [
  { id: 'subhanallah',    arabic: 'سُبْحَانَ اللَّهِ',      transliteration: 'SubhanAllah',          meaning: 'Glory be to Allah',              target: 33, color: '#2d9e5f' },
  { id: 'alhamdulillah',  arabic: 'الْحَمْدُ لِلَّهِ',      transliteration: 'Alhamdulillah',         meaning: 'All praise be to Allah',         target: 33, color: '#d4a853' },
  { id: 'allahuakbar',    arabic: 'اللَّهُ أَكْبَرُ',       transliteration: 'Allahu Akbar',          meaning: 'Allah is the Greatest',          target: 34, color: '#8b5cf6' },
  { id: 'lailahaillallah',arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah',   meaning: 'There is no god but Allah',      target: 100, color: '#3b82f6' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ',   transliteration: 'Astaghfirullah',        meaning: 'I seek forgiveness from Allah',  target: 100, color: '#ef4444' },
  { id: 'salawat',        arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', transliteration: 'Allahumma salli ala Muhammad', meaning: 'Blessings on the Prophet ﷺ', target: 100, color: '#f59e0b' },
  { id: 'hawqala',        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wala quwwata illa billah', meaning: 'No power except with Allah', target: 100, color: '#06b6d4' },
]

const TASBEEH_HADITH = "The Messenger ﷺ said: 'Two words are light on the tongue, heavy on the scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil Adheem.' — Sahih al-Bukhari 6682"

export default function DhikrPage() {
  const [selected, setSelected] = useState(DHIKR_LIST[0])
  const [count, setCount] = useState(0)
  const [sessions, setSessions] = useState<{ id: string; count: number }[]>([])
  const [totalToday, setTotalToday] = useState(0)
  const [vibrate, setVibrate] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('qareen_dhikr_sessions')
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('qareen_dhikr_date')
    if (saved && savedDate === today) {
      const s = JSON.parse(saved)
      setSessions(s)
      setTotalToday(s.reduce((a: number, b: any) => a + b.count, 0))
    } else {
      localStorage.setItem('qareen_dhikr_date', today)
    }
  }, [])

  const saveSessions = (s: { id: string; count: number }[]) => {
    localStorage.setItem('qareen_dhikr_sessions', JSON.stringify(s))
    setTotalToday(s.reduce((a, b) => a + b.count, 0))
  }

  const tap = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(30)
    setVibrate(true)
    setTimeout(() => setVibrate(false), 100)

    const next = count + 1
    setCount(next)

    // Update sessions
    setSessions(prev => {
      const existing = prev.find(s => s.id === selected.id)
      const updated = existing
        ? prev.map(s => s.id === selected.id ? { ...s, count: s.count + 1 } : s)
        : [...prev, { id: selected.id, count: 1 }]
      saveSessions(updated)
      return updated
    })

    if (next >= selected.target) {
      setCompleted(true)
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200])
    }
  }, [count, selected])

  const reset = () => { setCount(0); setCompleted(false) }

  const switchDhikr = (d: typeof DHIKR_LIST[0]) => {
    setSelected(d); setCount(0); setCompleted(false)
  }

  const progress = Math.min((count / selected.target) * 100, 100)

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-10 pb-28">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📿</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-1">Dhikr Counter</h1>
          <p className="text-[#9ab8a4] text-[13px]">Digital Tasbeeh · {totalToday} total today</p>
        </div>

        {/* Dhikr selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {DHIKR_LIST.map(d => (
            <button key={d.id} onClick={() => switchDhikr(d)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] border transition-all"
              style={{
                background: selected.id === d.id ? d.color + '22' : '#0f2d1c',
                border: `1px solid ${selected.id === d.id ? d.color : '#1e4a2e'}`,
                color: selected.id === d.id ? d.color : '#9ab8a4',
              }}>
              {d.transliteration}
            </button>
          ))}
        </div>

        {/* Main counter card */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-3xl p-6 mb-4 text-center">
          {/* Arabic text */}
          <p className="text-3xl leading-loose mb-1" style={{ fontFamily: 'serif', color: selected.color, direction: 'rtl' }}>
            {selected.arabic}
          </p>
          <p className="text-[13px] text-[#9ab8a4] mb-1">{selected.transliteration}</p>
          <p className="text-[11px] text-[#9ab8a4]/60 italic mb-6">{selected.meaning}</p>

          {/* Count */}
          <div className="font-display text-7xl mb-2" style={{ color: completed ? '#d4a853' : '#f0ece0' }}>
            {count}
          </div>
          <p className="text-[#9ab8a4] text-[13px] mb-4">of {selected.target}</p>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-[#142d1e] mb-6 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: selected.color }} />
          </div>

          {completed && (
            <div className="mb-4 px-4 py-2 rounded-full text-[13px] font-medium inline-block"
              style={{ background: '#d4a853' + '22', color: '#d4a853', border: '1px solid #d4a853' + '44' }}>
              🎉 Completed! Masha'Allah
            </div>
          )}

          {/* TAP BUTTON */}
          <button onClick={tap}
            className="w-full py-6 rounded-2xl text-[18px] font-medium text-white transition-all active:scale-95 select-none"
            style={{
              background: `linear-gradient(135deg, ${selected.color}, ${selected.color}99)`,
              transform: vibrate ? 'scale(0.97)' : 'scale(1)',
              boxShadow: `0 8px 32px ${selected.color}33`,
            }}>
            Tap to Count
          </button>

          <button onClick={reset} className="mt-3 text-[12px] text-[#9ab8a4] hover:text-[#f0ece0] transition-colors">
            ↺ Reset
          </button>
        </div>

        {/* Session summary */}
        {sessions.length > 0 && (
          <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4 mb-4">
            <p className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-3">Today's Sessions</p>
            {sessions.map(s => {
              const dhikr = DHIKR_LIST.find(d => d.id === s.id)
              if (!dhikr || s.count === 0) return null
              return (
                <div key={s.id} className="flex justify-between items-center py-2 border-b border-[#142d1e] last:border-0">
                  <span className="text-[13px] text-[#f0ece0]">{dhikr.transliteration}</span>
                  <span className="font-display text-lg" style={{ color: dhikr.color }}>{s.count}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Hadith */}
        <div className="border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
          <p className="text-[11px] text-[#d4a853] uppercase tracking-widest mb-2">📜 Hadith on Dhikr</p>
          <p className="text-[12px] text-[#9ab8a4] leading-relaxed italic">{TASBEEH_HADITH}</p>
        </div>
      </div>
    </div>
  )
}
