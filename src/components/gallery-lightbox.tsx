"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gallery } from "@/lib/gallery";
import { useScrollLock } from "./use-scroll-lock";

export default function GalleryLightbox({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const [selected, setSelected] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useScrollLock(true);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function move(step: number) {
    setDirection(step);
    setSelected(current => (current + step + gallery.length) % gallery.length);
  }

  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-label="The Rua mood — illustrative gallery"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}
    >
      <div className="lightbox-content">
        <div className="lightbox-toolbar">
          <span className="eyebrow">A LITTLE OF THE RUA MOOD</span>
          <button autoFocus className="lightbox-close icon-button" onClick={onClose} aria-label="Close gallery"><X /></button>
        </div>
        <div
          className="lightbox-image"
          onTouchStart={event => {
            touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
          }}
          onTouchCancel={() => { touch.current = null; }}
          onTouchEnd={event => {
            if (!touch.current) return;
            const deltaX = event.changedTouches[0].clientX - touch.current.x;
            const deltaY = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) move(deltaX < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <Image
            key={selected}
            className={direction > 0 ? "photo-forward" : "photo-backward"}
            src={gallery[selected].src}
            alt={gallery[selected].alt}
            fill
            sizes="(max-width: 760px) 100vw, 1000px"
            draggable={false}
          />
        </div>
        <div className="lightbox-bottom">
          <div aria-live="polite" aria-atomic="true">
            <h3>{gallery[selected].title}</h3>
            <p>Illustrative imagery · {selected + 1} / {gallery.length}</p>
          </div>
          <div className="lightbox-arrows">
            <button className="icon-button" onClick={() => move(-1)} aria-label="Previous image"><ArrowLeft /></button>
            <button className="icon-button" onClick={() => move(1)} aria-label="Next image"><ArrowRight /></button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
