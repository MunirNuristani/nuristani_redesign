"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MIN_VISIBLE_MS = 500;
const SAFETY_TIMEOUT_MS = 4000;

export default function RouteTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const shownAtRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      activeRef.current = true;
      shownAtRef.current = Date.now();
      setActive(true);

      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        activeRef.current = false;
        setActive(false);
      }, SAFETY_TIMEOUT_MS);
    };

    // Capture phase: Next.js's <Link> calls preventDefault() during the bubble phase,
    // so a bubble-phase listener here would see every navigation as already "handled".
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!activeRef.current) return;

    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      activeRef.current = false;
      setActive(false);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    }, remaining);
  }, [pathname]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-(--ground) transition-[opacity,visibility] duration-[350ms] ease-in-out pointer-events-none ${
        active ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0"
      }`}
      aria-hidden={!active}
    >
      <div className="flex flex-col items-center gap-[18px]">
        <Image
          src="/logo_original_noLabel.png"
          alt=""
          width={84}
          height={84}
          priority
          className="animate-[route-transition-pulse_1.1s_ease-in-out_infinite]"
        />
        <div className="w-[120px] h-[3px] rounded-[3px] bg-(--surface-2) overflow-hidden">
          <span className="block w-[40%] h-full rounded-[3px] bg-(--accent) animate-[route-transition-sweep_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
