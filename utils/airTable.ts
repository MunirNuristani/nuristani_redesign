import Airtable from "airtable";

// Configure Airtable with proper environment variables
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
});

// Use environment variable for base ID
export const base = Airtable.base(process.env.AIRTABLE_BASE_ID || '');
