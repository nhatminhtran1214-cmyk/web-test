import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { CartProvider } from '@/context/CartContext'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VietTravel – Khám Phá Việt Nam',
  description: 'Đặt tour du lịch Việt Nam chất lượng cao, giá tốt nhất. Khám phá Hạ Long, Sapa, Đà Lạt, Phú Quốc, Hội An và nhiều hơn nữa.',
  keywords: 'tour du lịch việt nam, đặt tour, hạ long, sapa, đà lạt, phú quốc, hội an',
  openGraph: {
    title: 'VietTravel – Khám Phá Việt Nam',
    description: 'Nền tảng đặt tour du lịch Việt Nam uy tín số 1',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="vi">
      <body className={beVietnamPro.className}>
        <SessionProvider session={session}>
          <CartProvider>
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
