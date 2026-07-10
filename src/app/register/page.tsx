'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })
    setLoading(false)
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Đăng ký thất bại.'); return }
    router.push('/login?registered=1')
  }

  const fields = [
    { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0912 345 678' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A1628 0%, #0d2a4a 50%, #0A1628 100%)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0077B6, #00B4D8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>VietTravel</span>
        </Link>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 40 }}>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.6rem', marginBottom: 6 }}>Tạo tài khoản</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Đã có tài khoản? <Link href="/login" style={{ color: '#F4A261', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link></p>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FCA5A5', fontSize: '0.9rem' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.name]}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            {[['password', 'Mật khẩu', '••••••••'], ['confirm', 'Xác nhận mật khẩu', '••••••••']].map(([name, label, ph]) => (
              <div key={name}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={name}
                    name={name}
                    type={showPw ? 'text' : 'password'}
                    placeholder={ph}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '13px 44px 13px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {name === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(244,162,97,0.5)' : 'linear-gradient(135deg, #F4A261, #E76F51)', color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}
            >
              {loading ? <><span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Đang xử lý...</> : <><UserPlus size={18} /> Đăng ký</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
