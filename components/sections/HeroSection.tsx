"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_IMAGES = [
  "/pictures/Bardiya_ss_lt_(12)-1624817484.jpg",
  "/pictures/Swayambhu_ss_lt_(3)-1624820456.jpg",
  "/pictures/Pokhara_ss_lt_(4)-1624818140.jpg",
  "/pictures/Lumbini_tk_pilgrimage_(3)-1624819677.jpg",
  "/pictures/Janakpur_ss_pilgrimage_(1)-1624818475.jpg",
  "/pictures/Everest_mp_trekker_(3)-1624814609.jpg",
  "/pictures/poonhill_pg_adventure-1624431033.jpeg",
  "/pictures/Chitwan_ss_lt_(17)-1624813756.jpg",
  "/pictures/_DSC0502_-1624819394.jpg",
  "/pictures/Khaptad_taan_trekker_(6)-1624819036.jpg",
  "/pictures/_DSC2646_-1624815675.jpg",
];

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Gentle NTB-style parallax zoom (1x -> 2.8x) as the hero scrolls out
  const maskScale = useTransform(scrollYProgress, [0, 1], [1, 2.8]);
  const maskY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const maskOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0.15]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.35], [0, -16]);
  const decorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const decorY = useTransform(scrollYProgress, [0, 0.3], [0, 24]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen lg:h-screen overflow-hidden flex items-center justify-center bg-white pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Subtle shadow/watermark backdrop from NTB pictures */}
      <motion.div
        style={{ opacity: maskOpacity }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        {HERO_IMAGES.map((src, idx) => (
          <div
            key={`bg-${src}`}
            style={{ backgroundImage: `url('${src}')` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out blur-[1px] ${
              idx === activeIdx ? "opacity-[0.09]" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(255,255,255,0.75)_85%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </motion.div>

      {/* Full-quality transparent Dashain illustration in top-left white space (behind text) */}
      <motion.div
        style={{ opacity: decorOpacity, y: decorY }}
        className="hidden sm:block absolute top-12 sm:top-14 left-4 md:left-10 lg:left-16 z-10 w-72 md:w-96 lg:w-[28rem] aspect-[3/2] pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/festivals/dashain.webp"
          alt=""
          fill
          unoptimized
          priority
          className="object-contain object-center"
        />
      </motion.div>

      {/* Full-quality transparent Tihar marigold garlands in top-right corner */}
      <motion.div
        style={{ opacity: decorOpacity, y: decorY }}
        className="hidden sm:block absolute top-16 sm:top-20 right-4 md:right-8 lg:right-12 z-10 w-28 md:w-36 lg:w-44 aspect-[773/1333] pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/festivals/tihar-right.png"
          alt=""
          fill
          unoptimized
          priority
          className="object-contain object-top"
        />
      </motion.div>

      {/* Full-quality transparent Holi colors in bottom-right white space */}
      <motion.div
        style={{ opacity: decorOpacity, y: decorY }}
        className="hidden sm:block absolute bottom-6 sm:bottom-8 right-6 md:right-12 lg:right-16 z-10 w-44 md:w-56 lg:w-64 aspect-[2/1] pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/festivals/holi-hero.png"
          alt=""
          fill
          unoptimized
          priority
          className="object-contain object-center"
        />
      </motion.div>

      {/* Minimal "It's Time To / visit nepal" text in front (z-20) with smooth scroll zoom */}
      <motion.div
        style={{ scale: maskScale, y: maskY, opacity: maskOpacity }}
        className="relative z-20 flex flex-col items-center justify-center px-5 text-center select-none pointer-events-none will-change-transform"
      >
        <div className="relative flex flex-col items-center">
          {/* Sizing & accessibility anchor */}
          <div className="invisible flex flex-col items-center" aria-hidden="true">
            <span className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.03em] leading-tight mb-2 sm:mb-3">
              It&apos;s Time To
            </span>
            <span className="font-[family-name:var(--font-poppins)] lowercase text-[15.5vw] sm:text-[14.5vw] lg:text-[13.5vw] xl:text-[13vw] font-extrabold tracking-[-0.02em] leading-[0.95] whitespace-nowrap">
              visit nepal
            </span>
          </div>

          {HERO_IMAGES.map((src, idx) => (
            <div
              key={src}
              style={{
                backgroundImage: `url('${src}')`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              className={`absolute inset-0 bg-cover bg-center text-transparent flex flex-col items-center transition-opacity duration-[1200ms] ease-in-out ${
                idx === activeIdx ? "opacity-100" : "opacity-0"
              }`}
            >
              <motion.span
                style={{ opacity: subtitleOpacity, y: subtitleY }}
                className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.03em] leading-tight mb-2 sm:mb-3 will-change-transform"
              >
                It&apos;s Time To
              </motion.span>

              {idx === 0 ? (
                <h1
                  id="hero-heading"
                  className="font-[family-name:var(--font-poppins)] lowercase text-[15.5vw] sm:text-[14.5vw] lg:text-[13.5vw] xl:text-[13vw] font-extrabold tracking-[-0.02em] leading-[0.95] whitespace-nowrap"
                >
                  visit nepal
                </h1>
              ) : (
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-poppins)] lowercase text-[15.5vw] sm:text-[14.5vw] lg:text-[13.5vw] xl:text-[13vw] font-extrabold tracking-[-0.02em] leading-[0.95] whitespace-nowrap"
                >
                  visit nepal
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
