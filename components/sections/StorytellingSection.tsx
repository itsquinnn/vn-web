import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const storyMoments = [
  {
    id: "himalayas",
    title: "The Great Himalayan Arc",
    text: "Eight of the earth’s fourteen peaks crowning above 8,000 meters rise here. Ancient glaciers carve silent valleys where prayer flags flutter in thin, crystal air and mountains humble the human spirit.",
    imageUrl: "/pictures/everest_(1)-1624869402.jpg",
  },
  {
    id: "culture",
    title: "Sacred Architecture & Living Heritage",
    text: "Seven UNESCO World Heritage sites clustered within a single valley. Centuries-old Newari artisans still chisel intricate peacock windows and cast bronze deities just as their forefathers did in medieval dynasties.",
    imageUrl: "/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg",
  },
  {
    id: "hospitality",
    title: '"Atithi Devo Bhava": The Guest is Divine',
    text: "In every high-mountain teahouse and terraced valley homestay, hospitality is not an industry, it is an ancestral devotion. Strangers are welcomed with steaming cups of ginger-lemon tea and heartfelt Namastes.",
    imageUrl: "/pictures/mustang_tk_people-1624440754.jpeg",
  },
];

export default function StorytellingSection() {
  return (
    <section
      id="storytelling"
      className="pt-16 md:pt-24 pb-14 md:pb-20 bg-white text-[#17212B] scroll-mt-12"
      aria-labelledby="storytelling-heading"
    >
      <div className="container">
        {/* Editorial Magazine Opener */}
        <div className="max-w-3xl mb-16 lg:mb-20 text-left">
          <h2
            id="storytelling-heading"
            className="font-[family-name:var(--font-quicksand)] text-3xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-[-0.015em] leading-[1.15] text-[#17212B] text-balance"
          >
            More Than a Destination.
            <br />
            <span className="text-[#0552A2] font-semibold">
              A Feeling That Stays.
            </span>
          </h2>
          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[15px] sm:text-[17px] text-[#4B5563] mt-4 leading-[1.7] max-w-2xl">
            You do not simply visit Nepal; you enter a rhythm carved by glacial
            rivers, sacred dawn chants, towering monoliths, and the warm grace
            of its people.
          </p>
        </div>

        {/* Magazine-Spread Editorial Story Rows */}
        <div className="space-y-14 lg:space-y-20">
          {storyMoments.map((moment, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={moment.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Visual Frame */}
                <div
                  className={`lg:col-span-5 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="relative aspect-[3/2] max-w-md lg:max-w-none mx-auto rounded-xl overflow-hidden bg-[#17212B] shadow-[0_14px_40px_-12px_rgba(15,42,74,0.22)] group">
                    <Image
                      src={moment.imageUrl}
                      alt={moment.title}
                      fill
                      unoptimized
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Editorial Copy Block */}
                <div
                  className={`lg:col-span-7 flex flex-col gap-4 ${isReversed ? "lg:order-1 lg:pr-6" : "lg:order-2 lg:pl-6"}`}
                >
                  <h3 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#17212B] leading-[1.22] tracking-[-0.01em]">
                    {moment.title}
                  </h3>

                  <div className="w-12 h-1 rounded-full bg-[#FDB716]" />

                  <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[15px] sm:text-base text-[#475569] leading-[1.75]">
                    {moment.text}
                  </p>

                  <div className="pt-1">
                    <a
                      href="#experiences"
                      className="relative inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.14em] font-bold text-[#0552A2] hover:text-[#043e7b] pb-1 transition-colors w-fit cursor-pointer group/cta"
                    >
                      <span>Discover the Journey</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                      <span
                        className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#0552A2] group-hover/cta:w-full transition-all duration-500 ease-out"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
