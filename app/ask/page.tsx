'use client'
import { useState, useRef } from 'react'
import { Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import AnswerCard from '@/components/features/AnswerCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useSettingsStore, getDir } from '@/lib/settings'
//import { askQuestion } from '@/lib/api'
import type { GuidanceResponse } from '@/types'

const SAMPLE_QUESTIONS = [
  'I feel angry and want to insult someone',
  'Is bank interest (riba) allowed in Islam?',
  'Is music halal or haram?',
  'What does Islam say about breaking promises?',
  'Can I delay my prayer if I am busy with work?',
]

export default function AskPage() {
  const { language, madhhab } = useSettingsStore()
  const dir = getDir(language)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<GuidanceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAsk = async () => {
  if (!question.trim() || loading) return
  setLoading(true)
  setAnswer(null)
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are Qareen, an Islamic ethical guidance AI. ALWAYS return valid JSON only:
{
  "verdict": "Prohibited|Obligatory|Recommended|Permissible|Disliked|Needs Scholar",
  "verdict_type": "haram|obligatory|recommended|mubah|makruh|scholarly",
  "explanation": "2-3 sentence explanation",
  "category": "topic",
  "suggested_action": "practical step",
  "authenticity": "Sahih/Hasan",
  "quran_citation": {"surah":"name","ayah":"X:Y","arabic":"arabic text","text":"english"},
  "hadith_citation": {"collection":"name","number":"XXXX","narrator":"Name (RA)","text":"hadith","grade":"Sahih"},
  "sources": ["source1","source2"],
  "is_scholar_verified": false,
  "disclaimer": "This app provides educational guidance and is not a substitute for a qualified scholar."
}`,
        messages: [{ role: "user", content: question }],
      }),
    })
    const data = await response.json()
    const raw = data.content?.map((b: any) => b.text || "").join("") || ""
    const match = raw.replace(/```json|```/g, "").match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON")
    const result = JSON.parse(match[0])
    result.id = Date.now().toString()
    result.created_at = new Date().toISOString()
    result.sources = result.sources || []
    setAnswer(result)
  } catch (err) {
    toast.error("Could not get guidance. Check your API key or connection.")
  } finally {
    setLoading(false)
  }
}

  return (
    <div dir={dir} className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[#f0ece0] mb-2">
            Ask Anything
          </h1>
          <p className="text-[#9ab8a4] text-[14px]">
            Questions about ethics, finance, worship, food, relationships & more
          </p>
        </div>

        {/* Quick examples */}
        {!answer && !loading && (
          <div className="mb-6">
            <p className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-3">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.slice(0, 3).map(q => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="text-[12px] bg-[#0f2d1c] border border-[#1e4a2e] hover:border-gold-500/40 rounded-full px-3 py-1.5 text-[#9ab8a4] hover:text-gold-400 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Input */}
        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-4 mb-5 focus-within:border-gold-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAsk() }}
            placeholder="Describe your situation or ask an ethical question…"
            rows={4}
            dir={dir}
            className="w-full bg-transparent text-[#f0ece0] placeholder:text-[#9ab8a4]/50 text-[15px] leading-relaxed resize-none focus:outline-none font-body"
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1e4a2e]">
            <span className="text-[11px] text-[#9ab8a4]/50">Ctrl+Enter to submit</span>
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium disabled:opacity-40"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching sources…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Get Guidance
                </>
              )}
            </button>
          </div>
        </div>

        {/* Madhhab note */}
        {madhhab !== 'General' && (
          <p className="text-[11px] text-gold-400/60 mb-5 italic">
            ✦ Responses will note {madhhab} school differences where relevant
          </p>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Answer */}
        {answer && !loading && (
          <AnswerCard
            answer={answer}
            dir={dir}
            onNew={() => { setAnswer(null); setQuestion(''); textareaRef.current?.focus() }}
          />
        )}

        {/* Evidence note */}
        {!answer && !loading && (
          <div className="mt-10 bg-[#0f2d1c]/50 border border-[#1e4a2e]/50 rounded-xl p-5">
            <h3 className="text-[#f0ece0] font-medium mb-3 text-[14px]">📚 How answers are sourced</h3>
            <ul className="space-y-2">
              {[
                'All answers cite specific Qur\'an verses with Arabic text',
                'Hadith from Sahih Bukhari, Sahih Muslim, Riyad as-Salihin',
                'Every verdict is classified: Obligatory / Recommended / Permissible / Disliked / Prohibited',
                'Scholar differences noted when relevant',
                'AI never claims knowledge of the unseen',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#9ab8a4] text-[13px]">
                  <span className="text-gold-500 mt-0.5 shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
