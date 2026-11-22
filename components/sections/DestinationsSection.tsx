"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { destinations } from "@/lib/destinations";
import { ArrowUpRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type RegionTab = "all" | "mountains" | "culture" | "wildlife";

const REGION_TABS: { id: RegionTab; label: string }[] = [
  { id: "all", label: "All Regions" },
  { id: "mountains", label: "Himalayas & Alpine" },
  { id: "culture", label: "Sacred Heritage" },
  { id: "wildlife", label: "Lakes & Wildlife" },
];

export default function DestinationsSection() {
  const [activeTab, setActiveTab] = useState<RegionTab>("all");

  // Filter all destinations so selecting a tab updates the featured spotlight and regional grid together
  const filteredDestinations = useMemo(() => {
    if (activeTab === "all") return destinations;
    return destinations.filter((d) => d.category === activeTab);
  }, [activeTab]);

  const leadDest = filteredDestinations[0] ?? destinations[0];
  const sideDests = filteredDestinations.slice(1, 3);
  const gridDests = filteredDestinations.slice(3, 7);

  return (
    <section
      id="destinations"
      className="py-12 md:py-16 bg-white scroll-mt-12 text-[#17212B]"
      aria-labelledby="destinations-heading"
    >
      <div className="container">
        {/* Minimal Editorial Header + Region Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-4">
          <div className="max-w-xl">
            <h2
              id="destinations-heading"
              className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-[-0.015em] leading-[1.15] text-[#17212B]"
            >
              Places That Stay With You
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm sm:text-[15px] text-[#4B5563] mt-2 leading-relaxed">
              From 8,000-meter Himalayan amphitheaters to ancient courtyards and
              subtropical sanctuaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {REGION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[11px] uppercase tracking-[0.12em] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0552A2] text-white shadow-sm"
                    : "bg-zinc-50 border border-zinc-200/80 text-[#4B5563] hover:text-[#17212B] hover:border-[#0552A2]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Unified Photo Bento (fits cleanly in one viewport) */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4"
        >
          {/* Row 1: Lead Feature (6 cols) + 2 Vertical Spotlights (3 cols each) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <motion.a
              href="#plan-your-trip"
              variants={itemVariants}
              className="md:col-span-6 group relative overflow-hidden rounded-2xl bg-[#17212B] h-[260px] sm:h-[300px] flex flex-col justify-end p-6 sm:p-7"
            >
              <Image
                src={leadDest.imageUrl}
                alt={leadDest.name}
                fill
                unoptimized
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#92C4EA] font-semibold block mb-1">
                    {leadDest.region}
                  </span>
                  <h3 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-white leading-tight">
                    {leadDest.name}
                  </h3>
                </div>
                <span className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#0552A2] group-hover:scale-105">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>

            {sideDests.map((dest) => (
              <motion.a
                key={dest.id}
                href="#plan-your-trip"
                variants={itemVariants}
                className="md:col-span-3 group relative overflow-hidden rounded-2xl bg-[#17212B] h-[230px] sm:h-[300px] flex flex-col justify-end p-5 sm:p-6"
              >
                <Image
                  src={dest.imageUrl}
                  alt={dest.name}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#92C4EA] font-semibold block mb-1">
                    {dest.region}
                  </span>
                  <h3 className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-white leading-snug">
                    {dest.name}
                  </h3>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Row 2: 4 Clean Regional Photo Tiles */}
          {gridDests.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gridDests.map((dest) => (
                <motion.a
                  key={dest.id}
                  href="#plan-your-trip"
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-2xl bg-[#17212B] h-[195px] sm:h-[210px] flex flex-col justify-end p-5"
                >
                  <Image
                    src={dest.imageUrl}
                    alt={dest.name}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="relative z-10 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#92C4EA] font-semibold block mb-0.5 truncate">
                        {dest.region}
                      </span>
                      <h4 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-white leading-snug truncate">
                        {dest.name}
                      </h4>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/75 shrink-0 transition-transform duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
