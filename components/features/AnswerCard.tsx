'use client'
import { useState } from 'react'
import { Bookmark, BookmarkCheck, Share2, RotateCcw } from 'lucide-react'
import type { GuidanceResponse } from '@/types'
import VerdictBadge from './VerdictBadge'
import CitationCard from './CitationCard'
import { clsx } from 'clsx'

interface AnswerCardProps {
  answer: GuidanceResponse
  onSave?: (id: string) => void
  onNew?: () => void
  dir?: 'ltr' | 'rtl'
}

export default function AnswerCard({ answer, onSave, onNew, dir = 'ltr' }: AnswerCardProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    onSave?.(answer.id)
  }

  return (
    <div
      dir={dir}
      className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 md:p-6 animate-slide-up"
    >
      {/* Verdict + Category row */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-2">Verdict</div>
          <VerdictBadge type={answer.verdict_type} size="lg" />
        </div>
        <div className="flex flex-col items-end gap-2">
          {answer.category && (
            <span className="bg-[#142d1e] border border-[#1e4a2e] rounded-full px-3 py-1 text-[11px] text-[#9ab8a4]">
              {answer.category}
            </span>
          )}
          {answer.is_scholar_verified && (
            <span className="bg-emerald-900/40 border border-emerald-700/40 rounded-full px-3 py-1 text-[11px] text-emerald-400">
              🎓 Scholar Verified
            </span>
          )}
        </div>
      </div>

      {/* Evidence-based banner */}
      <div className="bg-gold-500/8 border border-gold-500/20 rounded-lg px-4 py-2.5 mb-5 flex items-center gap-2">
        <span className="text-gold-500">📚</span>
        <span className="text-[12px] text-gold-400">
          Based on Qur'an and Hadith
          {answer.authenticity ? ` — ${answer.authenticity}` : ''}
        </span>
      </div>

      {/* Explanation */}
      <p className="text-[#f0ece0] leading-relaxed text-[15px] mb-5">{answer.explanation}</p>

      {/* Qur'an citation */}
      {answer.quran_citation && (
        <CitationCard icon="📖" label="Qur'anic Reference">
          {answer.quran_citation.arabic && (
            <p className="arabic-text text-gold-400 text-xl mb-2">{answer.quran_citation.arabic}</p>
          )}
          <p className="text-[14px] text-[#f0ece0] italic leading-relaxed mb-1">
            "{answer.quran_citation.text}"
          </p>
          <p className="text-[11px] text-[#9ab8a4]">
            — {answer.quran_citation.surah} {answer.quran_citation.ayah}
          </p>
        </CitationCard>
      )}

      {/* Hadith citation */}
      {answer.hadith_citation && (
        <CitationCard icon="📜" label="Hadith Reference">
          <p className="text-[14px] text-[#f0ece0] italic leading-relaxed mb-1">
            "{answer.hadith_citation.text}"
          </p>
          <p className="text-[11px] text-[#9ab8a4]">
            — {answer.hadith_citation.collection} #{answer.hadith_citation.number}
            {answer.hadith_citation.narrator ? `, ${answer.hadith_citation.narrator}` : ''}
            {answer.hadith_citation.grade ? ` [${answer.hadith_citation.grade}]` : ''}
          </p>
        </CitationCard>
      )}

      {/* Suggested Action */}
      {answer.suggested_action && (
        <CitationCard icon="✦" label="Suggested Action">
          <p className="text-[14px] text-[#f0ece0] leading-relaxed">{answer.suggested_action}</p>
        </CitationCard>
      )}

      {/* Sources */}
      {answer.sources.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-[#9ab8a4] uppercase tracking-widest mb-2">Sources</div>
          <div className="flex flex-wrap gap-2">
            {answer.sources.map((s, i) => (
              <span key={i} className="bg-[#142d1e] border border-[#1e4a2e] rounded-full px-3 py-1 text-[11px] text-[#9ab8a4]">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 pt-4 border-t border-[#1e4a2e]">
        <button
          onClick={handleSave}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border transition-all',
            saved
              ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
              : 'border-[#1e4a2e] text-[#9ab8a4] hover:border-gold-500/40 hover:text-gold-400'
          )}
        >
          {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border border-[#1e4a2e] text-[#9ab8a4] hover:text-[#f0ece0] transition-all"
        >
          <RotateCcw size={14} />
          New
        </button>
        <button
          onClick={() => navigator.clipboard?.writeText(window.location.origin + '/questions/' + answer.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border border-[#1e4a2e] text-[#9ab8a4] hover:text-[#f0ece0] transition-all ml-auto"
        >
          <Share2 size={14} />
          Share
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-[#9ab8a4]/70 mt-4 italic leading-relaxed">
        ⚠️ {answer.disclaimer}
      </p>
    </div>
  )
}
