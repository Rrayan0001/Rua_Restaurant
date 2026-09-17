"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight, ArrowLeft, ArrowRight, MapPin, Utensils, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent, type MouseEvent } from "react";
import { flavours, restaurant } from "@/lib/restaurant";
import { gallery } from "@/lib/gallery";
import { useScrollLock } from "./use-scroll-lock";
import { BrandStar } from "./brand-star";

const GalleryLightbox = dynamic(() => import("./gallery-lightbox"), { ssr: false });
const links = [
  { id: "story", label: "Our story" },
  { id: "flavours", label: "The flavours" },
  { id: "moments", label: "The moments" },
  { id: "visit", label: "Find us" },
];

export function BookingButton({ children, className }: { children: ReactNode; className?: string }) {
  return <a className={className} href={restaurant.bookingUrl} target="_blank" rel="noreferrer">{children}</a>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (document.body.style.position === "fixed") return;
        setScrolled(window.scrollY > 32);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -60% 0px" });
    links.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer, .mobile-actions"));
    const previous = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key !== "Tab") return;
      const items = header.current?.querySelectorAll<HTMLElement>("a, button");
      const first = items?.[0];
      const last = items?.[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const media = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", onKey);
    return () => {
      background.forEach((element, index) => { element.inert = previous[index]; });
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!open) return;
    event.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      const section = document.getElementById(id);
      history.pushState(null, "", `#${id}`);
      section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      if (section) { section.tabIndex = -1; section.focus({ preventScroll: true }); }
    });
  }

  return (
    <header ref={header} className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <div className="wrap header-inner">
        <a href="#" className="brand" aria-label="Rua home" onClick={() => setOpen(false)}>rua<span>YELAHANKA</span></a>
        <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
          <span className="menu-icon" aria-hidden="true"><span /><span /></span>
        </button>
        <nav id="main-nav" ref={nav} aria-label="Main navigation" className={open ? "open" : ""}>
          <span className="mobile-nav-eyebrow eyebrow">MAKE YOURSELF AT HOME</span>
          {links.map((link, index) => <a key={link.id} href={`#${link.id}`} aria-current={active === link.id && scrolled ? "location" : undefined} onClick={event => navigate(event, link.id)} style={{ animationDelay: `${index * 45}ms` }}><span className="nav-index" aria-hidden="true">0{index + 1}</span>{link.label}<ArrowUpRight className="mobile-nav-arrow" size={22} /></a>)}
          <BookingButton className="nav-book">A table for you <ArrowUpRight size={18} /></BookingButton>
          <span className="mobile-nav-note">Yelahanka, Bengaluru · A little escape.</span>
        </nav>
      </div>
      <div ref={progress} className="reading-progress" aria-hidden="true" />
    </header>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const show = () => { element.classList.remove("reveal-waiting"); element.classList.add("is-revealed"); };
    if (media.matches || element.getBoundingClientRect().top < window.innerHeight) { show(); return; }
    element.classList.add("reveal-waiting");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { show(); observer.disconnect(); }
    }, { threshold: 0.08 });
    const reduce = () => { if (media.matches) { show(); observer.disconnect(); } };
    observer.observe(element);
    media.addEventListener("change", reduce);
    return () => { observer.disconnect(); media.removeEventListener("change", reduce); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function MotionRibbon() {
  const [paused, setPaused] = useState(false);
  const ribbon = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(paused);
    return () => { delete document.documentElement.dataset.motionPaused; };
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("ambient-visible", entry.isIntersecting));
    });
    if (ribbon.current) observer.observe(ribbon.current);
    const stamp = document.querySelector(".round-stamp");
    if (stamp) observer.observe(stamp);
    return () => observer.disconnect();
  }, []);
  const words = ["NORTH INDIAN SOUL", "A TABLE FOR EVERY STORY", "YELAHANKA, WITH LOVE", "MAKE YOURSELF AT HOME"];
  return <div className="welcome-ribbon" ref={ribbon}>
    <div className="ribbon-window" tabIndex={0} role="region" aria-label="Rua welcome messages"><div className="ribbon-track">
      {[0, 1].map(copy => <div className="ribbon-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{words.map(word => <span key={word}>{word}<span className="ribbon-flower" aria-hidden="true"><BrandStar /></span></span>)}</div>)}
    </div></div>
    <button className="ribbon-control" aria-label={paused ? "Play ambient motion" : "Pause ambient motion"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
  </div>;
}

export function MobileActions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height || 80;
    const observer = new IntersectionObserver(([entry]) => {
      if (document.body.style.position !== "fixed") setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= headerHeight);
    }, { rootMargin: `-${headerHeight}px 0px 0px` });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return <nav className={`mobile-actions ${visible ? "actions-visible" : ""}`} aria-label="Quick restaurant actions" inert={!visible}>
    <a href={restaurant.menuUrl} target="_blank" rel="noreferrer"><Utensils size={18} /><span>Menu</span></a>
    <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /><span>Directions</span></a>
    <BookingButton className="mobile-reserve">Find a table <ArrowUpRight size={18} /></BookingButton>
  </nav>;
}

