import Link from "next/link";
import { restaurant } from "@/lib/restaurant";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sources & image credits — Rua" };

export default function Credits() {
  return (
    <main className="credits-page wrap">
      <Link className="text-link" href="/">← Back to Rua</Link>
      <p className="eyebrow">THE DETAILS BEHIND THE DESIGN</p>
      <h1>Sources &<br /><em>image credits.</em></h1>
      <h2>Restaurant information</h2>
      <p>
        Rua is listed in Yelahanka, Bengaluru, serving North Indian vegetarian and
        non-vegetarian food. Listed opening hours are 11 AM to 11 PM daily.
        Location coordinates and hours were sourced from{" "}
        <a href={restaurant.listingUrl} target="_blank" rel="noreferrer">EazyDiner</a>,
        accessed 17 September 2026. Please confirm hours directly when planning a visit.
      </p>
      <p>
        Menu and booking links lead to Rua’s published Zomato listing. Reservations
        are completed on Zomato and are subject to the restaurant’s availability.
        This website does not process or confirm reservations.
      </p>
      <h2>Photography & creative direction</h2>
      <p>
        The interior photographs are illustrative Unsplash images selected for this
        portfolio design; they do not depict Rua’s verified premises. Cuisine cards
        are editorial inspiration, not a confirmed menu. No individual dish prices,
        customer reviews, or awards have been invented.
      </p>
      <ul>
        <li><a href="https://images.unsplash.com/photo-1552566626-52f8b828add9">Hero interior</a> — Unsplash.</li>
        <li><a href="https://images.unsplash.com/photo-1414235077428-338989a2e8c0">Dining table</a> — Unsplash.</li>
        <li><a href="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4">Evening interior</a> — Unsplash.</li>
        <li><a href="https://images.unsplash.com/photo-1631452180519-c014fe946bc7">Curry photograph</a> — Unsplash.</li>
        <li><a href="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0">Grilled food photograph</a> — Unsplash.</li>
        <li>Indian table photograph — <a href={restaurant.listingUrl}>Rua’s EazyDiner listing</a>. Listing image, not independently authenticated restaurant photography.</li>
      </ul>
      <p>
        Replace illustrative images with owner-provided photographs for an official
        restaurant launch. Typography: Cormorant Garamond and DM Sans, distributed
        through Google Fonts. Icons: Lucide.
      </p>
    </main>
  );
}
