import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const duration = searchParams.get('duration')
  const featured = searchParams.get('featured')
  const destinationSlug = searchParams.get('destination')

  try {
    const tours = await prisma.tour.findMany({
      where: {
        ...(region ? { destination: { region: region as any } } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { destination: { name: { contains: search, mode: 'insensitive' } } },
          ]
        } : {}),
        ...(minPrice ? { priceAdult: { gte: parseFloat(minPrice) } } : {}),
        ...(maxPrice ? { priceAdult: { lte: parseFloat(maxPrice) } } : {}),
        ...(duration ? { duration } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
        ...(destinationSlug ? { destination: { slug: destinationSlug } } : {}),
      },
      include: {
        destination: { select: { name: true, slug: true, region: true } },
      },
      orderBy: { rating: 'desc' },
    })
    return NextResponse.json(tours)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}
