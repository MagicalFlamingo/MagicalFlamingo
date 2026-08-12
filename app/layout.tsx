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
        {/* Council round 23: widened the weight range on the SAME two
            typefaces (still no third font - that was explicitly rejected
            once already) - Lora 500 for the hero name (was missing, so
            `font-medium` silently fell back to the nearest loaded weight
            instead of the weight actually requested), plus Inter 100/900
            so real weight contrast (the AWS stat's "/100" vs "67") is an
            available lever, not just bigger sizes. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
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
