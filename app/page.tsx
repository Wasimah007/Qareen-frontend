'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { useSettingsStore, getDir } from '@/lib/settings'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const FEATURES = [
  { icon: '⚡', title: 'Instant Guidance', desc: 'Get Hadith-backed answers in seconds, not hours.' },
  { icon: '📖', title: 'Always Cited', desc: 'Every answer includes Qur\'an verse + Hadith reference. No guessing.' },
  { icon: '🌙', title: 'Waswasa Counter', desc: 'Unique tool to calm intrusive religious thoughts with fiqh principles.' },
  { icon: '🌍', title: '5 Languages', desc: 'English, Arabic, Urdu, French, Turkish with RTL support.' },
  { icon: '🎓', title: 'Scholar Verified', desc: 'Human scholars review and verify AI answers.' },
  { icon: '⚖️', title: 'Madhhab-Aware', desc: 'Notes Hanafi, Maliki, Shafi\'i, Hanbali differences when relevant.' },
]

const VERDICT_EXAMPLES = [
  { icon: '🔴', label: 'Haram', example: 'Bank interest (riba)' },
  { icon: '🟡', label: 'Makruh', example: 'Controversial music' },
  { icon: '🔵', label: 'Permissible', example: 'Modern trade contracts' },
  { icon: '🟢', label: 'Recommended', example: 'Voluntary night prayer' },
  { icon: '🟣', label: 'Obligatory', example: 'Five daily prayers' },
  { icon: '🟠', label: 'Needs Scholar', example: 'Complex fatwa cases' },
]

export default function HomePage() {
  const { language } = useSettingsStore()
  const dir = getDir(language)

  return (
    <div className="min-h-screen" dir={dir}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1f14] islamic-pattern pt-20 pb-24 px-6">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #d4a853 0%, #2d9e5f 50%, transparent 70%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-5 py-2 mb-8"
            >
              <span className="text-gold-400 text-[12px] tracking-[3px]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.95] mb-5">
              <span className="text-gold-gradient">Qareen</span>
              <br />
              <span className="text-[#f0ece0]">قرين</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gold-400/80 tracking-[3px] text-[13px] uppercase mb-5 italic font-display">
              Constant Companion Against Waswasa
            </motion.p>

            <motion.p variants={fadeUp} className="text-[#9ab8a4] text-[clamp(1rem,2.5vw,1.25rem)] max-w-xl mx-auto leading-relaxed mb-10">
              AI-powered Islamic ethical guidance rooted in Qur'an & authentic Hadith.
              Always cited. Never claiming the unseen.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/ask"
                className="btn-primary px-8 py-3.5 rounded-full text-[15px] font-medium no-underline"
              >
                Ask a Question →
              </Link>
              <Link href="/waswasa"
                className="px-8 py-3.5 rounded-full text-[15px] border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 no-underline transition-all"
              >
                🌙 Waswasa Counter
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────── */}
      <section className="bg-[#0f2d1c] border-y border-[#1e4a2e] py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '📖', label: 'Qur\'anic Evidence' },
            { icon: '📜', label: 'Sahih Hadith' },
            { icon: '🎓', label: 'Scholar-Reviewed' },
            { icon: '🕌', label: 'Madhhab-Aware' },
          ].map(t => (
            <div key={t.label} className="group">
              <div className="text-3xl mb-2 group-hover:animate-float">{t.icon}</div>
              <div className="text-[12px] text-[#9ab8a4] font-medium">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-center text-[#f0ece0] mb-12">
          How It Works
        </h2>
        {[
          { n: 1, t: 'Type your question', d: 'Describe any situation — ethics, finance, worship, relationships, food, and more.' },
          { n: 2, t: 'AI detects topic & intent', d: 'Smart classification routes your question to relevant Qur\'anic and Hadith evidence.' },
          { n: 3, t: 'Evidence is retrieved', d: 'RAG-powered lookup from Sahih Bukhari, Sahih Muslim, Riyad as-Salihin, and more.' },
          { n: 4, t: 'Verdict returned with citations', d: 'Structured response: verdict + Qur\'an + Hadith + suggested action + sources.' },
        ].map(step => (
          <div key={step.n} className="flex gap-5 mb-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #2d9e5f, #d4a853)' }}>
              {step.n}
            </div>
            <div>
              <h3 className="text-[#f0ece0] font-medium mb-1">{step.t}</h3>
              <p className="text-[#9ab8a4] text-[14px] leading-relaxed">{step.d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── VERDICT TYPES ─────────────────────────────────── */}
      <section className="bg-[#0f2d1c] border-y border-[#1e4a2e] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-center text-[#f0ece0] mb-4">
            Islamic Ethical Categories
          </h2>
          <p className="text-center text-[#9ab8a4] text-[14px] mb-12">
            Every answer is classified into one of these fiqh categories
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {VERDICT_EXAMPLES.map(v => (
              <div key={v.label} className="bg-[#142d1e] border border-[#1e4a2e] rounded-xl p-4 hover:-translate-y-1 transition-transform">
                <div className="text-2xl mb-2">{v.icon}</div>
                <div className="text-[#f0ece0] font-medium text-[14px] mb-1">{v.label}</div>
                <div className="text-[#9ab8a4] text-[12px]">{v.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-center text-[#f0ece0] mb-12">
            What Makes Qareen Unique
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-5 hover:border-gold-500/30 hover:-translate-y-1 transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-[#f0ece0] font-medium mb-2">{f.title}</h3>
                <p className="text-[#9ab8a4] text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1f14] islamic-pattern py-24 px-6 text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #2d9e5f22 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <p className="text-[12px] text-gold-400 tracking-[4px] uppercase mb-4 font-display italic">
            1.9 Billion Muslims. One Companion.
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#f0ece0] mb-6">
            Start Your Journey
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ask"
              className="btn-primary px-10 py-4 rounded-full text-[16px] font-medium no-underline">
              Ask a Question
            </Link>
            <Link href="/auth/register"
              className="px-10 py-4 rounded-full text-[16px] border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 no-underline transition-all">
              Create Free Account
            </Link>
          </div>
          <p className="text-[#9ab8a4]/60 text-[12px] mt-6 italic">
            5 free questions daily. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2d1c] border-t border-[#1e4a2e] py-10 px-6 text-center">
        <p className="arabic-text text-gold-400/60 text-lg mb-3">
          وَمَا أُوتِيتُم مِّن الْعِلْمِ إِلَّا قَلِيلًا
        </p>
        <p className="text-[#9ab8a4]/60 text-[12px] italic mb-4">
          "And you have been given of knowledge only a little" — Qur'an 17:85
        </p>
        <p className="text-[#9ab8a4]/40 text-[11px]">
          Developed By Waseem Reegoo © 2026 Qareen. Educational guidance only — not a substitute for qualified Islamic scholarship.
        </p>
      </footer>
      <div className="h-16 md:h-0" />
    </div>
  )
}
