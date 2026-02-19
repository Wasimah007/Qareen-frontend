'use client'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'

// ── Types ──────────────────────────────────────────────────────────────────
const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const
type Prayer = typeof PRAYERS[number]
type DayLog = { date: string; missed: Prayer[]; made_up: Prayer[] }
type AllLogs = Record<string, DayLog>

const PRAYER_COLORS: Record<Prayer, string> = {
  Fajr: '#3b82f6', Dhuhr: '#f59e0b', Asr: '#8b5cf6', Maghrib: '#ef4444', Isha: '#6366f1'
}
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getKey(d: Date) { return d.toISOString().split('T')[0] }
function today() { return getKey(new Date()) }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }

// ── Bar Chart Component ──────────────────────────────────────────────────
function BarChart({ data, maxVal, color = '#d4a853', label }: {
  data: { key: string; val: number; label: string }[]
  maxVal: number
  color?: string
  label: string
}) {
  if (data.length === 0) return null
  const mx = Math.max(maxVal, 1)
  const H = 80

  return (
    <div>
      <p className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end gap-1 overflow-x-auto pb-2" style={{ minHeight: H + 24 }}>
        {data.map(d => {
          const pct = d.val / mx
          const barH = Math.max(pct * H, d.val > 0 ? 4 : 2)
          return (
            <div key={d.key} className="flex flex-col items-center gap-1 shrink-0" style={{ minWidth: 24 }}>
              <span className="text-[9px]" style={{ color: d.val > 0 ? color : 'transparent' }}>{d.val || ''}</span>
              <div className="w-5 rounded-t-sm transition-all"
                style={{ height: barH, background: d.val > 0 ? color : '#1e4a2e', opacity: d.val > 0 ? 1 : 0.4 }} />
              <span className="text-[9px] text-[#9ab8a4]/60 rotate-0">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ missed, total }: { missed: number; total: number }) {
  const r = 36, cx = 44, cy = 44, circumference = 2 * Math.PI * r
  const attended = total - missed
  const pct = total > 0 ? attended / total : 1
  const dash = pct * circumference

  return (
    <svg width={88} height={88} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e4a2e" strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={missed === 0 ? '#22c55e' : missed < 5 ? '#f59e0b' : '#ef4444'}
        strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#f0ece0">
        {total > 0 ? Math.round(pct * 100) : 100}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="#9ab8a4">on time</text>
    </svg>
  )
}

export default function MissedPrayersPage() {
  const [logs, setLogs] = useState<AllLogs>({})
  const [selectedDate, setSelectedDate] = useState(today())
  const [view, setView] = useState<'today'|'month'|'year'>('today')
  const [tab, setTab] = useState<'missed'|'makeup'>('missed')

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('qareen_missed_prayers')
    if (saved) setLogs(JSON.parse(saved))
  }, [])

  const saveLogs = (newLogs: AllLogs) => {
    setLogs(newLogs)
    localStorage.setItem('qareen_missed_prayers', JSON.stringify(newLogs))
  }

  const getDay = (date: string): DayLog =>
    logs[date] || { date, missed: [], made_up: [] }

  const togglePrayer = (date: string, prayer: Prayer, type: 'missed' | 'made_up') => {
    const day = getDay(date)
    const list = day[type]
    const newList = list.includes(prayer)
      ? list.filter(p => p !== prayer)
      : [...list, prayer]
    saveLogs({ ...logs, [date]: { ...day, [type]: newList } })
  }

  // ── Stats for current day ──────────────────────────────────────────────
  const todayLog = getDay(selectedDate)
  const todayMissed = todayLog.missed.length
  const todayMadeUp = todayLog.made_up.filter(p => todayLog.missed.includes(p)).length

  // ── Monthly data ────────────────────────────────────────────────────────
  const monthData = useMemo(() => {
    const days = daysInMonth(viewYear, viewMonth)
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(viewYear, viewMonth, i + 1)
      const k = getKey(d)
      const log = logs[k]
      return { key: k, val: log?.missed.length || 0, label: String(i + 1) }
    })
  }, [logs, viewYear, viewMonth])

  const monthTotal = monthData.reduce((a, b) => a + b.val, 0)
  const monthMax = Math.max(...monthData.map(d => d.val), 1)

  // ── Yearly data ─────────────────────────────────────────────────────────
  const yearData = useMemo(() => {
    return MONTHS.map((label, mi) => {
      const days = daysInMonth(viewYear, mi)
      let val = 0
      for (let d = 1; d <= days; d++) {
        const k = getKey(new Date(viewYear, mi, d))
        val += logs[k]?.missed.length || 0
      }
      return { key: `${viewYear}-${mi}`, val, label }
    })
  }, [logs, viewYear])

  const yearTotal = yearData.reduce((a, b) => a + b.val, 0)
  const yearMax = Math.max(...yearData.map(d => d.val), 1)

  // ── Per-prayer breakdown ────────────────────────────────────────────────
  const perPrayerMonth = useMemo(() => {
    const counts: Record<Prayer, number> = { Fajr:0, Dhuhr:0, Asr:0, Maghrib:0, Isha:0 }
    monthData.forEach(d => {
      const log = logs[d.key]
      log?.missed.forEach(p => counts[p]++)
    })
    return counts
  }, [logs, monthData])

  // ── All-time total missed ───────────────────────────────────────────────
  const allTimeMissed = Object.values(logs).reduce((a, l) => a + l.missed.length, 0)
  const allTimeMadeUp = Object.values(logs).reduce((a, l) => a + l.made_up.length, 0)
  const totalPrayers5PerDay = Object.keys(logs).length * 5
  const attendedAll = totalPrayers5PerDay - allTimeMissed

  const PrayerButton = ({ prayer, type, date }: { prayer: Prayer; type: 'missed'|'made_up'; date: string }) => {
    const log = getDay(date)
    const active = log[type].includes(prayer)
    const color = PRAYER_COLORS[prayer]
    return (
      <button onClick={() => togglePrayer(date, prayer, type)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] transition-all"
        style={{
          background: active ? color + '22' : '#0f2d1c',
          border: `1px solid ${active ? color : '#1e4a2e'}`,
          color: active ? color : '#9ab8a4',
        }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: active ? color : '#1e4a2e' }} />
        {prayer}
        {active && <span className="text-[10px]">{type === 'missed' ? '✕' : '✓'}</span>}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-28">

        {/* Header */}
        <div className="mb-8">
          <div className="text-4xl mb-3">🕌</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-1">Prayer Tracker</h1>
          <p className="text-[#9ab8a4] text-[13px]">Track missed & made-up prayers — daily, monthly, yearly</p>
        </div>

        {/* All-time summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Missed',   val: allTimeMissed,  color: '#ef4444' },
            { label: 'Made Up',        val: allTimeMadeUp,  color: '#22c55e' },
            { label: 'Pending Qadha', val: Math.max(0, allTimeMissed - allTimeMadeUp), color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-3 text-center">
              <div className="font-display text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
              <p className="text-[10px] text-[#9ab8a4]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* View tabs */}
        <div className="flex gap-2 mb-6">
          {(['today','month','year'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="flex-1 py-2 rounded-xl text-[13px] border capitalize transition-all"
              style={{ background: view===v ? '#d4a85322' : '#0f2d1c', border:`1px solid ${view===v ? '#d4a853' : '#1e4a2e'}`, color: view===v ? '#d4a853' : '#9ab8a4' }}>
              {v}
            </button>
          ))}
        </div>

        {/* ── TODAY VIEW ── */}
        {view === 'today' && (
          <div className="space-y-4">
            {/* Date picker */}
            <div className="flex items-center justify-between bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl px-4 py-3">
              <p className="text-[#f0ece0] text-[14px]">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
              </p>
              <input type="date" value={selectedDate}
                max={today()}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-[#9ab8a4] text-[12px] focus:outline-none cursor-pointer" />
            </div>

            {/* Donut + quick stats */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4 flex items-center gap-4">
              <DonutChart missed={todayMissed} total={5} />
              <div>
                <p className="text-[#f0ece0] font-medium text-[15px] mb-2">
                  {todayMissed === 0 ? '🎉 All prayers on time!' : `${todayMissed} prayer${todayMissed > 1 ? 's' : ''} missed`}
                </p>
                <p className="text-[#9ab8a4] text-[12px]">{5 - todayMissed} prayed on time</p>
                {todayMissed > 0 && <p className="text-[#2d9e5f] text-[12px]">{todayMadeUp} made up (qadha)</p>}
              </div>
            </div>

            {/* Tab: missed / made up */}
            <div className="flex gap-2">
              {(['missed','makeup'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-xl text-[13px] border transition-all capitalize"
                  style={{ background: tab===t ? '#d4a85322' : '#0f2d1c', border:`1px solid ${tab===t ? '#d4a853' : '#1e4a2e'}`, color: tab===t ? '#d4a853' : '#9ab8a4' }}>
                  {t === 'missed' ? `✕ Missed (${todayMissed})` : `✓ Made Up (${todayMadeUp})`}
                </button>
              ))}
            </div>

            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4">
              <p className="text-[#9ab8a4] text-[12px] mb-3">
                {tab === 'missed' ? 'Tap prayers you missed today:' : 'Tap prayers you have made up (qadha):'}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRAYERS.map(p => (
                  <PrayerButton key={p} prayer={p} type={tab === 'missed' ? 'missed' : 'made_up'} date={selectedDate} />
                ))}
              </div>
            </div>

            {/* Reminder */}
            {todayMissed > 0 && (
              <div className="border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
                <p className="text-[11px] text-[#d4a853] uppercase tracking-widest mb-1">📜 Reminder</p>
                <p className="text-[12px] text-[#9ab8a4] leading-relaxed italic">
                  "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. 
                  If it is sound, then the rest of his deeds will be sound." — At-Tabarani [Sahih]
                </p>
                <p className="text-[12px] text-[#2d9e5f] mt-2">
                  Make up missed prayers as soon as possible. Qadha prayers are still accepted.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── MONTH VIEW ── */}
        {view === 'month' && (
          <div className="space-y-4">
            {/* Month nav */}
            <div className="flex items-center justify-between bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl px-4 py-3">
              <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) } else setViewMonth(m => m-1) }}
                className="text-[#9ab8a4] hover:text-[#f0ece0] px-2 py-1">←</button>
              <p className="text-[#f0ece0] font-medium">{MONTHS[viewMonth]} {viewYear}</p>
              <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) } else setViewMonth(m => m+1) }}
                className="text-[#9ab8a4] hover:text-[#f0ece0] px-2 py-1">→</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4 text-center">
                <div className="font-display text-4xl text-[#ef4444] mb-1">{monthTotal}</div>
                <p className="text-[11px] text-[#9ab8a4]">Total missed in {MONTHS[viewMonth]}</p>
              </div>
              <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4 text-center">
                <div className="font-display text-4xl text-[#22c55e] mb-1">
                  {daysInMonth(viewYear, viewMonth) * 5 - monthTotal}
                </div>
                <p className="text-[11px] text-[#9ab8a4]">Prayed on time</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 overflow-hidden">
              <BarChart data={monthData} maxVal={monthMax} color="#ef4444" label={`Daily missed — ${MONTHS[viewMonth]} ${viewYear}`} />
            </div>

            {/* Per-prayer breakdown */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5">
              <p className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-4">Missed by prayer — {MONTHS[viewMonth]}</p>
              {PRAYERS.map(p => {
                const val = perPrayerMonth[p]
                const pct = daysInMonth(viewYear, viewMonth) > 0 ? val / daysInMonth(viewYear, viewMonth) : 0
                return (
                  <div key={p} className="mb-3">
                    <div className="flex justify-between text-[13px] mb-1">
                      <span style={{ color: PRAYER_COLORS[p] }}>{p}</span>
                      <span className="text-[#9ab8a4]">{val} day{val !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#142d1e] overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct * 100}%`, background: PRAYER_COLORS[p] }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Calendar grid */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4">
              <p className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-3">Calendar view</p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S','M','T','W','T','F','S'].map((d,i) => (
                  <div key={i} className="text-[10px] text-[#9ab8a4]/50 py-1">{d}</div>
                ))}
                {/* Offset for first day */}
                {Array.from({ length: new Date(viewYear, viewMonth, 1).getDay() }).map((_,i) => (
                  <div key={`empty-${i}`} />
                ))}
                {monthData.map((d, i) => {
                  const missed = d.val
                  const bg = missed === 0 ? '#142d1e' : missed <= 2 ? '#78350f' : '#7f1d1d'
                  const color = missed === 0 ? '#2d9e5f' : missed <= 2 ? '#f59e0b' : '#ef4444'
                  return (
                    <button key={d.key}
                      onClick={() => { setSelectedDate(d.key); setView('today') }}
                      className="aspect-square rounded-lg flex items-center justify-center text-[11px] transition-all hover:scale-110"
                      style={{ background: bg, color }}>
                      {i + 1}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-3 justify-end">
                {[['#142d1e','#2d9e5f','All prayed'],['#78350f','#f59e0b','1-2 missed'],['#7f1d1d','#ef4444','3+ missed']].map(([bg,c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: bg }} />
                    <span className="text-[10px]" style={{ color: c }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── YEAR VIEW ── */}
        {view === 'year' && (
          <div className="space-y-4">
            {/* Year nav */}
            <div className="flex items-center justify-between bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl px-4 py-3">
              <button onClick={() => setViewYear(y => y - 1)} className="text-[#9ab8a4] hover:text-[#f0ece0] px-2 py-1">←</button>
              <p className="text-[#f0ece0] font-medium">{viewYear}</p>
              <button onClick={() => setViewYear(y => y + 1)} className="text-[#9ab8a4] hover:text-[#f0ece0] px-2 py-1">→</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Missed in ' + viewYear, val: yearTotal,            color: '#ef4444' },
                { label: 'Prayed on time',         val: 365 * 5 - yearTotal, color: '#22c55e' },
                { label: 'Adherence rate',         val: `${Math.round((1 - yearTotal / (365 * 5)) * 100)}%`, color: '#d4a853' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-3 text-center">
                  <div className="font-display text-2xl mb-1" style={{ color: s.color }}>{s.val}</div>
                  <p className="text-[10px] text-[#9ab8a4]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 overflow-hidden">
              <BarChart data={yearData} maxVal={yearMax} color="#ef4444" label={`Monthly missed prayers — ${viewYear}`} />
            </div>

            {/* Best / worst months */}
            {yearTotal > 0 && (() => {
              const sorted = [...yearData].sort((a, b) => b.val - a.val)
              const worst = sorted[0]
              const best = [...yearData].filter(d => d.val === 0)
              return (
                <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4">
                  <p className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-3">Insights</p>
                  {worst.val > 0 && (
                    <div className="flex justify-between text-[13px] py-2 border-b border-[#142d1e]">
                      <span className="text-[#9ab8a4]">Hardest month</span>
                      <span className="text-[#ef4444]">{worst.label} ({worst.val} missed)</span>
                    </div>
                  )}
                  {best.length > 0 && (
                    <div className="flex justify-between text-[13px] py-2">
                      <span className="text-[#9ab8a4]">Perfect month(s)</span>
                      <span className="text-[#22c55e]">{best.map(b => b.label).join(', ')}</span>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Monthly table */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 px-4 py-2 border-b border-[#1e4a2e]">
                <span className="text-[10px] text-[#9ab8a4] uppercase tracking-wider">Month</span>
                <span className="text-[10px] text-[#9ab8a4] uppercase tracking-wider text-center">Missed</span>
                <span className="text-[10px] text-[#9ab8a4] uppercase tracking-wider text-right">Rate</span>
              </div>
              {yearData.map(m => {
                const days = daysInMonth(viewYear, MONTHS.indexOf(m.label))
                const rate = Math.round((1 - m.val / (days * 5)) * 100)
                return (
                  <div key={m.key} className="grid grid-cols-3 px-4 py-2.5 border-b border-[#142d1e] last:border-0">
                    <span className="text-[13px] text-[#f0ece0]">{m.label}</span>
                    <span className="text-[13px] text-center" style={{ color: m.val === 0 ? '#22c55e' : m.val < 10 ? '#f59e0b' : '#ef4444' }}>
                      {m.val}
                    </span>
                    <span className="text-[13px] text-right" style={{ color: rate >= 95 ? '#22c55e' : rate >= 80 ? '#f59e0b' : '#ef4444' }}>
                      {rate}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Hadith footer */}
        <div className="mt-8 border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
          <p className="text-[10px] text-[#d4a853] uppercase tracking-widest mb-2">📜 On Qadha Prayers</p>
          <p className="text-[13px] text-[#f0ece0] italic leading-relaxed mb-1">
            "Whoever forgets a prayer, or sleeps through it, the expiation is to pray it when he remembers it."
          </p>
          <p className="text-[11px] text-[#9ab8a4]">— Sahih Muslim 684, narrated by Anas ibn Malik (RA)</p>
        </div>
      </div>
    </div>
  )
}
