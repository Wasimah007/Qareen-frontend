'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import VerdictBadge from '@/components/features/VerdictBadge'
import { useAuthStore } from '@/lib/auth'
import { getUnverifiedQuestions, verifyQuestion, getAdminStats } from '@/lib/api'
import { ShieldCheck, Users, MessageCircle, CheckCircle, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export default function AdminPage() {
  const { user } = useAuthStore()
  const [questions, setQuestions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'queue' | 'stats'>('queue')
  const [notes, setNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user || !['scholar', 'admin'].includes(user.role)) return
    Promise.all([
      getUnverifiedQuestions().then(setQuestions),
      user.role === 'admin' ? getAdminStats().then(setStats) : Promise.resolve(),
    ]).finally(() => setLoading(false))
  }, [user])

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await verifyQuestion({ question_id: id, is_verified: isVerified, scholar_note: notes[id] })
      setQuestions(prev => prev.filter(q => q.id !== id))
      toast.success(isVerified ? '✓ Marked as verified' : 'Flagged for review')
    } catch {
      toast.error('Failed to update')
    }
  }

  if (!user || !['scholar', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-display text-2xl text-[#f0ece0] mb-3">Access Restricted</h2>
            <p className="text-[#9ab8a4]">Scholar or Admin role required</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-[#f0ece0]">Scholar Dashboard</h1>
            <p className="text-[#9ab8a4] text-[13px] mt-1">
              Role: <span className="text-gold-400 capitalize">{user.role}</span>
            </p>
          </div>
          <div className="flex gap-2">
            {(['queue', ...(user.role === 'admin' ? ['stats'] : [])] as any[]).map((t: string) => (
              <button key={t} onClick={() => setTab(t as any)}
                className={clsx('px-4 py-1.5 rounded-full text-[13px] border transition-all capitalize',
                  tab === t ? 'bg-gold-500/15 border-gold-500/40 text-gold-400' : 'border-[#1e4a2e] text-[#9ab8a4]')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '👥', label: 'Total Users',       value: stats.total_users },
              { icon: '💬', label: 'Total Questions',   value: stats.total_questions },
              { icon: '✅', label: 'Scholar Verified',  value: stats.verified_questions },
              { icon: '🌙', label: 'Waswasa Sessions',  value: stats.waswasa_sessions },
              { icon: '📊', label: "Today's Questions", value: stats.questions_today },
              { icon: '📈', label: 'Verification Rate', value: `${stats.verification_rate}%` },
            ].map(s => (
              <div key={s.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-display text-2xl text-gold-400">{s.value}</div>
                <div className="text-[11px] text-[#9ab8a4] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Queue */}
        {tab === 'queue' && (
          <>
            <p className="text-[#9ab8a4] text-[13px] mb-5">
              {questions.length} questions awaiting scholar review
            </p>

            {loading && (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-5 animate-pulse">
                    <div className="shimmer h-4 w-3/4 rounded mb-3" />
                    <div className="shimmer h-3 w-full rounded mb-2" />
                    <div className="shimmer h-3 w-2/3 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && questions.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="font-display text-2xl text-[#f0ece0] mb-3">Queue is clear!</h2>
                <p className="text-[#9ab8a4]">All questions have been reviewed.</p>
              </div>
            )}

            {!loading && questions.map(q => (
              <div key={q.id} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-4">
                {/* Question */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <p className="text-[#f0ece0] text-[14px] leading-relaxed mb-2">{q.question_text}</p>
                    <div className="flex gap-2 flex-wrap">
                      <VerdictBadge type={q.verdict_type} size="sm" />
                      {q.category && (
                        <span className="bg-[#142d1e] border border-[#1e4a2e] rounded-full px-2 py-0.5 text-[11px] text-[#9ab8a4]">
                          {q.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-[#142d1e] rounded-xl p-3 mb-4 text-[13px] text-[#9ab8a4] leading-relaxed">
                  {q.explanation}
                </div>

                {/* Citations */}
                {q.quran_citation && (
                  <div className="citation-border mb-3">
                    <p className="text-[11px] text-gold-400 mb-1">📖 {q.quran_citation.surah} {q.quran_citation.ayah}</p>
                    <p className="text-[12px] text-[#9ab8a4] italic">"{q.quran_citation.text}"</p>
                  </div>
                )}
                {q.hadith_citation && (
                  <div className="citation-border mb-4">
                    <p className="text-[11px] text-gold-400 mb-1">📜 {q.hadith_citation.collection} #{q.hadith_citation.number}</p>
                    <p className="text-[12px] text-[#9ab8a4] italic">"{q.hadith_citation.text}"</p>
                  </div>
                )}

                {/* Scholar note input */}
                <input
                  type="text"
                  placeholder="Add scholar note (optional)…"
                  value={notes[q.id] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                  className="qareen-input w-full px-3 py-2 rounded-lg text-[13px] mb-3"
                />

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify(q.id, true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 text-[13px] hover:bg-emerald-900/50 transition-all"
                  >
                    <ShieldCheck size={14} /> Mark Verified
                  </button>
                  <button
                    onClick={() => handleVerify(q.id, false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-[13px] hover:bg-red-900/30 transition-all"
                  >
                    Needs Revision
                  </button>
                </div>

                <p className="text-[10px] text-[#9ab8a4]/40 mt-3">
                  {new Date(q.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
