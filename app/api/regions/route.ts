import { NextResponse } from 'next/server';
import { REGIONS_DATA } from '@/data/mock/sales-data';
import { slow } from '@/utils/slow';

export async function GET() {
  await slow();

  const regions = REGIONS_DATA.map(r => {
    return { name: r.name };
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  return NextResponse.json(regions);
}
