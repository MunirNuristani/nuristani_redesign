import Hero from "./components/MainPage/Hero";
import LanguageSection from "./components/MainPage/LanguageSection";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
        <Hero />
        <LanguageSection />
    </div>
  );
}
