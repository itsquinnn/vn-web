"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

interface HeritageSite {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  year: string;
  significance: string;
}

const heritageSites: HeritageSite[] = [
  {
    id: "kathmandu-durbar",
    name: "Kathmandu Durbar Square",
    description:
      "Ancient royal square of the Malla kings, anchored by multi-tiered pagoda temples, carved cedar courtyards, and the sacred Kumari Ghar, residence of the living goddess.",
    imageUrl: "/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg",
    location: "Kathmandu Valley",
    year: "1979",
    significance: "Seat of Malla Dynasties & Living Goddess Kumari",
  },
  {
    id: "boudhanath",
    name: "Boudhanath Stupa",
    description:
      "One of the largest spherical stupas in the world, radiating spiritual energy as thousands of Buddhist pilgrims circumambulate beneath Buddha’s all-seeing compassionate eyes.",
    imageUrl: "/pictures/boudha-1624805151.jpg",
    location: "Kathmandu",
    year: "1979",
    significance: "Spiritual Center of Himalayan Buddhism",
  },
  {
    id: "bhaktapur-durbar",
    name: "Bhaktapur Medieval Square",
    description:
      "The best-preserved medieval city-state in the Himalayas, celebrated for the 55-Window Palace, the towering Nyatapola Temple, and open pottery squares where clay is shaped as it was 600 years ago.",
    imageUrl: "/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg",
    location: "Bhaktapur",
    year: "1979",
    significance: "UNESCO City of Culture & Master Woodcarvers",
  },
  {
    id: "lumbini",
    name: "Lumbini Sacred Garden",
    description:
      "The holy birthplace of Siddhartha Gautama (Lord Buddha), centered on the ancient Maya Devi Temple, the 3rd-century BC Ashoka Pillar, and serene monastic zones from 30+ nations.",
    imageUrl: "/pictures/lumbini-1624821139.jpg",
    location: "Rupandehi",
    year: "1997",
    significance: "Sacred Cradle of Buddhism & World Peace",
  },
];

interface Festival {
  id: string;
  name: string;
  nepaliName: string;
  season: string;
  month: string;
  duration: string;
  theme: string;
  description: string;
  rituals: string[];
  location: string;
  imageUrl: string;
  quote: string;
}

