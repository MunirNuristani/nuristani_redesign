import Airtable from "airtable";

// Configure Airtable with proper environment variables
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
});

// Use environment variable for base ID
export const Alphabet = Airtable.base(process.env.ALPHABET_BASE_ID || process.env.NEXT_PUBLIC_AT_BASE_ID || '');