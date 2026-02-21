import { NextResponse } from 'next/server';
import { getCategories } from '@/data/queries/sales';

export async function GET() {
  return NextResponse.json(await getCategories());
}
