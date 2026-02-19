'use client'
import { useEffect, useState } from 'react'
import FourQulModal from '@/components/features/FourQulModal'

export default function NotificationScheduler() {
  const [showFourQul, setShowFourQul] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkTime = () => {
      const settings = localStorage.getItem('qareen_fourqul_settings')
      if (!settings) return

      const { time, enabled } = JSON.parse(settings)
      if (!enabled || !time) return

      const now = new Date()
      const [h, m] = time.split(':').map(Number)
      const isTime = now.getHours() === h && now.getMinutes() === m

      if (!isTime) return

      // Don't show twice in the same minute
      const lastShown = localStorage.getItem('qareen_fourqul_shown_at')
      const todayMin = `${now.toDateString()}-${h}-${m}`
      if (lastShown === todayMin) return

      localStorage.setItem('qareen_fourqul_shown_at', todayMin)

      // Try browser notification first
      if ('Notification' in window && Notification.permission === 'granted') {
        const notif = new Notification('🌙 Time for Char Qul', {
          body: 'Recite the 4 Quls before sleeping for protection — as taught by the Prophet ﷺ',
          icon: '/favicon.ico',
          tag: 'four-qul-reminder',
        })
        notif.onclick = () => {
          window.focus()
          setShowFourQul(true)
          notif.close()
        }
      } else {
        // Fallback: show in-app popup
        setShowFourQul(true)
      }
    }

    // Check every 30 seconds
    interval = setInterval(checkTime, 30000)
    checkTime() // Also check immediately on mount

    return () => clearInterval(interval)
  }, [])

  if (!showFourQul) return null
  return <FourQulModal onClose={() => setShowFourQul(false)} />
}
