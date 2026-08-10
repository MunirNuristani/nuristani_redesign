"use client";

import { useState, useEffect } from "react";
import jalaali from "jalaali-js";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { Language } from "@/context/Reducer";

function daysInJalaaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalaali.isLeapJalaaliYear(jy) ? 30 : 29;
}

function toGregorianLabel(jy: number, jm: number, jd: number): string {
  const { gm, gd } = jalaali.toGregorian(jy, jm, jd);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${gd} ${months[gm - 1]}`;
}

function toFarsiDigits(n: number): string {
  return n.toLocaleString("fa-AF", { useGrouping: false });
}

// Returns offset from Saturday (Sat=0, Sun=1, Mon=2, ..., Fri=6)
function firstDayOfMonth(jy: number, jm: number): number {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, 1);
  const jsDay = new Date(gy, gm - 1, gd).getDay(); // 0=Sun...6=Sat
  return (jsDay + 1) % 7;
}

function getTodayJalali() {
  const today = new Date();
  return jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

function prevMonth(jy: number, jm: number) {
  return jm === 1 ? { jy: jy - 1, jm: 12 } : { jy, jm: jm - 1 };
}

function nextMonth(jy: number, jm: number) {
  return jm === 12 ? { jy: jy + 1, jm: 1 } : { jy, jm: jm + 1 };
}

const INITIAL_YEAR = 1405;

export default function CalendarClient() {
  const { state } = useAppContext();
  const lang = state.language as Language;
  const isRTL = lang !== "en";

  const {
    calendarTitle,
    shamsiMonths,
    shamsiDaysFull,
    today: todayLabel,
    gregorianDate,
    yearLabel,
  } = phrases;

  const monthNames: string[] = shamsiMonths[lang] as string[];
  // Reorder to Sat-start: [Sat, Sun, Mon, Tue, Wed, Thu, Fri]
  const allDays: string[] = shamsiDaysFull[lang] as string[];
  const dayNames = [6, 0, 1, 2, 3, 4, 5].map((i) => allDays[i]);

  const [jy, setJy] = useState(INITIAL_YEAR);
  const [jm, setJm] = useState(1);
  const [todayJalali, setTodayJalali] = useState<{ jy: number; jm: number; jd: number } | null>(null);

  useEffect(() => {
    const t = getTodayJalali();
    setTodayJalali(t);
    setJy(t.jy);
    setJm(t.jm);
  }, []);

  const totalDays = daysInJalaaliMonth(jy, jm);
  const startDow = firstDayOfMonth(jy, jm);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const gregStart = toGregorianLabel(jy, jm, 1);
  const gregEnd = toGregorianLabel(jy, jm, totalDays);

  const handlePrev = () => {
    const p = prevMonth(jy, jm);
    setJy(p.jy);
    setJm(p.jm);
  };

  const handleNext = () => {
    const n = nextMonth(jy, jm);
    setJy(n.jy);
    setJm(n.jm);
  };

  const goToToday = () => {
    if (todayJalali) {
      setJy(todayJalali.jy);
      setJm(todayJalali.jm);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Page title */}
        <h1 className="text-center text-3xl font-bold text-(--color-secondary) mb-6">
          {calendarTitle[lang]}
        </h1>

        {/* Navigation header */}
        <div
          className="bg-(--color-secondary) rounded-xl px-5 py-4 shadow-md flex items-center justify-between mb-1"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <button
            onClick={handlePrev}
            aria-label="Previous month"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <p className="text-white font-bold text-xl">
              {monthNames[jm - 1]}
            </p>
            <p className="text-white/75 text-lg">
              {yearLabel[lang]}: {isRTL ? toFarsiDigits(jy) : jy}
            </p>
            <p className="text-white/60 text-lg mt-0.5">
              {gregorianDate[lang]}: {gregStart} – {gregEnd}
            </p>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next month"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Today button */}
        <div className="flex justify-center mb-4 mt-2">
          <button
            onClick={goToToday}
            className="text-lg font-semibold text-(--color-primary) hover:underline"
          >
            ← {todayLabel[lang]}
          </button>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200" dir={isRTL ? "rtl" : "ltr"}>
            {dayNames.map((d, i) => (
              <div
                key={i}
                className={`text-center text-lg font-semibold py-3 ${
                  i === 6 ? "text-green-600" : "text-gray-500"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 p-2 gap-1" dir={isRTL ? "rtl" : "ltr"}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className="h-20" />;

              const isToday =
                todayJalali?.jy === jy &&
                todayJalali?.jm === jm &&
                todayJalali?.jd === day;

              const colIndex = idx % 7;
              const isFriday = colIndex === 6; // Friday is last column in Sat-start week
              const gregLabel = toGregorianLabel(jy, jm, day);

              return (
                <div
                  key={idx}
                  className={`h-20 flex flex-col items-center justify-center rounded-xl transition-colors ${
                    isToday
                      ? "bg-[var(--color-accent)] text-white shadow-md"
                      : isFriday
                      ? "text-green-600 hover:bg-green-50"
                      : "text-gray-800 hover:bg-blue-50"
                  }`}
                >
                  <span className={`text-2xl font-bold leading-none ${isToday ? "text-white" : ""}`}>
                    {isRTL ? toFarsiDigits(day) : day}
                  </span>
                  <span className={`text-xs mt-1.5 leading-none ${isToday ? "text-white/80" : "text-gray-400"}`}>
                    {gregLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today indicator */}
        {todayJalali && (
          <p className="text-center text-lg text-gray-500 mt-4">
            {todayLabel[lang]}:{" "}
            <span className="font-semibold text-gray-700">
              {isRTL
                ? `${toFarsiDigits(todayJalali.jd)} ${monthNames[todayJalali.jm - 1]} ${toFarsiDigits(todayJalali.jy)}`
                : `${monthNames[todayJalali.jm - 1]} ${todayJalali.jd}, ${todayJalali.jy}`}
            </span>
            {" · "}
            {gregorianDate[lang]}: <span className="font-semibold text-gray-700">{toGregorianLabel(todayJalali.jy, todayJalali.jm, todayJalali.jd)}</span>
          </p>
        )}

      </div>
    </div>
  );
}
