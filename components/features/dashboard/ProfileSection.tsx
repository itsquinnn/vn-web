'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore } from '@/store/useTravelStore';
import {
  Compass,
  MapPin,
  Map,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Mountain,
  Plane,
  ShieldCheck,
  Sparkles,
  Heart,
  FileCheck,
  UserCheck,
  X,
} from 'lucide-react';
import {
  UPCOMING_TRIPS,
  DRAFT_TRIPS,
  RECENT_BOOKINGS,
  ActivityLogItem,
  RECENT_ACTIVITY_LOG,
  WishlistItem,
  INITIAL_WISHLIST,
} from './mockDashboardData';

interface ProfileSectionProps {
  onNavigate?: (id: string) => void;
}

const getActivityStyle = (item: ActivityLogItem) => {
  const iconKey = item.icon?.toLowerCase() || '';
  const title = item.title?.toLowerCase() || '';

  if (iconKey === 'map' || iconKey === '🗺️' || title.includes('itinerary') || title.includes('trip')) {
    return {
      icon: Map,
      bg: 'bg-blue-50',
      text: 'text-[#0552A2]',
      badgeBg: 'bg-blue-100/80',
      badgeText: 'text-blue-800',
      dotBorder: 'border-[#0552A2]',
    };
  }

  if (iconKey === 'file-check' || iconKey === 'file-text' || iconKey === '📄' || title.includes('permit')) {
    return {
      icon: FileCheck,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      badgeBg: 'bg-emerald-100/80',
      badgeText: 'text-emerald-800',
      dotBorder: 'border-emerald-500',
    };
  }

  if (iconKey === 'heart' || iconKey === '❤️' || title.includes('bookmark') || title.includes('wishlist')) {
    return {
      icon: Heart,
      bg: 'bg-rose-50',
      text: 'text-[#EC1F27]',
      badgeBg: 'bg-rose-100/80',
      badgeText: 'text-rose-800',
      dotBorder: 'border-[#EC1F27]',
    };
  }

  if (iconKey === 'plane' || iconKey === '✈️' || title.includes('flight') || title.includes('ticket')) {
    return {
      icon: Plane,
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      badgeBg: 'bg-sky-100/80',
      badgeText: 'text-sky-800',
      dotBorder: 'border-sky-500',
    };
  }

  if (iconKey === 'user-check' || iconKey === '🧗' || title.includes('guide')) {
    return {
      icon: UserCheck,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      badgeBg: 'bg-purple-100/80',
      badgeText: 'text-purple-800',
      dotBorder: 'border-purple-500',
    };
  }

  if (iconKey === 'mountain' || iconKey === '🪂' || title.includes('adventure') || title.includes('activity')) {
    return {
      icon: Mountain,
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      badgeBg: 'bg-orange-100/80',
      badgeText: 'text-orange-800',
      dotBorder: 'border-orange-500',
    };
  }

  if (iconKey === 'shield-check' || iconKey === '🎒' || title.includes('gear')) {
    return {
      icon: ShieldCheck,
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      badgeBg: 'bg-teal-100/80',
      badgeText: 'text-teal-800',
      dotBorder: 'border-teal-500',
    };
  }

  return {
    icon: Sparkles,
    bg: 'bg-slate-100',
    text: 'text-[#0552A2]',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    dotBorder: 'border-[#0552A2]',
  };
};

