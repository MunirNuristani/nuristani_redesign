"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

export interface AlphabetLetter {
  letter: string;
  latin: string;
  name: string;
  description: string;
  recordingOgg?: string;
  recordingMp3?: string;
}

export default function AlphabetClient({ letters }: { letters: AlphabetLetter[] }) {
  const { state } = useAppContext();
  const { language: lang } = state;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const toggleAudio = (i: number, src: string) => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (playingIndex === i) {
      audio.pause();
      setPlayingIndex(null);
      return;
    }
    audio.src = src;
    setPlayingIndex(i);
    audio.play().catch(() => setPlayingIndex(null));
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <h1>{phrases.alphabetHeading[lang]}</h1>
          <p className="lede">{phrases.alphabetInfo[lang]}</p>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 1080 }}>
        <div className="bg-(--surface) border border-(--line) rounded-(--radius) overflow-hidden max-[768px]:hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[phrases.letter[lang], phrases.latin[lang], phrases.nameOfLetter[lang], phrases.usage[lang], phrases.listen[lang]].map((label, i) => (
                  <th
                    key={i}
                    className="bg-(--surface-2) mono text-[0.9rem] tracking-[0.08em] uppercase text-(--ink-muted) font-semibold px-[18px] py-[14px] text-start align-middle border-b border-(--line)"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {letters.map((l, i) => {
                const src = l.recordingMp3 || l.recordingOgg || "";
                const isPlaying = playingIndex === i;
                const isLast = i === letters.length - 1;
                const tdBase = `px-[18px] py-[14px] align-middle ${isLast ? "" : "border-b border-(--line)"}`;
                return (
                  <tr key={i} className="hover:bg-(--accent-soft)">
                    <td className={`${tdBase} text-start text-[1.5rem] font-semibold text-(--accent) w-[1%] whitespace-nowrap`}>{l.letter}</td>
                    <td dir="ltr" className={`${tdBase} text-start mono text-[1.1rem] text-(--ink-muted) w-[1%] whitespace-nowrap`}>{l.latin}</td>
                    <td className={`${tdBase} text-start text-[0.9rem] text-(--ink) w-[1%] whitespace-nowrap`}>{l.name}</td>
                    <td className={`${tdBase} text-start text-[0.88rem] leading-[1.7] text-(--ink)`}>{l.description}</td>
                    <td className={`${tdBase} w-[1%] whitespace-nowrap text-center`}>
                      {src && (
                        <button
                          type="button"
                          className={`specimen-play mx-auto${isPlaying ? " is-playing" : ""}`}
                          aria-label={`${phrases.listen[lang]} ${l.letter}`}
                          onClick={() => toggleAudio(i, src)}
                        >
                          {isPlaying ? (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                              <rect x="0" y="0" width="3" height="10" />
                              <rect x="7" y="0" width="3" height="10" />
                            </svg>
                          ) : (
                            <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor" aria-hidden="true">
                              <path d="M0 0L9 5L0 10V0Z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <audio ref={audioRef} onEnded={() => setPlayingIndex(null)} onError={() => setPlayingIndex(null)} />

        <div className="hidden max-[768px]:flex flex-col items-center justify-center gap-[14px] py-[60px] px-5 text-center">
          <p className="text-[1.1rem] text-(--ink-muted) m-0">{phrases.rotate[lang]}</p>
          <Image src="/rotatePhone.svg" alt="Rotate your phone" width={90} height={112} className="w-[90px] h-auto" />
        </div>
      </div>
    </>
  );
}
