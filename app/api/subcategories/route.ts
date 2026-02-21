import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const category = request.nextUrl.searchParams.get('category');

  if (!category) {
    return NextResponse.json([]);
  }

  const subcategories = await prisma.subcategory.findMany({
    orderBy: { name: 'asc' },
    select: { name: true },
    where: { category: { name: category } },
  });

  return NextResponse.json(subcategories);
}
