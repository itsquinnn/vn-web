'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import {
  Compass,
  Mountain,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  Award,
  Zap,
  Trees,
  Landmark,
  Wind,
  Coffee,
  Check
} from 'lucide-react';

interface ActivitiesSectionProps {
  activeId: string;
  onNavigate?: (id: string) => void;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'Trekking' | 'Mountaineering' | 'Wildlife' | 'Cultural' | 'Aerial & Action' | 'Eco-Tourism';
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Technical / Extreme' | 'Moderate to Challenging';
  duration: string;
  maxAltitude: string;
  region: string;
  season: string;
  estimatedCost: number;
  image: string;
  description: string;
  highlights: string[];
  permits: string[];
  gearRequirement: string;
  guideRequirement: string;
}

const ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: 'trekking',
    title: 'Annapurna Sanctuary & High Pass Loop',
    category: 'Trekking',
    difficulty: 'Moderate to Challenging',
    duration: '10 - 14 Days',
    maxAltitude: '4,130m',
    region: 'Annapurna & Gandaki',
    season: 'Oct–Dec & Mar–May',
    estimatedCost: 850,
    image: '/pictures/annapurna-1624804396.jpg',
    description: 'Walk pristine trails through ancient rhododendron forests into the sacred glacial amphitheater surrounded by towering 7,000m and 8,000m peaks.',
    highlights: [
      'Poon Hill sunrise panoramic view of Dhaulagiri & Annapurna',
      'Glacial amphitheater at Annapurna Base Camp (ABC)',
      'Natural mineral hot springs relaxation in Jhinu Danda'
    ],
    permits: ['ACAP Conservation Permit (Endorsed)', 'TIMS Central Trekker Register Card'],
    gearRequirement: 'Layered alpine thermal kit, broken-in trekking boots, collapsible poles',
    guideRequirement: 'Certified NMA / TAAN Mountain Guide + Porter'
  },
  {
    id: 'mountaineering',
    title: 'Ama Dablam & Island Peak Ascents',
    category: 'Mountaineering',
    difficulty: 'Technical / Extreme',
    duration: '24 - 30 Days',
    maxAltitude: '6,812m',
    region: 'Khumbu (Everest)',
    season: 'April–May & Oct–Nov',
    estimatedCost: 4200,
    image: '/pictures/Everest_tk_trekker_(5)-1630474503.jpg',
    description: 'Technical alpine ridge climbing on the "Matterhorn of the Himalayas", accompanied by master Sherpa pathfinders with high-altitude oxygen telemetry.',
    highlights: [
      'Exhilarating knife-edge granite and ice ridge climbing',
      'Acclimatization camp perched above the clouds',
      'Unmatched summit panoramas over Everest, Lhotse, and Makalu'
    ],
    permits: ['NMA Technical Peak Climbing Permit', 'Sagarmatha National Park Permit'],
    gearRequirement: 'Full technical alpine kit (harness, crampons, ice axes, 8000m down suit)',
    guideRequirement: 'Mandatory IFMGA / UIAGM Certified Lead Sherpa'
  },
  {
    id: 'wildlife',
    title: 'Chitwan & Bardia Deep Jungle Safari',
    category: 'Wildlife',
    difficulty: 'Easy',
    duration: '3 - 5 Days',
    maxAltitude: '150m',
    region: 'Terai Lowlands',
    season: 'October – April',
    estimatedCost: 380,
    image: '/pictures/Chitwan_ss_jungleactivities-1630491399.JPG',
    description: 'Track endangered Royal Bengal tigers, one-horned rhinos, and wild elephant herds on foot and by silent canoe down pristine river corridors.',
    highlights: [
      'Guided on-foot tiger tracking with veteran naturalists',
      'Silent dugout wooden canoe drift for rare gharial crocodiles',
      'Tharu indigenous cultural dance and local village homestay'
    ],
    permits: ['Chitwan / Bardia National Park Wildlife Clearances'],
    gearRequirement: 'Neutral khaki safari apparel, 8x42 binoculars, sun protection',
    guideRequirement: 'Senior Wildlife Naturalist & Indigenous Tracker'
  },
  {
    id: 'cultural',
    title: 'Kathmandu Valley UNESCO Heritage Walk',
    category: 'Cultural',
    difficulty: 'Easy',
    duration: '2 - 4 Days',
    maxAltitude: '1,400m',
    region: 'Kathmandu Valley',
    season: 'Year-round',
    estimatedCost: 220,
    image: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg',
    description: 'Immerse in seven clustered medieval World Heritage sanctuaries, sacred Newari bronze artisan courtyards, and ancient Buddhist stupa rituals.',
    highlights: [
      'Centuries-old peacock windows and pottery squares of Bhaktapur',
      'Boudhanath stupa evening prayer flag circumambulation',
      'Living Goddess (Kumari Ghar) sacred courtyard audience'
    ],
    permits: ['Kathmandu Valley UNESCO Heritage Unified Ticket'],
    gearRequirement: 'Comfortable slip-on walking shoes, modest temple clothing',
    guideRequirement: 'Licensed Heritage Historian & Cultural Guide'
  },
  {
    id: 'ecotourism',
    title: 'Highland Organic Tea & Homestay Circuit',
    category: 'Eco-Tourism',
    difficulty: 'Easy',
    duration: '4 - 6 Days',
    maxAltitude: '2,200m',
    region: 'Ilam & Eastern Hills',
    season: 'March – November',
    estimatedCost: 320,
    image: '/pictures/Illam-1631441491.jpg',
    description: 'Experience authentic mountain hospitality at community-run tea cooperatives, learn artisan cardamom curing, and savor farm-to-table dining.',
    highlights: [
      'Hands-on tea plucking in misty organic rolling hills',
      'Traditional stone hearth cooking with host families',
      'Scenic ridge hikes overlooking Mt. Kanchenjunga'
    ],
    permits: ['Community Homestay Cooperative Registry'],
    gearRequirement: 'Light daypack, breathable warm fleece, personal journal',
    guideRequirement: 'Local Cooperative Village Ambassador'
  },
  {
    id: 'adventure',
    title: 'Pokhara Aerial Paragliding & Ultralight',
    category: 'Aerial & Action',
    difficulty: 'Moderate',
    duration: '1 - 2 Days',
    maxAltitude: '1,800m',
    region: 'Pokhara (Sarangkot)',
    season: 'September – May',
    estimatedCost: 140,
    image: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg',
    description: 'Launch from Sarangkot ridge into thermal updrafts above Phewa Lake, soaring with mountain eagles against the towering Annapurna backdrop.',
    highlights: [
      '30-minute high-altitude tandem thermal flight',
      'Stunning aerial reflections of Machapuchare (Fishtail)',
      'Complimentary HD action camera recording & landing certificate'
    ],
    permits: ['CAAN Aerial Tourism Aviation Clearance'],
    gearRequirement: 'Windproof light jacket, sport shoes, UV sunglasses',
    guideRequirement: 'APPI / FAI International Certified Tandem Pilot'
  },
  {
    id: 'rafting',
    title: 'Trishuli & Bhote Koshi Whitewater Rafting',
    category: 'Aerial & Action',
    difficulty: 'Moderate',
    duration: '2 - 3 Days',
    maxAltitude: '950m',
    region: 'Central Himalayan Rivers',
    season: 'Sept–Dec & Mar–May',
    estimatedCost: 190,
    image: '/pictures/Pokhara_oy_lt_(2)-1624817867.jpg',
    description: 'Charge through Class III-IV glacial whitewater gorges fed by Himalayan snowmelt, followed by secluded sandy beach wilderness camping under the stars.',
    highlights: [
      'Thrilling canyon rapids with names like Twin Rock & Surprise',
      'White sand riverbank campfire barbecues and stargazing',
      'Cliff jumping and natural canyon waterfall swims'
    ],
    permits: ['Nepal River Tourism Authority Entry Token'],
    gearRequirement: 'Quick-dry sportswear, waterproof dry bag, river sandals',
    guideRequirement: 'IRF Certified River Captain & Safety Kayak Team'
  },
  {
    id: 'everest-heli',
    title: 'Everest Luxury Champagne Heli Landing',
    category: 'Aerial & Action',
    difficulty: 'Easy',
    duration: 'Half Day (4 hrs)',
    maxAltitude: '5,545m (Kala Patthar)',
    region: 'Khumbu (Everest)',
    season: 'Year-round',
    estimatedCost: 1250,
    image: '/pictures/everest_(1)-1624869402.jpg',
    description: 'Board an Airbus H125 helicopter from Kathmandu for a scenic alpine flight, landing directly at Kala Patthar for a champagne breakfast overlooking Everest.',
    highlights: [
      'Touchdown at Kala Patthar (5,545m) with direct view of Everest Summit',
      'Champagne breakfast on the outdoor terrace of Hotel Everest View',
      'Aerial flyby over Tengboche Monastery and the Khumbu Icefall'
    ],
    permits: ['Sagarmatha High Altitude Aviation Clearance'],
    gearRequirement: 'Insulated down jacket, warm beanie, alpine sunglasses',
    guideRequirement: 'Senior Himalayan High-Altitude Flight Captain'
  }
];

