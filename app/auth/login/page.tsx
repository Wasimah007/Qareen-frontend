'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { login } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { setToken, fetchMe } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const tokenRes = await login(email, password)
      setToken(tokenRes)
      await fetchMe()
      toast.success('Welcome back!')
      router.push('/ask')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1f14] islamic-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="no-underline">
            <div className="font-display text-5xl text-gold-500 mb-2">Qareen</div>
            <div className="text-[12px] text-[#9ab8a4] italic">Constant Companion</div>
          </Link>
        </div>

        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-6">
          <h1 className="font-display text-2xl text-[#f0ece0] mb-1">Welcome Back</h1>
          <p className="text-[#9ab8a4] text-[13px] mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-[#9ab8a4] uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="qareen-input w-full px-4 py-3 rounded-xl text-[14px]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9ab8a4] uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="qareen-input w-full px-4 py-3 rounded-xl text-[14px]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-[15px] font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#9ab8a4] mt-5">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-gold-400 hover:text-gold-300 no-underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-[#9ab8a4]/40 mt-6 italic">
          Educational guidance only — not a substitute for qualified scholars.
        </p>
      </div>
    </div>
  )
}