const festivals: Festival[] = [
  {
    id: "dashain",
    name: "Dashain",
    nepaliName: "दशैं (बडादशैं)",
    season: "Autumn Harvest",
    month: "September – October",
    duration: "15 Days",
    theme: "Victory of Good & The Great Himalayan Homecoming",
    description:
      "Nepal’s grandest national celebration. Across every hillside village and city courtyard, skies fill with handcrafted bamboo kites, 40-foot giant bamboo swings (Ping) soar over lush ridges, and families reunite across mountain valleys for elder blessings with crimson vermilion tika and golden barley jamara.",
    rituals: [
      "Elder blessings with crimson tika & jamara",
      "Village-built 40ft bamboo swings (Ping)",
      "Handcrafted kite flying across blue autumn skies",
      "Feasts of spiced goat curry & beaten rice",
    ],
    location: "Nationwide, across every mountain village & city",
    imageUrl: "/festivals/dashain.webp",
    quote:
      "The return of family, blessings of elders, and laughter on hilltop swings under crystal autumn skies.",
  },
  {
    id: "tihar",
    name: "Tihar (Deepawali)",
    nepaliName: "तिहार (यमपञ्चक)",
    season: "Autumn Lights",
    month: "October – November",
    duration: "5 Days",
    theme: "Festival of Lights, Harmony & Sacred Animal Reverence",
    description:
      "Five magical nights illuminating every doorway with clay butter lamps, rangoli mandalas, and marigold garlands. Communities honor crows, dogs, and sacred cows before sisters bless their brothers with seven-colored tika (Bhai Tika) in an enduring devotion to mutual protection.",
    rituals: [
      "Clay diyo oil lamps & glowing doorway rangolis",
      "Kukur Tihar: honoring dogs with garlands & treats",
      "Laxmi Puja: inviting goddess of prosperity into homes",
      "Bhai Tika: seven-colored sibling blessings",
    ],
    location: "Kathmandu Valley, Patan & Mountain Homestays",
    imageUrl: "/festivals/tihar.webp",
    quote:
      "Golden warmth spilling from every carved window, welcoming light into homes illuminated by faith.",
  },
  {
    id: "holi",
    name: "Holi (Fagu Purnima)",
    nepaliName: "होली (फागु पूर्णिमा)",
    season: "Spring Equinox",
    month: "March (Spring Equinox)",
    duration: "2 Days",
    theme: "Festival of Colors, Folk Rhythms & Vernal Awakening",
    description:
      "Ancient streets and historic squares erupt into jubilant celebrations of vibrant powdered crimson, saffron, and turquoise pigments. Strangers embrace with genuine smiles, sweet lassi and gujiya are shared freely, and traditional Newari Dhimay drummers turn courtyards into open-air dance parties.",
    rituals: [
      "Explosions of organic herbal powdered pigments",
      "Newari Dhimay folk drumming in historic squares",
      "Spontaneous street dancing and community bonfires",
      "Sharing spiced lassi and traditional sweets",
    ],
    location: "Basantapur Durbar, Pokhara Lakeside & Terai Plains",
    imageUrl: "/festivals/holi.webp",
    quote:
      "A sea of crimson, gold, and sky-blue washing away divisions as spring breathes life into the Himalayas.",
  },
  {
    id: "indra-jatra",
    name: "Indra Jatra (Yenya)",
    nepaliName: "इन्द्रजात्रा (येँयाः)",
    season: "Monsoon Harvest",
    month: "September",
    duration: "8 Days",
    theme: "Masked Lakhey Dances & Living Goddess Processions",
    description:
      "Eight days of hypnotic carnival energy in historic Kathmandu honoring Indra, King of Heaven. Enormous multi-story wooden chariots bearing the living goddess Kumari glide through candlelit brick alleys while masked Lakhey demons dance under torchlight to the pounding of thunderous drums.",
    rituals: [
      "Chariot procession of the Living Goddess Kumari",
      "Fierce masked Lakhey dances under torchlight",
      "Erection of the sacred Linga pole at Durbar Square",
      "Distribution of blessed liquor from Sweta Bhairab mask",
    ],
    location: "Location yet to be decided",
    imageUrl: "/festivals/indra-jatra.webp",
    quote:
      "Hypnotic drums echo off centuries-old bricks as the Living Goddess blesses an ocean of reverent devotees.",
  },
];

