"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Experience {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  category: string;
  highlights: string[];
  difficulty: "Easy" | "Moderate" | "Challenging" | "Extreme";
  duration: string;
}

const experiences: Experience[] = [
  {
    id: "trekking",
    name: "Trekking & Alpine Trails",
    subtitle: "Footpaths Through the Heavens",
    description:
      "Traverse timeless routes through blossoming rhododendron sanctuaries, colossal high-altitude passes, and hospitable Sherpa teahouse communities where kindness is sacred.",
    imageUrl: "/pictures/poonhill_pg_adventure-1624431033.jpeg",
    category: "Alpine Discovery",
    highlights: [
      "Everest Base Camp",
      "Annapurna Circuit",
      "Manaslu Wilderness",
      "Langtang Sacred Valley",
    ],
    difficulty: "Moderate",
    duration: "5–18 days",
  },
  {
    id: "mountaineering",
    name: "Himalayan Mountaineering",
    subtitle: "Summits Above the Clouds",
    description:
      "Challenge the pinnacles of our planet alongside certified UIAGM/IFMGA Sherpa masters, equipped with state-of-the-art oxygen logistics and disciplined acclimatization.",
    imageUrl: "/pictures/everest_(1)-1624869402.jpg",
    category: "High Altitude",
    highlights: [
      "Ama Dablam (6,812m)",
      "Island Peak (6,189m)",
      "Mera Peak (6,476m)",
      "Mt. Everest Summit",
    ],
    difficulty: "Extreme",
    duration: "14–60 days",
  },
  {
    id: "cultural",
    name: "Cultural Journeys",
    subtitle: "Centuries of Living Heritage",
    description:
      "Immerse your spirit in breathing ancient traditions, from Newari stone architecture and wood carving courtyards to sacred Vedic rituals along holy riverbanks.",
    imageUrl: "/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg",
    category: "Heritage & Arts",
    highlights: [
      "Kathmandu Durbar Square",
      "Bhaktapur Medieval Square",
      "Patan Golden Temple",
      "Panauti Heritage Walk",
    ],
    difficulty: "Easy",
    duration: "3–10 days",
  },
  {
    id: "spiritual",
    name: "Spiritual Retreats",
    subtitle: "Sacred Silence & Meditation",
    description:
      "Discover transcendent tranquility at the birthplace of Lord Buddha in Lumbini, meditate inside thousand-year-old cliff caves, and practice mindfulness with resident lamas.",
    imageUrl: "/pictures/Swayambhu_ss_lt_(3)-1624820456.jpg",
    category: "Spiritual Wellness",
    highlights: [
      "Lumbini Sacred Garden",
      "Kopan Monastery",
      "Namo Buddha Stupa",
      "Pharping Guru Rinpoche Caves",
    ],
    difficulty: "Easy",
    duration: "3–14 days",
  },
  {
    id: "wildlife",
    name: "Subtropical Wildlife & Safari",
    subtitle: "Realm of the Bengal Tiger",
    description:
      "Track Greater One-horned Rhinoceros on guided foot safaris, navigate tranquil jungle rivers among marsh crocodiles, and spot Bengal tigers within pristine Terai national reserves.",
    imageUrl: "/pictures/Chitwan_ss_jungleactivities-1630491399.JPG",
    category: "Jungle & Safari",
    highlights: [
      "Chitwan National Park",
      "Bardia Untamed Reserve",
      "Koshi Tappu Wetlands",
      "Dugout River Canoeing",
    ],
    difficulty: "Easy",
    duration: "3–7 days",
  },
  {
    id: "adventure",
    name: "High-Adrenaline Adventure",
    subtitle: "Sky, Water & Gravity",
    description:
      "Soar like a raptor on tandem paragliders above Phewa Lake, raft the tempestuous glacial rapids of the Bhote Koshi, or plunge from the world’s highest suspension bungee platforms.",
    imageUrl: "/pictures/Pokhara_oy_lt_(2)-1624817867.jpg",
    category: "Extreme Adventure",
    highlights: [
      "Pokhara Paragliding",
      "Trishuli & Sun Koshi Rafting",
      "The Last Resort Bungee",
      "Zip-Flyer Sarangkot",
    ],
    difficulty: "Moderate",
    duration: "1–5 days",
  },
  {
    id: "food",
    name: "Food & Culinary Traditions",
    subtitle: "A Feast of Himalayan Spices",
    description:
      "Master hand-pinched steamed momo alongside Newari home chefs, relish steaming plates of traditional organic dal bhat, and savor highland yak cheeses and salt-butter tea.",
    imageUrl: "/pictures/yomari_traditional_newari_delicacy_from_nepal_2-1624430457.jpg",
    category: "Gastronomy",
    highlights: [
      "Kathmandu Street Food Walks",
      "Newari Culinary Masterclasses",
      "Tea Plantation Tastings",
      "Organic Homestay Dining",
    ],
    difficulty: "Easy",
    duration: "1–7 days",
  },
  {
    id: "roadtrips",
    name: "Scenic Himalayan Road Trips",
    subtitle: "Crossroads of the Ancient Silk Roads",
    description:
      "Traverse winding mountain highways carving deep gorges between dramatic peaks, from Kathmandu’s lush hill crests to the high arid plateaus of the Tibetan border.",
    imageUrl: "/pictures/Choyou_1626729673-1635169288.jpeg",
    category: "Overland Exploration",
    highlights: [
      "Prithvi Highway Odyssey",
      "Upper Mustang 4x4 Trail",
      "B.P. Koirala Highway",
      "Rara Lake Off-Road Drive",
    ],
    difficulty: "Easy",
    duration: "3–10 days",
  },
];

