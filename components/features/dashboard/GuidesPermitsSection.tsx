'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore, Permit, Guide } from '@/store/useTravelStore';
import {
  Search,
  X,
  Star,
  Phone,
  Globe,
  Award,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

interface GuidesPermitsSectionProps {
  activeId: string;
}

interface Butler {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  languages: string[];
  bio: string;
  pricePerDay: number;
  avatar: string;
}

const BUTLERS: Butler[] = [
  {
    id: 'butler-1',
    name: 'Aarav Rajbhandari',
    specialty: 'Heritage & Palace Concierge',
    rating: 4.9,
    experience: 9,
    languages: ['English', 'Nepali', 'French'],
    bio: 'Dedicated personal butler for heritage suites, private dining curation, luggage logistics, and Kathmandu cultural arrangements.',
    pricePerDay: 95,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
  },
  {
    id: 'butler-2',
    name: 'Sonam Dolma',
    specialty: 'Luxury Lodge Butler',
    rating: 5.0,
    experience: 7,
    languages: ['English', 'Nepali', 'Tibetan'],
    bio: 'Specialized in high-altitude luxury lodge hospitality, heated gear preparation, bespoke tea service, and wellness scheduling.',
    pricePerDay: 110,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
  },
  {
    id: 'butler-3',
    name: 'Bikash Thapa',
    specialty: 'Expedition & Transit Valet',
    rating: 4.8,
    experience: 11,
    languages: ['English', 'Nepali', 'Hindi', 'Japanese'],
    bio: 'Handles seamless airport-to-lodge transfers, private helicopter coordination, equipment packing, and 24/7 itinerary adjustments.',
    pricePerDay: 85,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300',
  },
  {
    id: 'butler-4',
    name: 'Prerana Shrestha',
    specialty: 'Private Retreat Host',
    rating: 4.9,
    experience: 6,
    languages: ['English', 'Nepali', 'German'],
    bio: 'Curates private lakeside picnics, spa reservations, dietary meal planning, and artisan shopping experiences in Pokhara and Kathmandu.',
    pricePerDay: 90,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300',
  },
];

interface GuideReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const INITIAL_GUIDE_REVIEWS: Record<string, GuideReview[]> = {
  g1: [
    {
      id: 'rev-g1-1',
      author: 'Marcus Vance',
      rating: 5,
      date: 'May 2026',
      comment: 'Nima managed our Khumbu icefall crossing with total calm. His altitude pacing kept our entire team healthy to Base Camp.',
    },
    {
      id: 'rev-g1-2',
      author: 'Elena Rostova',
      rating: 5,
      date: 'April 2026',
      comment: 'Unmatched mountain judgment and fluent communication. Worth every dollar for high-altitude safety.',
    },
  ],
  g2: [
    {
      id: 'rev-g2-1',
      author: 'Daniel Kim',
      rating: 5,
      date: 'May 2026',
      comment: 'Priya spotted a Bengal tiger and two rhinos on our first morning in Chitwan. Her botanical knowledge made every walk fascinating.',
    },
    {
      id: 'rev-g2-2',
      author: 'Sofia Alvarez',
      rating: 5,
      date: 'March 2026',
      comment: 'Patient, knowledgeable, and spoke fluent Spanish with our family throughout the trek.',
    },
  ],
  g3: [
    {
      id: 'rev-g3-1',
      author: 'Hannah Weber',
      rating: 5,
      date: 'April 2026',
      comment: 'Lobsang opened doors to monasteries in Upper Mustang we would never have experienced on our own. Deeply insightful.',
    },
  ],
};

const GUIDE_SPECIALTIES = ['All', 'Mountaineering', 'Trekking', 'Culture', 'Wildlife', 'Spiritual'] as const;

export default function GuidesPermitsSection({ activeId }: GuidesPermitsSectionProps) {
  const { guides, permits, addPermit, addBooking } = useTravelStore();
  
  // Form states
  const [applicantName, setApplicantName] = useState('Alex Mercer');
  const [passportNumber, setPassportNumber] = useState('NPL-9988221A');
  const [permitType, setPermitType] = useState<'Trekking' | 'Mountaineering' | 'National Park'>('Trekking');
  const [zone, setZone] = useState('Annapurna Conservation Area (ACAP)');
  const [startDate, setStartDate] = useState('2026-06-05');
  const [endDate, setEndDate] = useState('2026-06-15');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // 0: None, 1: Hashing, 2: Verification, 3: Completed
  const [hiredGuide, setHiredGuide] = useState<{ guide: Guide; days: number; total: number } | null>(null);
  const [hiredButler, setHiredButler] = useState<Butler | null>(null);

  // Guides search, filter, sort, profile & reviews state
  const [guideSearch, setGuideSearch] = useState('');
  const [guideSpecialty, setGuideSpecialty] = useState<string>('All');
  const [guideSort, setGuideSort] = useState<'rating' | 'experience' | 'price-asc' | 'price-desc'>('rating');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [hireDays, setHireDays] = useState(5);
  const [hireStartDate, setHireStartDate] = useState('2026-06-05');
  const [guideReviews, setGuideReviews] = useState<Record<string, GuideReview[]>>(INITIAL_GUIDE_REVIEWS);
  const [reviewAuthor, setReviewAuthor] = useState('Alex Mercer');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!selectedGuide) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedGuide(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedGuide]);

  const getGuideStats = (guide: Guide) => {
    const reviews = guideReviews[guide.id] || [];
    if (reviews.length === 0) return { avgRating: guide.rating, count: 0 };
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avgRating: Number(((guide.rating + total) / (reviews.length + 1)).toFixed(2)),
      count: reviews.length,
    };
  };

  const filteredGuides = useMemo(() => {
    const q = guideSearch.trim().toLowerCase();
    const list = guides.filter((g) => {
      const matchesSpecialty = guideSpecialty === 'All' || g.type === guideSpecialty;
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.type.toLowerCase().includes(q) ||
        g.bio.toLowerCase().includes(q) ||
        g.languages.some((l) => l.toLowerCase().includes(q));
      return matchesSpecialty && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (guideSort === 'rating') return getGuideStats(b).avgRating - getGuideStats(a).avgRating;
      if (guideSort === 'experience') return b.experience - a.experience;
      if (guideSort === 'price-asc') return a.pricePerDay - b.pricePerDay;
      return b.pricePerDay - a.pricePerDay;
    });
  }, [guides, guideSearch, guideSpecialty, guideSort, guideReviews]);

  const containerVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleApplyPermit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStep(1);

    // Simulated progress steps
    setTimeout(() => {
      setSubmitStep(2);
      setTimeout(() => {
        setSubmitStep(3);
        const costMap = { Trekking: 30, Mountaineering: 11000, 'National Park': 20 };
        addPermit({
          type: permitType,
          zone,
          applicantName,
          passportNumber,
          startDate,
          endDate,
          cost: costMap[permitType] || 30
        });
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitStep(0);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleHireGuide = (guide: Guide, days = 5) => {
    const total = guide.pricePerDay * days;
    const start = new Date(`${hireStartDate}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    const fmt = (d: Date) =>
      Number.isNaN(d.getTime())
        ? `${days} days`
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateRange = Number.isNaN(start.getTime()) ? `${days} days` : `${fmt(start)} - ${fmt(end)}`;

    const invNo = `INV-GUIDE-${Math.floor(1000 + Math.random() * 9000)}`;
    addBooking({
      id: `b-guide-${Date.now()}`,
      type: 'Guide',
      title: `${guide.name} - ${guide.type} Guide`,
      date: dateRange,
      details: `${days} ${days === 1 ? 'day' : 'days'}. Languages: ${guide.languages.join(', ')}.`,
      cost: total,
      status: 'Confirmed',
      invoiceNo: invNo
    });

    setSelectedGuide(null);
    setHiredGuide({ guide, days, total });
    setTimeout(() => {
      setHiredGuide(null);
    }, 2500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide || !reviewComment.trim()) return;
    const newRev: GuideReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim() || 'Traveler',
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
    };
    setGuideReviews((prev) => ({
      ...prev,
      [selectedGuide.id]: [newRev, ...(prev[selectedGuide.id] || [])],
    }));
    setReviewComment('');
    setReviewRating(5);
  };

  const handleHireButler = (butler: Butler) => {
    const invNo = `INV-BUTLER-${Math.floor(1000 + Math.random() * 9000)}`;
    addBooking({
      id: `b-butler-${Date.now()}`,
      type: 'Guide',
      title: `${butler.name} - Personal Butler Service`,
      date: `${startDate} - ${endDate}`,
      details: `${butler.specialty}. Languages: ${butler.languages.join(', ')}.`,
      cost: butler.pricePerDay * 5,
      status: 'Confirmed',
      invoiceNo: invNo
    });

    setHiredButler(butler);
    setTimeout(() => {
      setHiredButler(null);
    }, 2000);
  };

  return (
    <motion.div 
      key={activeId}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-left"
    >
      {/* ── GUIDES VIEW ────────────────────────────────────────────────── */}
      {activeId === 'guides' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-4">
          <motion.div variants={itemVariants} className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Sherpas & Mountain Guides</h2>
            <p className="text-xs text-[#475569]">Search, compare, and review certified Himalayan guides for mountaineering, wildlife, and cultural journeys.</p>
          </motion.div>

          {/* Search, Specialty & Sort Controls */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={guideSearch}
                  onChange={(e) => setGuideSearch(e.target.value)}
                  placeholder="Search by name, specialty, or language..."
                  className="w-full bg-white border border-slate-200/90 rounded-full pl-10 pr-9 py-2 text-xs text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] shadow-2xs transition-colors"
                />
                {guideSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setGuideSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-[#64748B]">
                  Showing <strong className="text-[#0552A2]">{filteredGuides.length}</strong> {filteredGuides.length === 1 ? 'guide' : 'guides'}
                </span>
                <select
                  aria-label="Sort guides"
                  value={guideSort}
                  onChange={(e) => setGuideSort(e.target.value as typeof guideSort)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#17212B] focus:outline-none focus:border-[#0552A2] cursor-pointer"
                >
                  <option value="rating">Sort: Top Rated</option>
                  <option value="experience">Sort: Most Experienced</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {GUIDE_SPECIALTIES.map((spec) => {
                const isActive = guideSpecialty === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setGuideSpecialty(spec)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0552A2] text-white border-[#0552A2] font-semibold shadow-2xs'
                        : 'bg-white text-[#475569] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {spec === 'All' ? 'All Guides' : spec}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Guides Grid */}
          <motion.div
            variants={itemVariants}
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}
          >
            {filteredGuides.map((guide) => {
              const stats = getGuideStats(guide);
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-[#0552A2]/50 hover:shadow-md transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="flex gap-3.5 items-start">
                      <div className="relative shrink-0">
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                        />
                        <span
                          title={guide.status}
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            guide.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors truncate">
                            {guide.name}
                          </h3>
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {stats.avgRating}
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1 mt-1">
                          <span className="text-[11px] font-medium text-[#0552A2] bg-[#0552A2]/8 px-2 py-0.5 rounded-md">
                            {guide.type}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                            <span>{guide.experience} yrs exp</span>
                            {stats.count > 0 && (
                              <span>
                                · {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 mt-3 min-h-[2.4rem]">
                      {guide.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {guide.languages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="text-[11px] text-[#475569] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                        >
                          {lang}
                        </span>
                      ))}
                      {guide.languages.length > 3 && (
                        <span className="text-[11px] text-[#64748B] px-1.5 py-0.5">
                          +{guide.languages.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3.5 gap-2">
                    <div>
                      <span className="text-sm font-bold text-[#17212B]">${guide.pricePerDay}</span>
                      <span className="text-xs text-[#64748B]"> / day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGuide(guide);
                        }}
                        className="text-xs font-semibold text-[#0552A2] hover:bg-[#0552A2]/8 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Profile & Reviews
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHireGuide(guide);
                        }}
                        className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Hire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {filteredGuides.length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold text-[#17212B]">No guides matched your search</p>
              <p className="text-xs text-[#64748B]">Try clearing your search or selecting another specialty.</p>
              <button
                type="button"
                onClick={() => {
                  setGuideSearch('');
                  setGuideSpecialty('All');
                }}
                className="mt-1 text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Guide Profile & Reviews Modal */}
          <AnimatePresence>
            {selectedGuide && (() => {
              const stats = getGuideStats(selectedGuide);
              const reviews = guideReviews[selectedGuide.id] || [];
              return (
                <div
                  onClick={() => setSelectedGuide(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-left"
                  >
                    <button
                      type="button"
                      aria-label="Close profile"
                      onClick={() => setSelectedGuide(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start pr-8">
                      <img
                        src={selectedGuide.avatar}
                        alt={selectedGuide.name}
                        className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-[#17212B]">{selectedGuide.name}</h3>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              selectedGuide.status === 'Online'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {selectedGuide.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#475569]">
                          <span className="font-semibold text-[#0552A2]">{selectedGuide.type}</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {stats.avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-[#0552A2]" />
                            {selectedGuide.experience} years experience
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#0552A2]" />
                            {selectedGuide.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-[#0552A2]" />
                            {selectedGuide.languages.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-4 pb-4 border-b border-slate-100">
                      {selectedGuide.bio}
                    </p>

                    {/* Hire Guide Bar */}
                    <div className="mt-4 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="grid grid-cols-2 gap-2.5 flex-1">
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-[#475569]">Start Date</span>
                          <input
                            type="date"
                            value={hireStartDate}
                            onChange={(e) => setHireStartDate(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-[#475569]">Duration</span>
                          <select
                            value={hireDays}
                            onChange={(e) => setHireDays(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          >
                            {[1, 2, 3, 5, 7, 10, 14, 21].map((d) => (
                              <option key={d} value={d}>
                                {d} {d === 1 ? 'day' : 'days'}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="sm:text-right">
                          <span className="text-[11px] text-[#64748B] block">Total ({hireDays}d)</span>
                          <span className="text-base font-bold text-[#0552A2]">
                            ${selectedGuide.pricePerDay * hireDays}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleHireGuide(selectedGuide, hireDays)}
                          className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Hire Guide
                        </button>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-[#0552A2]" />
                        <h4 className="text-sm font-bold text-[#17212B]">
                          Traveler Reviews ({reviews.length})
                        </h4>
                      </div>

                      {/* Write a Review */}
                      <form
                        onSubmit={handleSubmitReview}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white mb-4 flex flex-col gap-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <input
                            type="text"
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="Your name"
                            className="bg-transparent border-0 p-0 text-xs font-semibold text-[#17212B] focus:outline-none sm:w-48"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-[#64748B] mr-1">Your rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                aria-label={`Rate ${star} stars`}
                                onClick={() => setReviewRating(star)}
                                className="p-0.5 cursor-pointer"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    star <= reviewRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={`Share your experience with ${selectedGuide.name}...`}
                            required
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          />
                          <button
                            type="submit"
                            className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            Post Review
                          </button>
                        </div>
                      </form>

                      {/* Review List */}
                      <div className="divide-y divide-slate-100">
                        {reviews.length === 0 ? (
                          <p className="text-xs text-[#64748B] py-2">
                            No reviews yet. Be the first to review {selectedGuide.name}.
                          </p>
                        ) : (
                          reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="py-3 first:pt-1 last:pb-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-[#17212B]">
                                  {rev.author}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {rev.rating}
                                  </span>
                                  <span className="text-[11px] text-[#64748B]">{rev.date}</span>
                                </div>
                              </div>
                              <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                                {rev.comment}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </AnimatePresence>

          {hiredGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl max-w-sm text-center">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#17212B]">Guide Booked</h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  Confirmed {hiredGuide.guide.name} for {hiredGuide.days} {hiredGuide.days === 1 ? 'day' : 'days'} (${hiredGuide.total}). Logged in your Bookings tab.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BUTLER VIEW ────────────────────────────────────────────────── */}
      {activeId === 'butler' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-4">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Personal Butlers & Concierge</h2>
            <p className="text-xs text-[#475569]">Book dedicated personal butlers for suite hospitality, private dining, luggage care, and seamless travel logistics.</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
          >
            {BUTLERS.map((butler) => (
              <div
                key={butler.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-[#0552A2]/50 transition-all duration-300 shadow-xs"
              >
                <div className="flex gap-4">
                  <img src={butler.avatar} alt={butler.name} className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-[#17212B]">{butler.name}</h3>
                      <span className="text-[10px] font-mono font-bold text-[#0552A2] shrink-0">
                        ★ {butler.rating.toFixed(1)} ({butler.experience} yrs)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{butler.specialty}</span>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 mt-1">{butler.bio}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {butler.languages.map((lang) => (
                    <span key={lang} className="text-[10px] font-mono text-[#475569] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3">
                  <div className="text-xs font-mono">
                    <span className="text-[#64748B] block text-[9px] uppercase">Service Rate</span>
                    <span className="font-bold text-[#17212B]">${butler.pricePerDay}/day</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleHireButler(butler)}
                    className="bg-[#0552A2] hover:bg-[#044080] text-white text-[10px] font-mono font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Book Butler
                  </button>
                </div>
              </div>
            ))}
          </motion.div>

          {hiredButler && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <div className="bg-white border border-[#92C4EA]/40 p-6 rounded-3xl shadow-xl max-w-sm text-center">
                <h4 className="text-sm font-bold text-[#17212B]">Butler Reserved</h4>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  You have successfully booked {hiredButler.name} ({hiredButler.specialty}). Your confirmation is logged in Bookings.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PERMITS VIEW ───────────────────────────────────────────────── */}
      {activeId === 'permits' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-4">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0552A2] uppercase">
              Gov Registry Access
            </span>
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Permits & Approvals</h2>
            <p className="text-xs text-[#475569]">Apply for standard conservation area permits and special mountaineering clearances online.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col gap-4 shadow-xs"
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] border-b border-slate-100 pb-2">
                New Permit Request
              </h3>

              <form onSubmit={handleApplyPermit} className="flex flex-col gap-3 font-mono text-[10px] text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-[#64748B]">Applicant Name</label>
                  <input 
                    type="text" 
                    value={applicantName} 
                    onChange={e => setApplicantName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-[#64748B]">Passport Identification</label>
                  <input 
                    type="text" 
                    value={passportNumber} 
                    onChange={e => setPassportNumber(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-[#64748B]">Permit Class</label>
                    <select 
                      value={permitType} 
                      onChange={e => setPermitType(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none text-[#17212B]"
                    >
                      <option value="Trekking">Trekking Loop</option>
                      <option value="Mountaineering">Mountaineering Peak</option>
                      <option value="National Park">National Park</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-[#64748B]">Target Zone</label>
                    <input 
                      type="text" 
                      value={zone} 
                      onChange={e => setZone(e.target.value)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-[#64748B]">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none text-[#17212B] font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-[#64748B]">End Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none text-[#17212B] font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#0552A2] hover:bg-[#044080] text-white py-2.5 rounded-xl font-bold uppercase tracking-widest mt-2 cursor-pointer transition-colors text-[10px] shadow-2xs"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Permit Clearances'}
                </button>
              </form>
            </motion.div>

            {/* List */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] border-b border-slate-100 pb-2">
                Active Permits Ledger
              </h3>

              <div className="flex flex-col gap-3">
                {permits.map(permit => (
                  <div key={permit.id} className="bg-white border border-slate-200/90 p-4 rounded-xl flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-white bg-[#0552A2] px-1.5 py-0.5 rounded uppercase">
                        {permit.type}
                      </span>
                      <h4 className="text-xs font-bold mt-1 text-[#17212B]">{permit.zone}</h4>
                      <p className="text-[10px] text-[#475569] mt-0.5 font-mono">Passport: {permit.passportNumber}</p>
                    </div>
                    <div className="text-right flex flex-col gap-1 font-mono text-xs">
                      <span className={`font-bold ${permit.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {permit.status}
                      </span>
                      <span className="text-[9px] text-[#64748B]">${permit.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hashing steps portal overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-[#92C4EA]/40 p-6 rounded-3xl shadow-xl max-w-sm text-center w-full"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-6 w-6 rounded-full border-2 border-t-transparent border-[#0552A2] animate-spin" />
                    <h4 className="text-xs font-mono font-bold text-[#17212B] uppercase mt-2">
                      {submitStep === 1 && '1/3 Generating Crypto Hash...'}
                      {submitStep === 2 && '2/3 Querying Immigration Gateway...'}
                      {submitStep === 3 && '3/3 Permit Registered Success!'}
                    </h4>
                    <p className="text-[10px] text-[#475569]">Connecting with Government Registry server nodes...</p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

