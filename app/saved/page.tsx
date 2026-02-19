'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const VERDICTS: Record<string, { color: string; icon: string }> = {
  haram:'#ef4444',prohibited:'#ef4444',makruh:'#f59e0b',disliked:'#f59e0b',
  mubah:'#3b82f6',permissible:'#3b82f6',halal:'#22c55e',recommended:'#22c55e',
  obligatory:'#8b5cf6',scholarly:'#d97706',
}

export default function SavedPage() {
  const [tab, setTab] = useState<'questions'|'hadiths'|'duas'>('questions')
  const [questions, setQuestions] = useState<any[]>([])
  const [hadiths, setHadiths]   = useState<any[]>([])
  const [duas, setDuas]         = useState<any[]>([])

  useEffect(() => {
    // Load saved question IDs + history
    const history = JSON.parse(localStorage.getItem('qareen_question_history') || '[]')
    const savedQIds = JSON.parse(localStorage.getItem('qareen_saved_questions') || '[]')
    setQuestions(history.filter((q: any) => savedQIds.includes(q.id)))

    // Load saved hadith IDs
    const savedHIds = JSON.parse(localStorage.getItem('qareen_saved_hadiths') || '[]')
    // We'll show placeholders since we can't import the HADITHS array here easily
    setHadiths(savedHIds)

    // Load saved dua IDs
    const savedDIds = JSON.parse(localStorage.getItem('qareen_saved_duas') || '[]')
    setDuas(savedDIds)
  }, [])

  const removeQuestion = (id: string) => {
    const saved = JSON.parse(localStorage.getItem('qareen_saved_questions') || '[]')
    localStorage.setItem('qareen_saved_questions', JSON.stringify(saved.filter((i: string) => i !== id)))
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const counts = { questions: questions.length, hadiths: hadiths.length, duas: duas.length }

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-28">
        <div className="mb-8">
          <div className="text-4xl mb-3">🔖</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-1">Saved</h1>
          <p className="text-[#9ab8a4] text-[13px]">Your bookmarked guidance, hadiths & duas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { v:'questions', l:`Questions (${counts.questions})` },
            { v:'hadiths',   l:`Hadiths (${counts.hadiths})` },
            { v:'duas',      l:`Duas (${counts.duas})` },
          ] as const).map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              className="flex-1 py-2 rounded-xl text-[12px] border transition-all"
              style={{ background:tab===t.v?'#d4a85322':'#0f2d1c', border:`1px solid ${tab===t.v?'#d4a853':'#1e4a2e'}`, color:tab===t.v?'#d4a853':'#9ab8a4' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Saved Questions */}
        {tab === 'questions' && (
          questions.length === 0
            ? <Empty icon="💬" msg="No saved questions yet" link="/ask" linkLabel="Ask a question" />
            : <div className="space-y-4">
                {questions.map((q: any) => {
                  const vc = Verdicts[q.verdict_type] || '#9ab8a4'
                  return (
                    <div key={q.id} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full border"
                          style={{ color:vc, border:`1px solid ${vc}44`, background:`${vc}11` }}>
                          {q.verdict}
                        </span>
                        <button onClick={() => removeQuestion(q.id)} className="text-[#9ab8a4] hover:text-red-400 text-[12px] transition-colors">✕ Remove</button>
                      </div>
                      {q.question && <p className="text-[#9ab8a4] text-[12px] italic mb-2">Q: {q.question}</p>}
                      <p className="text-[#f0ece0] text-[14px] leading-relaxed mb-2">{q.explanation}</p>
                      {q.quran_citation && (
                        <p className="text-[12px] text-[#d4a853]">📖 {q.quran_citation.surah} {q.quran_citation.ayah}</p>
                      )}
                    </div>
                  )
                })}
              </div>
        )}

        {/* Saved Hadiths */}
        {tab === 'hadiths' && (
          hadiths.length === 0
            ? <Empty icon="📜" msg="No saved hadiths yet" link="/hadith" linkLabel="Browse hadiths" />
            : <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 text-center">
                <p className="text-[#9ab8a4] text-[14px] mb-4">You have {hadiths.length} saved hadith(s).</p>
                <Link href="/hadith" className="btn-primary px-6 py-2.5 rounded-full text-[14px] no-underline inline-block">
                  View in Hadith Collection →
                </Link>
              </div>
        )}

        {/* Saved Duas */}
        {tab === 'duas' && (
          duas.length === 0
            ? <Empty icon="🤲" msg="No saved duas yet" link="/dua" linkLabel="Browse duas" />
            : <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 text-center">
                <p className="text-[#9ab8a4] text-[14px] mb-4">You have {duas.length} saved dua(s).</p>
                <Link href="/dua" className="btn-primary px-6 py-2.5 rounded-full text-[14px] no-underline inline-block">
                  View in Dua Collection →
                </Link>
              </div>
        )}
      </div>
    </div>
  )
}

function Empty({ icon, msg, link, linkLabel }: { icon:string; msg:string; link:string; linkLabel:string }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-[#9ab8a4] mb-6">{msg}</p>
      <Link href={link} className="btn-primary px-6 py-2.5 rounded-full text-[14px] no-underline inline-block">
        {linkLabel} →
      </Link>
    </div>
  )
}

const Verdicts: Record<string, string> = {
  haram:'#ef4444',prohibited:'#ef4444',makruh:'#f59e0b',disliked:'#f59e0b',
  mubah:'#3b82f6',permissible:'#3b82f6',halal:'#22c55e',recommended:'#22c55e',
  obligatory:'#8b5cf6',scholarly:'#d97706',
}
