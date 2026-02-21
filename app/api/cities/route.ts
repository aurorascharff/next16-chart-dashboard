import { type NextRequest, NextResponse } from 'next/server';
import { getCities } from '@/data/queries/sales';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region');
  const country = request.nextUrl.searchParams.get('country');
  if (!region) return NextResponse.json([]);
  return NextResponse.json(await getCities(region, country));
}
