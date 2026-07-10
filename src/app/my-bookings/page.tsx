'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Calendar, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

type Booking = {
  id: string; status: string; totalPrice: number; adults: number; children: number
  departureDate: string; createdAt: string; customerName: string
  tour: { title: string; images: string[]; duration: string; destination: { name: string } }
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Chờ xử lý', class: 'badge-pending' },
  CONFIRMED: { label: 'Đã xác nhận', class: 'badge-confirmed' },
  CANCELLED: { label: 'Đã hủy', class: 'badge-cancelled' },
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated') {
      fetch('/api/bookings').then(r => r.json()).then(data => {
        setBookings(data)
        setLoading(false)
      })
    }
  }, [status])

  const formatDate = (d: string) => { try { return format(new Date(d), 'dd/MM/yyyy', { locale: vi }) } catch { return d } }

  return (
    <>
      <Header />
      <div style={{ paddingTop: 90, paddingBottom: 80, minHeight: '100vh', background: 'var(--sand)' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0A1628, #003566)', padding: '40px 0 48px', color: 'white', marginBottom: 40 }}>
          <div className="container">
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, marginBottom: 6 }}>📋 Đơn đặt tour của tôi</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Xin chào, <strong style={{ color: '#F4A261' }}>{session?.user?.name}</strong>! Đây là lịch sử các chuyến đi của bạn.</p>
          </div>
        </div>

        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: 24, display: 'flex', gap: 20 }}>
                  <div className="skeleton" style={{ width: 140, height: 100, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 18, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '45%' }} />
                    <div className="skeleton" style={{ height: 14, width: '55%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>✈️</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Chưa có chuyến đi nào</h3>
              <p style={{ color: '#6B7A99', marginBottom: 24 }}>Hãy đặt tour đầu tiên để bắt đầu hành trình khám phá Việt Nam!</p>
              <Link href="/tours" className="btn btn-primary" style={{ padding: '14px 32px' }}>🗺️ Khám phá tour ngay</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {bookings.map(booking => {
                const statusInfo = STATUS_MAP[booking.status] || { label: booking.status, class: 'badge-pending' }
                return (
                  <div key={booking.id} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)' }}
                  >
                    <img
                      src={booking.tour.images?.[0] || '/images/placeholder.jpg'}
                      alt={booking.tour.title}
                      style={{ width: 160, height: 'auto', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.3 }}>{booking.tour.title}</h3>
                          <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: '0.85rem' }}>
                            <MapPin size={13} color="#0077B6" /> {booking.tour.destination.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: '0.85rem' }}>
                            <Clock size={13} color="#0077B6" /> {booking.tour.duration}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: '0.85rem' }}>
                            <Calendar size={13} color="#0077B6" /> {formatDate(booking.departureDate)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: '0.85rem' }}>
                            <Users size={13} color="#0077B6" /> {booking.adults} người lớn{booking.children > 0 ? `, ${booking.children} trẻ em` : ''}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7A99' }}>Tổng thanh toán</div>
                          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0077B6' }}>{booking.totalPrice.toLocaleString('vi-VN')}₫</div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6B7A99' }}>Đặt ngày {formatDate(booking.createdAt)} • #{booking.id.slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
