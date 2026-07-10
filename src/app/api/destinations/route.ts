import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      include: { _count: { select: { tours: true } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(destinations)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}
