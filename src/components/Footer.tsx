import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0A1628', color: 'white', padding: '64px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0077B6, #00B4D8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem' }}>VietTravel</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>KHÁM PHÁ VIỆT NAM</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
              Nền tảng đặt tour du lịch Việt Nam uy tín. Trải nghiệm đích thực, giá tốt nhất, dịch vụ tận tâm.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: '🌐', url: '#' },
                { label: '🔵', url: '#' },
                { label: '🔗', url: '#' }
              ].map((item, i) => (
                <a key={i} href={item.url} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none', fontSize: '1.1rem' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0077B6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tours */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#90E0EF' }}>Tour nổi bật</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Vịnh Hạ Long', 'Sapa Trek', 'Phú Quốc', 'Hội An', 'Đà Lạt', 'Ninh Bình'].map(name => (
                <li key={name}>
                  <Link href={`/tours?search=${name}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F4A261')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >{name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#90E0EF' }}>Điểm đến</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Miền Bắc', 'NORTH'], ['Miền Trung', 'CENTRAL'], ['Miền Nam', 'SOUTH']].map(([label, region]) => (
                <li key={region}>
                  <Link href={`/tours?region=${region}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F4A261')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#90E0EF' }}>Liên hệ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                [Phone, '1800 1234 (miễn phí)'],
                [Mail, 'hotro@viettravel.vn'],
                [MapPin, '01 Đường Tràng Tiền, Hoàn Kiếm, Hà Nội'],
              ].map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    <Icon size={16} color="#F4A261" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>© 2024 VietTravel. Tất cả quyền được bảo lưu.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Câu hỏi thường gặp'].map(t => (
              <a key={t} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
