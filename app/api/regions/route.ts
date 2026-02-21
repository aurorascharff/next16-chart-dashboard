import { NextResponse } from 'next/server';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function GET() {
  await slow();

  const regions = await prisma.region.findMany({
    orderBy: { name: 'asc' },
    select: { name: true },
  });
  return NextResponse.json(regions);
}
