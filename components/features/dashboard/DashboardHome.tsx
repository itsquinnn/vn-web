'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore } from '@/store/useTravelStore';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Hotel,
  ShieldCheck,
  Heart,
  Search,
  MapPin,
  X,
} from 'lucide-react';
import {
  RECOMMENDED_DESTINATIONS,
  WishlistItem,
  INITIAL_WISHLIST,
} from './mockDashboardData';

interface DashboardHomeProps {
  onNavigate?: (id: string) => void;
}

const PLACE_FILTERS = [
  { id: 'All', label: 'All Nepal', keywords: [] as string[] },
  { id: 'everest', label: 'Everest & Koshi', keywords: ['koshi', 'everest', 'ilam'] },
  { id: 'gandaki', label: 'Pokhara & Annapurna', keywords: ['gandaki', 'ghandruk', 'bandipur', 'mustang'] },
  { id: 'mustang', label: 'Upper Mustang', keywords: ['mustang'] },
  { id: 'chitwan', label: 'Chitwan & Bardia', keywords: ['chitwan', 'bardia'] },
  { id: 'karnali', label: 'Rara & Dolpo', keywords: ['karnali', 'rara', 'dolpo'] },
  { id: 'bagmati', label: 'Bagmati & Rolwaling', keywords: ['bagmati', 'dolakha', 'tsho-rolpa'] },
  { id: 'madhesh', label: 'Janakpur & Madhesh', keywords: ['madhesh', 'janakpur'] },
  { id: 'west', label: 'Far West (Khaptad)', keywords: ['sudurpashchim', 'khaptad'] },
];

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const currentUser = useTravelStore((state) => state.currentUser);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeRecCategory, setActiveRecCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('All');

  const firstName = currentUser?.name?.split(' ')[0] || 'Traveler';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      if (exists) {
        showToast(`Removed ${item.name} from your Wishlist`);
        return prev.filter((w) => w.id !== item.id);
      }
      showToast(`Saved ${item.name} to your Wishlist`);
      return [...prev, item];
    });
  };

  const handleDestinationClick = (slug: string) => {
    onNavigate?.(slug);
  };

  const filteredRecommendations = useMemo(() => {
    const placeObj = PLACE_FILTERS.find((p) => p.id === selectedPlace);
    return RECOMMENDED_DESTINATIONS.filter((dest) => {
      const matchesCategory = activeRecCategory === 'All' || dest.category === activeRecCategory;
      const matchesPlace =
        !placeObj ||
        placeObj.id === 'All' ||
        placeObj.keywords.some(
          (kw) =>
            dest.region.toLowerCase().includes(kw) ||
            dest.slug.toLowerCase().includes(kw) ||
            dest.name.toLowerCase().includes(kw)
        );
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q) ||
        dest.category.toLowerCase().includes(q);
      return matchesCategory && matchesPlace && matchesSearch;
    });
  }, [activeRecCategory, selectedPlace, searchQuery]);

  return (
    <div className="w-full space-y-6 sm:space-y-7 pb-8 text-left">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-[#0552A2] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20"
          >
            <CheckCircle2 className="h-4 w-4 text-[#FDB716]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Namaste Greeting + Search + Place Selector */}
      <div className="space-y-4 pb-2">
        <div>
          <h1 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold text-[#17212B] tracking-tight">
            Namaste, {firstName}
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1">
            From Himalayan passes to quiet tea hills — pick a place below to tailor your recommendations.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places, valleys, national parks, or regions..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Places Selector */}
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#17212B] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#0552A2]" />
            <span>Where in Nepal are you dreaming of going?</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PLACE_FILTERS.map((place) => {
              const active = selectedPlace === place.id;
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelectedPlace(place.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer border ${
                    active
                      ? 'bg-[#0552A2] text-white border-[#0552A2]'
                      : 'bg-white text-[#4B5563] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {place.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Travel Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate?.('customize')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0552A2]/40 hover:bg-blue-50/30 text-left transition-all cursor-pointer flex items-center gap-3 group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0552A2] group-hover:bg-[#0552A2] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold text-[#17212B] block truncate">
              Plan a Trip
            </span>
            <span className="text-[11px] text-[#4B5563] block truncate">Customizer</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate?.('hotels')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0552A2]/40 hover:bg-blue-50/30 text-left transition-all cursor-pointer flex items-center gap-3 group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0552A2] group-hover:bg-[#0552A2] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Hotel className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold text-[#17212B] block truncate">
              Find Stays
            </span>
            <span className="text-[11px] text-[#4B5563] block truncate">Lodge &amp; Spa</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate?.('explore')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0552A2]/40 hover:bg-blue-50/30 text-left transition-all cursor-pointer flex items-center gap-3 group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0552A2] group-hover:bg-[#0552A2] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold text-[#17212B] block truncate">
              Destinations
            </span>
            <span className="text-[11px] text-[#4B5563] block truncate">7 Provinces</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate?.('permits')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0552A2]/40 hover:bg-blue-50/30 text-left transition-all cursor-pointer flex items-center gap-3 group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0552A2] group-hover:bg-[#0552A2] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold text-[#17212B] block truncate">
              Permits
            </span>
            <span className="text-[11px] text-[#4B5563] block truncate">TIMS &amp; ACAP</span>
          </div>
        </button>
      </div>

      {/* Recommended Destinations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3">
          <div>
            <span className="text-xs font-medium text-[#0552A2] block mb-0.5">
              Curated across Nepal ({filteredRecommendations.length})
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
              Recommended Destinations
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {['All', 'Heritage', 'High Altitude', 'Wildlife', 'Scenic', 'Hidden Gem'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveRecCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeRecCategory === cat
                    ? 'bg-[#0552A2] text-white shadow-xs'
                    : 'bg-slate-100 text-[#4B5563] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center gap-2">
            <p className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
              No destinations match that combination
            </p>
            <p className="text-xs text-slate-500">
              Try another region or reset your filters to view all destinations.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPlace('All');
                setActiveRecCategory('All');
                setSearchQuery('');
              }}
              className="mt-1 text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
            >
              Show All Places
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {filteredRecommendations.map((dest) => {
              const isWishlisted = wishlist.some((w) => w.slug === dest.slug);
              return (
                <motion.div
                  key={dest.id}
                  layout
                  transition={{
                    layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.25 },
                  }}
                  className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-[border-color,box-shadow,transform] duration-300 ease-out flex flex-col justify-between transform-gpu will-change-transform"
                >
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#17212B]">
                    <Image
                      src={dest.imageUrl}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#0552A2]">
                      {dest.category}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: `w-${dest.slug}`,
                          name: dest.name,
                          slug: dest.slug,
                          location: dest.region,
                          category: dest.category,
                          imageUrl: dest.imageUrl,
                        });
                      }}
                      className={`absolute top-3.5 right-3.5 h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#EC1F27] text-white shadow-md'
                          : 'bg-white/80 backdrop-blur-md text-[#17212B] hover:bg-white hover:text-[#EC1F27]'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="text-[11px] font-medium text-amber-200 block truncate">
                        {dest.region} • {dest.elevation}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold font-[family-name:var(--font-quicksand)] text-[#17212B] group-hover:text-[#0552A2] transition-colors leading-snug">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Est: {dest.duration}
                      </span>

                      <button
                        onClick={() => handleDestinationClick(dest.slug)}
                        className="font-semibold text-[#0552A2] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Editorial Stories */}
      <div className="pt-6 border-t border-slate-200">
        <div className="mb-4 sm:mb-5">
          <span className="text-xs font-medium text-[#0552A2] block mb-0.5">
            Editorial stories
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
            Still Deciding Where to Go?
          </h2>
        </div>

        <div className="journey-card-wrapper">
          <div className="responsive-grid-2">
            <div
              onClick={() => handleDestinationClick('annapurna')}
              className="group relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#17212B] p-4 sm:p-6 flex flex-col justify-end text-white cursor-pointer shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/pictures/annapurna-1624804396.jpg"
                alt="Annapurna"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 brightness-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10">
                <span className="text-[11px] font-semibold text-amber-300 block mb-1">
                  Alpine Solitude
                </span>
                <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-quicksand)] text-white leading-tight">
                  Escape into the High Annapurnas
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Where glacial valleys unfold beneath twelve peaks crowning above 7,000 meters.
                </p>
              </div>
            </div>

            <div
              onClick={() => handleDestinationClick('kathmandu')}
              className="group relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#17212B] p-4 sm:p-6 flex flex-col justify-end text-white cursor-pointer shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg"
                alt="Kathmandu"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 brightness-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10">
                <span className="text-[11px] font-semibold text-amber-300 block mb-1">
                  Living Heritage
                </span>
                <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-quicksand)] text-white leading-tight">
                  Courtyards of the Kathmandu Valley
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Centuries of sacred rituals, master Newari woodcarvers, and golden stupa eyes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
