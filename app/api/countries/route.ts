import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const region = request.nextUrl.searchParams.get('region');

  if (!region) {
    return NextResponse.json([]);
  }

  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
    select: { name: true },
    where: { region: { name: region } },
  });

  return NextResponse.json(countries);
}
