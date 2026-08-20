"use client";

import jalaali from "jalaali-js";
import { useState, useEffect } from "react";
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

export default function NewCalendarPage() {
  const { state } = useAppContext();
  const lang = state.language as Language;
  const isRTL = lang !== "en";

  const { calendarTitle, shamsiMonths, shamsiDaysFull, today: todayLabel, gregorianDate } = phrases;

  const monthNames: string[] = shamsiMonths[lang] as string[];
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
    <>
      <section className="page-hero">
        <div className="hero-bg" />
        <div className="wrap">

          <h1> {calendarTitle[lang]}</h1>
        </div>
      </section>
      <div className="dict-results" style={{ maxWidth: 640 }}>
        {todayJalali && (jy !== todayJalali.jy || jm !== todayJalali.jm) && (
          <button
            className="block w-full text-center text-[0.85rem] text-(--accent) mb-[14px] p-2 bg-(--accent-soft) border-0 rounded-lg cursor-pointer underline underline-offset-[3px] transition-colors duration-150 ease-in-out hover:bg-(--surface-2)"
            onClick={goToToday}
          >
            {todayLabel[lang]}:{" "}
            <strong className="text-(--ink) no-underline">
              {isRTL
                ? `${toFarsiDigits(todayJalali.jd)} ${monthNames[todayJalali.jm - 1]} ${toFarsiDigits(todayJalali.jy)}`
                : `${monthNames[todayJalali.jm - 1]} ${todayJalali.jd}, ${todayJalali.jy}`}
            </strong>
            {" · "}
            {gregorianDate[lang]}:{" "}
            <strong className="text-(--ink) no-underline">{toGregorianLabel(todayJalali.jy, todayJalali.jm, todayJalali.jd)}</strong>
          </button>
        )}

        <div className="bg-(--surface) border border-(--line) rounded-(--radius) p-[26px] max-[860px]:p-4">
          <div className="flex items-center justify-between gap-[14px] mb-[18px]">
            <button
              className="w-[38px] h-[38px] flex-none rounded-full border border-(--line) bg-(--surface-2) text-(--ink) text-[1.3rem] leading-none hover:border-(--accent) hover:text-(--accent)"
              onClick={handlePrev}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="text-center">
              <div className="flex flex-row items-center gap-2">
                <p className="text-[1.3rem] font-semibold m-0 max-[860px]:text-[1.1rem]">{monthNames[jm - 1]}</p>
                <p className="text-[1.3rem] font-semibold m-0 max-[860px]:text-[1.1rem]"> {isRTL ? toFarsiDigits(jy) : jy}</p>
              </div>
              <p className="mono text-[0.78rem] text-(--ink-muted) mt-[2px]">
                {gregorianDate[lang]}: {gregStart} – {gregEnd}
              </p>
            </div>
            <button
              className="w-[38px] h-[38px] flex-none rounded-full border border-(--line) bg-(--surface-2) text-(--ink) text-[1.3rem] leading-none hover:border-(--accent) hover:text-(--accent)"
              onClick={handleNext}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0 bg-(--surface-2) rounded-lg overflow-hidden mb-[14px]">
            {dayNames.map((d, i) => (
              <div
                key={i}
                className={`text-center mono text-[0.9rem] uppercase tracking-[0.04em] text-(--ink-muted) px-1 py-[11px] max-[860px]:text-[0.46rem] max-[860px]:tracking-normal max-[860px]:px-px max-[860px]:py-2 max-[860px]:whitespace-nowrap max-[860px]:overflow-hidden max-[860px]:text-ellipsis rtl:text-[1.2rem] rtl:normal-case rtl:tracking-normal max-[860px]:rtl:text-[0.78rem] ${
                  i === 0 ? "border-s-0" : "border-s border-(--surface)"
                } ${i === 6 ? "text-(--accent) font-semibold bg-(--accent-soft)" : ""}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 max-[860px]:gap-[3px]">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className="aspect-square invisible" />;
              const isToday = todayJalali?.jy === jy && todayJalali?.jm === jm && todayJalali?.jd === day;
              const isFriday = idx % 7 === 6;
              return (
                <div
                  key={idx}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg hover:bg-(--accent-soft) ${
                    isToday ? "bg-(--accent)" : ""
                  }`}
                >
                  <span
                    className={`text-[1.05rem] font-semibold leading-none ${
                      isToday ? "text-white" : isFriday ? "text-(--accent)" : ""
                    }`}
                  >
                    {isRTL ? toFarsiDigits(day) : day}
                  </span>
                  <span className={`mono text-[0.62rem] mt-[3px] ${isToday ? "text-white" : "text-(--ink-muted)"}`}>
                    {toGregorianLabel(jy, jm, day)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </>
  );
}
