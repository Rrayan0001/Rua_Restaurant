import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">A LITTLE DETOUR</span><h1>This table<br />is <em>somewhere else.</em></h1><p>We couldn’t find that page. Let’s get you back to Rua.</p><Link href="/" className="button button-peach">Back to the good things <ArrowUpRight size={18} aria-hidden="true" /></Link></main>;
}
