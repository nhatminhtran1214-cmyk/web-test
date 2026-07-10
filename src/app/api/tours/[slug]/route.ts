import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        destination: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(tour)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 })
  }
}
