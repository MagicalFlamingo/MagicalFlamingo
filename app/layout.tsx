import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Round 26 (full aesthetic pivot to a real reference site the user pointed at):
            that reference has no serif display moment anywhere - one
            plain sans throughout. Lora dropped from this link entirely;
            Inter is now the only typeface in the app, not a swap to a
            different sans - going from two typefaces to one, not adding
            a third (that's been explicitly rejected before). The wide
            weight range (round 23) stays - real weight contrast is still
            a lever with just one typeface. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
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
