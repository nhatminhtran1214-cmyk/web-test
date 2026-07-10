'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { MapPin, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0A1628 0%, #0d2a4a 50%, #0A1628 100%)' }}>
      {/* Left decorative panel */}
      <div style={{ flex: 1, display: 'none', position: 'relative', overflow: 'hidden' }} className="auth-panel">
        <img src="/images/hero-bg.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,119,182,0.8), rgba(10,22,40,0.9))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16 }}>Chào mừng<br />trở lại! 👋</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>Đăng nhập để quản lý các chuyến đi và khám phá hàng trăm tour du lịch Việt Nam.</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40, justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0077B6, #00B4D8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={22} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>VietTravel</span>
          </Link>

          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 40 }}>
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.6rem', marginBottom: 6 }}>Đăng nhập</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Chưa có tài khoản? <Link href="/register" style={{ color: '#F4A261', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link></p>

            {error && (
              <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FCA5A5', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '13px 44px 13px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(0,119,182,0.5)' : 'linear-gradient(135deg, #0077B6, #00B4D8)', color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', marginTop: 4 }}
              >
                {loading ? <><span className="spinner" style={{ width: 20, height: 20 }} /> Đang đăng nhập...</> : <><LogIn size={18} /> Đăng nhập</>}
              </button>
            </form>

            {/* Demo accounts */}
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,119,182,0.1)', borderRadius: 10, border: '1px solid rgba(0,119,182,0.2)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 8, fontWeight: 600 }}>🔑 TÀI KHOẢN DEMO</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>Admin: admin@viettravel.vn / admin123</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>User: user@viettravel.vn / user123</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (min-width: 900px) { .auth-panel { display: flex !important; } }`}</style>
    </div>
  )
}
