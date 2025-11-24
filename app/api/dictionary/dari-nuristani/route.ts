import { NextResponse } from 'next/server';
import wordslist from '../../../../WordBank.json';

export async function GET() {
  return NextResponse.json(wordslist, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
