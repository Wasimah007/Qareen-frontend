'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSettingsStore } from '@/lib/settings'
import { Menu, X, ChevronDown } from 'lucide-react'

const NAV_PRIMARY = [
  { href:'/ask',     label:'Ask' },
  { href:'/waswasa', label:'Waswasa' },
]
const NAV_TOOLS = [
  { href:'/prayer-times', label:'🕌 Prayer Times',  desc:'Live namaz times' },
  { href:'/qibla',        label:'🧭 Qibla',          desc:'Direction to Mecca' },
  { href:'/dhikr',        label:'📿 Dhikr Counter',  desc:'Digital tasbeeh' },
  { href:'/dua',          label:'🤲 Duas',            desc:'Dua collection' },
  { href:'/four-qul',     label:'🌙 Char Qul',         desc:'4 Quls before sleep' },
  { href:'/missed-prayers',label:'🕌 Prayer Tracker',  desc:'Daily prayer log & graphs' },
]
const NAV_LEARN = [
  { href:'/hadith',   label:'📜 Daily Hadith',     desc:'Authentic hadiths' },
  { href:'/calendar', label:'🗓️ Islamic Calendar',  desc:'Hijri dates & events' },
]
const NAV_USER = [
  { href:'/dashboard', label:'📋 Dashboard' },
  { href:'/saved',     label:'🔖 Saved' },
  { href:'/profile',   label:'👤 Profile' },
  { href:'/settings',  label:'⚙️ Settings' },
]
const LANGUAGES = [
  { code:'en', label:'EN' }, { code:'ar', label:'AR' },
  { code:'ur', label:'UR' }, { code:'fr', label:'FR' }, { code:'tr', label:'TR' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage } = useSettingsStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const learnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false)
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) setLearnOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const active = (href: string) => pathname === href

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6 border-b border-[#1e4a2e]"
        style={{ background:'rgba(10,31,20,0.96)', backdropFilter:'blur(12px)' }}>

        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <span className="font-display text-xl" style={{ color:'#d4a853', fontFamily:'Georgia,serif' }}>Qareen</span>
          <span className="hidden sm:block text-[11px] text-[#9ab8a4] italic">Constant Companion</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5 ml-6 flex-1 flex-wrap">
          {NAV_PRIMARY.map(n => (
            <Link key={n.href} href={n.href}
              className="px-3 py-1.5 rounded-full text-[13px] no-underline transition-all"
              style={{ background:active(n.href)?'#2d9e5f22':'transparent', border:`1px solid ${active(n.href)?'#2d9e5f66':'transparent'}`, color:active(n.href)?'#2d9e5f':'#9ab8a4' }}>
              {n.label}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div ref={toolsRef} className="relative">
            <button onClick={() => { setToolsOpen(o=>!o); setLearnOpen(false) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] transition-all"
              style={{ background:toolsOpen?'#d4a85322':'transparent', color:toolsOpen?'#d4a853':'#9ab8a4', border:`1px solid ${toolsOpen?'#d4a85344':'transparent'}` }}>
              Tools <ChevronDown size={12} className={`transition-transform ${toolsOpen?'rotate-180':''}`} />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background:'#0f2d1c', border:'1px solid #1e4a2e' }}>
                {NAV_TOOLS.map(n => (
                  <Link key={n.href} href={n.href} onClick={() => setToolsOpen(false)}
                    className="block px-4 py-3 no-underline hover:bg-[#142d1e] transition-colors border-b border-[#1e4a2e] last:border-0">
                    <p className="text-[13px] text-[#f0ece0]">{n.label}</p>
                    <p className="text-[11px] text-[#9ab8a4]">{n.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Learn dropdown */}
          <div ref={learnRef} className="relative">
            <button onClick={() => { setLearnOpen(o=>!o); setToolsOpen(false) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] transition-all"
              style={{ background:learnOpen?'#d4a85322':'transparent', color:learnOpen?'#d4a853':'#9ab8a4', border:`1px solid ${learnOpen?'#d4a85344':'transparent'}` }}>
              Learn <ChevronDown size={12} className={`transition-transform ${learnOpen?'rotate-180':''}`} />
            </button>
            {learnOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background:'#0f2d1c', border:'1px solid #1e4a2e' }}>
                {NAV_LEARN.map(n => (
                  <Link key={n.href} href={n.href} onClick={() => setLearnOpen(false)}
                    className="block px-4 py-3 no-underline hover:bg-[#142d1e] transition-colors border-b border-[#1e4a2e] last:border-0">
                    <p className="text-[13px] text-[#f0ece0]">{n.label}</p>
                    <p className="text-[11px] text-[#9ab8a4]">{n.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_USER.map(n => (
            <Link key={n.href} href={n.href}
              className="px-3 py-1.5 rounded-full text-[13px] no-underline transition-all"
              style={{ color:active(n.href)?'#d4a853':'#9ab8a4', background:active(n.href)?'#d4a85322':'transparent', border:`1px solid ${active(n.href)?'#d4a85344':'transparent'}` }}>
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <select value={language} onChange={e => setLanguage(e.target.value as any)}
            className="bg-transparent border border-[#1e4a2e] rounded-full px-2 py-1 text-[11px] text-[#9ab8a4] focus:outline-none cursor-pointer">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <button onClick={() => setMobileOpen(o=>!o)} className="md:hidden p-2 text-[#9ab8a4]">
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </nav>

      <div className="h-14" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60"/>
          <div className="absolute top-14 left-0 right-0 overflow-y-auto max-h-[calc(100vh-56px)]"
            style={{ background:'#0a1f14', border:'1px solid #1e4a2e' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-4 space-y-1">
              {[
                { title:'Main', links: NAV_PRIMARY.map(n => ({ ...n, desc:undefined })) },
                { title:'Tools', links: NAV_TOOLS },
                { title:'Learn', links: NAV_LEARN },
                { title:'Account', links: NAV_USER.map(n => ({ ...n, desc:undefined })) },
              ].map(group => (
                <div key={group.title}>
                  <p className="text-[10px] uppercase tracking-widest text-[#9ab8a4]/40 px-3 py-2">{group.title}</p>
                  {group.links.map((n: any) => (
                    <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl no-underline text-[14px] transition-all"
                      style={{ background:active(n.href)?'#d4a85322':'transparent', color:active(n.href)?'#d4a853':'#f0ece0' }}>
                      {n.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
