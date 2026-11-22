import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Oswald:wght@400;600;700&family=Poppins:wght@700;800&family=Quicksand:wght@500;600;700&family=Roboto+Condensed:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#17212B] font-sans selection:bg-[#0552A2] selection:text-white">
        {children}
      </body>
    </html>
  );
}
