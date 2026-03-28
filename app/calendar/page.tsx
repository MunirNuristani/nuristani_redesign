import CalendarClient from './CalendarClient';

export const metadata = {
  title: 'Hijri Shamsi Calendar - Afghan Solar Calendar',
  description: 'Interactive Hijri Shamsi (Afghan Solar) calendar. Convert dates between the Afghan solar calendar and Gregorian calendar. View the current date in the Afghan calendar system used in Afghanistan.',
  keywords: [
    'Hijri Shamsi calendar',
    'Afghan solar calendar',
    'Afghanistan calendar',
    'Shamsi date',
    'تقویم هجری شمسی',
    'تقویم افغانستان',
  ],
  openGraph: {
    title: 'Hijri Shamsi Calendar - Afghan Solar Calendar',
    description: 'Interactive Afghan solar calendar — view and convert Hijri Shamsi dates',
    url: 'https://nuristani.info/calendar',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nuristani.info/calendar',
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
