"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

export default function NewHistoricImagesPage() {
  const { state } = useAppContext();
  const { language: lang } = state;
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/getHistoricalImages")
      .then((r) => r.json())
      .then((data) => setUrls(data.map((item: { url: string }) => item.url)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{urls.length || "..."} {phrases.images[lang]}</p>
          <h1>{phrases.historicalImageTitle[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1120 }}>
        {loading && <p className="gallery-loading">{phrases.searching[lang]}</p>}
        {!loading && urls.length === 0 && <p className="list-empty">{phrases.notFound[lang]}</p>}
        <div className="gallery-grid">
          {urls.map((url, i) => (
            <div className="gallery-item" key={i} onClick={() => setSelected(url)}>
              <Image src={url} alt={`Historic image ${i + 1}`} width={400} height={300} sizes="220px" style={{ width: "100%", height: "auto" }} />
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <button className="close-btn" aria-label="close" onClick={() => setSelected(null)}>✕</button>
          <Image src={selected} alt="" width={1200} height={900} style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
