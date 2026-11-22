import type { Metadata, Viewport } from "next";
import {
  Oswald,
  Noto_Sans,
  Roboto_Condensed,
  Dancing_Script,
  Poppins,
  Quicksand,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  adjustFontFallback: true,
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
  preload: true,
  adjustFontFallback: true,
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0552A2",
};

export const metadata: Metadata = {
  title: "Visit Nepal Naturally Nepal | Official Tourism Portal",
  description:
    "Somewhere between earth and heaven. Discover extraordinary Himalayan landscapes, ancient UNESCO heritage, and unforgettable journeys across Nepal.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${notoSans.variable} ${robotoCondensed.variable} ${dancingScript.variable} ${poppins.variable} ${quicksand.variable} ${ibmPlexSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#17212B] font-sans selection:bg-[#0552A2] selection:text-white">
        {children}
      </body>
    </html>
  );
}
