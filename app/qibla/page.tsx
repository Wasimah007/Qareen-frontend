'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'

const MECCA = { lat: 21.3891, lng: 39.8579 }

function calcQibla(lat: number, lng: number) {
  const φ1 = lat * Math.PI / 180
  const φ2 = MECCA.lat * Math.PI / 180
  const Δλ = (MECCA.lng - lng) * Math.PI / 180
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  return Math.round(bearing)
}

function distKm(lat: number, lng: number) {
  const R = 6371
  const dLat = (MECCA.lat - lat) * Math.PI / 180
  const dLng = (MECCA.lng - lng) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat*Math.PI/180)*Math.cos(MECCA.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}

export default function QiblaPage() {
  const [qibla, setQibla] = useState<number | null>(null)
  const [compass, setCompass] = useState(0)
  const [dist, setDist] = useState<number | null>(null)
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasCompass, setHasCompass] = useState(false)
  const deviceOrient = useRef(0)

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); setLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        const angle = calcQibla(lat, lng)
        const km = distKm(lat, lng)
        setQibla(angle)
        setDist(km)
        // Reverse geocode city
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          const data = await res.json()
          setLocation(data.address?.city || data.address?.town || data.address?.country || 'Your Location')
        } catch {}
        setLoading(false)
      },
      () => {
        // Fallback to Karachi
        setQibla(calcQibla(24.8607, 67.0011))
        setDist(distKm(24.8607, 67.0011))
        setLocation('Karachi (default)')
        setLoading(false)
      }
    )

    // Device orientation for real compass
    const handler = (e: DeviceOrientationEvent) => {
      const alpha = (e as any).webkitCompassHeading ?? e.alpha ?? 0
      deviceOrient.current = alpha
      setCompass(alpha)
      setHasCompass(true)
    }
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  // Arrow rotation: qibla direction minus device heading
  const arrowRotation = qibla !== null ? (qibla - compass + 360) % 360 : 0

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-10 pb-28 text-center">

        <div className="mb-8">
          <div className="text-5xl mb-4">🧭</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-2">Qibla Direction</h1>
          {location && <p className="text-[#9ab8a4] text-[13px]">📍 {location}</p>}
          {dist && <p className="text-[#d4a853] text-[12px] mt-1">{dist.toLocaleString()} km from Mecca</p>}
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 border-4 border-[#1e4a2e] border-t-[#d4a853] rounded-full animate-spin" />
            <p className="text-[#9ab8a4] text-[13px]">Getting your location…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-red-300 text-[13px]">{error}</div>
        )}

        {qibla !== null && !loading && (
          <>
            {/* Compass Rose */}
            <div className="relative mx-auto mb-8" style={{ width: 280, height: 280 }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#1e4a2e]"
                style={{ background: 'radial-gradient(circle, #142d1e 0%, #0a1f14 100%)' }} />

              {/* Cardinal directions */}
              {[{l:'N',r:0},{l:'E',r:90},{l:'S',r:180},{l:'W',r:270}].map(d => (
                <div key={d.l} className="absolute"
                  style={{ top:'50%', left:'50%', transform:`translate(-50%,-50%) rotate(${d.r}deg) translateY(-120px)` }}>
                  <span className={`text-[13px] font-bold ${d.l==='N' ? 'text-red-400' : 'text-[#9ab8a4]'}`}>{d.l}</span>
                </div>
              ))}

              {/* Degree marks */}
              {Array.from({length:36}).map((_,i) => (
                <div key={i} className="absolute" style={{ top:'50%', left:'50%', transform:`translate(-50%,-50%) rotate(${i*10}deg) translateY(-105px)` }}>
                  <div className={`mx-auto ${i%9===0?'h-4 w-0.5 bg-[#d4a853]':'h-2 w-px bg-[#1e4a2e]'}`} />
                </div>
              ))}

              {/* Qibla arrow */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${arrowRotation}deg)`, transition: 'transform 0.3s ease' }}>
                <div className="flex flex-col items-center">
                  {/* Kaaba icon at top */}
                  <div className="text-xl mb-1">🕋</div>
                  {/* Arrow shaft */}
                  <div className="w-1 rounded-full" style={{ height: 90, background: 'linear-gradient(to bottom, #d4a853, #2d9e5f)' }} />
                  <div className="text-base">📍</div>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ background: '#d4a853' }} />
            </div>

            {/* Degree info */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 mb-6">
              <div className="font-display text-5xl text-[#d4a853] mb-2">{qibla}°</div>
              <p className="text-[#9ab8a4] text-[13px] mb-3">from North (clockwise)</p>
              {hasCompass
                ? <p className="text-emerald-400 text-[12px]">✓ Live compass active — turn your device</p>
                : <p className="text-[#9ab8a4] text-[12px] italic">Tap anywhere on mobile to enable compass</p>}
            </div>

            {/* Instructions */}
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4 text-left">
              <p className="text-[11px] text-[#d4a853] uppercase tracking-widest mb-3">How to use</p>
              {[
                'Hold your phone flat and level',
                'The 🕋 icon shows direction to Mecca',
                'Turn until the arrow points away from you',
                'That is your Qibla direction',
              ].map((s, i) => (
                <div key={i} className="flex gap-2 text-[13px] text-[#9ab8a4] mb-2">
                  <span className="text-[#d4a853] shrink-0">{i+1}.</span>{s}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Dua */}
        <div className="mt-6 border-l-[3px] border-[#d4a853] pl-4 bg-[#0f2d1c] rounded-r-xl p-4 text-left">
          <p className="text-[#d4a853] text-xl mb-2 text-right" style={{ fontFamily: 'serif' }}>
            وَمِنْ حَيْثُ خَرَجْتَ فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
          </p>
          <p className="text-[13px] text-[#f0ece0] italic mb-1">
            "Wherever you are, turn your face toward the Sacred Mosque."
          </p>
          <p className="text-[11px] text-[#9ab8a4]">— Qur'an 2:150</p>
        </div>
      </div>
    </div>
  )
}
