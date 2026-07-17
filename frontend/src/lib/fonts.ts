import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from "next/font/google";

/**
 * Font pairing strategy:
 * 
 * 1. SECTOR 034 (display) — Self-hosted @font-face via globals.css.
 *    Used for: hero headlines, section titles, logo wordmark, dashboard labels.
 *    A techno-futuristic display font with angular cuts — the spec's primary.
 * 
 * 2. SPACE GROTESK (body sans) — Google Fonts.
 *    Used for: body text, descriptions, nav items, form labels, buttons.
 *    Clean geometric sans with just enough character to complement Sector
 *    without competing. Excellent readability at small sizes.
 * 
 * 3. JETBRAINS MONO (code/data) — Google Fonts.
 *    Used for: transaction hashes, code blocks, tabular data, addresses.
 *    Monospace for precision — anything that needs alignment or looks like data.
 * 
 * 4. PLAYFAIR DISPLAY (serif accent) — Google Fonts.
 *    Used for: the hero emotional line ("Privacy that isn't secrecy.") only.
 *    Serif voice font for one emotional moment, then out.
 */

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
