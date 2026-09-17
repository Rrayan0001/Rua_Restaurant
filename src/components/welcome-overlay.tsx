"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollLock } from "./use-scroll-lock";

const SEEN_KEY = "rua-welcome-seen";
const SHOW_MS = 1800;
const EXIT_MS = 550;

/**
 * Premium welcome intro: a hand-drawn doodle (arch + cloche + steam)
 * sketches itself in, the wordmark rises, then the veil lifts.
 * Shows once per tab session; skipped entirely for reduced motion.
 * ?welcome=stay forces the show for previews without consuming the session.
 */
export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const leftRef = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  useScrollLock(visible);

  const dismiss = useCallback(() => {
    if (leftRef.current) return;
    leftRef.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      // Rendering null keeps this component mounted, so effect cleanup won't
      // run — restore background interactivity here instead of on unmount.
      document
        .querySelectorAll<HTMLElement>("header, main, footer, .mobile-actions")
        .forEach(element => {
          element.inert = false;
        });
      // Preview mode must not consume the once-per-session show.
      const stay = new URLSearchParams(window.location.search).get("welcome") === "stay";
      if (!stay) {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* private mode: replay next visit */
        }
      }
      setVisible(false);
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    // ?welcome=stay freezes the intro for deterministic testing and always
    // forces a show (bypasses the seen check); production never uses it.
    const stay = new URLSearchParams(window.location.search).get("welcome") === "stay";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!stay) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        seen = false;
      }
      if (seen) return;
    }
    // Deferred a frame so the splash mounts after hydration without an SSR mismatch.
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      skipRef.current?.focus({ preventScroll: true });
    });
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer, .mobile-actions"),
    );
    const previous = background.map(element => element.inert);
    background.forEach(element => {
      element.inert = true;
    });
    // Auto-dismiss in production; preview mode stays until Skip/Escape.
    const auto = stay ? 0 : window.setTimeout(dismiss, SHOW_MS);
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(auto);
      background.forEach((element, index) => {
        element.inert = previous[index];
      });
      document.removeEventListener("keydown", onKey);
    };
  }, [dismiss]);

  if (!visible) return null;

  return (
    <div
      className={`welcome ${leaving ? "welcome-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Rua"
    >
      <div className="welcome-inner">
        <p className="welcome-eyebrow">A LITTLE ESCAPE IN YELAHANKA</p>
        <svg className="welcome-doodle" viewBox="0 0 220 168" fill="none" aria-hidden="true">
          <path pathLength={100} d="M42 150 V76 C42 46 68 26 110 26 C152 26 178 46 178 76 V150" />
          <path pathLength={100} d="M58 150 V78 C58 54 76 38 110 38 C144 38 162 54 162 78 V150" />
          <path pathLength={100} d="M80 116 C80 97 93 85 110 85 C127 85 140 97 140 116" />
          <path pathLength={100} d="M72 116 H148" />
          <path pathLength={100} d="M110 85 V77" />
          <path pathLength={100} d="M92 66 c-5-6 5-9 0-15" />
          <path pathLength={100} d="M110 66 c-5-6 5-9 0-15" />
          <path pathLength={100} d="M128 66 c-5-6 5-9 0-15" />
          <path pathLength={100} d="M28 150 H52" />
          <path pathLength={100} d="M168 150 H192" />
          <path
            pathLength={100}
            d="M188 30 l2.2 5.2 5.2 2.2 -5.2 2.2 -2.2 5.2 -2.2-5.2 -5.2-2.2 5.2-2.2 Z"
          />
        </svg>
        <p className="welcome-word">rua</p>
        <p className="welcome-sub">YELAHANKA</p>
        <p className="welcome-tag">Good food. Great company.</p>
        <div className="welcome-loader" aria-hidden="true">
          <span />
        </div>
        <p className="welcome-hint">SETTING YOUR TABLE</p>
      </div>
      <button ref={skipRef} className="welcome-skip" onClick={dismiss}>
        Skip intro
      </button>
    </div>
  );
}
