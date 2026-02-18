'use client'
import { clsx } from 'clsx'
import { getVerdictConfig } from '@/lib/verdict'

interface VerdictBadgeProps {
  type?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function VerdictBadge({ type, size = 'md', className }: VerdictBadgeProps) {
  const config = getVerdictConfig(type)
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-1',
    md: 'text-[13px] px-3.5 py-1.5',
    lg: 'text-[15px] px-5 py-2',
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide',
        config.cssClass,
        sizeClasses[size],
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
