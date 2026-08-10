import { NextRequest, NextResponse } from 'next/server';
import wordsList from '../../../../WordBank.json';
import nuristaniDictionary from '../../../../dictionary_output.json';
import { suggestWords, searchWords, WordData, NuristaniWordData } from '@/utils/dictionarySearch';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dict = searchParams.get('dict') === 'nuristaniToPashtoDari'
    ? 'nuristaniToPashtoDari'
    : 'dariToNuristani';
  const q = searchParams.get('q') ?? '';
  const mode = searchParams.get('mode') === 'suggest' ? 'suggest' : 'search';

  const headers = {
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
  };

  if (!q.trim()) {
    return NextResponse.json(
      mode === 'suggest' ? { suggestions: [] } : { exactMatches: [], similarWords: [] },
      { headers }
    );
  }

  if (dict === 'dariToNuristani') {
    const data = wordsList as WordData[];
    if (mode === 'suggest') {
      return NextResponse.json({ suggestions: suggestWords(data, q) }, { headers });
    }
    return NextResponse.json(searchWords(data, q), { headers });
  }

  const data = nuristaniDictionary as NuristaniWordData[];
  if (mode === 'suggest') {
    return NextResponse.json({ suggestions: suggestWords(data, q) }, { headers });
  }
  return NextResponse.json(searchWords(data, q), { headers });
}
