'use client'
import { clsx } from 'clsx'

interface CitationCardProps {
  icon: string
  label: string
  children: React.ReactNode
  className?: string
}

export default function CitationCard({ icon, label, children, className }: CitationCardProps) {
  return (
    <div className={clsx(
      'citation-border bg-[#142d1e] border border-[#1e4a2e] rounded-xl p-4 mb-3',
      className
    )}>
      <div className="text-[11px] text-gold-500 font-semibold mb-2 uppercase tracking-widest flex items-center gap-1.5">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}
