"use client";

import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

export interface AlphabetLetter {
  letter: string;
  latin: string;
  name: string;
  description: string;
}

export default function AlphabetClient({ letters }: { letters: AlphabetLetter[] }) {
  const { state } = useAppContext();
  const { language: lang } = state;

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{phrases.kalashaAla[lang]}</p>
          <h1>{phrases.alphabetHeading[lang]}</h1>
          <p className="lede">{phrases.alphabetInfo[lang]}</p>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1080 }}>
        <div className="alpha-grid">
          {letters.map((l, i) => (
            <div className="alpha-card" key={i}>
              <div className="alpha-top">
                <span className="letter">{l.letter}</span>
                <span className="latin mono">{l.latin}</span>
              </div>
              <p className="name">{l.name}</p>
              {l.description && <p className="desc">{l.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
