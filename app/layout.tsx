import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Direct feedback after round 4 ("colors, fonts, typography - all need
// to be enhanced"): round 26 had gone to one plain sans everywhere,
// which read as flat rather than restrained. Fraunces is the one
// addition - a real optical-size serif with actual character, reserved
// for display headlines only (see .font-display in globals.css) so
// this stays a 2-typeface system, not the 3-typeface mix that's
// already been explicitly rejected before.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});

const TITLE = "Danielle Goldberg - Senior Product Designer";
const DESCRIPTION =
  "Senior product designer, 8 years enterprise B2B (Qlik, AWS). This portfolio is a real chat agent, not a slideshow - ask it anything.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <head>
        {/* Round 4 (enhanced richness pass): both typefaces now load
            via next/font/google (self-hosted at build time, no runtime
            request to Google's CDN) instead of a manual stylesheet
            link - the old link only ever covered Inter anyway, so
            adding Fraunces here would have meant two different loading
            strategies for two fonts. One mechanism for both now. */}
      </head>
      <body className="min-h-full bg-[#FAF3E7]">
        {/* Respects the OS-level "reduce motion" setting sitewide - one
            switch instead of auditing every motion.* usage by hand. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
