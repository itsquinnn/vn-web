'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore, Booking, ChatChannel } from '@/store/useTravelStore';
import TripCustomizer from './TripCustomizer';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Mountain,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Send,
  User,
  Users,
  FileCheck,
  Hotel
} from 'lucide-react';
import {
  EXPEDITION_BLUEPRINTS,
  REGION_OPTIONS,
  TREK_STYLES,
  LODGING_STYLES,
  INTEREST_TAGS,
  ExpeditionBlueprint,
  ItineraryDay
} from './mockCustomizerData';

interface AccountSectionProps {
  activeId: string;
}

export default function AccountSection({ activeId }: AccountSectionProps) {
  const { 
    currentUser, loginUser, logoutUser, 
    bookings, addBooking,
    channels, activeChannelId, setActiveChannelId, sendMessage,
    customPreferences, setCustomPreference, generatedItinerary, setGeneratedItinerary,
    feedPosts, addFeedPost, deleteFeedPost
  } = useTravelStore();

  // Auth Form states
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Traveler' | 'Guide' | 'Butler'>('Traveler');
  
  // Customizer wizard states
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(EXPEDITION_BLUEPRINTS[0].id);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '8,000m Himalayan Peaks',
    'Ancient Monasteries & Stupas',
    'Golden Hour Alpine Sunrises'
  ]);
  const [selectedTrekStyle, setSelectedTrekStyle] = useState<string>('balanced');
  const [selectedLodgingStyle, setSelectedLodgingStyle] = useState<string>('ecolodge');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [bookSuccess, setBookSuccess] = useState<boolean>(false);

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Story post states
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName || !authEmail) return;
    loginUser(authName, selectedRole, authEmail);
  };

  const handleLoadBlueprint = (blueprint: ExpeditionBlueprint) => {
    setSelectedBlueprintId(blueprint.id);
    const regionName = blueprint.region.split(' ')[0];
    setCustomPreference('preferredRegion', regionName);
    setCustomPreference('duration', blueprint.duration);
    setCustomPreference('difficulty', blueprint.difficulty.toLowerCase());
    setCustomPreference('budget', blueprint.budgetTier);
    setGeneratedItinerary({
      id: blueprint.id,
      title: blueprint.title,
      region: blueprint.region,
      difficulty: blueprint.difficulty,
      duration: blueprint.duration,
      maxAlt: blueprint.maxAlt,
      distance: blueprint.distance,
      costEstimate: blueprint.costEstimate,
      highlights: blueprint.highlights,
      permits: blueprint.permits,
      guideRequirement: blueprint.guideRequirement,
      imageUrl: blueprint.imageUrl,
      days: blueprint.days
    });
  };

  useEffect(() => {
    if (!generatedItinerary) {
      handleLoadBlueprint(EXPEDITION_BLUEPRINTS[0]);
    }
  }, []);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      const matched = EXPEDITION_BLUEPRINTS.find(b => 
        b.region.toLowerCase().includes(customPreferences.preferredRegion.toLowerCase())
      ) || EXPEDITION_BLUEPRINTS[0];

      let costMult = 1;
      if (selectedLodgingStyle === 'luxury' || customPreferences.budget === 'luxury') costMult = 2.1;
      else if (selectedLodgingStyle === 'teahouse' || customPreferences.budget === 'budget') costMult = 0.78;

      const duration = customPreferences.duration || matched.duration;
      const customDays: ItineraryDay[] = matched.days.slice(0, duration).map((d, idx) => ({
        ...d,
        day: idx + 1
      }));

      while (customDays.length < duration) {
        const nextDayNum = customDays.length + 1;
        customDays.push({
          day: nextDayNum,
          title: `Alpine Exploration & Cultural Immersion (Day ${nextDayNum})`,
          activity: `Guided valley trek exploring ancient sacred chortens, traditional settlement architecture, and high-altitude flora along the river banks.`,
          alt: matched.maxAlt,
          distance: '7.5 km',
          duration: '4.5 hrs',
          stay: selectedLodgingStyle === 'luxury' ? 'Himalayan Boutique Eco Resort' : (selectedLodgingStyle === 'ecolodge' ? 'Comfort Mountain Lodge' : 'Traditional Sherpa Tea House'),
          meals: 'B, L, D'
        });
      }

      setGeneratedItinerary({
        id: `custom-${Date.now()}`,
        title: `${duration}-Day Custom ${matched.region} Expedition`,
        region: matched.region,
        difficulty: customPreferences.difficulty.charAt(0).toUpperCase() + customPreferences.difficulty.slice(1),
        duration: duration,
        maxAlt: matched.maxAlt,
        distance: `${Math.round(duration * 9.2)} km`,
        costEstimate: Math.round(matched.costEstimate * costMult * (duration / matched.duration)),
        highlights: [
          ...matched.highlights.slice(0, 3),
          ...selectedInterests.slice(0, 2)
        ],
        permits: matched.permits,
        guideRequirement: matched.guideRequirement,
        imageUrl: matched.imageUrl,
        days: customDays
      });
    }, 1200);
  };

  const handleBookExpedition = () => {
    if (!generatedItinerary) return;
    addBooking({
      id: `BK-${Date.now()}`,
      type: 'Custom Trip',
      title: generatedItinerary.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      details: `${generatedItinerary.duration} Days • ${generatedItinerary.region} • ${generatedItinerary.difficulty}`,
      cost: generatedItinerary.costEstimate,
      status: 'Confirmed',
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setBookSuccess(true);
    setTimeout(() => setBookSuccess(false), 3500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(activeChannelId, chatInput, 'user');
    setChatInput('');
  };

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  return (
    <motion.div 
      key={activeId}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-left"
    >
      {/* ── LOGIN SECTION ────────────────────────────────────────────── */}
      {activeId === 'login' && (
        <div className={currentUser ? "max-w-[1440px] w-full mx-auto py-6" : "max-w-sm mx-auto py-8"}>
          {currentUser ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Profile Card column (left, 1-span) */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-200/90 p-6 rounded-2xl text-center flex flex-col gap-4 shadow-xs relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full mx-auto border-2 border-[#0552A2] object-cover shadow-sm" />
                <div>
                  <h3 className="font-bold text-sm text-[#17212B]">{currentUser.name}</h3>
                  <p className="text-[10px] text-[#64748B] font-mono mt-0.5">{currentUser.email}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[9px] font-mono font-bold text-[#0552A2]">
                    {currentUser.role} Account Active
                  </span>
                </div>
                <button 
                  onClick={logoutUser}
                  className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-[#17212B] py-2.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Disconnect Gateway
                </button>
              </motion.div>

              {/* Feed Management column (right, 2-span) */}
              <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-6">
                
                {/* Create Story Form */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col gap-3 shadow-xs text-left">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0552A2] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Share your Himalayan Story
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <textarea
                      placeholder="What is on your mind? Share your trekking updates, peak climbs, or cultural findings..."
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 text-[#17212B] focus:outline-none focus:border-[#0552A2]/50 focus:bg-white resize-none font-sans leading-relaxed"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 text-[9px] font-mono text-[#64748B]">
                        <label className="uppercase">Location Coordinates</label>
                        <input
                          type="text"
                          placeholder="e.g. Annapurna Base Camp (4,130m)"
                          value={newPostLocation}
                          onChange={e => setNewPostLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-[11px] rounded-lg px-2.5 py-1.5 text-[#17212B] focus:outline-none focus:border-[#0552A2] focus:bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1 text-[9px] font-mono text-[#64748B]">
                        <label className="uppercase">Image Link (Optional)</label>
                        <input
                          type="text"
                          placeholder="Paste photo URL"
                          value={newPostImage}
                          onChange={e => setNewPostImage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-[11px] rounded-lg px-2.5 py-1.5 text-[#17212B] focus:outline-none focus:border-[#0552A2] focus:bg-white"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (!newPostContent.trim()) return;
                        addFeedPost(newPostContent, newPostImage || undefined, newPostLocation || undefined);
                        setNewPostContent('');
                        setNewPostLocation('');
                        setNewPostImage('');
                      }}
                      className="bg-[#0552A2] hover:bg-[#044080] text-white font-mono text-[10px] font-bold py-2.5 rounded-xl uppercase tracking-widest transition-colors cursor-pointer w-full"
                    >
                      Publish Story
                    </button>
                  </div>
                </div>

                {/* List of User's Posts */}
                <div className="flex flex-col gap-3 text-left">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] px-1">
                    Your Published Stories ({feedPosts.filter(p => p.userName === currentUser.name).length})
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {(() => {
                      const userPosts = feedPosts.filter(p => p.userName === currentUser.name);
                      if (userPosts.length === 0) {
                        return (
                          <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-2xl text-center text-xs font-mono text-[#64748B]">
                            You haven't shared any Himalayan stories yet. Publish your first post above!
                          </div>
                        );
                      }
                      return userPosts.map(post => (
                        <div key={post.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-3 shadow-2xs hover:border-[#0552A2]/30 transition-all relative overflow-hidden">
                          
                          {/* Post Header */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-center gap-2">
                              <img src={post.userAvatar} alt={post.userName} className="w-8 h-8 rounded-full object-cover border border-[#92C4EA]/25" />
                              <div>
                                <h4 className="text-xs font-bold text-[#17212B]">{post.userName}</h4>
                                <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-[#64748B] mt-0.5">
                                  <span>{post.timestamp}</span>
                                  <span>•</span>
                                  <span className="text-[#0552A2] font-semibold">{post.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteFeedPost(post.id)}
                              className="text-[9px] font-mono font-bold text-red-500 hover:text-red-600 transition-colors uppercase border border-red-500/10 hover:border-red-500/20 px-2 py-0.5 rounded bg-red-500/5 cursor-pointer"
                              title="Delete Story"
                            >
                              Delete
                            </button>
                          </div>
                          
                          {/* Post Content */}
                          <p className="text-xs text-[#475569] leading-relaxed pr-2">{post.content}</p>
                          
                          {/* Post Image preview if any */}
                          {post.image && (
                            <img src={post.image} alt="Story upload" className="w-full h-32 object-cover rounded-xl border border-[#92C4EA]/20" />
                          )}
                          
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </motion.div>

            </div>
          ) : (
            <motion.div variants={itemVariants} className="bg-white border border-slate-200/90 p-6 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] text-center border-b border-slate-100 pb-2">
                Ecosystem Verification
              </h3>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3 font-mono text-[10px]">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-[#64748B]">Passenger Name</label>
                  <input 
                    type="text" 
                    value={authName} 
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-[#64748B]">Verification Email</label>
                  <input 
                    type="email" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="alex@travelers.org"
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-[#64748B]">Identity Role</label>
                  <select 
                    value={selectedRole} 
                    onChange={e => setSelectedRole(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-[#17212B] focus:outline-none"
                  >
                    <option value="Traveler">Traveler Profile</option>
                    <option value="Guide">Guide Profile</option>
                    <option value="Butler">Travel Butler Profile</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-[#0552A2] hover:bg-[#044080] text-white font-bold py-2.5 rounded-xl uppercase tracking-widest mt-2 transition-colors cursor-pointer shadow-xs"
                >
                  Verify Access
                </button>
              </form>
            </motion.div>
          )}
        </div>
      )}

      {/* ── BOOKINGS SECTION ─────────────────────────────────────────── */}
      {activeId === 'bookings' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0552A2] uppercase bg-[#0552A2]/10 px-2.5 py-0.5 rounded-full w-fit">
              Confirmed Vouchers
            </span>
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Ecosystem Bookings</h2>
            <p className="text-xs text-[#475569]">Holographic check-in codes, guide listings, and invoice schedules generated under your credentials.</p>
          </motion.div>

          <div 
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
          >
            {bookings.map(b => (
              <div 
                key={b.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#0552A2]/40 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{b.invoiceNo}</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">{b.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#17212B] mt-1">{b.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{b.details}</p>
                </div>

                <div className="flex justify-between items-center mt-5 border-t border-slate-100 pt-3 font-mono">
                  <div>
                    <span className="text-[#64748B] block text-[9px] uppercase">Amount Paid</span>
                    <span className="text-xs font-bold text-[#0552A2]">${b.cost} USD</span>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-[#17212B] text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Print Voucher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PAST TRIPS SECTION ────────────────────────────────────────── */}
      {activeId === 'pasttrips' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0552A2] uppercase bg-[#0552A2]/10 px-2.5 py-0.5 rounded-full w-fit">
              Historical Ledger
            </span>
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Past Journeys</h2>
            <p className="text-xs text-[#475569]">Archived trips, high peak climbs successfully navigated, and past guide reviews.</p>
          </motion.div>

          <div 
            className="grid gap-5 auto-card-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
          >
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[9px] font-mono text-[#0552A2] font-bold bg-[#0552A2]/10 px-2 py-0.5 rounded uppercase">
                  OCTOBER 2025 • COMPLETED
                </span>
                <h3 className="text-sm font-bold text-[#17212B] mt-2">Annapurna Circuit Hike</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Completed 16-day loop crossing Thorong La Pass (5,416m). Guide support: Nima Sherpa.</p>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Elevation: 5,416m</span>
                <span className="text-emerald-600 font-bold">16 Days Done</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[9px] font-mono text-[#0552A2] font-bold bg-[#0552A2]/10 px-2 py-0.5 rounded uppercase">
                  MARCH 2024 • COMPLETED
                </span>
                <h3 className="text-sm font-bold text-[#17212B] mt-2">Kathmandu Cultural Pilgrimage</h3>
                <p className="text-xs text-[#475569] leading-relaxed mt-1">Visited Pashupatinath, Boudha, Swayambhu, and Bhaktapur squares. Lodging: Shangri-La valley.</p>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Elevation: 1,400m</span>
                <span className="text-emerald-600 font-bold">5 Days Done</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MESSAGES SECTION ──────────────────────────────────────────── */}
      {activeId === 'messages' && (
        <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2">
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0552A2] uppercase bg-[#0552A2]/10 px-2.5 py-0.5 rounded-full w-fit">
              Communication Terminal
            </span>
            <h2 className="text-2xl font-black tracking-tight text-[#17212B]">Ecosystem Channels</h2>
            <p className="text-xs text-[#475569]">Chat in real-time with certified guides, host owners, or your cognitive AI butler.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[560px] lg:h-[500px] items-stretch">
            {/* Channels List */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden overflow-y-auto shadow-xs shrink-0">
              {channels.map(ch => (
                <div 
                  key={ch.id} 
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors shrink-0 lg:shrink ${
                    activeChannelId === ch.id 
                      ? 'bg-[#0552A2]/10 border border-[#0552A2]/30 text-[#0552A2]' 
                      : 'hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  <img src={ch.avatar} alt={ch.name} className="w-10 h-10 object-cover rounded-full border border-slate-200 shrink-0" />
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-[#17212B] truncate">{ch.name.split(' (')[0]}</h4>
                    <p className="text-[9px] text-[#64748B] font-mono">{ch.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Box */}
            <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs flex-1 min-h-[360px]">
              {/* Header */}
              <div className="bg-white p-3 px-4 border-b border-slate-100 flex items-center gap-3">
                <img src={activeChannel?.avatar} alt={activeChannel?.name} className="w-8 h-8 object-cover rounded-full border border-slate-200" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-[#17212B]">{activeChannel?.name}</h4>
                  <p className="text-[8px] font-mono text-emerald-600 font-bold uppercase">{activeChannel?.status}</p>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto font-mono text-[10px] bg-slate-50/40">
                {activeChannel?.messages.map((m, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col gap-0.5 max-w-[85%] sm:max-w-[80%] ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className="text-[8px] text-[#64748B]">{m.senderName} • {m.timestamp}</span>
                    <div 
                      className={`p-2.5 rounded-2xl text-[11px] leading-relaxed font-sans shadow-2xs ${
                        m.sender === 'user' 
                          ? 'bg-[#0552A2] text-white rounded-tr-none' 
                          : 'bg-white text-[#17212B] rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.translatedText && (
                      <span className="text-[9px] text-[#0552A2] italic font-sans max-w-xs mt-0.5">
                        Trans: {m.translatedText}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask weather, pathfinders, or send namaste..."
                  className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B] font-mono"
                />
                <button 
                  type="submit"
                  className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-bold font-mono px-4 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMIZE SECTION ─────────────────────────────────────────── */}
      {activeId === 'customize' && <TripCustomizer />}
    </motion.div>
  );
}

