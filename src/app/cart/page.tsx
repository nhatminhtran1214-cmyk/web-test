'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, Trash2, Calendar, Users, ArrowRight, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function CartPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  if (!cart) return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '100px 24px 60px' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1628' }}>Giỏ hàng trống</h2>
        <p style={{ color: '#6B7A99', textAlign: 'center' }}>Bạn chưa chọn tour nào. Hãy khám phá các tour du lịch tuyệt vời!</p>
        <Link href="/tours" className="btn btn-primary" style={{ padding: '14px 32px' }}>
          <MapPin size={18} /> Khám phá tour
        </Link>
      </div>
      <Footer />
    </>
  )

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi }) } catch { return dateStr }
  }

  return (
    <>
      <Header />
      <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--sand)' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>🛒 Giỏ hàng</h1>
          <p style={{ color: '#6B7A99', marginBottom: 32 }}>Xem lại thông tin trước khi đặt tour</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'flex-start' }}>
            {/* Cart item */}
            <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative', height: 220 }}>
                <img src={cart.tourImage || '/images/placeholder.jpg'} alt={cart.tourTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                  <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{cart.tourTitle}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <MapPin size={13} color="#F4A261" />
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>{cart.destination}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  {[
                    { icon: Calendar, label: 'Ngày khởi hành', value: formatDate(cart.departureDate) },
                    { icon: Users, label: 'Thời gian', value: cart.duration },
                    { icon: Users, label: 'Người lớn', value: `${cart.adults} người` },
                    { icon: Users, label: 'Trẻ em', value: `${cart.children} người` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ padding: 16, background: '#f8faff', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Icon size={14} color="#0077B6" />
                        <span style={{ fontSize: '0.78rem', color: '#6B7A99', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#0A1628' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6B7A99', marginBottom: 8 }}>
                    <span>{cart.adults} người lớn × {cart.priceAdult.toLocaleString('vi-VN')}₫</span>
                    <span>{(cart.adults * cart.priceAdult).toLocaleString('vi-VN')}₫</span>
                  </div>
                  {cart.children > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6B7A99', marginBottom: 8 }}>
                      <span>{cart.children} trẻ em × {cart.priceChild.toLocaleString('vi-VN')}₫</span>
                      <span>{(cart.children * cart.priceChild).toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div style={{ height: 1, background: '#e8edf5', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                    <span>Tổng cộng</span>
                    <span style={{ color: '#0077B6' }}>{cart.totalPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={clearCart} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, border: '1.5px solid #FEE2E2', background: 'transparent', color: '#DC2626', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                    <Trash2 size={16} /> Xóa
                  </button>
                  <Link href={`/tours/${cart.tourSlug}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, border: '1.5px solid #e8edf5', background: 'transparent', color: '#0077B6', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    Chỉnh sửa
                  </Link>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 90 }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 20 }}>Tóm tắt đơn hàng</h3>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <img src={cart.tourImage} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{cart.tourTitle}</div>
                    <div style={{ color: '#6B7A99', fontSize: '0.8rem', marginTop: 4 }}>{cart.duration} • {cart.destination}</div>
                  </div>
                </div>

                <div style={{ background: '#f8faff', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: '#0077B6' }}>
                    <span>Tổng</span>
                    <span>{cart.totalPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div style={{ color: '#6B7A99', fontSize: '0.78rem', marginTop: 4 }}>Đã bao gồm thuế và phí dịch vụ</div>
                </div>
              </div>

              <button
                id="proceed-checkout-btn"
                onClick={() => router.push('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem', borderRadius: 12 }}
              >
                Tiến hành đặt tour <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['✅ Xác nhận ngay qua email', '📞 Hỗ trợ 24/7', '🔒 Bảo mật thanh toán'].map(t => (
                  <div key={t} style={{ fontSize: '0.82rem', color: '#6B7A99' }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
