import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BookingSuccessPage() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #f0fdf4)' }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '56px 48px', maxWidth: 520, width: '100%', textAlign: 'center', boxShadow: '0 8px 48px rgba(0,119,182,0.12)' }}>
          <div style={{ width: 96, height: 96, borderRadius: 99, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '2.8rem' }}>
            🎉
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0A1628', marginBottom: 12 }}>Đặt tour thành công!</h1>
          <p style={{ color: '#6B7A99', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
            Cảm ơn bạn đã tin tưởng VietTravel! Đơn đặt tour của bạn đã được ghi nhận và đang <strong style={{ color: '#F4A261' }}>chờ xử lý</strong>. Chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ.
          </p>

          <div style={{ background: '#f8faff', borderRadius: 16, padding: 24, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, color: '#0A1628', marginBottom: 14 }}>📋 Bước tiếp theo:</div>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Kiểm tra email xác nhận đặt tour',
                'Nhân viên sẽ gọi xác nhận trong 2–4 giờ làm việc',
                'Chuẩn bị hành lý và chờ ngày khởi hành',
              ].map((step, i) => (
                <li key={i} style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <Link href="/my-bookings" className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
              📋 Xem đơn đặt của tôi
            </Link>
            <Link href="/tours" className="btn btn-outline" style={{ justifyContent: 'center', padding: '14px' }}>
              🗺️ Khám phá thêm tour
            </Link>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#EFF6FF', borderRadius: 12 }}>
            <p style={{ fontSize: '0.82rem', color: '#0077B6', fontWeight: 600 }}>📞 Cần hỗ trợ? Gọi ngay: <a href="tel:18001234" style={{ color: '#0077B6' }}>1800 1234</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
