"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

export interface HistoricalFigure {
  id: string;
  imageUrl: string;
  caption: { en: string; prs: string; ps: string; nr: string };
  era: string;
  createdAt: { seconds: number } | null;
}

const ALL_LABEL: Record<string, string> = {
  en: "All eras", prs: "همه دوره‌ها", ps: "ټول دورونه", nr: "ټول دورونه" };

export default function HistoricalFiguresClient({ figures }: { figures: HistoricalFigure[] }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoricalFigure | null>(null);

  const eras = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const f of figures) {
      if (f.era && !seen.has(f.era)) {
        seen.add(f.era);
        list.push(f.era);
      }
    }
    return list;
  }, [figures]);

  const shown = activeEra ? figures.filter((f) => f.era === activeEra) : figures;

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <h1>{phrases.historicalFiguresTitle[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1120 }}>
        {eras.length > 0 && (
          <div className="dict-tabs" role="tablist">
            <button className={activeEra === null ? "is-active" : ""} onClick={() => setActiveEra(null)}>
              {ALL_LABEL[lang] || ALL_LABEL.en}
            </button>
            {eras.map((era) => (
              <button key={era} className={activeEra === era ? "is-active" : ""} onClick={() => setActiveEra(era)}>
                {era}
              </button>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="list-empty">{phrases.notFound[lang]}</p>
        ) : (
          <div className="gallery-grid">
            {shown.map((f) => (
              <div className="gallery-item" key={f.id} onClick={() => setSelected(f)}>
                <div className="gallery-media">
                  <Image
                    src={f.imageUrl}
                    alt={f.caption[lang] || f.caption.en}
                    fill
                    sizes="220px"
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p className="caption">{f.caption[lang] || f.caption.en}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <button className="close-btn" aria-label="close" onClick={() => setSelected(null)}>✕</button>
          <Image
            src={selected.imageUrl}
            alt={selected.caption[lang] || selected.caption.en}
            width={800}
            height={1200}
            unoptimized
            style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "78vh" }}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="caption" onClick={(e) => e.stopPropagation()}>{selected.caption[lang] || selected.caption.en}</p>
        </div>
      )}
    </>
  );
}