export default function ExperiencesSection() {
  const [selectedExperience, setSelectedExperience] = useState<Experience>(
    experiences[0],
  );

  const activeIndex = experiences.findIndex(
    (e) => e.id === selectedExperience.id
  );

  return (
    <section
      id="experiences"
      className="py-12 md:py-16 bg-white scroll-mt-12 text-[#17212B]"
      aria-labelledby="experiences-heading"
    >
      <div className="container">
        {/* Minimal Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-xl">
            <h2
              id="experiences-heading"
              className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-[-0.015em] leading-[1.15] text-[#17212B]"
            >
              Ways to Experience Nepal
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm sm:text-[15px] text-[#4B5563] mt-2 leading-relaxed">
              Choose your calling - from 8,000-meter alpine passes and quiet
              monasteries to subtropical river safaris.
            </p>
          </div>
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(experiences.length).padStart(2, "0")}
          </span>
        </div>

        {/* Clean Numbered Tab Strip (No SaaS list or icon circles) */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none border-b border-zinc-200/80 mb-8 pb-px">
          {experiences.map((exp, idx) => {
            const isSelected = selectedExperience.id === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedExperience(exp)}
                className={`shrink-0 pb-3 text-left transition-colors cursor-pointer border-b-2 -mb-px flex items-baseline gap-2 ${isSelected
                    ? "border-[#0552A2] text-[#0552A2]"
                    : "border-transparent text-[#64748B] hover:text-[#17212B]"
                  }`}
              >
                <span className="text-[11px] font-mono opacity-70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold whitespace-nowrap">
                  {exp.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Borderless Editorial Split */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedExperience.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left: Clean Full-Bleed NTB Photo */}
            <div className="lg:col-span-7">
              <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] w-full rounded-2xl overflow-hidden bg-[#17212B]">
                <Image
                  src={selectedExperience.imageUrl}
                  alt={selectedExperience.name}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#92C4EA] font-semibold block mb-1">
                    {selectedExperience.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {selectedExperience.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Right: Pure Editorial Narrative (No Card Box) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div>
                <h4 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-[#17212B] leading-snug">
                  {selectedExperience.subtitle}
                </h4>
                <div className="w-10 h-0.5 rounded-full bg-[#FDB716] mt-3" />
              </div>

              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[15px] text-[#475569] leading-[1.75]">
                {selectedExperience.description}
              </p>

              {/* Signature Highlights */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                {selectedExperience.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#17212B]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80">
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
                  {selectedExperience.duration} · {selectedExperience.difficulty}
                </span>

                <a
                  href="#plan-your-trip"
                  className="relative inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-bold text-[#0552A2] hover:text-[#043e7b] pb-0.5 transition-colors group/cta"
                >
                  <span>Plan This Experience</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                  <span
                    className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#0552A2] group-hover/cta:w-full transition-all duration-300"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
