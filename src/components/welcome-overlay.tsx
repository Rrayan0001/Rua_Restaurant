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
        <svg className="welcome-doodle" viewBox="0 0 171 168" fill="none" aria-hidden="true">
          <path pathLength={100} d="M85.5 3.5 a80 80 0 1 0 0.1 0" />
          <path pathLength={100} d="M85.5 10.5 a73 73 0 1 0 0.1 0" />
          <path pathLength={100} d="M85.5 10.5 V46" />
          <path pathLength={100} d="M70 52 L32.5 30.5 M101 52 L138.5 30.5" />
          <path pathLength={100} d="M31 96 L10.5 83.5 M140 96 L160.5 83.5" />
          <path pathLength={100} d="M49 106.5 C40 106 33 103 31 98 C29 93 34 84 45 74 C62 58 77 47 85.5 46 C94 47 109 58 126 74 C137 84 142 93 140 98 C138 103 131 106 122 106.5" />
          <path pathLength={100} d="M85.5 46 V80 M85.5 46 C80 56 73 68 62 78 M85.5 46 C91 56 98 68 109 78" />
          <path pathLength={100} d="M49 106.5 V131.5 M122 106.5 V131.5" />
          <path pathLength={100} d="M27 131.5 H144" />
          <path pathLength={100} d="M73.5 131.5 V110 C73.5 102.5 78.5 97.5 85.5 97.5 C92.5 97.5 97.5 102.5 97.5 110 V131.5" />
          <path pathLength={100} d="M73.5 131.5 L55 154 M97.5 131.5 L116 154" />
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
