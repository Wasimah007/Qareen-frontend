'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'

const HIJRI_MONTHS = [
  { num:1,  name:'Muharram',    arabic:'مُحَرَّم',    sacred: true,  desc:'Sacred month — one of the four sacred months in Islam.' },
  { num:2,  name:'Safar',       arabic:'صَفَر',       sacred: false, desc:'Month of traveling — named for the emptying of homes.' },
  { num:3,  name:'Rabi al-Awwal', arabic:'رَبِيع الأَوَّل', sacred:false, desc:'Birth month of the Prophet Muhammad ﷺ (12th Rabi al-Awwal).' },
  { num:4,  name:"Rabi' al-Thani", arabic:'رَبِيع الثَّانِي', sacred:false, desc:'Second spring month.' },
  { num:5,  name:'Jumada al-Awwal', arabic:'جُمَادَى الأُولَى', sacred:false, desc:'First month of Jumada.' },
  { num:6,  name:'Jumada al-Thani', arabic:'جُمَادَى الآخِرَة', sacred:false, desc:'Second month of Jumada.' },
  { num:7,  name:'Rajab',        arabic:'رَجَب',       sacred: true,  desc:'Sacred month — a month of worship and preparation.' },
  { num:8,  name:"Sha'ban",      arabic:'شَعْبَان',    sacred: false, desc:'Month of the Prophet ﷺ — he fasted much in this month.' },
  { num:9,  name:'Ramadan',      arabic:'رَمَضَان',    sacred: false, desc:'Month of fasting, Qur\'an revelation, and Laylat al-Qadr.' },
  { num:10, name:'Shawwal',      arabic:'شَوَّال',     sacred: false, desc:'Month of Eid al-Fitr. Six days of fasting are recommended.' },
  { num:11, name:"Dhu'l-Qa'dah", arabic:'ذُو الْقَعْدَة', sacred:true, desc:'Sacred month — one of the four sacred months.' },
  { num:12, name:"Dhu'l-Hijjah", arabic:'ذُو الْحِجَّة', sacred:true, desc:'Month of Hajj — contains the Day of Arafah and Eid al-Adha.' },
]

const EVENTS_2025_26 = [
  { name:'Islamic New Year 1447', arabic:'رأس السنة الهجرية', hijri:'1 Muharram 1447', gregorian:'Jun 26, 2025', icon:'🌙', desc:'Start of the Islamic lunar year.' },
  { name:'Day of Ashura',        arabic:'عاشوراء',            hijri:'10 Muharram 1447', gregorian:'Jul 5, 2025',  icon:'🙏', desc:'Day of fasting — Moses was saved from Pharaoh on this day.' },
  { name:'Prophet\'s Birthday',  arabic:'المولد النبوي',       hijri:'12 Rabi al-Awwal 1447', gregorian:'Sep 4, 2025', icon:'🌹', desc:'Birth of Prophet Muhammad ﷺ.' },
  { name:'Isra\' and Mi\'raj',   arabic:'الإسراء والمعراج',    hijri:'27 Rajab 1447',   gregorian:'Jan 27, 2026', icon:'✨', desc:'The Night Journey and Ascension of the Prophet ﷺ.' },
  { name:'Sha\'ban 15 (Laylat al-Bara\'ah)', arabic:'ليلة البراءة', hijri:'15 Sha\'ban 1447', gregorian:'Feb 12, 2026', icon:'🌟', desc:'Night of forgiveness — many Muslims fast and pray.' },
  { name:'Start of Ramadan',     arabic:'بداية رمضان',         hijri:'1 Ramadan 1447',  gregorian:'Feb 28, 2026', icon:'🌙', desc:'Start of the blessed month of fasting.' },
  { name:'Laylat al-Qadr',       arabic:'ليلة القدر',          hijri:'27 Ramadan 1447', gregorian:'Mar 26, 2026', icon:'⭐', desc:'Night of Power — better than a thousand months (Qur\'an 97:3).' },
  { name:'Eid al-Fitr',          arabic:'عيد الفطر',           hijri:'1 Shawwal 1447',  gregorian:'Mar 30, 2026', icon:'🎉', desc:'Festival of Breaking the Fast after Ramadan.' },
  { name:'Day of Arafah',        arabic:'يوم عرفة',            hijri:'9 Dhu\'l-Hijjah 1447', gregorian:'Jun 25, 2026', icon:'🕌', desc:'The pinnacle of Hajj — fasting on this day expiates two years of sins.' },
  { name:'Eid al-Adha',          arabic:'عيد الأضحى',          hijri:'10 Dhu\'l-Hijjah 1447', gregorian:'Jun 26, 2026', icon:'🐑', desc:'Festival of Sacrifice — commemorating Ibrahim\'s ﷺ devotion.' },
]

