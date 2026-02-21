import { type NextRequest, NextResponse } from 'next/server';
import { getSubcategories } from '@/data/queries/sales';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  if (!category) return NextResponse.json([]);
  return NextResponse.json(await getSubcategories(category));
}