const filters = ["The whole table", "Vegetarian", "Non-vegetarian"];

export function FlavourMenu() {
  const [active, setActive] = useState(filters[0]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const selectionVersion = useRef(0);
  const shown = active === filters[0] ? flavours : flavours.filter(item => item.category === active);
  function select(filter: string) {
    const version = ++selectionVersion.current;
    if (filter === active) return;
    const cards = panel.current?.querySelectorAll<HTMLElement>(".dish-card");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !cards) { setActive(filter); return; }
    // Exit and enter use opacity/transform only. No animation dependency required.
    const commit = () => { if (selectionVersion.current === version) setActive(filter); };
    Promise.all(Array.from(cards, card => card.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(6px)" }], { duration: 100 }).finished)).then(commit).catch(commit);
  }
  function handleKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % filters.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + filters.length) % filters.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = filters.length - 1;
    else return;
    event.preventDefault();
    select(filters[next]);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  return <>
    <div className="menu-tabs" role="tablist" aria-label="Explore cuisine inspiration">
      {filters.map((filter, index) => <button key={filter} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`flavour-tab-${index}`} aria-selected={active === filter} aria-controls="flavour-panel" tabIndex={active === filter ? 0 : -1} onKeyDown={event => handleKey(event, index)} onClick={() => select(filter)}>{filter}<span>{index === 0 ? "03" : index === 1 ? "02" : "01"}</span></button>)}
    </div>
    <div ref={panel} id="flavour-panel" role="tabpanel" tabIndex={0} aria-labelledby={`flavour-tab-${filters.indexOf(active)}`} className="dish-grid">
      {shown.map((dish, index) => <article className="dish-card" key={`${active}-${dish.title}`} style={{ animationDelay: `${index * 45}ms` }}>
        <div className="dish-image"><Image src={dish.image} alt={dish.alt} fill sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 760px) 44vw, 30vw" quality={65} /><span className="dish-number">0{flavours.indexOf(dish) + 1}</span><span className="dish-tag"><span className={dish.category === "Vegetarian" ? "veg-dot" : "nonveg-dot"} />{dish.category}</span></div>
        <div className="dish-caption"><span className="eyebrow">{dish.label}</span><h3>{dish.title}</h3><p>{dish.description}</p><span className="dish-rule" /></div>
      </article>)}
    </div>
    <span className="sr-only" role="status">{shown.length} cuisine inspirations shown.</span>
  </>;
}

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const open = selected !== null;

  useEffect(() => {
    if (!open) lastTrigger.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index)); });
    }, { root: element, threshold: 0.65 });
    element.querySelectorAll(".gallery-item").forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    const element = track.current;
    const item = element?.children[index] as HTMLElement | undefined;
    if (!element || !item) return;
    element.scrollTo({ left: item.offsetLeft - (element.clientWidth - item.clientWidth) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <>
    <div className="gallery-grid" ref={track} aria-label="Dining moments gallery">
      {gallery.map((image, index) => <button data-index={index} className={`gallery-item gallery-item-${index}`} key={image.src} aria-label={`View ${image.title}`} onClick={event => { lastTrigger.current = event.currentTarget; setSelected(index); }}>
        <div className="gallery-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 80vw, 30vw" quality={65} /><span className="gallery-expand"><ArrowUpRight size={22} /></span></div>
        <div className="gallery-caption"><span>{image.sub}</span><h3>{image.title}</h3></div>
      </button>)}
    </div>
    <div className="gallery-controls">
      <span className="gallery-hint">SWIPE. SLOW DOWN. STAY A WHILE.</span>
      <div className="gallery-pagination">{gallery.map((image, index) => <button key={image.src} aria-label={`Show ${image.title}`} aria-current={current === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}</div>
      <div className="gallery-nav"><button aria-label="Previous gallery card" disabled={current === 0} onClick={() => goTo(current - 1)}><ArrowLeft size={18} /></button><button aria-label="Next gallery card" disabled={current === gallery.length - 1} onClick={() => goTo(current + 1)}><ArrowRight size={18} /></button></div>
    </div>
    {open && <GalleryLightbox initialIndex={selected} onClose={() => setSelected(null)} />}
  </>;
}