export default function ProfileSection({ onNavigate }: ProfileSectionProps) {
  const currentUser = useTravelStore((state) => state.currentUser);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTripFilter, setActiveTripFilter] = useState<'All' | 'Alpine' | 'Scenic' | 'Safari'>('All');
  const [bookingFilter, setBookingFilter] = useState<'All' | 'Confirmed' | 'Upcoming' | 'Pending'>('All');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showAllDrafts, setShowAllDrafts] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const fullName = currentUser?.name || 'Alex Mercer';
  const roleLabel = currentUser?.role || 'Traveler';
  const emailLabel = currentUser?.email || 'alex.mercer@visitnepal.com';

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

  const filteredUpcomingTrips = useMemo(() => {
    if (activeTripFilter === 'All') return UPCOMING_TRIPS;
    return UPCOMING_TRIPS.filter((t) => t.category === activeTripFilter);
  }, [activeTripFilter]);

  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'All') return RECENT_BOOKINGS;
    return RECENT_BOOKINGS.filter((b) => b.status === bookingFilter);
  }, [bookingFilter]);

  const displayedBookings = showAllBookings ? filteredBookings : filteredBookings.slice(0, 4);
  const displayedDrafts = showAllDrafts ? DRAFT_TRIPS : DRAFT_TRIPS.slice(0, 3);
  const displayedActivity = showAllActivity ? RECENT_ACTIVITY_LOG : RECENT_ACTIVITY_LOG.slice(0, 5);

  return (
    <div className="w-full space-y-5 sm:space-y-6 pb-8 text-left">
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

      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
            <Image
              src={currentUser?.avatar || '/pictures/mustang_tk_people-1624440754.jpeg'}
              alt={fullName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold text-[#17212B] tracking-tight leading-tight">
                {fullName}
              </h1>
              <span className="text-xs font-semibold text-[#0552A2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                {roleLabel}
              </span>
            </div>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-0.5">
              {emailLabel} · {UPCOMING_TRIPS.length} upcoming journeys across Nepal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate?.('customize')}
            className="px-4 py-2 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Plan a New Trip</span>
          </button>

          <button
            onClick={() => onNavigate?.('explore')}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-[#0552A2] text-[#17212B] hover:text-[#0552A2] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Explore Destinations</span>
          </button>
        </div>
      </div>

      {/* Minimal Travel Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-3 border-b border-slate-200/80">
        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
            Upcoming Trips
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#17212B]">
              {UPCOMING_TRIPS.length}
            </span>
            <span className="text-[11px] text-[#0552A2] font-medium truncate">
              Next in 21 days
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
            Places Explored
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#17212B]">
              8
            </span>
            <span className="text-[11px] text-[#64748B] truncate">
              4 provinces
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
            Saved Sanctuaries
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#17212B]">
              {wishlist.length}
            </span>
            <span className="text-[11px] text-[#64748B] truncate">
              Wishlist
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
            Distance Trekked
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#17212B]">
              124 km
            </span>
            <span className="text-[11px] text-[#64748B] truncate">
              4 completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Profile Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start pt-2">
        {/* Left Column: Upcoming Journeys & Continue Planning */}
        <div className="xl:col-span-7 2xl:col-span-8 space-y-6 sm:space-y-8 min-w-0">
          {/* Your Upcoming Journeys */}
          <div>
            <div className="flex flex-wrap items-end justify-between mb-4 sm:mb-5 gap-3">
              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-[#17212B] tracking-tight">
                  Your Upcoming Journeys
                </h2>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(['All', 'Alpine', 'Scenic', 'Safari'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTripFilter(cat)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                      activeTripFilter === cat
                        ? 'bg-[#0552A2] text-white'
                        : 'bg-slate-100 text-[#4B5563] hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 journey-card-wrapper">
              {filteredUpcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="journey-responsive-card group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-[#0552A2]/35 transition-all duration-300"
                >
                  <div className="journey-responsive-visual relative shrink-0 bg-[#17212B]">
                    <Image
                      src={trip.imageUrl}
                      alt={trip.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between gap-3 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1.5 flex-wrap font-[family-name:var(--font-ibm-plex-sans)]">
                        <span className="font-semibold text-[#0552A2]">{trip.countdown}</span>
                        <span>·</span>
                        <span>{trip.dates}</span>
                        <span>·</span>
                        <span>{trip.duration}</span>
                      </div>

                      <h3 className="font-[family-name:var(--font-quicksand)] text-lg sm:text-xl font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors leading-snug">
                        {trip.title}
                      </h3>
                      <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-[13px] text-[#4B5563] mt-1.5 line-clamp-2 leading-relaxed">
                        {trip.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[#64748B] text-[11px]">
                        Max elevation {trip.elevation}
                      </span>

                      <button
                        onClick={() => handleDestinationClick(trip.slug)}
                        className="font-semibold text-[#0552A2] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Itinerary</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Planning (Draft Itineraries) */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
              <div>
                <span className="text-xs font-medium text-[#0552A2] block mb-0.5">
                  In-progress trips ({DRAFT_TRIPS.length})
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
                  Continue Planning
                </h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setShowAllDrafts(!showAllDrafts)}
                  className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
                >
                  {showAllDrafts ? 'Show Less' : `View All (${DRAFT_TRIPS.length})`}
                </button>
                <button
                  onClick={() => onNavigate?.('customize')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-[#0552A2] hover:bg-[#0552A2] hover:text-white transition-colors cursor-pointer"
                >
                  + New Draft
                </button>
              </div>
            </div>

            <div className="journey-card-wrapper">
              <div className="responsive-grid-3">
                {displayedDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3.5 sm:gap-4 min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={draft.imageUrl}
                          alt={draft.title}
                          fill
                          sizes="48px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold font-[family-name:var(--font-quicksand)] text-[#17212B] truncate">
                          {draft.title}
                        </h4>
                        <p className="text-[11px] text-[#4B5563] truncate mt-0.5">
                          {draft.statusSummary}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[#4B5563] text-[11px]">Completion</span>
                        <span className="font-semibold text-[#0552A2]">{draft.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0552A2] rounded-full transition-all duration-500"
                          style={{ width: `${draft.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>{draft.lastEdited}</span>
                      <button
                        onClick={() => onNavigate?.('customize')}
                        className="font-semibold text-[#0552A2] hover:underline cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bookings, Wishlist, Recent Travel Log */}
        <div className="xl:col-span-5 2xl:col-span-4 space-y-4 sm:space-y-5 w-full min-w-0">
          {/* My Bookings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
                My Bookings ({filteredBookings.length})
              </h3>
              <button
                onClick={() => setShowAllBookings(!showAllBookings)}
                className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                {showAllBookings ? 'Show Less' : `View all (${RECENT_BOOKINGS.length})`}
              </button>
            </div>

            <div className="flex items-center gap-1 mb-3.5 border-b border-slate-100 pb-2 flex-wrap">
              {(['All', 'Confirmed', 'Upcoming', 'Pending'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setBookingFilter(s)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                    bookingFilter === s
                      ? 'bg-[#0552A2] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {displayedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white hover:shadow-xs transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[11px] font-semibold text-[#0552A2]">{b.type}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#17212B]">{b.cost}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[#17212B] leading-snug line-clamp-2">
                    {b.title}
                  </h4>

                  <div className="text-[11px] text-[#4B5563] flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{b.destination}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/50 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
                    <span>{b.date}</span>
                    <span className="text-slate-600 font-medium">{b.ref}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Wishlist */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
                Saved Wishlist ({wishlist.length})
              </h3>
              <button
                onClick={() => onNavigate?.('explore')}
                className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                Explore more
              </button>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-[#4B5563] py-4 text-center">
                Your wishlist is empty. Explore destinations to save your dreams!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => handleDestinationClick(item.slug)}
                      className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer flex-1"
                    >
                      <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="40px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#17212B] group-hover:text-[#0552A2] truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {item.location}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWishlist(item)}
                      className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#EC1F27] hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                      title="Remove from wishlist"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Travel Log */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-[family-name:var(--font-quicksand)] text-[#17212B]">
                Recent Travel Log
              </h3>
              <button
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                {showAllActivity ? 'Show Less' : `View all (${RECENT_ACTIVITY_LOG.length})`}
              </button>
            </div>

            <div className="relative pl-5 border-l-2 border-slate-200 space-y-4">
              {displayedActivity.map((log) => {
                const style = getActivityStyle(log);
                const IconComponent = style.icon;

                return (
                  <div key={log.id} className="relative group">
                    <div
                      className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-white border-2 ${style.dotBorder} transition-colors`}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-bold text-[#17212B] truncate">
                            {log.title}
                          </span>
                          {log.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${style.badgeBg} ${style.badgeText} shrink-0`}
                            >
                              {log.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4B5563] mt-1 pl-8 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
