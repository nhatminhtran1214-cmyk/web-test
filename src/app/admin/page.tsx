'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { MapPin, Users, Calendar, ChevronDown, BarChart2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

type Booking = {
  id: string; status: string; totalPrice: number; adults: number; children: number
  departureDate: string; createdAt: string; customerName: string; customerEmail: string; customerPhone: string
  user: { name: string; email: string }
  tour: { title: string; images: string[]; duration: string; destination: { name: string } }
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ xử lý', color: '#856404', bg: '#FFF3CD' },
  { value: 'CONFIRMED', label: 'Đã xác nhận', color: '#065F46', bg: '#D1FAE5' },
  { value: 'CANCELLED', label: 'Đã hủy', color: '#991B1B', bg: '#FEE2E2' },
]

const STATUS_BADGE_MAP: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Chờ xử lý', class: 'badge-pending' },
  CONFIRMED: { label: 'Đã xác nhận', class: 'badge-confirmed' },
  CANCELLED: { label: 'Đã hủy', class: 'badge-cancelled' },
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') { router.push('/'); return }
      fetchBookings()
    }
  }, [status])

  const fetchBookings = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    setUpdatingId(null)
  }

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus ? b.status === filterStatus : true
    const matchSearch = search ? (
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.tour.title.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase())
    ) : true
    return matchStatus && matchSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    revenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((s, b) => s + b.totalPrice, 0),
  }

  const formatDate = (d: string) => { try { return format(new Date(d), 'dd/MM/yyyy', { locale: vi }) } catch { return d } }

  return (
    <>
      <Header />
      <div style={{ paddingTop: 90, minHeight: '100vh', background: '#f0f5ff' }}>
        {/* Top bar */}
        <div style={{ background: 'linear-gradient(135deg, #0A1628, #0d2a4a)', padding: '32px 0', marginBottom: 32 }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>🛡️ Admin Dashboard</h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>Quản lý đơn đặt tour VietTravel</p>
              </div>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Về trang chủ
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginTop: 28 }}>
              {[
                { label: 'Tổng đơn', value: stats.total, color: '#90E0EF', icon: BarChart2 },
                { label: 'Chờ xử lý', value: stats.pending, color: '#FCD34D', icon: Clock },
                { label: 'Đã xác nhận', value: stats.confirmed, color: '#6EE7B7', icon: CheckCircle },
                { label: 'Đã hủy', value: stats.cancelled, color: '#FCA5A5', icon: XCircle },
                { label: 'Doanh thu', value: `${(stats.revenue / 1000000).toFixed(1)}M₫`, color: '#F4A261', icon: BarChart2 },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon size={16} color={color} />
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>{label}</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.5rem', color: color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: 60 }}>
          {/* Filter bar */}
          <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <input
              type="text"
              placeholder="🔍 Tìm khách hàng, tên tour..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e8edf5', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ value: '', label: 'Tất cả' }, ...STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))].map(opt => (
                <button key={opt.value} onClick={() => setFilterStatus(opt.value)} style={{ padding: '8px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem', background: filterStatus === opt.value ? '#0077B6' : '#f0f5ff', color: filterStatus === opt.value ? 'white' : '#374151', transition: 'all 0.2s' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <span style={{ color: '#6B7A99', fontSize: '0.85rem' }}>{filtered.length} đơn</span>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Khách hàng</th>
                    <th>Khởi hành</th>
                    <th>Số người</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j}><div className="skeleton" style={{ height: 14, borderRadius: 6 }} /></td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#6B7A99' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
                        Không có đơn nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    filtered.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={booking.tour.images?.[0]} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3 }}>{booking.tour.title}</div>
                              <div style={{ color: '#6B7A99', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={10} /> {booking.tour.destination.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{booking.customerName}</div>
                          <div style={{ color: '#6B7A99', fontSize: '0.78rem' }}>{booking.customerPhone}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#374151', fontSize: '0.88rem' }}>
                            <Calendar size={13} color="#0077B6" /> {formatDate(booking.departureDate)}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#374151', fontSize: '0.88rem' }}>
                            <Users size={13} color="#0077B6" /> {booking.adults}+{booking.children}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0077B6', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                            {booking.totalPrice.toLocaleString('vi-VN')}₫
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${STATUS_BADGE_MAP[booking.status]?.class}`}>
                            {STATUS_BADGE_MAP[booking.status]?.label || booking.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ color: '#6B7A99', fontSize: '0.82rem' }}>{formatDate(booking.createdAt)}</div>
                          <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>#{booking.id.slice(-8).toUpperCase()}</div>
                        </td>
                        <td>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={booking.status}
                              disabled={updatingId === booking.id}
                              onChange={e => updateStatus(booking.id, e.target.value)}
                              style={{ padding: '6px 30px 6px 10px', borderRadius: 8, border: '1.5px solid #e8edf5', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', outline: 'none', color: '#0A1628', background: updatingId === booking.id ? '#f0f0f0' : 'white', appearance: 'none' }}
                            >
                              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7A99' }} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
