"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";

type LanguageCode = "en" | "prs" | "ps" | "nr";

const KEYBOARD_CONFIGS = [
  {
    platform: "windows" as const,
    available: true,
    images: ["/keyboardImages/Keyboard.jpg", "/keyboardImages/Keyboard_shift.jpg"],
    downloadUrl: "/keyboard/kalasha.zip",
    guideUrl: (lang: LanguageCode) => `/guides/Installation_Guide_${lang}.pdf`,
  },
  {
    platform: "macos" as const,
    available: false,
    images: [] as string[],
    downloadUrl: undefined,
    guideUrl: undefined,
  },
  {
    platform: "ios" as const,
    available: false,
    images: [] as string[],
    downloadUrl: undefined,
    guideUrl: undefined,
  },
  {
    platform: "android" as const,
    available: true,
    images: ["/keyboardImages/Android_keyboard.jpg", "/keyboardImages/Android_keyboard_shift.jpg"],
    downloadUrl: "https://play.google.com/store/apps/details?id=com.kalasha.keyboard.ala",
    guideUrl: (_lang: LanguageCode) => "https://www.youtube.com/shorts/0Q3OJN_qJew",
  },
];

export default function NewTechnologyPage() {
  const { state } = useAppContext();
  const lang = state.language as LanguageCode;
  const [tab, setTab] = useState(0);

  const {
    keyboards, downloadKeyboardText, download, installationGuide,
    windows, macos, ios, android, comingSoon, availableNow,
    langSupport, langSupportDetail,
    windowsLangSupportDetail, macOSLangSupportDetail,
    IOSLangSupportDetail, AndroidLangSupportDetail, underDev,
  } = phrases;

  const titles = { windows: windows[lang], macos: macos[lang], ios: ios[lang], android: android[lang] };
  const details = {
    windows: windowsLangSupportDetail[lang],
    macos: macOSLangSupportDetail[lang],
    ios: IOSLangSupportDetail[lang],
    android: AndroidLangSupportDetail[lang],
  };

  const config = KEYBOARD_CONFIGS[tab];

  return (
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">
          <p className="kicker">{downloadKeyboardText[lang]}</p>
          <h1>{keyboards[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 820 }}>
        <div className="word-card-full" style={{ marginBottom: 30 }}>
          <p className="wc-gloss-label">{langSupport[lang]}</p>
          <p className="wc-meaning" style={{ marginTop: 0 }}>{langSupportDetail[lang]}</p>
        </div>

        <div className="dict-tabs" role="tablist">
          {KEYBOARD_CONFIGS.map((c, i) => (
            <button key={c.platform} className={tab === i ? "is-active" : ""} onClick={() => setTab(i)}>
              {titles[c.platform]}
            </button>
          ))}
        </div>

        <div className="word-card-full">
          <span
            className={`inline-block px-4 py-[6px] rounded-full text-[0.78rem] font-semibold ${
              config.available ? "bg-(--accent-soft) text-(--accent)" : "bg-(--surface-2) text-(--ink-muted)"
            }`}
          >
            {config.available ? availableNow[lang] : comingSoon[lang]}
          </span>
          <p className="wc-meaning" style={{ marginTop: 16 }}>{details[config.platform]}</p>

          {config.available && config.images.length > 0 && (
            <div className="flex flex-col gap-[14px] mt-[22px]">
              {config.images.map((img) => (
                <Image
                  key={img}
                  src={img}
                  alt={`${titles[config.platform]} keyboard layout`}
                  width={800}
                  height={400}
                  className="border border-(--line) rounded-(--radius)"
                  style={{ width: "100%", height: "auto" }}
                />
              ))}
            </div>
          )}

          {!config.available && (
            <p className="dict-empty" style={{ padding: "36px 0 6px" }}>{underDev[lang]}</p>
          )}

          {config.available && (
            <div className="cta-row" style={{ justifyContent: "flex-start", marginTop: 20 }}>
              {config.downloadUrl && (
                <a href={config.downloadUrl} target="_blank" rel="noopener noreferrer" className="cta solid">
                  {download[lang]}
                </a>
              )}
              {config.guideUrl && (
                <a href={config.guideUrl(lang)} target="_blank" rel="noopener noreferrer" className="cta ghost">
                  {installationGuide[lang]}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
