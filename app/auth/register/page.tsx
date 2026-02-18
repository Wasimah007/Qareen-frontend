'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { register } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import { MADHHABS } from '@/lib/settings'

export default function RegisterPage() {
  const router = useRouter()
  const { setToken, fetchMe } = useAuthStore()
  const [form, setForm] = useState({
    email: '', username: '', password: '', full_name: '',
    preferred_language: 'en', preferred_madhhab: 'General',
  })
  const [loading, setLoading] = useState(false)

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const tokenRes = await register(form)
      setToken(tokenRes)
      await fetchMe()
      toast.success('Welcome to Qareen! 🕌')
      router.push('/ask')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1f14] islamic-pattern flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="no-underline">
            <div className="font-display text-5xl text-gold-500 mb-2">Qareen</div>
            <div className="text-[12px] text-[#9ab8a4] italic">Constant Companion Against Waswasa</div>
          </Link>
        </div>

        <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-6">
          <h1 className="font-display text-2xl text-[#f0ece0] mb-1">Join Qareen</h1>
          <p className="text-[#9ab8a4] text-[13px] mb-6">5 free questions daily. No credit card required.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com', required: true },
              { label: 'Username', key: 'username', type: 'text', placeholder: 'yourname', required: true },
              { label: 'Password', key: 'password', type: 'password', placeholder: '8+ characters', required: true },
              { label: 'Full Name (optional)', key: 'full_name', type: 'text', placeholder: 'Your name', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] text-[#9ab8a4] uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={update(f.key)}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="qareen-input w-full px-4 py-2.5 rounded-xl text-[14px]"
                />
              </div>
            ))}

            <div>
              <label className="text-[11px] text-[#9ab8a4] uppercase tracking-wider block mb-1.5">Preferred Madhhab</label>
              <select
                value={form.preferred_madhhab}
                onChange={update('preferred_madhhab')}
                className="qareen-input w-full px-4 py-2.5 rounded-xl text-[14px]"
              >
                {MADHHABS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-[15px] font-medium disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#9ab8a4] mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 no-underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-[#9ab8a4]/40 mt-4 italic">
          ⚠️ Educational guidance only. Not a substitute for qualified scholars.
        </p>
      </div>
    </div>
  )
}
