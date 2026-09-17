import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "./mobile-motion.css";
import "./welcome.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: "Rua Yelahanka — Good food. Great company.",
  description: "A little escape, right here in Yelahanka. Discover Rua, a North Indian restaurant in Bengaluru. Explore the menu, find your way, and plan a table together.",
  openGraph: {
    title: "Rua — Come for the food. Stay for the feeling.",
    description: "North Indian flavours. Unhurried moments. Your next favourite table in Yelahanka, Bengaluru.",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1920, height: 1280, alt: "Warm, atmospheric restaurant interior — illustrative imagery" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#183d32", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