const CATEGORIES = [
  'All',
  'Trekking',
  'Mountaineering',
  'Wildlife',
  'Cultural',
  'Aerial & Action',
  'Eco-Tourism'
];

export default function ActivitiesSection({ activeId, onNavigate }: ActivitiesSectionProps) {
  const router = useRouter();
  const { addBooking } = useTravelStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookedActivity, setBookedActivity] = useState<{ activity: ActivityItem; invoiceNo: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedActivity(null);
        setBookedActivity(null);
      }
    };
    if (selectedActivity || bookedActivity) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedActivity, bookedActivity]);


  // Filter activities
  const filteredActivities = useMemo(() => {
    return ACTIVITIES_LIST.filter((act) => {
      const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
      const matchesDifficulty = difficultyFilter === 'All' || act.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase());
      const matchesSearch =
        searchQuery.trim() === '' ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, difficultyFilter, searchQuery]);

  const activeActivity = useMemo(() => {
    return ACTIVITIES_LIST.find((a) => a.id === activeId) || ACTIVITIES_LIST[0];
  }, [activeId]);

  const handleBook = (activity: ActivityItem) => {
    const inv = `INV-ACT-${Math.floor(1000 + Math.random() * 9000)}`;
    addBooking({
      id: `b-act-${Date.now()}`,
      type: 'Adventure Package',
      title: activity.title,
      date: 'Flexible Seasonal Booking - 2026',
      details: `${activity.category} in ${activity.region}. Max Altitude: ${activity.maxAltitude}. Duration: ${activity.duration}.`,
      cost: activity.estimatedCost,
      status: 'Confirmed',
      invoiceNo: inv
    });

    setBookedActivity({ activity, invoiceNo: inv });
    setBookingSuccess(`Expedition confirmed! Added "${activity.title}" to your Bookings.`);
    setTimeout(() => {
      setBookingSuccess(null);
    }, 4000);
  };

  const getDifficultyBadge = (difficulty: string) => {
    if (difficulty.includes('Technical') || difficulty.includes('Extreme')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (difficulty.includes('Challenging')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (difficulty.includes('Moderate')) {
      return 'bg-blue-50 text-[#0552A2] border-blue-200';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Trekking':
        return <Mountain className="h-3.5 w-3.5" />;
      case 'Mountaineering':
        return <Zap className="h-3.5 w-3.5" />;
      case 'Wildlife':
        return <Trees className="h-3.5 w-3.5" />;
      case 'Cultural':
        return <Landmark className="h-3.5 w-3.5" />;
      case 'Eco-Tourism':
        return <Coffee className="h-3.5 w-3.5" />;
      case 'Aerial & Action':
      default:
        return <Wind className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="w-full text-left font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {bookingSuccess && !bookedActivity && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[90] bg-[#0552A2] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20"
          >
            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="text-xs font-bold">{bookingSuccess}</p>
              <p className="text-[10px] text-white/80">View status anytime in your Bookings ledger.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPEDITION BOOKING CONFIRMED MODAL ────────────────────────────── */}
      <AnimatePresence>
        {bookedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#0552A2] via-emerald-500 to-[#0552A2]" />

              {/* Animated Success Badge */}
              <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                <Check className="h-7 w-7" strokeWidth={3} />
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed
              </span>

              <h3 className="font-[family-name:var(--font-quicksand)] text-lg sm:text-xl font-bold text-[#17212B] mt-2.5 leading-snug">
                {bookedActivity.activity.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Added to your Visit Nepal bookings.
              </p>

              {/* Booking Summary Ticket */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 my-4 text-left flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                  <span className="text-slate-500 text-xs">Reference</span>
                  <span className="font-semibold text-[#0552A2]">{bookedActivity.invoiceNo}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Destination</span>
                  <span className="font-semibold text-[#17212B]">{bookedActivity.activity.region}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Duration</span>
                  <span className="font-semibold text-[#17212B]">{bookedActivity.activity.duration}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Max Elevation</span>
                  <span className="font-semibold text-[#17212B]">{bookedActivity.activity.maxAltitude}</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/70">
                  <span className="font-bold text-[#17212B]">Total Package</span>
                  <span className="text-base font-bold text-[#0552A2]">
                    ${bookedActivity.activity.estimatedCost}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">/ pax</span>
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setBookedActivity(null);
                    if (onNavigate) {
                      onNavigate('home');
                    } else {
                      router.push('/dashboard?section=home');
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setBookedActivity(null)}
                  className="py-3 px-5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN DIRECTORY VIEW (when activeId === 'activities') ───────────── */}
      {activeId === 'activities' && (
        <div className="flex flex-col gap-4 sm:gap-5 max-w-[1440px] w-full mx-auto py-1">
          {/* Header */}
          <div className="pb-4 border-b border-slate-200/70">
            <h1 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
              Activities &amp; Experiences
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1 max-w-2xl">
              From Himalayan treks and wildlife safaris to cultural walks and paragliding across Nepal.
            </p>
          </div>

          {/* Filter Toolbar: Search + Difficulty Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, regions, or peaks..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0552A2] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                aria-label="Filter activities by difficulty level"
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#17212B] focus:outline-none focus:border-[#0552A2] font-medium cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy (Family &amp; Heritage)</option>
                <option value="Moderate">Moderate (Trekking)</option>
                <option value="Challenging">Challenging (High Passes)</option>
                <option value="Technical">Technical (Climbing)</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${isActive
                    ? 'bg-[#0552A2] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  {cat !== 'All' && getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* ── CARD GRID ─────────────── */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                No activities match your filter
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm">
                Try resetting your search or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setDifficultyFilter('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0552A2]/35 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() => setSelectedActivity(act)}
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={act.image}
                      alt={act.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                    <div className="absolute top-3.5 left-3.5">
                      <span className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#0552A2] flex items-center gap-1">
                        {getCategoryIcon(act.category)}
                        <span>{act.category}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="text-[11px] font-medium text-amber-200 block truncate">
                        {act.region} · {act.maxAltitude}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>{act.duration}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadge(act.difficulty)}`}>
                          {act.difficulty}
                        </span>
                      </div>

                      <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors leading-snug line-clamp-1">
                        {act.title}
                      </h3>

                      <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    {/* Card Footer: Pricing + Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500">From </span>
                        <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                          ${act.estimatedCost}
                        </span>
                        <span className="text-[11px] text-slate-500"> / person</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-[#0552A2] group-hover:translate-x-0.5 transition-transform">
                        <span>View Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DETAIL MODAL (Quick Specs & Direct Expedition Booking) ────────── */}
      <AnimatePresence>
        {selectedActivity && (
          <div
            onClick={() => setSelectedActivity(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 overflow-y-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[76vh] sm:max-h-[80vh] shadow-2xl border border-slate-200 flex flex-col text-left overflow-hidden my-auto shrink-0"
            >
              {/* Modal Cover Image */}
              <div className="relative h-32 sm:h-38 w-full overflow-hidden bg-slate-900 shrink-0">
                <Image
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <button
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-3 right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  aria-label="Close activity details"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-3 left-4 sm:left-5 right-4 sm:right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {selectedActivity.category}
                    </span>
                    <span className="bg-[#EC1F27] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {selectedActivity.difficulty}
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-quicksand)] text-base sm:text-lg md:text-xl font-bold leading-tight">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    <span>{selectedActivity.region}</span>
                    <span>·</span>
                    <span>Max Elevation: {selectedActivity.maxAltitude}</span>
                  </p>
                </div>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-4 sm:p-5 md:p-6 flex-1 overflow-y-auto flex flex-col gap-4 sm:gap-5 scrollbar-thin">
                <div>
                  <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-1">
                    Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                {/* Logistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Duration</span>
                    <span className="text-xs font-bold text-[#17212B] mt-0.5 block">{selectedActivity.duration}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Best Season</span>
                    <span className="text-xs font-bold text-[#17212B] mt-0.5 block">{selectedActivity.season}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Max Altitude</span>
                    <span className="text-xs font-bold text-[#17212B] mt-0.5 block">{selectedActivity.maxAltitude}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Est. Cost</span>
                    <span className="text-xs font-bold text-[#0552A2] mt-0.5 block">${selectedActivity.estimatedCost} / person</span>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-2">
                    Key Highlights
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {selectedActivity.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#475569]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0552A2] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance & Requirements */}
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 text-[#475569]">
                    <span className="font-semibold text-[#17212B]">Guide Requirement:</span>
                    <span className="text-right text-[11px] sm:text-xs font-medium">{selectedActivity.guideRequirement}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 text-[#475569]">
                    <span className="font-semibold text-[#17212B]">Gear Profile:</span>
                    <span className="text-right text-[11px] sm:text-xs font-medium">{selectedActivity.gearRequirement}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-[#475569]">
                    <span className="font-semibold text-[#17212B]">Permits Included:</span>
                    <span className="text-right text-[11px] sm:text-xs text-[#0552A2] font-semibold">{selectedActivity.permits.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Fixed / Sticky Modal Action Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500">Estimated Cost</span>
                  <span className="font-[family-name:var(--font-quicksand)] text-sm sm:text-base font-bold text-[#0552A2]">
                    ${selectedActivity.estimatedCost}
                    <span className="text-[11px] font-normal text-slate-500"> / person</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleBook(selectedActivity);
                      setSelectedActivity(null);
                    }}
                    className="px-5 py-2 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Expedition</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SPECIFIC DETAILED ACTIVITY SHEET (when URL is e.g. section=trekking) ─ */}
      {activeId !== 'activities' && (
        <div className="flex flex-col gap-4 sm:gap-5 max-w-[1440px] w-full mx-auto py-1">
          {/* Back button */}
          <button
            onClick={() => (onNavigate ? onNavigate('activities') : router.push('/dashboard?section=activities'))}
            className="self-start flex items-center gap-1.5 text-xs font-bold text-[#0552A2] hover:underline cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>← Back to All Activities</span>
          </button>

          {/* Hero Banner */}
          <div className="relative h-48 sm:h-56 md:h-60 lg:h-64 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md shrink-0">
            <Image
              src={activeActivity.image}
              alt={activeActivity.title}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="bg-[#0552A2] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                  {activeActivity.category}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                  {activeActivity.difficulty}
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                {activeActivity.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#EC1F27]" />
                <span>{activeActivity.region}</span>
                <span>•</span>
                <span>Altitude: {activeActivity.maxAltitude}</span>
              </p>
            </div>
          </div>

          {/* Details 2-Column Split */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 items-start">
            <div className="xl:col-span-7 2xl:col-span-8 flex flex-col gap-4 sm:gap-5 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] mb-1.5">
                  Overview
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {activeActivity.description}
                </p>
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] mb-2">
                  Key Highlights
                </h3>
                <div className="flex flex-col gap-2">
                  {activeActivity.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#475569]">
                      <CheckCircle2 className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 sm:p-5 rounded-2xl border border-blue-200/70 flex flex-col gap-1.5">
                <span className="font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#0552A2] flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Safety &amp; Acclimatization Note</span>
                </span>
                <p className="text-xs text-[#475569] leading-relaxed">
                  High-altitude routes require a licensed local guide, steady hydration, and conservative daily elevation gains above 3,000m.
                </p>
              </div>
            </div>

            {/* Logistics Card Sidebar */}
            <div className="xl:col-span-5 2xl:col-span-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3.5 sm:gap-4">
              <h3 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] border-b border-slate-100 pb-2">
                Trip Details
              </h3>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                  <span className="text-slate-500 shrink-0">Duration:</span>
                  <span className="font-bold text-[#17212B] text-right">{activeActivity.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                  <span className="text-slate-500 shrink-0">Best Season:</span>
                  <span className="font-bold text-[#17212B] text-right">{activeActivity.season}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                  <span className="text-slate-500 shrink-0">Max Elevation:</span>
                  <span className="font-bold text-[#17212B] text-right">{activeActivity.maxAltitude}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                  <span className="text-slate-500 shrink-0">Guide Requirement:</span>
                  <span className="font-bold text-[#17212B] text-right">{activeActivity.guideRequirement}</span>
                </div>
                <div className="flex items-center justify-between py-1 gap-2">
                  <span className="text-slate-500 shrink-0">Est. Cost:</span>
                  <span className="font-bold text-[#0552A2] text-right">${activeActivity.estimatedCost} / person</span>
                </div>
              </div>

              <button
                onClick={() => handleBook(activeActivity)}
                className="w-full py-3 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-98"
              >
                <span>Book Activity</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
