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

export default function NewCalendarPage() {
  const { state } = useAppContext();
  const lang = state.language as Language;
  const isRTL = lang !== "en";

  const { calendarTitle, shamsiMonths, shamsiDaysFull, today: todayLabel, gregorianDate, yearLabel } = phrases;

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
          <p className="kicker">{yearLabel[lang]} {isRTL ? toFarsiDigits(jy) : jy}</p>
          <h1>{calendarTitle[lang]}</h1>
        </div>
      </section>

      <div className="dict-results" style={{ maxWidth: 640 }}>
        <div className="cal-card">
          <div className="cal-nav">
            <button onClick={handlePrev} aria-label="Previous month" className={isRTL ? "flip" : ""}>‹</button>
            <div className="cal-nav-label">
              <p className="month">{monthNames[jm - 1]}</p>
              <p className="sub mono">{gregorianDate[lang]}: {gregStart} – {gregEnd}</p>
            </div>
            <button onClick={handleNext} aria-label="Next month" className={isRTL ? "flip" : ""}>›</button>
          </div>

          <button className="cal-today-btn" onClick={goToToday}>{todayLabel[lang]}</button>

          <div className="cal-grid cal-dow">
            {dayNames.map((d, i) => (
              <div key={i} className={i === 6 ? "is-friday" : ""}>{d}</div>
            ))}
          </div>

          <div className="cal-grid">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className="cal-cell is-empty" />;
              const isToday = todayJalali?.jy === jy && todayJalali?.jm === jm && todayJalali?.jd === day;
              const isFriday = idx % 7 === 6;
              return (
                <div key={idx} className={`cal-cell${isToday ? " is-today" : ""}${isFriday ? " is-friday" : ""}`}>
                  <span className="d">{isRTL ? toFarsiDigits(day) : day}</span>
                  <span className="g mono">{toGregorianLabel(jy, jm, day)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {todayJalali && (
          <p className="cal-today-line">
            {todayLabel[lang]}:{" "}
            <strong>
              {isRTL
                ? `${toFarsiDigits(todayJalali.jd)} ${monthNames[todayJalali.jm - 1]} ${toFarsiDigits(todayJalali.jy)}`
                : `${monthNames[todayJalali.jm - 1]} ${todayJalali.jd}, ${todayJalali.jy}`}
            </strong>
            {" · "}
            {gregorianDate[lang]}: <strong>{toGregorianLabel(todayJalali.jy, todayJalali.jm, todayJalali.jd)}</strong>
          </p>
        )}
      </div>
    </>
  );
}
