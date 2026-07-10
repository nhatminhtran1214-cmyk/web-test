'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { MapPin, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const { cart } = useCart()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'
  const isLightHeader = !isHome || scrolled

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: isLightHeader ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: isLightHeader ? 'blur(20px)' : 'none',
      borderBottom: isLightHeader ? '1px solid rgba(0,119,182,0.1)' : 'none',
      boxShadow: isLightHeader ? '0 2px 20px rgba(0,119,182,0.08)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={20} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: isLightHeader ? '#0A1628' : 'white', lineHeight: 1.1 }}>VietTravel</div>
            <div style={{ fontSize: '0.68rem', color: isLightHeader ? '#6B7A99' : 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: 1 }}>KHÁM PHÁ VIỆT NAM</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {[['/', 'Trang chủ'], ['/tours', 'Tour du lịch'], ['/tours?region=NORTH', 'Miền Bắc'], ['/tours?region=CENTRAL', 'Miền Trung'], ['/tours?region=SOUTH', 'Miền Nam']].map(([href, label]) => (
            <Link key={href} href={href} style={{
              padding: '8px 14px',
              borderRadius: 99,
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isLightHeader ? '#0A1628' : 'white',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = isLightHeader ? '#f0f7ff' : 'rgba(255,255,255,0.15)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 99, background: isLightHeader ? '#f0f7ff' : 'rgba(255,255,255,0.15)', textDecoration: 'none', transition: 'all 0.2s' }}>
            <ShoppingCart size={20} color={isLightHeader ? '#0077B6' : 'white'} />
            {cart && (
              <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, background: '#F4A261', borderRadius: 99, fontSize: '0.65rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            )}
          </Link>

          {/* Auth */}
          {session ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: isLightHeader ? '#f0f7ff' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: isLightHeader ? '#0077B6' : 'white', fontFamily: 'inherit' }}
              >
                <User size={16} />
                {session.user?.name?.split(' ').pop()}
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 8, minWidth: 180, zIndex: 100 }}>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#0077B6', fontWeight: 600, fontSize: '0.9rem' }}>🛡️ Quản trị</Link>
                  )}
                  <Link href="/my-bookings" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#0A1628', fontWeight: 600, fontSize: '0.9rem' }}>📋 Đơn của tôi</Link>
                  <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
                  <button onClick={() => { signOut(); setUserMenuOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, color: '#DC2626', fontWeight: 600, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" className={`btn ${isLightHeader ? 'btn-outline' : 'btn-ghost'}`} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Đăng nhập</Link>
              <Link href="/register" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Đăng ký</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: isLightHeader ? '#0A1628' : 'white' }} className="mobile-menu-btn">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'white', padding: '16px 24px 24px', borderTop: '1px solid #f0f0f0' }}>
          {[['/', 'Trang chủ'], ['/tours', 'Tour du lịch'], ['/tours?region=NORTH', 'Miền Bắc'], ['/tours?region=CENTRAL', 'Miền Trung'], ['/tours?region=SOUTH', 'Miền Nam']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontWeight: 600, color: '#0A1628', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
