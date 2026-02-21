import { type NextRequest, NextResponse } from 'next/server';
import { REGIONS_DATA } from '@/data/mock/sales-data';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const region = request.nextUrl.searchParams.get('region');

  if (!region) {
    return NextResponse.json([]);
  }

  const regionData = REGIONS_DATA.find(r => {
    return r.name === region;
  });
  if (!regionData) {
    return NextResponse.json([]);
  }

  const countries = regionData.countries
    .map(c => {
      return { name: c.name };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return NextResponse.json(countries);
}
