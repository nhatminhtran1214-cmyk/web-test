import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Star, Users } from 'lucide-react'

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
  destination: {
    name: string
    region: string
  }
}

export default function TourCard({ tour }: { tour: Tour }) {
  const regionLabel = tour.destination.region === 'NORTH' ? 'Miền Bắc' : tour.destination.region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam'
  
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={tour.images[0] || '/images/placeholder.jpg'}
          alt={tour.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600 }}>
            {regionLabel}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={13} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0A1628' }}>{tour.rating.toFixed(1)}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={13} color="#0077B6" />
          <span style={{ fontSize: '0.82rem', color: '#0077B6', fontWeight: 600 }}>{tour.destination.name}</span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, color: '#0A1628' }}>{tour.title}</h3>

        <div style={{ display: 'flex', gap: 16, color: '#6B7A99', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={13} />
            <span>{tour.duration}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} />
            <span>Tối đa {tour.maxGroupSize} người</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4 }} className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} fill={i < Math.round(tour.rating) ? '#F59E0B' : 'none'} color="#F59E0B" />
          ))}
          <span style={{ fontSize: '0.8rem', color: '#6B7A99', marginLeft: 4 }}>({tour.reviewCount} đánh giá)</span>
        </div>

        <div className="divider" style={{ margin: '4px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6B7A99' }}>Từ</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0077B6' }}>
              {tour.priceAdult.toLocaleString('vi-VN')}₫
              <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#6B7A99' }}>/người</span>
            </div>
          </div>
          <Link href={`/tours/${tour.slug}`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>Xem tour</Link>
        </div>
      </div>
    </div>
  )
}
