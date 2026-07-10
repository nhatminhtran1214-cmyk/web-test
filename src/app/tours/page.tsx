'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

type Tour = {
  id: string; title: string; slug: string; duration: string; durationDays: number
  priceAdult: number; rating: number; reviewCount: number; maxGroupSize: number
  images: string[]; featured: boolean; destination: { name: string; region: string; slug: string }
}

const REGIONS = [
  { label: 'Tất cả miền', value: '' },
  { label: 'Miền Bắc', value: 'NORTH' },
  { label: 'Miền Trung', value: 'CENTRAL' },
  { label: 'Miền Nam', value: 'SOUTH' },
]
const DURATIONS = ['', '2N1Đ', '3N2Đ', '4N3Đ']
const PRICE_RANGES = [
  { label: 'Tất cả', min: '', max: '' },
  { label: 'Dưới 2 triệu', min: '', max: '2000000' },
  { label: '2 – 4 triệu', min: '2000000', max: '4000000' },
  { label: '4 – 6 triệu', min: '4000000', max: '6000000' },
  { label: 'Trên 6 triệu', min: '6000000', max: '' },
]
const SORT_OPTIONS = [
  { label: 'Đánh giá cao', value: 'rating' },
  { label: 'Giá thấp → cao', value: 'price_asc' },
  { label: 'Giá cao → thấp', value: 'price_desc' },
  { label: 'Mới nhất', value: 'newest' },
]

function ToursContent() {
  const searchParams = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [region, setRegion] = useState(searchParams.get('region') || '')
  const [duration, setDuration] = useState('')
  const [priceRange, setPriceRange] = useState(0)
  const [sort, setSort] = useState('rating')
  const [filterOpen, setFilterOpen] = useState(false)

  const fetchTours = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (region) params.set('region', region)
    if (duration) params.set('duration', duration)
    const pr = PRICE_RANGES[priceRange]
    if (pr.min) params.set('minPrice', pr.min)
    if (pr.max) params.set('maxPrice', pr.max)
    if (searchParams.get('destination')) params.set('destination', searchParams.get('destination')!)
    const res = await fetch(`/api/tours?${params}`)
    let data: Tour[] = await res.json()
    if (sort === 'price_asc') data = data.sort((a, b) => a.priceAdult - b.priceAdult)
    else if (sort === 'price_desc') data = data.sort((a, b) => b.priceAdult - a.priceAdult)
    setTours(data)
    setLoading(false)
  }

  useEffect(() => { fetchTours() }, [region, duration, priceRange, sort])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchTours() }

  const resetFilters = () => { setRegion(''); setDuration(''); setPriceRange(0); setSearch(''); setSort('rating') }

  const activeFiltersCount = [region, duration, priceRange > 0].filter(Boolean).length

  return (
    <>
      <Header />

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #003566 100%)', paddingTop: 100, paddingBottom: 48, color: 'white' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 8 }}>Khám phá Tour Du Lịch</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem' }}>
            {loading ? '...' : `${tours.length} tour phù hợp cho bạn`}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginTop: 28, maxWidth: 640 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B7A99' }} />
              <input
                type="text"
                placeholder="Tìm tour, điểm đến..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '13px 16px 13px 46px', borderRadius: 12, border: 'none', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '13px 24px', borderRadius: 12 }}>Tìm</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Sidebar Filter */}
        <aside style={{ width: 260, flexShrink: 0, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={18} color="#0077B6" /> Bộ lọc
              {activeFiltersCount > 0 && <span style={{ background: '#0077B6', color: 'white', borderRadius: 99, padding: '1px 8px', fontSize: '0.78rem' }}>{activeFiltersCount}</span>}
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E76F51', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={13} /> Xóa lọc
              </button>
            )}
          </div>

          {/* Region */}
          <div className="filter-section">
            <span className="filter-label">Khu vực</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REGIONS.map(r => (
                <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: region === r.value ? '#EFF6FF' : 'transparent', transition: 'background 0.2s' }}>
                  <input type="radio" name="region" checked={region === r.value} onChange={() => setRegion(r.value)} style={{ accentColor: '#0077B6' }} />
                  <span style={{ fontWeight: region === r.value ? 700 : 500, color: region === r.value ? '#0077B6' : '#0A1628', fontSize: '0.92rem' }}>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="filter-section">
            <span className="filter-label">Thời gian</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DURATIONS.map(d => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: duration === d ? '#EFF6FF' : 'transparent' }}>
                  <input type="radio" name="duration" checked={duration === d} onChange={() => setDuration(d)} style={{ accentColor: '#0077B6' }} />
                  <span style={{ fontWeight: duration === d ? 700 : 500, color: duration === d ? '#0077B6' : '#0A1628', fontSize: '0.92rem' }}>{d || 'Tất cả'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-section">
            <span className="filter-label">Khoảng giá</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRICE_RANGES.map((pr, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: priceRange === i ? '#EFF6FF' : 'transparent' }}>
                  <input type="radio" name="price" checked={priceRange === i} onChange={() => setPriceRange(i)} style={{ accentColor: '#0077B6' }} />
                  <span style={{ fontWeight: priceRange === i ? 700 : 500, color: priceRange === i ? '#0077B6' : '#0A1628', fontSize: '0.92rem' }}>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#6B7A99', fontSize: '0.92rem' }}>
              <strong style={{ color: '#0A1628' }}>{tours.length}</strong> tour được tìm thấy
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#6B7A99', fontSize: '0.88rem' }}>Sắp xếp:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 32px 8px 12px', borderRadius: 8, border: '1.5px solid #e8edf5', fontFamily: 'inherit', fontSize: '0.88rem', color: '#0A1628', outline: 'none', cursor: 'pointer', background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7A99\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 8px center / 16px', appearance: 'none' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="tour-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: 'white' }}>
                  <div className="skeleton" style={{ height: 220 }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton" style={{ height: 14, width: '60%' }} />
                    <div className="skeleton" style={{ height: 20 }} />
                    <div className="skeleton" style={{ height: 14, width: '45%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#6B7A99' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: '#0A1628' }}>Không tìm thấy tour phù hợp</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button onClick={resetFilters} className="btn btn-primary" style={{ marginTop: 20 }}>Xóa bộ lọc</button>
            </div>
          ) : (
            <div className="tour-grid">
              {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner" /></div>}>
      <ToursContent />
    </Suspense>
  )
}
