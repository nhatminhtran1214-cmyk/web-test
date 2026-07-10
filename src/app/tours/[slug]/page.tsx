'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StarRating from '@/components/StarRating'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'
import {
  MapPin, Clock, Users, Star, ChevronRight, Check, X,
  Calendar, Plus, Minus, ShoppingCart, ChevronDown, ChevronUp
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'

type Itinerary = { day: number; title: string; activities: string[] }
type Review = { id: string; rating: number; comment: string; createdAt: string; user: { name: string; image?: string } }
type Tour = {
  id: string; title: string; slug: string; description: string; duration: string; durationDays: number
  priceAdult: number; priceChild: number; maxGroupSize: number; rating: number; reviewCount: number
  images: string[]; itinerary: Itinerary[]; inclusions: string[]; exclusions: string[]
  destination: { name: string; region: string; slug: string; description: string }
  reviews: Review[]
}

export default function TourDetailPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [departureDate, setDepartureDate] = useState(() => format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [openDay, setOpenDay] = useState<number | null>(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetch(`/api/tours/${slug}`).then(r => r.json()).then(data => {
      setTour(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <><Header />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
      <Footer /></>
  )

  if (!tour) return (
    <><Header />
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>😕</div>
        <h2>Không tìm thấy tour</h2>
        <Link href="/tours" className="btn btn-primary">Xem tất cả tour</Link>
      </div>
      <Footer /></>
  )

  const total = adults * tour.priceAdult + children * tour.priceChild
  const regionLabel = tour.destination.region === 'NORTH' ? 'Miền Bắc' : tour.destination.region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam'

  const handleAddToCart = () => {
    if (!session) { router.push('/login'); return }
    addToCart({
      tourId: tour.id,
      tourTitle: tour.title,
      tourSlug: tour.slug,
      tourImage: tour.images[0],
      priceAdult: tour.priceAdult,
      priceChild: tour.priceChild,
      duration: tour.duration,
      destination: tour.destination.name,
      adults,
      children,
      departureDate,
      totalPrice: total,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div style={{ background: 'white', paddingTop: 82, paddingBottom: 0, borderBottom: '1px solid #f0f5ff' }}>
        <div className="container" style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#6B7A99' }}>
          <Link href="/" style={{ color: '#0077B6', textDecoration: 'none', fontWeight: 500 }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/tours" style={{ color: '#0077B6', textDecoration: 'none', fontWeight: 500 }}>Tour du lịch</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#0A1628', fontWeight: 600 }}>{tour.title}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ background: '#EFF6FF', color: '#0077B6', padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700 }}>{regionLabel}</span>
            <span style={{ background: '#FFF3CD', color: '#92400E', padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700 }}>{tour.duration}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>{tour.title}</h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={15} color="#0077B6" />
              <span style={{ color: '#0077B6', fontWeight: 600 }}>{tour.destination.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StarRating rating={tour.rating} size={15} />
              <span style={{ fontWeight: 700, color: '#0A1628' }}>{tour.rating.toFixed(1)}</span>
              <span style={{ color: '#6B7A99', fontSize: '0.88rem' }}>({tour.reviewCount} đánh giá)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: '0.9rem' }}>
              <Users size={15} /> Tối đa {tour.maxGroupSize} người
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
          {/* Left column */}
          <div>
            {/* Gallery */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 420, marginBottom: 8 }}>
                <img src={tour.images[activeImg] || '/images/placeholder.jpg'} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
              </div>
              {tour.images.length > 1 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {tour.images.map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ width: 88, height: 64, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: activeImg === i ? '3px solid #0077B6' : '3px solid transparent', transition: 'border 0.2s', flexShrink: 0 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 14 }}>Giới thiệu tour</h2>
              <p style={{ color: '#374151', lineHeight: 1.8 }}>{tour.description}</p>
            </div>

            {/* Itinerary */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>Lịch trình chi tiết</h2>
              {(tour.itinerary as Itinerary[]).map((item) => (
                <div key={item.day} style={{ marginBottom: 12 }}>
                  <button
                    onClick={() => setOpenDay(openDay === item.day ? null : item.day)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: openDay === item.day ? '#EFF6FF' : '#f8faff', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s' }}
                  >
                    <div className="itinerary-day-num">{item.day}</div>
                    <span style={{ flex: 1, fontWeight: 700, fontSize: '0.95rem', color: openDay === item.day ? '#0077B6' : '#0A1628' }}>{item.title}</span>
                    {openDay === item.day ? <ChevronUp size={16} color="#0077B6" /> : <ChevronDown size={16} color="#6B7A99" />}
                  </button>
                  {openDay === item.day && (
                    <div style={{ padding: '16px 16px 4px 78px' }}>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {item.activities.map((act, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9rem', color: '#374151' }}>
                            <div style={{ width: 6, height: 6, borderRadius: 99, background: '#0077B6', marginTop: 7, flexShrink: 0 }} />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Inclusions / Exclusions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { title: '✅ Bao gồm', items: tour.inclusions, color: '#065F46', bg: '#D1FAE5', icon: Check },
                { title: '❌ Không bao gồm', items: tour.exclusions, color: '#991B1B', bg: '#FEE2E2', icon: X },
              ].map(({ title, items, color, bg, icon: Icon }) => (
                <div key={title} style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 14, color: '#0A1628' }}>{title}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem', color: '#374151' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 99, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <Icon size={11} color={color} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Reviews */}
            {tour.reviews.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>
                  Đánh giá từ khách hàng
                  <span style={{ background: '#FFF3CD', color: '#92400E', padding: '2px 10px', borderRadius: 99, fontSize: '0.8rem', marginLeft: 10, fontWeight: 700 }}>{tour.reviewCount}</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {tour.reviews.map(review => (
                    <div key={review.id} style={{ padding: 20, background: '#f8faff', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 99, background: 'linear-gradient(135deg, #0077B6, #00B4D8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                          {review.user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{review.user.name}</div>
                          <div style={{ color: '#6B7A99', fontSize: '0.8rem' }}>{format(new Date(review.createdAt), 'dd/MM/yyyy')}</div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}><StarRating rating={review.rating} size={14} /></div>
                      </div>
                      <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.7 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="booking-widget">
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', color: '#6B7A99', marginBottom: 4 }}>Giá từ</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0077B6' }}>
                {tour.priceAdult.toLocaleString('vi-VN')}₫
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6B7A99' }}>/người lớn</span>
              </div>
              <div style={{ color: '#6B7A99', fontSize: '0.85rem' }}>{(tour.priceChild).toLocaleString('vi-VN')}₫/trẻ em</div>
            </div>

            <div className="divider" />

            {/* Departure Date */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}>
                <Calendar size={15} color="#0077B6" /> Ngày khởi hành
              </label>
              <input
                type="date"
                value={departureDate}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                onChange={e => setDepartureDate(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e8edf5', fontFamily: 'inherit', fontSize: '0.92rem', outline: 'none', color: '#0A1628', boxSizing: 'border-box' }}
              />
            </div>

            {/* Adults */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}>
                <Users size={15} color="#0077B6" /> Người lớn
              </label>
              <div className="number-input">
                <button onClick={() => setAdults(Math.max(1, adults - 1))}><Minus size={16} /></button>
                <span>{adults}</span>
                <button onClick={() => setAdults(Math.min(tour.maxGroupSize, adults + 1))}><Plus size={16} /></button>
              </div>
            </div>

            {/* Children */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: '#0A1628' }}>
                <Users size={15} color="#52B788" /> Trẻ em (dưới 12 tuổi)
              </label>
              <div className="number-input">
                <button onClick={() => setChildren(Math.max(0, children - 1))}><Minus size={16} /></button>
                <span>{children}</span>
                <button onClick={() => setChildren(Math.min(10, children + 1))}><Plus size={16} /></button>
              </div>
            </div>

            <div className="divider" />

            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6B7A99' }}>
                <span>{adults} người lớn × {tour.priceAdult.toLocaleString('vi-VN')}₫</span>
                <span>{(adults * tour.priceAdult).toLocaleString('vi-VN')}₫</span>
              </div>
              {children > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6B7A99' }}>
                  <span>{children} trẻ em × {tour.priceChild.toLocaleString('vi-VN')}₫</span>
                  <span>{(children * tour.priceChild).toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="divider" style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#0A1628' }}>
                <span>Tổng cộng</span>
                <span style={{ color: '#0077B6' }}>{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem', borderRadius: 12, background: addedToCart ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : undefined }}
            >
              {addedToCart ? <><Check size={18} /> Đã thêm vào giỏ!</> : <><ShoppingCart size={18} /> Đặt tour ngay</>}
            </button>

            {!session && (
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6B7A99', marginTop: 10 }}>
                Bạn cần <Link href="/login" style={{ color: '#0077B6', fontWeight: 600 }}>đăng nhập</Link> để đặt tour
              </p>
            )}

            <div style={{ marginTop: 20, padding: 14, background: '#f8faff', borderRadius: 10, fontSize: '0.82rem', color: '#6B7A99' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: '#065F46', fontWeight: 600 }}>✅ Hoàn tiền 100% nếu hủy trước 7 ngày</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>📞 Hỗ trợ 24/7 trong suốt hành trình</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔒 Thanh toán bảo mật, an toàn</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
