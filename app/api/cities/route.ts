import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const country = request.nextUrl.searchParams.get('country');

  if (!country) {
    return NextResponse.json([]);
  }

  const cities = await prisma.city.findMany({
    orderBy: { name: 'asc' },
    select: { name: true },
    where: { country: { name: country } },
  });

  return NextResponse.json(cities);
}
