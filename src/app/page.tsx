'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import { MapPin, Search, Star, ChevronRight, Shield, Clock, Headphones, Award } from 'lucide-react'

type Tour = {
  id: string
  title: string
  slug: string
  duration: string
  priceAdult: number
  rating: number
  reviewCount: number
  maxGroupSize: number
  images: string[]
  featured: boolean
  destination: { name: string; region: string; slug: string }
}

type Destination = {
  id: string
  name: string
  slug: string
  region: string
  description: string
  imageUrl: string
  _count: { tours: number }
}

const REGIONS = [
  { label: 'Tất cả', value: '' },
  { label: 'Miền Bắc', value: 'NORTH' },
  { label: 'Miền Trung', value: 'CENTRAL' },
  { label: 'Miền Nam', value: 'SOUTH' },
]

const WHY_US = [
  { icon: Shield, title: 'Uy tín & An toàn', desc: 'Cam kết hoàn tiền 100% nếu tour bị hủy. Mua bảo hiểm du lịch cho mọi hành trình.' },
  { icon: Award, title: 'Chất lượng đảm bảo', desc: 'Hơn 500 tour được kiểm duyệt kỹ lưỡng. Hướng dẫn viên được đào tạo chuyên nghiệp.' },
  { icon: Clock, title: 'Đặt tour dễ dàng', desc: 'Quy trình đặt tour đơn giản 3 bước. Xác nhận ngay lập tức qua email và SMS.' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng. Hỗ trợ khẩn cấp trong suốt chuyến đi.' },
]

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRegion, setActiveRegion] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tours?featured=true').then(r => r.json()),
      fetch('/api/destinations').then(r => r.json()),
    ]).then(([tours, dests]) => {
      setFeaturedTours(tours.slice(0, 6))
      setDestinations(dests.slice(0, 8))
      setLoading(false)
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (activeRegion) params.set('region', activeRegion)
    window.location.href = `/tours?${params.toString()}`
  }

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 640, display: 'flex', alignItems: 'center', paddingTop: '50px', overflow: 'hidden' }}>
        <img
          src="/images/hero-banner.jpg"
          alt="Sapa ruộng bậc thang"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,40,0.75) 0%, rgba(0,119,182,0.4) 100%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
          <div className="animate-fade-up">

            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
              Du Lịch Việt Nam<br />
              <span style={{ background: 'linear-gradient(135deg, #F4A261, #E76F51)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Trọn Vẹn & Đáng Nhớ
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Hơn 100 tour du lịch trong nước chất lượng cao. Từ vịnh Hạ Long huyền thoại đến đảo ngọc Phú Quốc – chúng tôi đưa bạn đến mọi điểm đến Việt Nam.
            </p>

            {/* Search box */}
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: 24, maxWidth: 760, margin: '0 auto', textAlign: 'left' }}>
              {/* Region tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {REGIONS.map(r => (
                  <button key={r.value} onClick={() => setActiveRegion(r.value)} style={{ padding: '6px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', background: activeRegion === r.value ? '#F4A261' : 'rgba(255,255,255,0.15)', color: activeRegion === r.value ? 'white' : 'rgba(255,255,255,0.85)' }}>
                    {r.label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B7A99' }} />
                  <input
                    type="text"
                    placeholder="Tìm điểm đến, tên tour... (VD: Hạ Long, Sapa)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: 12, border: 'none', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', color: '#0A1628' }}
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ padding: '14px 28px', borderRadius: 12, whiteSpace: 'nowrap' }}>
                  <Search size={18} /> Tìm tour
                </button>
              </form>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
              {[['10,000+', 'Khách hài lòng'], ['100+', 'Tour đa dạng'], ['63', 'Tỉnh thành'], ['4.9★', 'Đánh giá']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F4A261' }}>{num}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)' }} className="animate-float">
          <span style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>Cuộn xuống</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)' }} />
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', borderRadius: 99, padding: '4px 14px', marginBottom: 12 }}>
                <MapPin size={13} color="#0077B6" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0077B6', textTransform: 'uppercase', letterSpacing: 0.5 }}>Điểm đến</span>
              </div>
              <h2 className="section-title">Điểm Đến Nổi Bật</h2>
              <p className="section-subtitle">Khám phá những điểm đến đẹp nhất Việt Nam từ Bắc vào Nam</p>
            </div>
            <Link href="/tours" className="btn btn-outline" style={{ flexShrink: 0 }}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>

          <div className="destination-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: 200 }} />
                  </div>
                ))
              : destinations.map(dest => (
                  <Link key={dest.id} href={`/tours?destination=${dest.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 16, overflow: 'hidden', position: 'relative', height: 200, cursor: 'pointer' }}
                    onMouseEnter={e => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.08)' }}
                    onMouseLeave={e => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)' }}
                  >
                    <img src={dest.imageUrl} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>{dest.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', marginTop: 2 }}>{dest._count.tours} tour</div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TOURS ───────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF3CD', borderRadius: 99, padding: '4px 14px', marginBottom: 12 }}>
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nổi bật</span>
              </div>
              <h2 className="section-title">Tour Được Yêu Thích</h2>
              <p className="section-subtitle">Những hành trình được khách hàng đánh giá cao nhất</p>
            </div>
            <Link href="/tours" className="btn btn-outline">
              Tất cả tour <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="tour-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: 'white' }}>
                  <div className="skeleton" style={{ height: 220 }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton" style={{ height: 16, width: '60%' }} />
                    <div className="skeleton" style={{ height: 20, width: '85%' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tour-grid">
              {featuredTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0d2144 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ color: 'white', marginBottom: 12 }}>Tại Sao Chọn VietTravel?</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>Chúng tôi cam kết mang lại trải nghiệm du lịch tuyệt vời nhất cho bạn</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #0077B6, #00B4D8)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={24} color="white" />
                </div>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #F4A261, #E76F51)', padding: '64px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Sẵn sàng cho chuyến phiêu lưu tiếp theo?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Đặt tour ngay hôm nay và nhận ưu đãi đặc biệt cho chuyến đi của bạn
          </p>
          <Link href="/tours" className="btn" style={{ background: 'white', color: '#E76F51', fontWeight: 800, fontSize: '1.05rem', padding: '16px 40px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            Khám phá tour ngay →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
