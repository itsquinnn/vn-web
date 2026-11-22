import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white text-[#17212B] pt-14 pb-10 border-t border-zinc-200/80 overflow-hidden">
      {/* Subtle NTB Himalayan aerial landscape & golden ridge accent in the background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/pictures/landscape2-44237cb6.jpeg"
          alt=""
          fill
          unoptimized
          className="object-cover object-bottom opacity-[0.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/92 to-white/75" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pictures/mountain-yellow.svg"
          alt=""
          className="absolute bottom-0 inset-x-0 w-full h-auto opacity-30"
        />
      </div>

      <div className="container relative z-10">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-8">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href="/"
              className="relative w-28 h-12 transition-transform duration-200 hover:scale-[1.02] block"
            >
              <Image
                src="/logo.png"
                alt="Visit Nepal Official Logo"
                fill
                unoptimized
                sizes="112px"
                className="object-contain object-left"
              />
            </Link>

            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[#4B5563] text-xs sm:text-[13px] leading-relaxed max-w-sm">
              Naturally Nepal: Once is Not Enough. Promoting sustainable
              Himalayan travel, living heritage, and safe alpine journeys across
              Nepal.
            </p>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-[family-name:var(--font-quicksand)] text-xs uppercase tracking-[0.14em] text-[#0552A2] font-bold">
              Explore
            </span>
            <ul className="font-[family-name:var(--font-ibm-plex-sans)] flex flex-col gap-2.5 text-[13px] text-[#4B5563]">
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="#culture"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Culture &amp; Heritage
                </a>
              </li>
              <li>
                <a
                  href="#storytelling"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Nepal Stories
                </a>
              </li>
              <li>
                <a
                  href="#plan-your-trip"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Trip Designer
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Regions */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-[family-name:var(--font-quicksand)] text-xs uppercase tracking-[0.14em] text-[#0552A2] font-bold">
              Featured Regions
            </span>
            <ul className="font-[family-name:var(--font-ibm-plex-sans)] flex flex-col gap-2.5 text-[13px] text-[#4B5563]">
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Everest Region (Khumbu)
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Annapurna Conservation Area
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Upper Mustang (Kingdom of Lo)
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Kathmandu Historic Valley
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  Chitwan &amp; Bardia Wildlands
                </a>
              </li>
            </ul>
          </div>

          {/* Traveler Assistance */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-[family-name:var(--font-quicksand)] text-xs uppercase tracking-[0.14em] text-[#0552A2] font-bold">
              Traveler Assistance
            </span>
            <ul className="font-[family-name:var(--font-ibm-plex-sans)] flex flex-col gap-2.5 text-[13px] text-[#4B5563]">
              <li>
                <span className="font-semibold text-[#17212B]">
                  Tourism Hotline:{" "}
                </span>
                <a
                  href="tel:+97714256909"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  +977-1-4256909
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#17212B]">
                  Tourist Police:{" "}
                </span>
                <a
                  href="tel:1144"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  1144 (Toll-Free)
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#17212B]">Email: </span>
                <a
                  href="mailto:info@visitnepal.gov.np"
                  className="hover:text-[#0552A2] transition-colors"
                >
                  info@visitnepal.gov.np
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#17212B]">
                  Headquarters:{" "}
                </span>
                <span>Bhrikutimandap, Kathmandu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A6578] gap-4 font-[family-name:var(--font-ibm-plex-sans)]">
          <p>
            © {new Date().getFullYear()} Visitnepal. All rights reserved.
          </p>
          <a
            href="#hero"
            className="inline-flex items-center gap-1.5 font-semibold text-[#17212B] hover:text-[#0552A2] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