function getHijriDate() {
  // Simple approximation using Aladhan data
  return null // Will be fetched from API
}

export default function CalendarPage() {
  const [hijriToday, setHijriToday] = useState<{day:string;month:string;year:string;monthNum:number}>()
  const [tab, setTab] = useState<'events'|'months'>('events')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const d = today.getDate()
    const m = today.getMonth() + 1
    const y = today.getFullYear()
    fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          const h = data.data.hijri
          setHijriToday({ day: h.day, month: h.month.en, year: h.year, monthNum: parseInt(h.month.number) })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const todayGregorian = new Date().toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-28">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗓️</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-2">Islamic Calendar</h1>
          <p className="text-[#9ab8a4] text-[13px]">{todayGregorian}</p>
        </div>

        {/* Today's Hijri Date */}
        <div className="bg-gradient-to-br from-[#0f2d1c] to-[#142d1e] border border-[#1e4a2e] rounded-2xl p-6 mb-8 text-center"
          style={{ boxShadow: '0 0 40px rgba(212,168,83,0.05)' }}>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-10 w-48 bg-[#1e4a2e] rounded mx-auto mb-2" />
              <div className="h-4 w-32 bg-[#1e4a2e] rounded mx-auto" />
            </div>
          ) : hijriToday ? (
            <>
              <p className="text-[11px] text-[#d4a853] uppercase tracking-[4px] mb-2">Today Hijri</p>
              <div className="font-display text-5xl text-[#f0ece0] mb-1">
                {hijriToday.day} {hijriToday.month}
              </div>
              <p className="text-[#d4a853] text-xl">{hijriToday.year} AH</p>
              {(() => {
                const m = HIJRI_MONTHS.find(h => h.num === hijriToday.monthNum)
                return m ? (
                  <div className="mt-3 pt-3 border-t border-[#1e4a2e]">
                    <p className="text-2xl text-[#d4a853] mb-1" style={{ fontFamily:'serif' }}>{m.arabic}</p>
                    {m.sacred && <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 text-[#d4a853]">🌙 Sacred Month</span>}
                  </div>
                ) : null
              })()}
            </>
          ) : (
            <p className="text-[#9ab8a4]">Today's Hijri date</p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {[{v:'events',l:'📅 Upcoming Events'},{v:'months',l:'🌙 Hijri Months'}].map(t => (
            <button key={t.v} onClick={() => setTab(t.v as any)}
              className="flex-1 py-2 rounded-xl text-[13px] border transition-all"
              style={{ background: tab===t.v ? '#d4a85322' : '#0f2d1c', border:`1px solid ${tab===t.v ? '#d4a853' : '#1e4a2e'}`, color: tab===t.v ? '#d4a853' : '#9ab8a4' }}>
              {t.l}
            </button>
          ))}
        </div>

        {tab === 'events' && (
          <div className="space-y-3">
            {EVENTS_2025_26.map((e, i) => (
              <div key={i} className="bg-[#0f2d1c] border border-[#1e4a2e] hover:border-[#d4a853]/30 rounded-xl p-4 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{e.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-[#f0ece0] font-medium text-[14px]">{e.name}</p>
                        <p className="text-[#d4a853] text-[12px]" style={{ fontFamily:'serif' }}>{e.arabic}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#f0ece0] text-[12px]">{e.gregorian}</p>
                        <p className="text-[#9ab8a4] text-[10px]">{e.hijri}</p>
                      </div>
                    </div>
                    <p className="text-[#9ab8a4] text-[12px] mt-2 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'months' && (
          <div className="space-y-3">
            {HIJRI_MONTHS.map(m => (
              <div key={m.num}
                className="bg-[#0f2d1c] border rounded-xl p-4 transition-all"
                style={{ border: `1px solid ${m.sacred ? '#d4a85344' : '#1e4a2e'}`, background: m.sacred ? '#d4a853' + '06' : '#0f2d1c' }}>
                <div className="flex items-center gap-4">
                  <div className="font-display text-3xl w-10 text-center" style={{ color: m.sacred ? '#d4a853' : '#9ab8a4' }}>
                    {m.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[#f0ece0] font-medium text-[14px]">{m.name}</p>
                      <p className="text-[#d4a853]" style={{ fontFamily:'serif' }}>{m.arabic}</p>
                      {m.sacred && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 text-[#d4a853]">Sacred</span>}
                    </div>
                    <p className="text-[#9ab8a4] text-[12px] leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quranic verse about months */}
        <div className="mt-8 border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4">
          <p className="text-[#d4a853] text-lg text-right mb-2" style={{ fontFamily:'serif' }}>
            إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا
          </p>
          <p className="text-[13px] text-[#f0ece0] italic mb-1">"Indeed, the number of months with Allah is twelve months." — Qur'an 9:36</p>
        </div>
      </div>
    </div>
  )
}
