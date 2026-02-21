import { type NextRequest, NextResponse } from 'next/server';
import { getCountries } from '@/data/queries/sales';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region');
  if (!region) return NextResponse.json([]);
  return NextResponse.json(await getCountries(region));
}
