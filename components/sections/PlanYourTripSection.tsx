"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTravelStore } from "@/store/useTravelStore";
import { ShieldCheck, ArrowRight } from "lucide-react";

const tripStyles = [
  {
    id: "trekking",
    label: "Trekking & High Alpine",
    description: "Multi-day mountain trails with teahouse and sherpa support",
  },
  {
    id: "cultural",
    label: "Cultural & Heritage Tour",
    description: "UNESCO ancient courtyards, monuments, and living monasteries",
  },
  {
    id: "wildlife",
    label: "Jungle Safari & Wildlife",
    description:
      "National parks, rhino tracking, jungle walks, and birdwatching",
  },
  {
    id: "spiritual",
    label: "Spiritual Retreat & Meditation",
    description:
      "Lumbini pilgrimage, mindfulness retreats, and monastery stays",
  },
  {
    id: "adventure",
    label: "Adventure & Air Sports",
    description: "Pokhara paragliding, river rafting, bungee, and canyoning",
  },
  {
    id: "roadtrip",
    label: "Scenic Highway Road Trip",
    description: "Chauffeured 4x4 overland through valleys and high plateaus",
  },
];

const durations = [
  {
    id: "short",
    days: 5,
    label: "3–5 Days",
    description: "Quick escape, single valley or city focus",
  },
  {
    id: "week",
    days: 9,
    label: "6–10 Days",
    description: "Classic circuit, 1–2 iconic regions",
  },
  {
    id: "extended",
    days: 14,
    label: "11–16 Days",
    description: "Deep high-altitude exploration (EBC, Annapurna)",
  },
  {
    id: "epic",
    days: 21,
    label: "17+ Days",
    description: "Grand Himalayan traverse & remote kingdoms",
  },
];

const seasons = [
  {
    id: "autumn",
    label: "Autumn (Oct – Dec)",
    tag: "Peak Clarity",
    description:
      "Crystal blue skies, crisp air, vibrant post-monsoon festivals",
  },
  {
    id: "spring",
    label: "Spring (Mar – May)",
    tag: "Wild Blossoms",
    description: "Rhododendrons in full bloom, warm days, climbing window",
  },
  {
    id: "winter",
    label: "Winter (Dec – Feb)",
    tag: "Serene & Crisp",
    description: "Pristine mountain views, fewer crowds, quiet valleys",
  },
  {
    id: "monsoon",
    label: "Summer / Rain Shadow (Jun – Sep)",
    tag: "Lush & Rain Shadow",
    description: "Upper Mustang rain shadow trails, lush valley greenery",
  },
];

const travelTips = [
  "Procure official TIMS cards and National Park permits prior to mountain trailhead departures.",
  "Acclimatize conservatively: schedule mandatory rest days above 3,500m elevation.",
  "Always trek with licensed local guides, certified for safety, route knowledge, and high-altitude logistics.",
  "Carry cash (NPR) for high-mountain teahouses; cards are accepted primarily in Kathmandu and Pokhara.",
  "Respect local cultural customs: circumambulate stupas clockwise and ask before photographing ceremonies.",
  "Drink filtered or boiled water; avoid single-use plastics in fragile conservation zones.",
];

const regionChoices = [
  {
    id: "everest",
    name: "Everest (Khumbu)",
    alt: "5,364m",
    image: "/pictures/Everest_tk_trekker_(5)-1630474503.jpg",
  },
  {
    id: "annapurna",
    name: "Annapurna",
    alt: "4,130m",
    image: "/pictures/annapurna-1624804396.jpg",
  },
  {
    id: "mustang",
    name: "Upper Mustang",
    alt: "3,840m",
    image: "/pictures/mustang_tk_people-1624440754.jpeg",
  },
  {
    id: "kathmandu",
    name: "Kathmandu Valley",
    alt: "1,400m",
    image: "/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg",
  },
  {
    id: "pokhara",
    name: "Pokhara & Phewa",
    alt: "822m",
    image: "/pictures/Pokhara_ss_lt_(4)-1624818140.jpg",
  },
  {
    id: "chitwan",
    name: "Chitwan Safari",
    alt: "150m",
    image: "/pictures/Chitwan_ss_lt_(17)-1624813756.jpg",
  },
  {
    id: "lumbini",
    name: "Lumbini",
    alt: "150m",
    image: "/pictures/Lumbini_tk_pilgrimage_(3)-1624819677.jpg",
  },
  {
    id: "langtang",
    name: "Langtang Valley",
    alt: "3,870m",
    image: "/pictures/Dhaulagiri_1626729219-1635169360.jpeg",
  },
  {
    id: "manaslu",
    name: "Manaslu Circuit",
    alt: "5,106m",
    image: "/pictures/Manaslu_View_from_Lho-1624808940.jpg",
  },
];

