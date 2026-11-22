'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore, Stay } from '@/store/useTravelStore';
import {
  MapPin,
  Star,
  ArrowRight,
  ArrowLeft,
  Search,
  Hotel,
  Car,
  Plane,
  CheckCircle2,
  X,
  Compass,
  ShieldCheck,
  BadgeCheck,
  BedDouble,
  MessageSquare,
  Send,
} from 'lucide-react';

interface StaysSectionProps {
  activeId: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Stays' },
  { id: 'Luxury', label: 'Luxury' },
  { id: 'Eco Resort', label: 'Eco Resort' },
  { id: 'Boutique Hotel', label: 'Boutique Hotel' },
  { id: 'Mountain Lodge', label: 'Mountain Lodge' },
  { id: 'Homestay', label: 'Heritage Homestay' },
];

interface StayReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const INITIAL_STAY_REVIEWS: Record<string, StayReview[]> = {
  s1: [
    {
      id: 'rev-s1-1',
      author: 'Claire Dubois',
      rating: 5,
      date: 'May 2026',
      comment: 'The carved Newari courtyard and evening lamps feel like stepping into a living museum. Worth every night.',
    },
  ],
  s2: [
    {
      id: 'rev-s2-1',
      author: 'Liam Patterson',
      rating: 5,
      date: 'April 2026',
      comment: 'Waking up to Everest from the heated terrace is unforgettable. Oxygen-enriched suites made acclimatization effortless.',
    },
  ],
  s3: [
    {
      id: 'rev-s3-1',
      author: 'Maya Lin',
      rating: 5,
      date: 'May 2026',
      comment: 'Quiet lakeside gardens with direct views of Machapuchare. Breakfast on the terrace was a highlight.',
    },
  ],
};

