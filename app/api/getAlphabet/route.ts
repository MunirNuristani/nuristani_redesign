import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable with environment variables
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
});

const base = Airtable.base(process.env.ALPHABET_BASE_ID || process.env.NEXT_PUBLIC_AT_BASE_ID || '');

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Missing AIRTABLE_PERSONAL_ACCESS_TOKEN' },
        { status: 500 }
      );
    }

    if (!process.env.ALPHABET_BASE_ID && !process.env.NEXT_PUBLIC_AT_BASE_ID) {
      return NextResponse.json(
        { error: 'Missing base ID configuration' },
        { status: 500 }
      );
    }

    // Fetch alphabet data from Airtable
    const records = await base('Alphabet')
      .select({
        sort: [{ field: 'No', direction: 'asc' }],
      })
      .all();

    // Transform the data
    const alphabets = records.map(record => ({
      id: record.id,
      fields: record.fields,
    }));

    return NextResponse.json({
      success: true,
      data: alphabets,
      count: alphabets.length,
    });

  } catch (error) {
    console.error('Error fetching alphabet data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch alphabet data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}