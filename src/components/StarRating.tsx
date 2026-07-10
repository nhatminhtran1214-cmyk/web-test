import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? '#F59E0B' : 'none'}
          color="#F59E0B"
        />
      ))}
    </div>
  )
}