function createStayBookingRefs() {
  return {
    id: `b-stay-${Date.now()}`,
    invoiceNo: `INV-STAY-${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

export default function StaysSection({ activeId }: StaysSectionProps) {
  const { stays, addBooking } = useTravelStore();
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [stayProfileTab, setStayProfileTab] = useState<'about' | 'rooms' | 'reviews'>('about');
  const [showStayBooking, setShowStayBooking] = useState(false);
  const [showStayChat, setShowStayChat] = useState(false);
  const [stayChatInput, setStayChatInput] = useState('');
  const [stayMessages, setStayMessages] = useState<Record<string, { id: string; sender: 'user' | 'hotel'; text: string }[]>>({});
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [stayCheckIn, setStayCheckIn] = useState('2026-06-05');
  const [stayNights, setStayNights] = useState(3);
  const [stayGuests, setStayGuests] = useState(2);
  const [stayBookedBanner, setStayBookedBanner] = useState<string | null>(null);

  const [stayReviews, setStayReviews] = useState<Record<string, StayReview[]>>(INITIAL_STAY_REVIEWS);
  const [reviewAuthor, setReviewAuthor] = useState('Alex Mercer');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const, staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Filter stays based on category and search query
  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const matchesCategory = selectedCategory === 'all' || stay.type === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() ||
        stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        stay.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [stays, selectedCategory, searchQuery]);

  const getStayStats = (stay: Stay) => {
    const reviews = stayReviews[stay.id] || [];
    if (reviews.length === 0) return { avgRating: stay.rating, count: 0 };
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avgRating: Number(((stay.rating + total) / (reviews.length + 1)).toFixed(2)),
      count: reviews.length,
    };
  };

  const openStayProfile = (stay: Stay) => {
    setSelectedStay(stay);
    setSelectedRoomName(stay.roomPreviews[0]?.name || '');
    setStayProfileTab('about');
    setShowStayBooking(false);
    setShowStayChat(false);
    setStayBookedBanner(null);
  };

  const handleSendStayChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStay || !stayChatInput.trim()) return;
    const text = stayChatInput.trim();
    const stayId = selectedStay.id;
    const stayName = selectedStay.name;
    setStayMessages((prev) => ({
      ...prev,
      [stayId]: [
        ...(prev[stayId] || []),
        { id: `msg-${Date.now()}`, sender: 'user', text },
      ],
    }));
    setStayChatInput('');
    setTimeout(() => {
      setStayMessages((prev) => ({
        ...prev,
        [stayId]: [
          ...(prev[stayId] || []),
          {
            id: `msg-reply-${Date.now()}`,
            sender: 'hotel',
            text: `Namaste from ${stayName}! Thank you for your message regarding "${text}". Our front desk team is available to assist with availability, transfers, and special requests.`,
          },
        ],
      }));
    }, 600);
  };

  const handleBook = (stay: Stay, roomName: string, price: number) => {
    const total = price * stayNights;
    const start = new Date(`${stayCheckIn}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + stayNights);
    const fmt = (d: Date) =>
      Number.isNaN(d.getTime())
        ? `${stayNights} nights`
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateRange = Number.isNaN(start.getTime()) ? `${stayNights} nights` : `${fmt(start)} - ${fmt(end)}`;

    const { id, invoiceNo } = createStayBookingRefs();
    addBooking({
      id,
      type: 'Hotel',
      title: `${stay.name} — ${roomName}`,
      date: dateRange,
      details: `${stayNights} ${stayNights === 1 ? 'night' : 'nights'} · ${stayGuests} ${stayGuests === 1 ? 'guest' : 'guests'}`,
      cost: total,
      status: 'Confirmed',
      invoiceNo,
    });

    setStayBookedBanner(`Reserved ${roomName} for ${stayNights} ${stayNights === 1 ? 'night' : 'nights'} ($${total}). Added to your Bookings.`);
    setTimeout(() => setStayBookedBanner(null), 4000);
  };

  const handleSubmitStayReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStay || !reviewComment.trim()) return;
    const newRev: StayReview = {
      id: `rev-s-${Date.now()}`,
      author: reviewAuthor.trim() || 'Traveler',
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
    };
    setStayReviews((prev) => ({
      ...prev,
      [selectedStay.id]: [newRev, ...(prev[selectedStay.id] || [])],
    }));
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <motion.div 
      key={activeId}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-left"
    >
      {/* ── HOTELS & LODGING DIRECTORIES ────────────────────────────────── */}
      {activeId !== 'transportation' && (
        <div
          className={
            selectedStay
              ? '-mx-2.5 -mt-2.5 sm:-mx-3.5 sm:-mt-3.5 md:-mx-4 md:-mt-4 -mb-4'
              : 'flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2'
          }
        >
          {selectedStay ? (() => {
            const stats = getStayStats(selectedStay);
            const reviews = stayReviews[selectedStay.id] || [];
            const activeRoom =
              selectedStay.roomPreviews.find((r) => r.name === selectedRoomName) ||
              selectedStay.roomPreviews[0];

            return (
              <div className="flex flex-col lg:flex-row items-stretch min-h-[calc(100dvh-3.5rem)] bg-white overflow-hidden">
                {/* Left: Hotel Profile */}
                <motion.div
                  layout="position"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 min-w-0"
                >
                  {stayBookedBanner && (
                    <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-5 py-3 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{stayBookedBanner}</span>
                    </div>
                  )}

                  {/* Cover Banner */}
                  <div className="relative h-60 sm:h-72 md:h-80 bg-slate-200">
                    <img
                      src={selectedStay.image}
                      alt={selectedStay.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
                    <button
                      type="button"
                      aria-label="Back to hotels"
                      onClick={() => {
                        setSelectedStay(null);
                        setShowStayBooking(false);
                        setShowStayChat(false);
                        setStayBookedBanner(null);
                      }}
                      className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#17212B] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="absolute top-3.5 right-3.5 bg-[#0552A2] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                      {selectedStay.type}
                    </span>
                  </div>

                  {/* Hotel Header */}
                  <div className="px-5 sm:px-6 pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-[#17212B]">
                            {selectedStay.name}
                          </h2>
                          <BadgeCheck className="w-5 h-5 text-[#0552A2] shrink-0" aria-label="Verified Stay" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1 font-semibold text-[#17212B]">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {stats.avgRating}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#0552A2]" />
                            {selectedStay.location}
                          </span>
                          <span>
                            From <strong className="text-[#0552A2]">${selectedStay.price}</strong> / night
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setShowStayChat((prev) => !prev);
                            setShowStayBooking(false);
                          }}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                            showStayChat
                              ? 'bg-[#17212B] text-white border-[#17212B]'
                              : 'bg-white hover:bg-slate-50 text-[#0552A2] border-[#0552A2]/30'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{showStayChat ? 'Hide Chat' : 'Chat Now'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowStayBooking((prev) => !prev);
                            setShowStayChat(false);
                          }}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            showStayBooking
                              ? 'bg-[#17212B] text-white'
                              : 'bg-[#0552A2] hover:bg-[#044080] text-white'
                          }`}
                        >
                          <span>
                            {showStayBooking ? 'Hide Booking' : `Book Room · $${activeRoom?.price ?? selectedStay.price}/night`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Tabs */}
                  <div className="flex border-t border-b border-slate-100 px-5 sm:px-6 gap-6">
                    {[
                      { id: 'about' as const, label: 'About' },
                      { id: 'rooms' as const, label: `Rooms & Suites (${selectedStay.roomPreviews.length})` },
                      { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
                    ].map((tab) => {
                      const active = stayProfileTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setStayProfileTab(tab.id)}
                          className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                            active
                              ? 'border-[#0552A2] text-[#0552A2]'
                              : 'border-transparent text-[#64748B] hover:text-[#17212B]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="p-5 sm:p-6">
                    {stayProfileTab === 'about' && (
                      <div className="space-y-4">
                        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {selectedStay.description}
                        </p>
                        <div className="border-t border-slate-100 pt-4">
                          <h3 className="text-xs font-semibold text-[#17212B] mb-2.5">
                            Property Highlights &amp; Amenities
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedStay.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-slate-50 text-[#334155] border border-slate-200/80 px-3 py-1 rounded-lg"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {stayProfileTab === 'rooms' && (
                      <div className="divide-y divide-slate-100">
                        {selectedStay.roomPreviews.map((room) => {
                          const isSelected = activeRoom?.name === room.name && showStayBooking;
                          return (
                            <div
                              key={room.name}
                              className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <BedDouble className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="text-sm font-bold text-[#17212B]">{room.name}</h4>
                                  <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">{room.info}</p>
                                </div>
                              </div>
                              <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                                <span className="text-sm font-bold text-[#0552A2]">
                                  ${room.price} <span className="text-xs font-normal text-slate-500">/ night</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRoomName(room.name);
                                    setShowStayBooking(true);
                                    setShowStayChat(false);
                                  }}
                                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#17212B] text-white'
                                      : 'bg-[#0552A2] hover:bg-[#044080] text-white'
                                  }`}
                                >
                                  {isSelected ? 'Selected' : 'Select Room'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {stayProfileTab === 'reviews' && (
                      <div>
                        <form
                          onSubmit={handleSubmitStayReview}
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 mb-5 flex flex-col gap-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <input
                              type="text"
                              value={reviewAuthor}
                              onChange={(e) => setReviewAuthor(e.target.value)}
                              placeholder="Your name"
                              className="bg-transparent border-0 p-0 text-sm font-semibold text-[#17212B] focus:outline-none sm:w-52"
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#64748B] mr-1">Rating:</span>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  aria-label={`Rate ${star} stars`}
                                  onClick={() => setReviewRating(star)}
                                  className="p-0.5 cursor-pointer"
                                >
                                  <Star
                                    className={`w-4.5 h-4.5 ${
                                      star <= reviewRating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
                            <textarea
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder={`Write a review for ${selectedStay.name}...`}
                              required
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-[#17212B] focus:outline-none focus:border-[#0552A2] resize-none"
                            />
                            <button
                              type="submit"
                              className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                              Post
                            </button>
                          </div>
                        </form>

                        <div className="divide-y divide-slate-100">
                          {reviews.length === 0 ? (
                            <p className="text-sm text-[#64748B] py-3">
                              No reviews yet. Be the first to review {selectedStay.name}.
                            </p>
                          ) : (
                            reviews.map((rev) => (
                              <div key={rev.id} className="py-4 first:pt-1 last:pb-1 flex gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-[#0552A2]/10 text-[#0552A2] font-bold text-sm flex items-center justify-center shrink-0">
                                  {rev.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-[#17212B]">
                                      {rev.author}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        {rev.rating}
                                      </span>
                                      <span className="text-xs text-[#64748B]">{rev.date}</span>
                                    </div>
                                  </div>
                                  <p className="text-xs sm:text-sm text-[#475569] mt-1.5 leading-relaxed">
                                    {rev.comment}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Right: Side Chat Now / Room Booking Tab with Smooth Swipe */}
                <AnimatePresence mode="wait">
                  {showStayChat && (
                    <motion.div
                      key="stay-chat-panel"
                      initial={{ opacity: 0, x: 48 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 48 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/40 p-5 sm:p-6 flex flex-col gap-4 text-xs min-h-[420px]"
                    >
                    <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                          Front Desk Chat
                        </h3>
                        {(() => {
                          const isOnline = (selectedStay as Stay & { status?: 'Online' | 'Offline' }).status !== 'Offline';
                          return (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium">
                              <span>{selectedStay.name}</span>
                              <span
                                title={isOnline ? 'Online' : 'Offline'}
                                aria-label={isOnline ? 'Online' : 'Offline'}
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              />
                            </span>
                          );
                        })()}
                      </div>
                      <button
                        type="button"
                        aria-label="Close chat tab"
                        onClick={() => setShowStayChat(false)}
                        className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      <div className="flex justify-start">
                        <div className="w-fit max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-[#475569] leading-relaxed">
                          Namaste! Welcome to <strong className="text-[#17212B]">{selectedStay.name}</strong>. Ask us about room availability, airport pickup, or early check-in.
                        </div>
                      </div>
                      {(stayMessages[selectedStay.id] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`w-fit max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words ${
                              msg.sender === 'user'
                                ? 'bg-[#0552A2] text-white rounded-tr-sm'
                                : 'bg-white border border-slate-200/80 text-[#475569] rounded-tl-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendStayChat} className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      <input
                        type="text"
                        value={stayChatInput}
                        onChange={(e) => setStayChatInput(e.target.value)}
                        placeholder={`Message ${selectedStay.name}...`}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                      />
                      <button
                        type="submit"
                        aria-label="Send message"
                        className="bg-[#0552A2] hover:bg-[#044080] text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                    </motion.div>
                  )}

                  {showStayBooking && activeRoom && (
                    <motion.div
                      key="stay-booking-panel"
                      initial={{ opacity: 0, x: 48 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 48 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/40 p-5 sm:p-6 space-y-4 text-xs"
                    >
                    <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                          Book Your Room
                        </h3>
                        <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#0552A2]">
                          ${activeRoom.price}
                          <span className="text-xs font-normal text-slate-500"> / night</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Close booking tab"
                        onClick={() => setShowStayBooking(false)}
                        className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-[#475569]">Room / Suite</span>
                        <select
                          value={activeRoom.name}
                          onChange={(e) => setSelectedRoomName(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                        >
                          {selectedStay.roomPreviews.map((room) => (
                            <option key={room.name} value={room.name}>
                              {room.name} (${room.price}/night)
                            </option>
                          ))}
                        </select>
                      </label>

                      <p className="text-[11px] text-[#64748B] leading-relaxed bg-white border border-slate-200/80 rounded-lg p-2.5">
                        {activeRoom.info}
                      </p>

                      <div className="grid grid-cols-2 gap-2.5">
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-[#475569]">Check-in</span>
                          <input
                            type="date"
                            value={stayCheckIn}
                            onChange={(e) => setStayCheckIn(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-[#475569]">Nights</span>
                          <select
                            value={stayNights}
                            onChange={(e) => setStayNights(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          >
                            {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? 'night' : 'nights'}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-[#475569]">Guests</span>
                        <select
                          value={stayGuests}
                          onChange={(e) => setStayGuests(Number(e.target.value))}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                        >
                          {[1, 2, 3, 4, 5, 6].map((g) => (
                            <option key={g} value={g}>
                              {g} {g === 1 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">
                          Total ({stayNights} {stayNights === 1 ? 'night' : 'nights'})
                        </span>
                        <span className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#0552A2]">
                          ${activeRoom.price * stayNights}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBook(selectedStay, activeRoom.name, activeRoom.price)}
                        className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm Booking
                      </button>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })() : (
            <>
              {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
              Hotels &amp; Stays
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563]">
              Book verified hotels, eco-resorts, mountain lodges, and heritage homestays across Nepal.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by hotel name, location, or amenities..."
                  className="w-full bg-white border border-slate-200/90 rounded-full pl-10 pr-9 py-2 text-xs text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] shadow-2xs transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Counter / Info */}
              <span className="text-xs text-[#64748B] shrink-0 self-center sm:self-auto">
                Showing <strong className="text-[#0552A2]">{filteredStays.length}</strong> properties
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${
                      isActive
                        ? 'bg-[#0552A2] text-white border-[#0552A2] shadow-2xs'
                        : 'bg-white text-[#475569] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Responsive Auto-Fill Grid (3+ Columns on larger viewports, automatically adjusting) */}
          <motion.div
            layout="position"
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
          >
            {filteredStays.map((stay, index) => (
              <motion.div
                key={stay.id}
                layout="position"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.28, delay: index * 0.03 },
                  y: { duration: 0.28, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }
                }}
                onClick={() => openStayProfile(stay)}
                className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-[#0552A2]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xs cursor-pointer active:scale-[0.985] flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div className="flex-1 flex flex-col">
                  {/* Image Banner */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-slate-900">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                    {/* Top Rating & Type Badges */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#0552A2] px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{stay.rating.toFixed(1)}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#0552A2] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      {stay.type}
                    </div>

                    {/* Bottom Location */}
                    <div className="absolute bottom-2.5 left-3 text-[11px] text-white/95 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#92C4EA]" />
                      <span className="line-clamp-1">{stay.location}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-[family-name:var(--font-quicksand)] text-sm sm:text-base font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors leading-snug line-clamp-1">
                        {stay.name}
                      </h3>
                      <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#475569] leading-relaxed line-clamp-2 min-h-[2.4rem]">
                        {stay.description}
                      </p>
                    </div>

                    {/* Feature Notes */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {stay.features.slice(0, 2).map((f, idx) => (
                        <span key={idx} className="text-[11px] text-[#475569] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md line-clamp-1">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Divider */}
                <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Starting from</span>
                    <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#0552A2] text-sm">
                      ${stay.price} <span className="text-[11px] font-normal text-[#64748B]">/ night</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="font-semibold text-[#0552A2] group-hover:underline flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <span>View Suites</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredStays.length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-2">
              <Hotel className="w-8 h-8 text-slate-400" />
              <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">No properties matched your search</h4>
              <p className="text-xs text-[#64748B]">Try clearing your search or selecting a different category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
            </>
          )}
        </div>
      )}

      {/* ── TRANSPORTATION VIEW ────────────────────────────────────────── */}
      {activeId === 'transportation' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
              Transportation
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563]">
              Airport transfers, domestic mountain flights, cable cars, and private 4x4 vehicles.
            </p>
          </motion.div>

          <motion.div
            layout="position"
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    Premium Aerial
                  </span>
                  <Plane className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Helicopter Summit Charter</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Direct peak-to-peak transfer bypassing multi-day trails. Popular for Everest Base Camp and Langtang loops.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$1,200 <span className="text-[10px] font-normal text-slate-500">/ flight leg</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Available Daily</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    Overland Rugged
                  </span>
                  <Car className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Private 4x4 Mountain Jeep</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Cross rugged canyon roads to Lo Manthang, Muktinath, or Pokhara in high-ground clearance expedition jeeps.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$180 <span className="text-[10px] font-normal text-slate-500">/ day (with driver)</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Includes Fuel</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    Domestic Aviation
                  </span>
                  <Plane className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Turboprop Mountain Flights</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Scenic twin-engine flights connecting Kathmandu to Pokhara, Lukla, or Jomsom high-altitude airstrips.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$150 <span className="text-[10px] font-normal text-slate-500">/ traveler</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">15kg Baggage</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    Scenic Ropeway
                  </span>
                  <Compass className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Chandragiri & Sarangkot Cable Car</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Gliding gondolas ascending over subtropical pine forests for panoramic Himalayan views over Kathmandu & Pokhara.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$24 <span className="text-[10px] font-normal text-slate-500">/ round-trip</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Express Entry</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    Trail Porter Support
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Certified Sherpa Porter Services</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Licensed and insured high-altitude porters adhering to strict ethical 20kg weight standards and welfare protocols.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$25 <span className="text-[10px] font-normal text-slate-500">/ day</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">IPPG Compliant</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-[#0552A2] uppercase bg-[#0552A2]/10 px-2 py-0.5 rounded-md">
                    VIP Arrival
                  </span>
                  <Car className="w-4 h-4 text-[#0552A2]" />
                </div>
                <h3 className="text-sm font-bold text-[#17212B]">Kathmandu Airport Express Transfer</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Air-conditioned hybrid sedan transfer directly from Tribhuvan International Airport to your hotel with cold towels.</p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0552A2]">$35 <span className="text-[10px] font-normal text-slate-500">/ transfer</span></span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Meet & Greet</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
