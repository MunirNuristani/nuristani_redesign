import { NextResponse } from 'next/server';
import nuristaniDictionary from '../../../../dictionary_output.json';

export async function GET() {
  return NextResponse.json(nuristaniDictionary, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
