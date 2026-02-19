'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import FourQulModal, { FOUR_QUL } from '@/components/features/FourQulModal'

export default function FourQulPage() {
  const [showModal, setShowModal] = useState(false)
  const [startIdx, setStartIdx] = useState(0)
  const [reminderTime, setReminderTime] = useState('22:00')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default')
  const [saved, setSaved] = useState(false)
  const [lastRead, setLastRead] = useState<string>('')

  useEffect(() => {
    const s = localStorage.getItem('qareen_fourqul_settings')
    if (s) {
      const p = JSON.parse(s)
      setReminderTime(p.time || '22:00')
      setReminderEnabled(p.enabled || false)
    }
    const lr = localStorage.getItem('qareen_fourqul_lastread')
    if (lr) setLastRead(lr)
    if ('Notification' in window) setNotifPermission(Notification.permission)
  }, [])

  const saveSettings = async () => {
    localStorage.setItem('qareen_fourqul_settings', JSON.stringify({ time: reminderTime, enabled: reminderEnabled }))

    if (reminderEnabled && 'Notification' in window && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission()
      setNotifPermission(perm)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const markRead = () => {
    const now = new Date().toLocaleString()
    localStorage.setItem('qareen_fourqul_lastread', now)
    setLastRead(now)
  }

  const openSurah = (idx: number) => {
    setStartIdx(idx)
    setShowModal(true)
  }

  const openAll = () => {
    setStartIdx(0)
    setShowModal(true)
    markRead()
  }

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 pb-28">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌙</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-2">
            Char Qul — چار قل
          </h1>
          <p className="text-[#9ab8a4] text-[13px] max-w-sm mx-auto leading-relaxed">
            The four Quls to recite before sleep for complete protection. 
            The Prophet ﷺ recited these every night, blew into his hands, and wiped over his body.
          </p>
          {lastRead && (
            <p className="text-[#2d9e5f] text-[11px] mt-3">✓ Last read: {lastRead}</p>
          )}
        </div>

        {/* Read All Button */}
        <button onClick={openAll}
          className="w-full py-4 rounded-2xl text-[15px] font-medium text-white mb-6 transition-all active:scale-98"
          style={{ background: 'linear-gradient(135deg,#2d9e5f,#d4a853)', boxShadow: '0 8px 32px rgba(45,158,95,0.25)' }}>
          🌙 Read All 4 Surahs
        </button>

        {/* Individual Surah Cards */}
        <div className="space-y-3 mb-8">
          {FOUR_QUL.map((s, i) => (
            <button key={s.number} onClick={() => openSurah(i)}
              className="w-full bg-[#0f2d1c] border border-[#1e4a2e] hover:border-[#d4a853]/40 rounded-2xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display text-[15px] shrink-0"
                    style={{ background: 'linear-gradient(135deg,#2d9e5f,#d4a853)' }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[#f0ece0] font-medium text-[15px] group-hover:text-[#d4a853] transition-colors">
                      Surah {s.name}
                    </p>
                    <p className="text-[#9ab8a4] text-[12px]">
                      {s.arabic_name} · {s.meaning} · Surah {s.number}
                    </p>
                  </div>
                </div>
                <p className="text-2xl text-[#d4a853]" style={{ fontFamily: 'var(--font-noto-arabic,serif)' }}>
                  {s.arabic.split('\n')[0]}
                </p>
              </div>
              <p className="text-[11px] text-[#9ab8a4]/60 mt-2 ml-14 leading-relaxed">{s.benefit.slice(0, 80)}…</p>
            </button>
          ))}
        </div>

        {/* ── DAILY REMINDER SETTINGS ── */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-6">
          <h2 className="text-[#f0ece0] font-medium text-[15px] mb-1">⏰ Daily Reminder</h2>
          <p className="text-[#9ab8a4] text-[12px] mb-5">
            Get a browser notification to read the 4 Quls before sleep
          </p>

          {/* Enable toggle */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e4a2e]">
            <div>
              <p className="text-[#f0ece0] text-[14px]">Enable reminder</p>
              <p className="text-[#9ab8a4] text-[11px]">Daily notification at set time</p>
            </div>
            <button onClick={() => setReminderEnabled(e => !e)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: reminderEnabled ? '#2d9e5f' : '#1e4a2e' }}>
              <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: reminderEnabled ? '26px' : '2px' }} />
            </button>
          </div>

          {/* Time picker */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#f0ece0] text-[14px]">Reminder time</p>
              <p className="text-[#9ab8a4] text-[11px]">Recommended: 10:00 PM (before sleep)</p>
            </div>
            <input type="time" value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              className="px-3 py-2 rounded-lg text-[14px] text-[#f0ece0] focus:outline-none"
              style={{ background: '#142d1e', border: '1px solid #1e4a2e' }} />
          </div>

          {/* Notification permission status */}
          {reminderEnabled && notifPermission !== 'granted' && (
            <div className="mb-4 px-3 py-2 rounded-lg text-[12px]"
              style={{ background: '#d4a85311', border: '1px solid #d4a85333', color: '#d4a853' }}>
              ⚠️ You'll need to allow notifications when prompted.
            </div>
          )}
          {reminderEnabled && notifPermission === 'granted' && (
            <div className="mb-4 px-3 py-2 rounded-lg text-[12px]"
              style={{ background: '#2d9e5f11', border: '1px solid #2d9e5f33', color: '#2d9e5f' }}>
              ✓ Notifications allowed. Reminder is active.
            </div>
          )}
          {notifPermission === 'denied' && (
            <div className="mb-4 px-3 py-2 rounded-lg text-[12px]"
              style={{ background: '#ef444411', border: '1px solid #ef444433', color: '#fca5a5' }}>
              ❌ Notifications blocked. Please enable them in your browser settings.
            </div>
          )}

          <button onClick={saveSettings}
            className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-all"
            style={{ background: saved ? '#2d9e5f' : 'linear-gradient(135deg,#2d9e5f,#3ec97a)' }}>
            {saved ? '✓ Saved!' : 'Save Reminder Settings'}
          </button>
        </div>

        {/* How the Prophet ﷺ read */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
          <h3 className="text-[#f0ece0] font-medium mb-3">📖 Sunnah Method Before Sleep</h3>
          {[
            'Make wudu (if possible)',
            'Recite Surah Al-Kafirun (Qul ya ayyuhal-kafirun)',
            'Recite Surah Al-Ikhlas 3 times',
            'Recite Surah Al-Falaq 3 times',
            'Recite Surah An-Nas 3 times',
            'Blow gently into both palms',
            'Wipe palms over your face and body (3 times)',
          ].map((s, i) => (
            <div key={i} className="flex gap-3 text-[13px] text-[#9ab8a4] mb-2.5">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#2d9e5f,#d4a853)', minWidth: 20 }}>
                {i + 1}
              </span>
              {s}
            </div>
          ))}
          <p className="text-[11px] text-[#9ab8a4]/50 mt-3 italic">— Sahih al-Bukhari 5017, narrated by Aisha (RA)</p>
        </div>

        {/* Hadith */}
        <div className="border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
          <p className="text-[10px] text-[#d4a853] uppercase tracking-widest mb-2">📜 Hadith</p>
          <p className="text-[13px] text-[#f0ece0] italic leading-relaxed mb-1">
            "Whoever recites the last three surahs of the Qur'an every night, they will suffice him."
          </p>
          <p className="text-[11px] text-[#9ab8a4]">— Jami at-Tirmidhi 2903 [Hasan]</p>
        </div>
      </div>

      {showModal && <FourQulModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
