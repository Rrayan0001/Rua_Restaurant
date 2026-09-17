import Image from "next/image";
import { ArrowDown, ArrowUpRight, Clock3, MapPin, MoveUpRight } from "lucide-react";
import { Header, Reveal, FlavourMenu, Gallery, BookingButton, MotionRibbon, MobileActions } from "@/components/experience";
import { HeroImage } from "@/components/hero-image";
import WelcomeOverlay from "@/components/welcome-overlay";
import { BrandStar } from "@/components/brand-star";
import { restaurant } from "@/lib/restaurant";

function Arch({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 110 130" fill="none" aria-hidden="true"><path d="M10 125V55a45 45 0 0 1 90 0v70M24 125V55a31 31 0 0 1 62 0v70M38 125V55a17 17 0 0 1 34 0v70M0 125h110" stroke="currentColor" strokeWidth="1.2"/><path d="M55 0v12M0 55h11M99 55h11" stroke="currentColor" /></svg>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <WelcomeOverlay />
    <Header />
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <HeroImage />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <div className="eyebrow hero-eyebrow"><span className="little-star"><BrandStar /></span> A LITTLE ESCAPE IN YELAHANKA</div>
          <h1 id="hero-title"><span className="hero-line"><span>Good food.</span></span><span className="hero-line"><em>Great company.</em></span></h1>
          <p>Some places feed you.<br />Some places make you feel at home.</p>
          <div className="hero-actions"><BookingButton className="button button-peach">Find your table <ArrowUpRight size={18} /></BookingButton><a className="hero-menu-link" href="#flavours">A taste of Rua <span><ArrowUpRight size={20} aria-hidden="true" /></span></a></div>
        </div>
        <div className="hero-bottom wrap"><a href="#story" className="scroll-cue"><span><ArrowDown size={16} /></span> GOOD THINGS AWAIT</a><p>YELAHANKA, BENGALURU <span>13.1751° N · 77.5480° E</span></p></div>
        <a className="round-stamp" href="#story" aria-label="Discover the Rua feeling"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="stamp-circle" d="M60,60m-44,0a44,44 0 1,1 88,0a44,44 0 1,1 -88,0" /></defs><text><textPath href="#stamp-circle" textLength="273">COME HUNGRY · LEAVE HAPPY · </textPath></text></svg><span><BrandStar /></span></a>
      </section>

      <MotionRibbon />

      <section id="story" className="story section-light section-space">
        <div className="wrap story-grid">
          <Reveal className="story-images"><div className="story-photo"><Image src="/images/table.jpg" alt="Sunlight falling across a beautifully set table — dining mood imagery" fill sizes="(max-width: 760px) 85vw, 40vw" /></div><div className="story-detail"><Image src="/images/curry.jpg" alt="A richly spiced Indian curry" fill sizes="(max-width: 760px) 42vw, 18vw" /></div><span className="image-caption">THE SIMPLE JOY OF COMING TOGETHER</span><span className="photo-note">a little less rush.<br /><em>a little more Rua.</em></span></Reveal>
          <Reveal className="story-copy"><p className="eyebrow"><span className="line" /> THE RUA FEELING</p><h2>Come for the food.<br />Stay for the <em>feeling.</em></h2><p className="body-copy">The best meals are never just about what’s on the plate. They’re about the people across the table. The conversation that keeps going. The moment you forget to check the time.</p><p className="body-copy">Find your little pause at Rua, Yelahanka. North Indian flavours, good company, and all the reasons to linger a little longer.</p><a className="text-link" href="#visit">Meet us at Rua <ArrowUpRight size={18} /></a><Arch className="story-arch" /></Reveal>
        </div>
      </section>

      <section id="flavours" className="flavours section-space">
        <div className="wrap"><Reveal className="section-heading"><div><p className="eyebrow"><span className="line" /> MADE FOR GOOD COMPANY</p><h2>Big flavours.<br /><em>Beautiful little moments.</em></h2></div><p>A love letter to the Indian table.<br />Explore the flavours that inspire a meal together.</p></Reveal><FlavourMenu /><div className="menu-footer"><p>A little cuisine inspiration. Discover current dishes and prices in the full menu.</p><a href={restaurant.menuUrl} target="_blank" rel="noreferrer" className="button button-outline">Explore the full menu <ArrowUpRight size={18} /></a></div></div>
      </section>

      <section className="interlude" aria-label="Slow down and savour"><Image src="/images/evening.jpg" alt="Lotus pond winding between Rua's earthen pavilions and lush courtyard planting" fill sizes="100vw" /><div className="interlude-shade" /><Reveal className="interlude-copy"><span className="eyebrow">PUT THE WORLD ON PAUSE</span><h2>No rush.<br />Just <em>one more bite.</em></h2><span className="interlude-star" aria-hidden="true"><BrandStar /></span></Reveal><span className="interlude-caption">A MOOD WORTH MAKING TIME FOR</span></section>

      <section id="moments" className="moments section-light section-space"><div className="wrap"><Reveal className="section-heading"><div><p className="eyebrow"><span className="line" /> LITTLE MOMENTS, WELL SPENT</p><h2>Your people.<br /><em>Your kind of place.</em></h2></div><p>A long lunch. A catch-up that was overdue.<br />Or a celebration of absolutely nothing.<br />There’s always a reason to gather.</p></Reveal><Gallery /><div className="moments-bottom"><span>GOOD FOOD IS A REASON. GOOD COMPANY IS THE OCCASION.</span><span className="tiny-flower" aria-hidden="true"><BrandStar /></span></div></div></section>

      <section id="visit" className="visit section-space"><div className="wrap visit-grid"><Reveal className="visit-copy"><p className="eyebrow"><span className="line" /> WE’LL SAVE YOU A SEAT</p><h2>Let’s make<br />a little <em>time.</em></h2><p>Your next good memory could start<br />with a table at Rua.</p><BookingButton className="button button-peach">Plan your visit <ArrowUpRight size={18} /></BookingButton><span className="booking-note">Table reservations via Zomato</span></Reveal><Reveal className="visit-card"><Arch className="visit-arch" /><span className="eyebrow">FIND YOUR WAY TO RUA</span><h3>A little closer<br />to a good time.</h3><div className="visit-details"><div><MapPin size={18} /><p>Yelahanka, Bengaluru<span>Karnataka, India</span></p></div><div><Clock3 size={18} /><p>Every day, {restaurant.hours}<span>Listed hours · confirm when booking</span></p></div></div><a className="text-link" href={restaurant.directionsUrl} target="_blank" rel="noreferrer">Get directions <MoveUpRight size={19} /></a><span className="card-coordinates">13.1751° N &nbsp; / &nbsp; 77.5480° E</span></Reveal></div></section>
    </main>
    <MobileActions />
    <footer className="footer"><div className="wrap"><div className="footer-top"><a className="brand" href="#" aria-label="Rua home"><Image src="/images/logo.png" alt="Rua" width={84} height={80} className="brand-logo-img brand-footer-logo" /><span className="brand-sub">YELAHANKA</span></a><p>Come hungry.<br /><em>Leave a little happier.</em></p><a className="back-top" href="#">BACK TO TOP <ArrowUpRight size={18} /></a></div><div className="footer-links"><span>GOOD FOOD. GREAT COMPANY.</span><nav aria-label="Footer navigation"><a href="#story">Our story</a><a href={restaurant.menuUrl} target="_blank" rel="noreferrer">The menu <ArrowUpRight size="1em" aria-hidden="true" /></a><a href="#visit">Find us</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Rua, Yelahanka</span><span>Made for moments that matter.</span><a href="/credits">Sources & image credits</a></div></div></footer>
  </>;
}