export default function PlanYourTripSection() {
  const router = useRouter();
  const currentUser = useTravelStore((state) => state.currentUser);
  const [selections, setSelections] = useState({
    destinations: ["everest"] as string[],
    tripStyle: "trekking",
    duration: "week",
    season: "autumn",
    difficulty: "moderate",
    transport: "flight",
    accommodation: "teahouse",
  });
  const [showTips, setShowTips] = useState(false);

  const handleDestinationToggle = (destId: string) => {
    setSelections((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(destId)
        ? prev.destinations.length > 1
          ? prev.destinations.filter((d) => d !== destId)
          : prev.destinations
        : [...prev.destinations, destId],
    }));
  };

  const handleSubmit = () => {
    try {
      localStorage.setItem(
        "nepal_custom_trip",
        JSON.stringify({
          ...selections,
          completedAt: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.error(e);
    }

    if (currentUser?.loggedIn && currentUser?.otpVerified) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  const primaryRegion =
    regionChoices.find(
      (r) => r.id === selections.destinations[selections.destinations.length - 1],
    ) ?? regionChoices[0];
  const selectedDuration = durations.find((d) => d.id === selections.duration);
  const selectedSeason = seasons.find((s) => s.id === selections.season);

  return (
    <section
      id="plan-your-trip"
      className="py-14 md:py-20 bg-white text-[#17212B] scroll-mt-12"
      aria-labelledby="plan-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Live Visual Destination Preview (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full rounded-2xl overflow-hidden bg-[#17212B]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={primaryRegion.id}
                  initial={{ opacity: 0.4, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={primaryRegion.image}
                    alt={primaryRegion.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#92C4EA] font-semibold block mb-1">
                  {selectedSeason?.label.split("(")[0].trim()} ·{" "}
                  {selectedDuration?.label} · {primaryRegion.alt}
                </span>
                <h3 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold leading-tight">
                  {selections.destinations
                    .map(
                      (id) =>
                        regionChoices.find((r) => r.id === id)?.name || id,
                    )
                    .join(" + ")}
                </h3>
              </div>
            </div>
          </div>

          {/* Right: Minimal Editorial Trip Composer (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <h2
                id="plan-heading"
                className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-[-0.015em] leading-[1.15] text-[#17212B]"
              >
                Design Your Ideal Himalayan Journey
              </h2>
              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm sm:text-[15px] text-[#4B5563] mt-2 leading-relaxed">
                Pick your regions, travel style, and season to generate a
                verified route with certified local guides.
              </p>
            </div>

            {/* Regions */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#64748B] block mb-2.5">
                Destinations
              </span>
              <div className="flex flex-wrap gap-2">
                {regionChoices.map((dest) => {
                  const isSelected = selections.destinations.includes(dest.id);
                  return (
                    <button
                      key={dest.id}
                      onClick={() => handleDestinationToggle(dest.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#0552A2] text-white border-[#0552A2]"
                          : "bg-white text-[#17212B] border-zinc-200 hover:border-[#0552A2]/60"
                      }`}
                    >
                      {dest.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style & Season */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#64748B] block mb-2">
                  Travel Style
                </span>
                <select
                  value={selections.tripStyle}
                  onChange={(e) =>
                    setSelections((prev) => ({
                      ...prev,
                      tripStyle: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-[#17212B] focus:outline-none focus:border-[#0552A2] cursor-pointer"
                >
                  {tripStyles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#64748B] block mb-2">
                  Season
                </span>
                <select
                  value={selections.season}
                  onChange={(e) =>
                    setSelections((prev) => ({
                      ...prev,
                      season: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-[#17212B] focus:outline-none focus:border-[#0552A2] cursor-pointer"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Duration */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#64748B] block mb-2.5">
                Duration
              </span>
              <div className="grid grid-cols-4 gap-2">
                {durations.map((dur) => {
                  const isSelected = selections.duration === dur.id;
                  return (
                    <button
                      key={dur.id}
                      onClick={() =>
                        setSelections((prev) => ({
                          ...prev,
                          duration: dur.id,
                        }))
                      }
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        isSelected
                          ? "bg-[#17212B] text-white border-[#17212B]"
                          : "bg-white text-[#4B5563] border-zinc-200 hover:border-[#17212B]/40"
                      }`}
                    >
                      {dur.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary CTA + Guidelines */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleSubmit}
                className="px-7 py-3.5 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs uppercase tracking-[0.14em] font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Build My Itinerary</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowTips(!showTips)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0552A2] transition-colors cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-[#0552A2]" />
                <span>{showTips ? "Hide Guidelines" : "Permit & Altitude Info"}</span>
              </button>
            </div>

            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#4B5563] leading-relaxed">
                    {travelTips.map((tip, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-[#0552A2] font-bold">
                          {idx + 1}.
                        </span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