export default function CultureSection() {
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(
    heritageSites[0],
  );
  const [activeFestival, setActiveFestival] = useState<Festival>(festivals[0]);

  const activeSiteIndex = heritageSites.findIndex(
    (s) => s.id === selectedSite.id
  );

  return (
    <section
      id="culture"
      className="py-12 md:py-16 bg-white text-[#17212B] scroll-mt-12"
      aria-labelledby="culture-heading"
    >
      <div className="container">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-xl">
            <h2
              id="culture-heading"
              className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-[-0.015em] leading-[1.15] text-[#17212B]"
            >
              Living Heritage, Breathing Tradition
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm sm:text-[15px] text-[#4B5563] mt-2 leading-relaxed">
              Traditions in Nepal are not locked behind museum glass; they live
              daily in courtyard rituals, temple offerings, and sacred festivals.
            </p>
          </div>
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            UNESCO Heritage · {String(activeSiteIndex + 1).padStart(2, "0")} /{" "}
            {String(heritageSites.length).padStart(2, "0")}
          </span>
        </div>

        {/* =========================================================================
            PART 1: UNESCO WORLD HERITAGE — CLEAN EDITORIAL SHOWCASE
        ========================================================================= */}
        <div className="mb-16 lg:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Lead Photo (7 cols) — Clean, unobstructed photography */}
            <div className="lg:col-span-7">
              <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-[#17212B] group">
                <Image
                  src={selectedSite.imageUrl}
                  alt={selectedSite.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Editorial Narrative + Horizontal Photo Strip (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-semibold text-[#0552A2] tracking-[0.16em] uppercase block mb-1.5">
                  {selectedSite.location} · UNESCO {selectedSite.year}
                </span>
                <h3 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold text-[#17212B] leading-tight">
                  {selectedSite.name}
                </h3>
                <div className="w-10 h-0.5 rounded-full bg-[#FDB716] mt-3" />
              </div>

              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[15px] text-[#475569] leading-[1.75]">
                {selectedSite.description}
              </p>

              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs font-medium text-[#64748B]">
                {selectedSite.significance}
              </p>

              {/* 4-Tile Horizontal Sanctuary Switcher */}
              <div className="grid grid-cols-4 gap-2.5 pt-2">
                {heritageSites.map((site) => {
                  const isSelected = selectedSite.id === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => setSelectedSite(site)}
                      aria-label={site.name}
                      className={`group/thumb relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-[#0552A2] ring-offset-2 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={site.imageUrl}
                        alt={site.name}
                        fill
                        unoptimized
                        sizes="120px"
                        className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PART 2: FESTIVALS THAT DEFINE THE YEAR — BORDERLESS SEASONAL SHOWCASE
        ========================================================================= */}
        <div className="pt-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-4">
            <div>
              <h3 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold text-[#17212B] tracking-[-0.015em]">
                Festivals That Define the Year
              </h3>
            </div>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm text-[#4B5563] max-w-md leading-relaxed">
              Each season brings a distinct spiritual pulse where generations
              unite in song, sacred blessings, and street processions.
            </p>
          </div>

          {/* Clean Numbered Seasonal Tab Bar (No repeated garland boxes) */}
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none border-b border-zinc-200/80 mb-8 pb-px">
            {festivals.map((fest, idx) => {
              const isActive = activeFestival.id === fest.id;
              const shortMonth = fest.month.split("(")[0].trim();
              return (
                <button
                  key={fest.id}
                  onClick={() => setActiveFestival(fest)}
                  className={`shrink-0 pb-3 text-left transition-colors cursor-pointer border-b-2 -mb-px flex items-baseline gap-2.5 ${
                    isActive
                      ? "border-[#0552A2] text-[#0552A2]"
                      : "border-transparent text-[#64748B] hover:text-[#17212B]"
                  }`}
                >
                  <span className="text-[11px] font-mono opacity-70">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-[family-name:var(--font-quicksand)] text-sm sm:text-base font-bold whitespace-nowrap">
                    {fest.name}
                  </span>
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] opacity-75 whitespace-nowrap">
                    · {shortMonth}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unified Borderless Festival Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFestival.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-2"
            >
              {/* Left: Editorial Storytelling & Practical Context */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#0552A2]">
                  <span>{activeFestival.month}</span>
                  <span className="text-zinc-300">•</span>
                  <span>{activeFestival.duration}</span>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-quicksand)] text-3xl sm:text-4xl font-bold text-[#17212B] tracking-tight leading-tight">
                    {activeFestival.name}
                  </h4>
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] block text-sm text-[#64748B] mt-1">
                    {activeFestival.nepaliName} · {activeFestival.theme}
                  </span>
                  <div className="w-10 h-0.5 rounded-full bg-[#FDB716] mt-3" />
                </div>

                <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[15px] text-[#475569] leading-[1.75]">
                  {activeFestival.description}
                </p>

                {/* Scannable Ritual Highlights */}
                <div className="flex flex-col gap-2 pt-1">
                  {activeFestival.rituals.slice(0, 3).map((ritual, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-[13px] font-medium text-[#17212B]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] shrink-0" />
                      <span>{ritual}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <MapPin className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
                    <span>{activeFestival.location}</span>
                  </div>

                  <a
                    href="#plan-your-trip"
                    className="relative inline-flex items-center gap-2 pb-0.5 text-xs uppercase tracking-[0.14em] font-bold text-[#0552A2] hover:text-[#043e7b] transition-colors shrink-0 cursor-pointer group/cta"
                  >
                    <span>Plan Around This Festival</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                    <span
                      className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#0552A2] group-hover/cta:w-full transition-all duration-300"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>

              {/* Right: Clean Transparent Festival Artwork */}
              <div className="lg:col-span-6">
                <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[360px]">
                  <Image
                    src={
                      activeFestival.id === "holi"
                        ? "/festivals/holi-hero.png"
                        : activeFestival.id === "tihar"
                          ? "/festivals/tihar-right.png"
                          : activeFestival.imageUrl
                    }
                    alt={activeFestival.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
