import type { VerdictType } from '@/types'

export interface VerdictConfig {
  label: string
  cssClass: string
  icon: string
  description: string
}

export const VERDICT_CONFIG: Record<string, VerdictConfig> = {
  haram:       { label: 'Haram',        cssClass: 'verdict-haram',       icon: '🔴', description: 'Forbidden in Islam' },
  prohibited:  { label: 'Prohibited',   cssClass: 'verdict-haram',       icon: '🔴', description: 'Forbidden in Islam' },
  makruh:      { label: 'Makruh',       cssClass: 'verdict-makruh',      icon: '🟡', description: 'Disliked but not forbidden' },
  disliked:    { label: 'Disliked',     cssClass: 'verdict-makruh',      icon: '🟡', description: 'Disliked but not forbidden' },
  mubah:       { label: 'Permissible',  cssClass: 'verdict-mubah',       icon: '🔵', description: 'Allowed in Islam' },
  permissible: { label: 'Permissible',  cssClass: 'verdict-mubah',       icon: '🔵', description: 'Allowed in Islam' },
  halal:       { label: 'Halal',        cssClass: 'verdict-halal',       icon: '🟢', description: 'Lawful and permitted' },
  recommended: { label: 'Recommended',  cssClass: 'verdict-recommended', icon: '🟢', description: 'Encouraged in Islam' },
  obligatory:  { label: 'Obligatory',   cssClass: 'verdict-obligatory',  icon: '🟣', description: 'Required in Islam' },
  scholarly:   { label: 'Needs Scholar',cssClass: 'verdict-scholarly',   icon: '🟠', description: 'Consult a qualified scholar' },
  unknown:     { label: 'Unknown',      cssClass: 'verdict-unknown',     icon: '⚪', description: 'Classification unclear' },
}

export function getVerdictConfig(type?: string): VerdictConfig {
  if (!type) return VERDICT_CONFIG.unknown
  return VERDICT_CONFIG[type.toLowerCase()] || VERDICT_CONFIG.unknown
}
