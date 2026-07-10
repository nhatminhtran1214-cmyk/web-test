'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Phone, Mail, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { cart, clearCart } = useCart()
  const [form, setForm] = useState({
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    specialRequests: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!cart) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '100px 24px 60px' }}>
          <div style={{ fontSize: '3rem' }}>🛒</div>
          <h2>Giỏ hàng trống!</h2>
          <Link href="/tours" className="btn btn-primary">Khám phá tour</Link>
        </div>
        <Footer />
      </>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) { router.push('/login'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: cart.tourId,
          departureDate: cart.departureDate,
          adults: cart.adults,
          children: cart.children,
          ...form,
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Đặt tour thất bại.'); setLoading(false); return }
      clearCart()
      router.push('/booking-success')
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  const formatDate = (d: string) => { try { return format(new Date(d), 'EEEE, dd/MM/yyyy', { locale: vi }) } catch { return d } }

  return (
    <>
      <Header />
      <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--sand)' }}>
        <div className="container">
          <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0077B6', fontWeight: 600, textDecoration: 'none', marginBottom: 24, fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Quay lại giỏ hàng
          </Link>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Thông tin đặt tour</h1>
          <p style={{ color: '#6B7A99', marginBottom: 32 }}>Điền đầy đủ thông tin để hoàn tất đặt tour</p>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36, maxWidth: 500 }}>
            {[['1', 'Chọn tour', true], ['2', 'Thông tin', true], ['3', 'Xác nhận', false]].map(([num, label, done], i) => (
              <div key={num as string} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 99, background: done ? '#0077B6' : '#e8edf5', color: done ? 'white' : '#6B7A99', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{num}</div>
                  <span style={{ fontWeight: done ? 700 : 500, color: done ? '#0A1628' : '#6B7A99', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? '#0077B6' : '#e8edf5', margin: '0 12px' }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'flex-start' }}>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <User size={20} color="#0077B6" /> Thông tin liên hệ
                </h2>

                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: '0.9rem' }}>{error}</div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}><User size={14} color="#0077B6" /> Họ và tên *</label>
                    <input id="customerName" name="customerName" type="text" required value={form.customerName} onChange={handleChange} placeholder="Nguyễn Văn A" className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}><Mail size={14} color="#0077B6" /> Email *</label>
                    <input id="customerEmail" name="customerEmail" type="email" required value={form.customerEmail} onChange={handleChange} placeholder="your@email.com" className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}><Phone size={14} color="#0077B6" /> Số điện thoại *</label>
                    <input id="customerPhone" name="customerPhone" type="tel" required value={form.customerPhone} onChange={handleChange} placeholder="0912 345 678" className="input" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}><MessageSquare size={14} color="#0077B6" /> Yêu cầu đặc biệt</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows={4}
                      value={form.specialRequests}
                      onChange={handleChange}
                      placeholder="Ăn chay, trẻ em cần ghế cao, phòng không hút thuốc..."
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #e8edf5', fontFamily: 'inherit', fontSize: '0.95rem', color: '#0A1628', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" required style={{ marginTop: 3, accentColor: '#0077B6', width: 16, height: 16 }} />
                  <span style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Tôi đồng ý với <a href="#" style={{ color: '#0077B6', fontWeight: 600 }}>Điều khoản dịch vụ</a> và <a href="#" style={{ color: '#0077B6', fontWeight: 600 }}>Chính sách hủy tour</a> của VietTravel.
                  </span>
                </label>
              </div>

              <button
                id="confirm-booking-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.05rem', borderRadius: 14, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <><span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Đang xử lý...</> : <><CheckCircle size={20} /> Xác nhận đặt tour</>}
              </button>
            </form>

            {/* Order summary */}
            <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 90 }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 20 }}>Chi tiết đơn hàng</h3>
              <img src={cart.tourImage} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
              <h4 style={{ fontWeight: 800, marginBottom: 4 }}>{cart.tourTitle}</h4>
              <div style={{ color: '#6B7A99', fontSize: '0.85rem', marginBottom: 16 }}>{cart.destination} • {cart.duration}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, padding: 14, background: '#f8faff', borderRadius: 12 }}>
                {[
                  ['📅 Khởi hành', formatDate(cart.departureDate)],
                  ['👤 Người lớn', `${cart.adults} người`],
                  ['👶 Trẻ em', `${cart.children} người`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: '#6B7A99' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: '#0A1628' }}>{value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#e8edf5', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#0077B6' }}>{cart.totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div style={{ padding: 12, background: '#D1FAE5', borderRadius: 10, fontSize: '0.82rem', color: '#065F46', fontWeight: 600, textAlign: 'center' }}>
                ✅ Không cần thanh toán ngay – Xác nhận sẽ được gửi qua email
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
