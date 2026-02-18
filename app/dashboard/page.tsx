'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, MessageCircle, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import VerdictBadge from '@/components/features/VerdictBadge'
import { useAuthStore } from '@/lib/auth'
import { useSettingsStore, getDir } from '@/lib/settings'
import { getHistory } from '@/lib/api'
import type { QuestionHistoryItem } from '@/types'
import { clsx } from 'clsx'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { language } = useSettingsStore()
  const dir = getDir(language)
  const [history, setHistory] = useState<QuestionHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'saved' | 'waswasa'>('all')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getHistory().then(setHistory).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const filtered = history.filter(q => {
    if (filter === 'saved') return q.is_saved
    if (filter === 'waswasa') return q.is_waswasa
    return true
  })

  return (
    <div dir={dir} className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-24">

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-[#f0ece0]">Question History</h1>
            {user && (
              <p className="text-[#9ab8a4] text-[13px] mt-1">
                {history.length} questions asked
              </p>
            )}
          </div>
          {/* Stats */}
          {user && (
            <div className="flex gap-3">
              {[
                { icon: <MessageCircle size={14} />, count: history.length, label: 'Total' },
                { icon: <Bookmark size={14} />, count: history.filter(q => q.is_saved).length, label: 'Saved' },
                { icon: <ShieldCheck size={14} />, count: history.filter(q => q.is_scholar_verified).length, label: 'Verified' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl px-3 py-2 text-center">
                  <div className="flex items-center gap-1 text-[#9ab8a4] justify-center mb-0.5">{s.icon}</div>
                  <div className="font-display text-xl text-gold-400">{s.count}</div>
                  <div className="text-[10px] text-[#9ab8a4]">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter tabs */}
        {user && (
          <div className="flex gap-2 mb-6">
            {(['all', 'saved', 'waswasa'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-[13px] border transition-all capitalize',
                  filter === f
                    ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                    : 'border-[#1e4a2e] text-[#9ab8a4] hover:border-gold-500/30'
                )}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Not logged in */}
        {!user && !loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-display text-2xl text-[#f0ece0] mb-3">Sign in to view history</h2>
            <p className="text-[#9ab8a4] mb-6 text-[14px]">Create a free account to save and track your questions</p>
            <div className="flex justify-center gap-3">
              <Link href="/auth/login" className="px-6 py-3 rounded-full border border-[#1e4a2e] text-[#9ab8a4] no-underline">Sign In</Link>
              <Link href="/auth/register" className="px-6 py-3 rounded-full btn-primary no-underline">Create Account</Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && user && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4">
                <div className="shimmer h-4 w-3/4 rounded mb-3" />
                <div className="shimmer h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && user && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="font-display text-2xl text-[#f0ece0] mb-3">
              {filter === 'all' ? 'No questions yet' : `No ${filter} questions`}
            </h2>
            <p className="text-[#9ab8a4] mb-6 text-[14px]">
              {filter === 'all' ? 'Ask something to get started!' : 'Questions will appear here once you bookmark them.'}
            </p>
            <Link href="/ask" className="btn-primary px-6 py-3 rounded-full no-underline text-[14px]">
              Ask a Question
            </Link>
          </div>
        )}

        {/* History list */}
        {!loading && user && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(item => (
              <Link
                key={item.id}
                href={`/questions/${item.id}`}
                className="block bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4 no-underline hover:border-gold-500/30 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[#f0ece0] text-[14px] leading-relaxed flex-1 line-clamp-2">
                    {item.is_waswasa && <span className="text-gold-400 mr-1">🌙</span>}
                    {item.question_text}
                  </p>
                  {item.verdict_type && <VerdictBadge type={item.verdict_type} size="sm" />}
                </div>
                <div className="flex items-center gap-3">
                  {item.category && (
                    <span className="text-[11px] text-[#9ab8a4] bg-[#142d1e] rounded-full px-2 py-0.5">
                      {item.category}
                    </span>
                  )}
                  {item.is_scholar_verified && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  )}
                  {item.is_saved && (
                    <span className="text-[11px] text-gold-400 flex items-center gap-1">
                      <Bookmark size={10} /> Saved
                    </span>
                  )}
                  <span className="text-[10px] text-[#9ab8a4]/50 ml-auto">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
