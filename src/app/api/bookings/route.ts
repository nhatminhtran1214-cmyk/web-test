import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { tourId, departureDate, adults, children, customerName, customerEmail, customerPhone, specialRequests } = body

    const tour = await prisma.tour.findUnique({ where: { id: tourId } })
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 })

    const totalPrice = Number(adults) * tour.priceAdult + Number(children || 0) * tour.priceChild

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        tourId,
        departureDate: new Date(departureDate),
        adults: parseInt(adults),
        children: parseInt(children) || 0,
        totalPrice,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests,
        status: 'PENDING',
      },
      include: { tour: { select: { title: true } } },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { tour: { include: { destination: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
