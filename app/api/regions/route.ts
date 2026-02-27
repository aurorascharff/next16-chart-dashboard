import { NextResponse } from 'next/server';
import { getRegions } from '@/data/queries/sales';

export async function GET() {
  return NextResponse.json(await getRegions());
}
