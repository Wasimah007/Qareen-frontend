import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Noto_Naskh_Arabic } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

const notoArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-arabic',
})

export const metadata: Metadata = {
  title: 'Qareen قرين — Islamic Ethical Guidance AI',
  description: 'Constant companion against waswasa. AI-powered Islamic ethical guidance rooted in Qur\'an and authentic Hadith.',
  keywords: ['Islamic', 'AI', 'Halal', 'Haram', 'Hadith', 'Quran', 'Fiqh', 'Waswasa', 'Islamic guidance'],
  openGraph: {
    title: 'Qareen قرين',
    description: 'Constant companion against waswasa',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${cormorant.variable} ${dmSans.variable} ${notoArabic.variable} font-body bg-qareen-bg text-white antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0f2d1c', color: '#f0ece0', border: '1px solid #1e4a2e' },
          }}
        />
        {children}
      </body>
    </html>
  )
}
