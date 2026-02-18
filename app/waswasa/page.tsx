'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import CitationCard from '@/components/features/CitationCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useSettingsStore, getDir } from '@/lib/settings'
import { getWaswasaSupport } from '@/lib/api'
import type { WaswasaResponse } from '@/types'

export default function WaswasaPage() {
  const { language } = useSettingsStore()
  const dir = getDir(language)
  const [thought, setThought] = useState('')
  const [response, setResponse] = useState<WaswasaResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!thought.trim() || loading) return
    setLoading(true)
    setResponse(null)
    try {
      const result = await getWaswasaSupport({ thought_text: thought, language })
      setResponse(result)
    } catch (err) {
      toast.error('Unable to get support. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={dir} className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 pb-24">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-5 animate-float">🌙</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] text-[#f0ece0] mb-3">
            Waswasa Counter
          </h1>
          <p className="text-[#9ab8a4] text-[15px] leading-relaxed max-w-sm mx-auto">
            Share what's troubling your heart. You are not alone — these thoughts are recognised in Islamic scholarship.
          </p>
        </div>

        {/* Fiqh principle banner */}
        <div className="bg-gold-500/8 border border-gold-500/20 rounded-xl p-4 mb-8 text-center">
          <p className="text-[13px] text-gold-400 italic font-display leading-relaxed">
            🌿 <em>Al-Yaqeen lā yazūlu bil-shakk</em>
            <br />
            <span className="text-gold-300/70 text-[11px]">Certainty is not removed by doubt</span>
          </p>
        </div>

        {/* Input */}
        {!response && (
          <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-6 focus-within:border-gold-500/40 transition-colors">
            <textarea
              value={thought}
              onChange={e => setThought(e.target.value)}
              placeholder="Describe the thought or doubt troubling you… This is a safe space."
              rows={5}
              dir={dir}
              className="w-full bg-transparent text-[#f0ece0] placeholder:text-[#9ab8a4]/50 text-[15px] leading-relaxed resize-none focus:outline-none font-body"
            />
            <div className="flex justify-end mt-3 pt-3 border-t border-[#1e4a2e]">
              <button
                onClick={handleSubmit}
                disabled={loading || !thought.trim()}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-medium disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Finding peace…
                  </>
                ) : (
                  '🌿 Find Peace'
                )}
              </button>
            </div>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {/* Response */}
        {response && !loading && (
          <div className="space-y-4 animate-slide-up">
            {/* Calming Verse */}
            {response.calming_verse && (
              <div className="bg-gradient-to-br from-[#0f2d1c] to-[#142d1e] border border-[#1e4a2e] rounded-2xl p-6 text-center">
                <div className="text-[10px] text-gold-400 uppercase tracking-widest mb-4">Calming Verse</div>
                {response.calming_verse.arabic && (
                  <p className="arabic-text text-gold-400 text-2xl mb-4 leading-loose">
                    {response.calming_verse.arabic}
                  </p>
                )}
                <p className="text-[15px] italic text-[#f0ece0] leading-relaxed mb-3">
                  "{response.calming_verse.text}"
                </p>
                <p className="text-[11px] text-[#9ab8a4]">
                  — {response.calming_verse.surah} {response.calming_verse.ayah}
                </p>
              </div>
            )}

            {/* Dhikr Box */}
            {response.dhikr && (
              <div className="bg-gradient-to-r from-gold-500/8 to-emerald-500/8 border border-gold-500/20 rounded-xl p-5 text-center">
                <div className="text-[10px] text-gold-400 uppercase tracking-widest mb-3">Dhikr</div>
                <p className="arabic-text text-gold-400 text-2xl mb-2">{response.dhikr}</p>
                <p className="text-[12px] text-[#9ab8a4] italic">{response.dhikr_translation}</p>
              </div>
            )}

            {/* Advice */}
            {response.advice && (
              <CitationCard icon="💚" label="Guidance">
                <p className="text-[14px] text-[#f0ece0] leading-relaxed">{response.advice}</p>
              </CitationCard>
            )}

            {/* Steps */}
            {response.steps?.length > 0 && (
              <CitationCard icon="✦" label="Steps to Take">
                <div className="space-y-3">
                  {response.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #2d9e5f, #d4a853)' }}>
                        {i + 1}
                      </span>
                      <span className="text-[13px] text-[#f0ece0] leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </CitationCard>
            )}

            {/* Hadith */}
            {response.hadith && (
              <CitationCard icon="📜" label="Hadith Reference">
                <p className="text-[13px] text-[#f0ece0] italic leading-relaxed mb-1">
                  "{response.hadith.text}"
                </p>
                <p className="text-[11px] text-[#9ab8a4]">
                  — {response.hadith.collection} #{response.hadith.number}
                  {response.hadith.grade ? ` [${response.hadith.grade}]` : ''}
                </p>
              </CitationCard>
            )}

            {/* Fiqh Principle */}
            <div className="bg-gold-500/5 border border-dashed border-gold-500/30 rounded-xl p-4 text-center">
              <p className="text-[12px] text-gold-400 italic font-display">
                🌿 {response.fiqh_principle}
              </p>
            </div>

            {/* Try another */}
            <button
              onClick={() => { setResponse(null); setThought('') }}
              className="w-full py-3 rounded-xl border border-[#1e4a2e] text-[#9ab8a4] hover:text-[#f0ece0] text-[14px] transition-colors"
            >
              ↺ Share another thought
            </button>

            <p className="text-[11px] text-[#9ab8a4]/60 text-center italic leading-relaxed">
              ⚠️ {response.disclaimer}
            </p>
          </div>
        )}

        {/* Explanation when empty */}
        {!response && !loading && (
          <div className="mt-8 bg-[#0f2d1c]/50 border border-[#1e4a2e]/50 rounded-xl p-5">
            <h3 className="text-[#f0ece0] font-medium mb-3 text-[14px]">What is Waswasa?</h3>
            <p className="text-[#9ab8a4] text-[13px] leading-relaxed mb-4">
              <em>Waswas</em> refers to intrusive thoughts, whispers, or compulsive doubts that Shaytan places in the heart of believers — especially around acts of worship, purity, or faith.
            </p>
            <p className="text-[#9ab8a4] text-[13px] leading-relaxed">
              Islamic scholars have extensively addressed this. The Fiqh principle <em>"Al-yaqeen lā yazūlu bil-shakk"</em> (certainty is not removed by doubt) is the central tool. The Prophet ﷺ himself gave specific guidance on dealing with these thoughts.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
