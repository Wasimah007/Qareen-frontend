'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'

interface PrayerTimes {
  Fajr: string; Sunrise: string; Dhuhr: string; Asr: string
  Sunset: string; Maghrib: string; Isha: string; Midnight: string
}

const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌙', Sunrise: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌇', Isha: '🌃'
}
const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const PRAYER_DESC: Record<string, string> = {
  Fajr: 'Dawn prayer — before sunrise', Sunrise: 'Forbidden prayer time',
  Dhuhr: 'Midday prayer', Asr: 'Afternoon prayer',
  Maghrib: 'Sunset prayer', Isha: 'Night prayer'
}

function to12h(t: string) {
  if (!t) return '--:--'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

function getNextPrayer(times: PrayerTimes) {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const [h, m] = (times[name as keyof PrayerTimes] || '').split(':').map(Number)
    if (!isNaN(h) && h * 60 + m > nowMins) return name
  }
  return 'Fajr' // Next day
}

export default function PrayerTimesPage() {
  const [times, setTimes] = useState<PrayerTimes | null>(null)
  const [city, setCity] = useState('')
  const [date, setDate] = useState('')
  const [hijri, setHijri] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) { fetchByCity('Mecca', 21.3891, 39.8579); return }
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      ()  => fetchByCity('Mecca', 21.3891, 39.8579)
    )
  }, [])

  async function fetchByCoords(lat: number, lng: number) {
    try {
      const d = new Date()
      const dateStr = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`)
      const data = await res.json()
      if (data.code === 200) {
        setTimes(data.data.timings)
        setCity(data.data.meta.timezone.split('/').pop()?.replace('_', ' ') || 'Your Location')
        setDate(data.data.date.readable)
        setHijri(`${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} AH`)
      }
    } catch { setError('Could not load prayer times.') }
    finally { setLoading(false) }
  }

  async function fetchByCity(name: string, lat: number, lng: number) {
    setCity(name); await fetchByCoords(lat, lng)
  }

  const next = times ? getNextPrayer(times) : null

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 pb-28">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🕌</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-2">Prayer Times</h1>
          {city && <p className="text-[#9ab8a4] text-[14px]">📍 {city}</p>}
          {date && <p className="text-[#9ab8a4] text-[12px] mt-1">{date}</p>}
          {hijri && <p className="text-[#d4a853] text-[11px] mt-1 italic">{hijri}</p>}
        </div>

        {/* Live Clock */}
        <div className="text-center mb-8">
          <div className="font-display text-5xl text-[#f0ece0] mb-1">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          {next && times && (
            <p className="text-[13px] text-[#d4a853]">
              Next: {PRAYER_ICONS[next]} {next} at {to12h(times[next as keyof PrayerTimes])}
            </p>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-16 rounded-xl bg-[#0f2d1c] border border-[#1e4a2e] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-red-300 text-[13px] text-center">{error}</div>
        )}

        {times && !loading && (
          <div className="space-y-3">
            {PRAYER_NAMES.map(name => {
              const t = times[name as keyof PrayerTimes]
              const isNext = name === next
              const isSunrise = name === 'Sunrise'
              return (
                <div key={name}
                  className="flex items-center justify-between p-4 rounded-xl border transition-all"
                  style={{
                    background: isNext ? 'rgba(212,168,83,0.08)' : '#0f2d1c',
                    border: isNext ? '1px solid rgba(212,168,83,0.4)' : '1px solid #1e4a2e',
                  }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{PRAYER_ICONS[name]}</span>
                    <div>
                      <p className={`font-medium text-[15px] ${isNext ? 'text-[#d4a853]' : 'text-[#f0ece0]'}`}>{name}</p>
                      <p className="text-[11px] text-[#9ab8a4]">{PRAYER_DESC[name]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-[18px] ${isNext ? 'text-[#d4a853]' : isSunrise ? 'text-[#9ab8a4]' : 'text-[#f0ece0]'}`}>
                      {to12h(t)}
                    </p>
                    {isNext && <p className="text-[10px] text-[#d4a853]">↑ Next</p>}
                    {isSunrise && <p className="text-[10px] text-[#9ab8a4]">Not obligatory</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Hadith about prayer */}
        <div className="mt-8 border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
          <p className="text-[12px] text-[#d4a853] uppercase tracking-widest mb-2">📜 Hadith on Prayer</p>
          <p className="text-[13px] text-[#f0ece0] italic leading-relaxed mb-1">
            "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound."
          </p>
          <p className="text-[11px] text-[#9ab8a4]">— At-Tabarani [Sahih]</p>
        </div>

        {/* Manual city buttons */}
        <div className="mt-6">
          <p className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-3">Quick Cities</p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Mecca',    lat: 21.3891, lng: 39.8579 },
              { name: 'Medina',  lat: 24.5247, lng: 39.5692 },
              { name: 'Istanbul',lat: 41.0082, lng: 28.9784 },
              { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
              { name: 'Cairo',   lat: 30.0444, lng: 31.2357 },
              { name: 'London',  lat: 51.5074, lng: -0.1278 },
            ].map(c => (
              <button key={c.name} onClick={() => { setLoading(true); fetchByCity(c.name, c.lat, c.lng) }}
                className="text-[12px] bg-[#0f2d1c] border border-[#1e4a2e] hover:border-[#d4a853]/50 rounded-full px-3 py-1.5 text-[#9ab8a4] hover:text-[#d4a853] transition-all">
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
