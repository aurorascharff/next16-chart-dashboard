import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/data/mock/sales-data';
import { slow } from '@/utils/slow';

export async function GET() {
  await slow();

  const categories = CATEGORIES.map(c => {
    return { name: c.name };
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  return NextResponse.json(categories);
}
