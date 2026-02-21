import { type NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/data/mock/sales-data';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const category = request.nextUrl.searchParams.get('category');

  if (!category) {
    return NextResponse.json([]);
  }

  const categoryData = CATEGORIES.find(c => {
    return c.name === category;
  });
  if (!categoryData) {
    return NextResponse.json([]);
  }

  const subcategories = categoryData.subcategories
    .map(name => {
      return { name };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return NextResponse.json(subcategories);
}
