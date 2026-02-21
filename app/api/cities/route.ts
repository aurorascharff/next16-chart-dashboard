import { type NextRequest, NextResponse } from 'next/server';
import { REGIONS_DATA } from '@/data/mock/sales-data';
import { slow } from '@/utils/slow';

export async function GET(request: NextRequest) {
  await slow();

  const region = request.nextUrl.searchParams.get('region');
  const country = request.nextUrl.searchParams.get('country');

  if (!region) {
    return NextResponse.json([]);
  }

  const regionData = REGIONS_DATA.find(r => {
    return r.name === region;
  });
  if (!regionData) {
    return NextResponse.json([]);
  }

  const countries = country
    ? regionData.countries.filter(c => {
        return c.name === country;
      })
    : regionData.countries;

  const cities = countries
    .flatMap(c => {
      return c.cities.map(name => {
        return { name };
      });
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return NextResponse.json(cities);
}
