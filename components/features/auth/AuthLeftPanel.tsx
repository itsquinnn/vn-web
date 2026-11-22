import React from 'react';
import Link from 'next/link';
import NepalBackgroundMap from '@/components/features/chat/NepalBackgroundMap';

interface AuthLeftPanelProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLeftPanel({
  imageSrc = "/pictures/everest_(1)-1624869402.jpg",
  imageAlt = "Nepal Himalayan landscape"
}: AuthLeftPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-[48%] h-full bg-[#0B1A2E] flex-shrink-0 flex-col justify-between overflow-hidden relative z-10 p-10 select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071324]/80 via-[#0B1A2E]/55 to-[#071324]/92 pointer-events-none" />
      
      {/* Official Brand Logo (clean, unobstructed) */}
      <div className="relative z-20 flex items-center justify-between">
        <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.png"
            alt="Visit Nepal Official Logo"
            className="h-11 md:h-12 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
          />
        </Link>
        <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.2em] text-white/60 font-semibold">
          Naturally Nepal
        </span>
      </div>

      {/* Centered Nepal Map Vector */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none scale-105">
        <NepalBackgroundMap isSidebar={true} theme="dark" />
      </div>

      {/* Editorial Footer Caption */}
      <div className="relative z-20 flex flex-col gap-1.5">
        <p className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-white/95 leading-snug">
          Once is Not Enough.
        </p>
        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-white/65 tracking-wide">
          7 Provinces · 8 Peaks Above 8,000m · Living Himalayan Heritage
        </p>
      </div>
    </div>
  );
}
