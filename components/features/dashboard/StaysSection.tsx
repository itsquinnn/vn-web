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
  MessageSquare,
  Send,
  Thermometer,
  Clock,
  Mountain,
  Camera,
  ExternalLink,
  ImagePlus,
} from 'lucide-react';

function getNepalStayInfo(stay: Stay) {
  const elevMatch = stay.location.match(/([\d,]+)\s*m/i);
  const elevationMeters = elevMatch ? Number(elevMatch[1].replace(/,/g, '')) : null;
  const isHighAltitude = elevationMeters !== null && elevationMeters >= 2800;

  let heating = 'In-room heater, hot shower & backup inverter power';
  let access = 'Private road transfer from Kathmandu or Pokhara';

  if (stay.type === 'Luxury') {
    heating = 'Central climate control, heated bedding & 24/7 generator backup';
  } else if (stay.type === 'Mountain Lodge') {
    heating = 'Heated electric blankets, dining hearth & solar/generator power';
  } else if (stay.type === 'Eco Resort') {
    heating = 'Solar hot water, wood/electric heating & off-grid battery bank';
  }

  if (stay.location.includes('Khumbu') || stay.location.includes('Syangboche')) {
    access = '35 min flight to Lukla + guided trail ascent or helicopter pad';
  } else if (stay.location.includes('Mustang')) {
    access = '25 min scenic flight from Pokhara to Jomsom + 4x4 transfer';
  } else if (stay.location.includes('Langtang')) {
    access = '6 hr drive to Syabrubesi + multi-day scenic valley trek';
  } else if (stay.location.includes('Rara')) {
    access = 'Domestic flight to Talcha Airport + 2 hr lakeside trail walk';
  } else if (stay.location.includes('Chitwan')) {
    access = '25 min flight to Bharatpur + 40 min lodge 4x4 transfer';
  } else if (stay.location.includes('Kathmandu')) {
    access = '20 min private drive from Tribhuvan International Airport (TIA)';
  } else if (stay.location.includes('Pokhara')) {
    access = '25 min flight from Kathmandu + 20 min valley transfer';
  }

  return {
    elevationMeters,
    isHighAltitude,
    heating,
    access,
    policy: 'Check-in 14:00 · Check-out 11:00 · Free date shift if domestic mountain flights are delayed by weather.',
  };
}

function getStayGallery(stay: Stay) {
  const baseItems = [
    { src: stay.image, label: `${stay.name} — Exterior`, tag: 'Property' },
    ...stay.roomPreviews.map((r) => ({ src: r.image, label: r.name, tag: 'Suite' })),
  ];

  let surroundings: { src: string; label: string; tag: string }[] = [
    { src: '/pictures/annapurna-1624804396.jpg', label: 'Himalayan Horizon View', tag: 'View' },
    { src: '/pictures/pokhara-1624821141.jpg', label: 'Valley Morning Light', tag: 'Surroundings' },
    { src: '/pictures/mountainviewing_pg_nature-1624432650.jpeg', label: 'Ridge Panorama', tag: 'View' },
  ];

  if (stay.location.includes('Kathmandu')) {
    surroundings = [
      { src: '/pictures/boudha-1624805151.jpg', label: 'Boudhanath Stupa (10 min)', tag: 'Nearby' },
      { src: '/pictures/pashupatinath_bagmati_aarati_pilgrimage_in_kathmandu_nepal-1624432580.jpeg', label: 'Pashupatinath Evening Aarati', tag: 'Nearby' },
      { src: '/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg', label: 'Newari Heritage Architecture', tag: 'Culture' },
    ];
  } else if (stay.location.includes('Syangboche') || stay.location.includes('Khumbu')) {
    surroundings = [
      { src: '/pictures/everest_(1)-1624869402.jpg', label: 'Mt. Everest & Lhotse Panorama', tag: 'View' },
      { src: '/pictures/The_Glaciers_in_the_Khumbu_Region_of_Nepal_Himalaya_2-1765456544.jpeg', label: 'Khumbu Glacier Valley', tag: 'View' },
      { src: '/pictures/ebc_tk_adventure_2-1624450606.jpeg', label: 'Trail Toward Namche & EBC', tag: 'Trail' },
    ];
  } else if (stay.location.includes('Pokhara')) {
    surroundings = [
      { src: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg', label: 'Phewa Lake & Machhapuchhre', tag: 'View' },
      { src: '/pictures/pokhara-1624821141.jpg', label: 'Pokhara Valley Reflections', tag: 'Surroundings' },
      { src: '/pictures/poonhill_pg_adventure-1624431033.jpeg', label: 'Annapurna Sunrise Ridge', tag: 'View' },
    ];
  } else if (stay.location.includes('Chitwan')) {
    surroundings = [
      { src: '/pictures/Chitwan_ss_jungleactivities-1630491399.JPG', label: 'Rapti River Canoeing', tag: 'Safari' },
      { src: '/pictures/chitwan-1624804397.jpg', label: 'Chitwan Wildlife Habitat', tag: 'Nature' },
      { src: '/pictures/junglesafari_ss_nature-1624432644.jpeg', label: 'Sal Forest & Grasslands', tag: 'Surroundings' },
    ];
  } else if (stay.location.includes('Mustang')) {
    surroundings = [
      { src: '/pictures/Muktinath_tk_pilgrimage-1624859283.jpg', label: 'Lower Mustang Canyon', tag: 'View' },
      { src: '/pictures/mustang_tk_people-1624440754.jpeg', label: 'Mustang Heritage Trail', tag: 'Culture' },
      { src: '/pictures/Dhaulagiri_1626729219-1635169360.jpeg', label: 'Nilgiri & Dhaulagiri Peaks', tag: 'View' },
    ];
  }

  return [...baseItems, ...surroundings].slice(0, 6);
}

interface NearbyArea {
  name: string;
  distance: string;
  note: string;
  image: string;
}

function getStayNearbyPlaces(stay: Stay): NearbyArea[] {
  if (stay.location.includes('Kathmandu')) {
    return [
      {
        name: 'Pashupatinath Temple',
        distance: '1.2 km · 5 min',
        note: 'Sacred Bagmati riverfront ghats & evening aarati',
        image: '/pictures/pashupatinath_bagmati_aarati_pilgrimage_in_kathmandu_nepal-1624432580.jpeg',
      },
      {
        name: 'Boudhanath Stupa',
        distance: '2.8 km · 10 min',
        note: 'UNESCO stupa, rooftop cafes & prayer wheels',
        image: '/pictures/boudha-1624805151.jpg',
      },
      {
        name: 'Kathmandu Durbar Square',
        distance: '5.4 km · 20 min',
        note: 'Royal Newari courtyards & Kumari Ghar',
        image: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg',
      },
      {
        name: 'Patan & Bhaktapur Heritage',
        distance: '20–35 min drive',
        note: 'Ancient woodcarving & pottery squares',
        image: '/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg',
      },
    ];
  }
  if (stay.location.includes('Syangboche') || stay.location.includes('Khumbu')) {
    return [
      {
        name: 'Namche Bazaar',
        distance: '1.5 hr scenic hike',
        note: 'Sherpa capital, gear shops & Saturday market',
        image: '/pictures/Everest_tk_trekker_(5)-1630474503.jpg',
      },
      {
        name: 'Everest View Ridge',
        distance: '15 min walk',
        note: 'Unobstructed 360° Everest, Lhotse & Ama Dablam',
        image: '/pictures/everest_(1)-1624869402.jpg',
      },
      {
        name: 'Khumbu Glacier Trail',
        distance: 'Day hike access',
        note: 'High-altitude alpine moraine & yak pastures',
        image: '/pictures/The_Glaciers_in_the_Khumbu_Region_of_Nepal_Himalaya_2-1765456544.jpeg',
      },
      {
        name: 'Khumjung Monastery',
        distance: '45 min walk',
        note: 'Historic Sherpa monastery & alpine valley',
        image: '/pictures/ebc_tk_adventure_2-1624450606.jpeg',
      },
    ];
  }
  if (stay.location.includes('Pokhara')) {
    return [
      {
        name: 'Phewa Lake Lakeside',
        distance: '20 min drive',
        note: 'Wooden boat rides, cafes & evening promenade',
        image: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg',
      },
      {
        name: 'World Peace Pagoda',
        distance: '25 min',
        note: 'Hilltop stupa overlooking lake & Annapurnas',
        image: '/pictures/pokhara-1624821141.jpg',
      },
      {
        name: 'Sarangkot Sunrise Point',
        distance: '35 min drive',
        note: 'Golden dawn over Machhapuchhre & Dhaulagiri',
        image: '/pictures/poonhill_pg_adventure-1624431033.jpeg',
      },
      {
        name: 'Annapurna Foothills',
        distance: 'Trailhead nearby',
        note: 'Day hikes through terraced villages & forests',
        image: '/pictures/annapurna-1624804396.jpg',
      },
    ];
  }
  if (stay.location.includes('Chitwan')) {
    return [
      {
        name: 'Rapti River Sunset Bank',
        distance: '2 min walk',
        note: 'Dugout canoeing & rhino sightings at dusk',
        image: '/pictures/Chitwan_ss_jungleactivities-1630491399.JPG',
      },
      {
        name: 'Chitwan Core Jungle',
        distance: 'Direct access',
        note: 'Jeep safari for one-horned rhino & Bengal tiger',
        image: '/pictures/chitwan-1624804397.jpg',
      },
      {
        name: 'Sal Forest Birding Trail',
        distance: '10 min walk',
        note: 'Guided naturalist walk through riverine grasslands',
        image: '/pictures/junglesafari_ss_nature-1624432644.jpeg',
      },
      {
        name: 'Tharu Cultural Village',
        distance: '10 min',
        note: 'Traditional mud-house craft & stick dance',
        image: '/pictures/Chitwan_ss_lt_(17)-1624813756.jpg',
      },
    ];
  }
  if (stay.location.includes('Mustang')) {
    return [
      {
        name: 'Muktinath Temple',
        distance: '1 hr drive',
        note: 'Sacred 108-spout pilgrimage at 3,710m',
        image: '/pictures/Muktinath_tk_pilgrimage-1624859283.jpg',
      },
      {
        name: 'Marpha Apple Village',
        distance: '20 min drive',
        note: 'Whitewashed stone alleys & local apple orchards',
        image: '/pictures/mustang_tk_people-1624440754.jpeg',
      },
      {
        name: 'Nilgiri & Dhaulagiri Face',
        distance: 'Panoramic view',
        note: 'Dramatic trans-Himalayan desert canyon peaks',
        image: '/pictures/Dhaulagiri_1626729219-1635169360.jpeg',
      },
      {
        name: 'Upper Mustang Gate',
        distance: 'Trail access',
        note: 'Ancient red cliffs, caves & Tibetan monasteries',
        image: '/pictures/shey-1626727697.jpeg',
      },
    ];
  }
  return [
    {
      name: 'Mountain Ridge Viewpoint',
      distance: '15–30 min walk',
      note: 'Sunrise & sunset Himalayan horizon views',
      image: '/pictures/mountainviewing_pg_nature-1624432650.jpeg',
    },
    {
      name: 'Heritage Village Bazaar',
      distance: '10 min walk',
      note: 'Local stone-paved streets, tea shops & crafts',
      image: '/pictures/Ghale_Gaon_Photo_001-1634812841.jpg',
    },
    {
      name: 'Rhododendron & Pine Trails',
      distance: 'Direct trailhead',
      note: 'Guided half-day nature & ridge hikes',
      image: '/pictures/gurans_trekking_ar-1624440965.jpeg',
    },
    {
      name: 'Alpine Valley Panorama',
      distance: 'Scenic day trip',
      note: 'Quiet mountain pass & glacial river valley',
      image: '/pictures/Manaslu_View_from_Lho-1624808940.jpg',
    },
  ];
}

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
  title?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
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
  const [stayProfileTab, setStayProfileTab] = useState<'about' | 'rooms' | 'photos' | 'location' | 'reviews'>('about');
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; label: string; tag: string } | null>(null);
  const [showStayBooking, setShowStayBooking] = useState(false);
  const [showStayChat, setShowStayChat] = useState(false);
  const [stayChatInput, setStayChatInput] = useState('');
  const [stayMessages, setStayMessages] = useState<Record<string, { id: string; sender: 'user' | 'hotel'; text: string }[]>>({});
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [stayCheckIn, setStayCheckIn] = useState('2026-06-05');
  const [stayNights, setStayNights] = useState(3);
  const [stayGuests, setStayGuests] = useState(2);
  const [includeTransfer, setIncludeTransfer] = useState(false);
  const [arrivalNote, setArrivalNote] = useState('');
  const [stayBookedBanner, setStayBookedBanner] = useState<string | null>(null);

  const [stayReviews, setStayReviews] = useState<Record<string, StayReview[]>>(INITIAL_STAY_REVIEWS);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [transportSearch, setTransportSearch] = useState('');
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
    const transferFee = includeTransfer ? 25 : 0;
    const total = price * stayNights + transferFee;
    const start = new Date(`${stayCheckIn}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + stayNights);
    const fmt = (d: Date) =>
      Number.isNaN(d.getTime())
        ? `${stayNights} nights`
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateRange = Number.isNaN(start.getTime()) ? `${stayNights} nights` : `${fmt(start)} - ${fmt(end)}`;

    const extraParts = [
      `${stayNights} ${stayNights === 1 ? 'night' : 'nights'}`,
      `${stayGuests} ${stayGuests === 1 ? 'guest' : 'guests'}`,
      ...(includeTransfer ? ['Pickup Transfer (+$25)'] : []),
      ...(arrivalNote.trim() ? [`Arrival: ${arrivalNote.trim()}`] : []),
    ];

    const { id, invoiceNo } = createStayBookingRefs();
    addBooking({
      id,
      type: 'Hotel',
      title: `${stay.name} — ${roomName}`,
      date: dateRange,
      details: extraParts.join(' · '),
      cost: total,
      status: 'Confirmed',
      invoiceNo,
    });

    setStayBookedBanner(`Reserved ${roomName} for ${stayNights} ${stayNights === 1 ? 'night' : 'nights'} ($${total}). Added to your Bookings.`);
    setTimeout(() => setStayBookedBanner(null), 4000);
  };

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, 4 - reviewPhotos.length));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setReviewPhotos((prev) => (prev.length < 4 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmitStayReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStay || !reviewComment.trim()) return;
    const newRev: StayReview = {
      id: `rev-s-${Date.now()}`,
      author: 'Alex Mercer',
      title: reviewTitle.trim() || undefined,
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      photos: reviewPhotos.length > 0 ? reviewPhotos : undefined,
    };
    setStayReviews((prev) => ({
      ...prev,
      [selectedStay.id]: [newRev, ...(prev[selectedStay.id] || [])],
    }));
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    setReviewPhotos([]);
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
                  <div className="flex border-t border-b border-slate-100 px-5 sm:px-6 gap-5 sm:gap-6 overflow-x-auto scrollbar-none">
                    {[
                      { id: 'about' as const, label: 'About' },
                      { id: 'rooms' as const, label: `Rooms & Suites (${selectedStay.roomPreviews.length})` },
                      { id: 'photos' as const, label: 'Photos & Views' },
                      { id: 'location' as const, label: 'Location & Nearby' },
                      { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
                    ].map((tab) => {
                      const active = stayProfileTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setStayProfileTab(tab.id);
                            setPreviewPhoto(null);
                          }}
                          className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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
                    {stayProfileTab === 'about' && (() => {
                      const stayInfo = getNepalStayInfo(selectedStay);
                      return (
                        <div className="space-y-5">
                          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#475569] leading-relaxed">
                            {selectedStay.description}
                          </p>

                          {stayInfo.isHighAltitude && (
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs text-amber-950">
                              <Mountain className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold block">
                                  High-Altitude Stay ({stayInfo.elevationMeters?.toLocaleString()}m)
                                </span>
                                <span className="text-[11px] text-amber-900/90">
                                  Plan 1–2 acclimatization nights at lower elevation before arrival and hydrate well.
                                </span>
                              </div>
                            </div>
                          )}

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

                          <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                            <div className="py-3 flex items-start gap-3">
                              <Plane className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-[#17212B]">Access &amp; Transit</p>
                                <p className="text-xs text-[#64748B] mt-0.5">{stayInfo.access}</p>
                              </div>
                            </div>
                            <div className="py-3 flex items-start gap-3">
                              <Thermometer className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-[#17212B]">Heating, Hot Water &amp; Power</p>
                                <p className="text-xs text-[#64748B] mt-0.5">{stayInfo.heating}</p>
                              </div>
                            </div>
                            <div className="py-3 flex items-start gap-3">
                              <Clock className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-[#17212B]">Check-in &amp; Weather Policy</p>
                                <p className="text-xs text-[#64748B] mt-0.5">{stayInfo.policy}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {stayProfileTab === 'rooms' && (
                      <div className="divide-y divide-slate-100">
                        {selectedStay.roomPreviews.map((room) => {
                          const isSelected = activeRoom?.name === room.name && showStayBooking;
                          return (
                            <div
                              key={room.name}
                              className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                            >
                              <div className="flex items-start gap-3.5">
                                <img
                                  src={room.image}
                                  alt={room.name}
                                  className="w-24 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                                />
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

                    {stayProfileTab === 'photos' && (() => {
                      const gallery = getStayGallery(selectedStay);
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-[#0552A2]" />
                              <span>Property exterior, suites, and surrounding views at {selectedStay.name}</span>
                            </p>
                          </div>

                          {previewPhoto && (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                              <img
                                src={previewPhoto.src}
                                alt={previewPhoto.label}
                                className="w-full max-h-80 object-cover"
                              />
                              <button
                                type="button"
                                aria-label="Close photo preview"
                                onClick={() => setPreviewPhoto(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#17212B] flex items-center justify-center shadow-sm cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="font-semibold text-[#17212B]">{previewPhoto.label}</span>
                                <span className="text-[11px] font-medium text-[#0552A2]">{previewPhoto.tag}</span>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {gallery.map((photo) => (
                              <button
                                key={photo.label}
                                type="button"
                                onClick={() => setPreviewPhoto(photo)}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 text-left cursor-pointer"
                              >
                                <img
                                  src={photo.src}
                                  alt={photo.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                                <span className="absolute top-2 left-2 bg-white/90 text-[#17212B] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {photo.tag}
                                </span>
                                <span className="absolute bottom-2 left-2.5 right-2.5 text-[11px] font-medium text-white line-clamp-1">
                                  {photo.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {stayProfileTab === 'location' && (() => {
                      const stayInfo = getNepalStayInfo(selectedStay);
                      const nearby = getStayNearbyPlaces(selectedStay);
                      const [lat, lng] = selectedStay.coords;
                      return (
                        <div className="space-y-6 text-xs">
                          <div>
                            <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-1">
                              Getting Here
                            </h4>
                            <p className="text-[#475569] leading-relaxed">{stayInfo.access}</p>
                          </div>

                          <div className="border-t border-slate-100 pt-4">
                            <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-3">
                              Around {selectedStay.location}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                              {nearby.map((place) => (
                                <div key={place.name} className="group">
                                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                                    <img
                                      src={place.image}
                                      alt={place.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <p className="font-semibold text-[#17212B] text-xs leading-snug line-clamp-1">
                                    {place.name}
                                  </p>
                                  <p className="text-[11px] text-[#0552A2] font-medium mt-0.5">
                                    {place.distance}
                                  </p>
                                  <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5 leading-relaxed">
                                    {place.note}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div>
                                <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                                  Hotel Location
                                </h4>
                                <p className="text-[11px] text-[#64748B]">
                                  {selectedStay.name} · {selectedStay.location}
                                </p>
                              </div>
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0552A2] hover:underline shrink-0"
                              >
                                <span>Open Map</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                              <iframe
                                title={`${selectedStay.name} location map`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.025}%2C${lat - 0.015}%2C${lng + 0.025}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`}
                                className="w-full h-full"
                                key={`${selectedStay.id}-${lat}-${lng}`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {stayProfileTab === 'reviews' && (() => {
                      const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
                        star,
                        count: reviews.filter((r) => r.rating === star).length,
                      }));

                      return (
                        <div className="space-y-6">
                          {/* Rating Breakdown + Borderless Review Composer Together */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-6 border-b border-slate-100 items-start">
                            {/* Left: Rating Summary (Non-clickable display) */}
                            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
                              <div className="flex items-center gap-3">
                                <span className="font-[family-name:var(--font-quicksand)] text-4xl font-bold text-[#17212B] leading-none">
                                  {stats.avgRating}
                                </span>
                                <div>
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${
                                          s <= Math.round(stats.avgRating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B] block mt-0.5">
                                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 space-y-1.5">
                                {ratingCounts.map(({ star, count }) => {
                                  const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                                  return (
                                    <div key={star} className="flex items-center gap-2.5 text-xs">
                                      <span className="w-7 text-left font-semibold text-[#17212B] flex items-center gap-0.5 shrink-0">
                                        {star}
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      </span>
                                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                          className="h-full rounded-full bg-amber-400 transition-all duration-300"
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                      <span className="w-5 text-right text-[11px] text-[#64748B] tabular-nums">
                                        {count}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Right: Clean Review Composer (No outer box, with Title + Photo upload) */}
                            <form
                              onSubmit={handleSubmitStayReview}
                              className="lg:col-span-7 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                                  Write a Review
                                </span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      aria-label={`Rate ${star} stars`}
                                      onClick={() => setReviewRating(star)}
                                      className="p-0.5 cursor-pointer"
                                    >
                                      <Star
                                        className={`w-4.5 h-4.5 transition-colors ${
                                          star <= reviewRating
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  <span className="text-xs font-semibold text-[#17212B] ml-1.5">
                                    {reviewRating}/5
                                  </span>
                                </div>
                              </div>

                              <input
                                type="text"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                                placeholder="Review title (e.g. Peaceful courtyard & warm hospitality)"
                                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] focus:bg-white transition-colors"
                              />

                              <textarea
                                rows={2}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder={`Share your stay experience at ${selectedStay.name}...`}
                                required
                                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] focus:bg-white transition-colors resize-none"
                              />

                              {reviewPhotos.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {reviewPhotos.map((src, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                      <img src={src} alt={`Upload preview ${idx + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        aria-label="Remove photo"
                                        onClick={() =>
                                          setReviewPhotos((prev) => prev.filter((_, i) => i !== idx))
                                        }
                                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-3">
                                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] hover:bg-[#0552A2]/8 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                                  <ImagePlus className="w-4 h-4" />
                                  <span>Add Photos ({reviewPhotos.length}/4)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleReviewPhotoUpload}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  type="submit"
                                  className="bg-[#0552A2] hover:bg-[#044080] text-white font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer"
                                >
                                  Post Review
                                </button>
                              </div>
                            </form>
                          </div>

                          {/* Review Feed */}
                          <div className="divide-y divide-slate-100">
                            {reviews.length === 0 ? (
                              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm text-[#64748B] py-3">
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
                                      <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                                        {rev.author}
                                      </span>
                                      <span className="text-xs text-[#64748B]">{rev.date}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                          key={s}
                                          className={`w-3.5 h-3.5 ${
                                            s <= rev.rating
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-slate-200'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    {rev.title && (
                                      <p className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mt-2">
                                        {rev.title}
                                      </p>
                                    )}
                                    <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                                      {rev.comment}
                                    </p>
                                    {rev.photos && rev.photos.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2.5">
                                        {rev.photos.map((photoUrl, idx) => (
                                          <img
                                            key={idx}
                                            src={photoUrl}
                                            alt={`${rev.author} review photo ${idx + 1}`}
                                            className="w-24 h-20 rounded-xl object-cover border border-slate-200"
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })()}
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

                      <label className="flex items-start gap-2.5 bg-white border border-slate-200 rounded-lg p-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTransfer}
                          onChange={(e) => setIncludeTransfer(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-[#0552A2] focus:ring-[#0552A2]"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-[#17212B] block">
                            Airport / Trailhead Pickup (+$25)
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            Driver meets you at TIA arrival gate or trailhead.
                          </span>
                        </div>
                      </label>

                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-[#475569]">
                          Arrival Time / Flight # (Optional)
                        </span>
                        <input
                          type="text"
                          value={arrivalNote}
                          onChange={(e) => setArrivalNote(e.target.value)}
                          placeholder="e.g. QR 652 · 14:30 or late check-in"
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                        />
                      </label>
                    </div>

                    <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">
                          Total ({stayNights} {stayNights === 1 ? 'night' : 'nights'}
                          {includeTransfer ? ' + pickup' : ''})
                        </span>
                        <span className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#0552A2]">
                          ${activeRoom.price * stayNights + (includeTransfer ? 25 : 0)}
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
              {/* Header (left) + Search (right) — matches DashboardHome */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                    Hotels &amp; Stays
                  </h2>
                  <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1">
                    Verified heritage palaces, mountain lodges, eco-resorts, and homestays across Nepal.
                  </p>
                </div>

                <div className="relative w-full md:w-80 lg:w-96 shrink-0">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hotels, valleys, or lodges..."
                    className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-9 py-2.5 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Category Filter Pills + Count */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`font-[family-name:var(--font-quicksand)] text-xs px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#0552A2] text-white shadow-xs'
                            : 'bg-slate-100 text-[#4B5563] hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B] shrink-0">
                  <strong className="text-[#17212B]">{filteredStays.length}</strong>{' '}
                  {filteredStays.length === 1 ? 'stay' : 'stays'}
                </span>
              </motion.div>

              {/* Clean Editorial Stays Grid */}
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
                    className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-[#0552A2]/45 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={stay.image}
                          alt={stay.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        />
                        <span className="font-[family-name:var(--font-ibm-plex-sans)] absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[11px] font-medium text-[#17212B] px-2.5 py-0.5 rounded-full shadow-xs">
                          {stay.type}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors leading-snug line-clamp-1">
                            {stay.name}
                          </h3>
                          <span className="font-[family-name:var(--font-ibm-plex-sans)] flex items-center gap-1 text-xs font-semibold text-[#17212B] shrink-0 pt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {stay.rating.toFixed(1)}
                          </span>
                        </div>

                        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0552A2] shrink-0" />
                          <span className="line-clamp-1">{stay.location}</span>
                        </p>

                        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#475569] leading-relaxed line-clamp-2 pt-1">
                          {stay.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#0552A2] text-base">
                          ${stay.price}
                        </span>
                        <span className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
                          {' '}
                          / night
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#0552A2] group-hover:underline flex items-center gap-1 text-xs">
                        <span>View suites</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
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
      {activeId === 'transportation' && (() => {
        const transportOptions = [
          {
            id: 't1',
            tag: 'Premium Aerial',
            title: 'Helicopter Summit Charter',
            desc: 'Direct peak-to-peak transfer bypassing multi-day trails. Popular for Everest Base Camp and Langtang loops.',
            price: '$1,200',
            unit: '/ flight leg',
            badge: 'Available Daily',
            icon: Plane,
          },
          {
            id: 't2',
            tag: 'Overland Rugged',
            title: 'Private 4x4 Mountain Jeep',
            desc: 'Cross rugged canyon roads to Lo Manthang, Muktinath, or Pokhara in high-ground clearance expedition jeeps.',
            price: '$180',
            unit: '/ day (with driver)',
            badge: 'Includes Fuel',
            icon: Car,
          },
          {
            id: 't3',
            tag: 'Domestic Aviation',
            title: 'Turboprop Mountain Flights',
            desc: 'Scenic twin-engine flights connecting Kathmandu to Pokhara, Lukla, or Jomsom high-altitude airstrips.',
            price: '$150',
            unit: '/ traveler',
            badge: '15kg Baggage',
            icon: Plane,
          },
          {
            id: 't4',
            tag: 'Scenic Ropeway',
            title: 'Chandragiri & Sarangkot Cable Car',
            desc: 'Gliding gondolas ascending over subtropical pine forests for panoramic Himalayan views over Kathmandu & Pokhara.',
            price: '$24',
            unit: '/ round-trip',
            badge: 'Express Entry',
            icon: Compass,
          },
          {
            id: 't5',
            tag: 'Trail Porter Support',
            title: 'Certified Sherpa Porter Services',
            desc: 'Licensed and insured high-altitude porters adhering to strict ethical 20kg weight standards and welfare protocols.',
            price: '$25',
            unit: '/ day',
            badge: 'IPPG Compliant',
            icon: ShieldCheck,
          },
          {
            id: 't6',
            tag: 'VIP Arrival',
            title: 'Kathmandu Airport Express Transfer',
            desc: 'Air-conditioned hybrid sedan transfer directly from Tribhuvan International Airport to your hotel with cold towels.',
            price: '$35',
            unit: '/ transfer',
            badge: 'Meet & Greet',
            icon: Car,
          },
        ];
        const tq = transportSearch.trim().toLowerCase();
        const filteredTransport = transportOptions.filter(
          (item) =>
            !tq ||
            item.title.toLowerCase().includes(tq) ||
            item.tag.toLowerCase().includes(tq) ||
            item.desc.toLowerCase().includes(tq)
        );

        return (
          <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2">
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                  Transportation
                </h2>
                <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1">
                  Airport transfers, domestic mountain flights, cable cars, and private 4x4 vehicles.
                </p>
              </div>
              <div className="relative w-full md:w-80 lg:w-96 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={transportSearch}
                  onChange={(e) => setTransportSearch(e.target.value)}
                  placeholder="Search flights, jeeps, or transfers..."
                  className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-9 py-2.5 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] transition-colors"
                />
                {transportSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setTransportSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div
              layout="position"
              className="grid gap-5 auto-card-grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
            >
              {filteredTransport.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0552A2]/50 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono font-bold text-white uppercase bg-[#0552A2] px-2 py-0.5 rounded-md">
                          {item.tag}
                        </span>
                        <Icon className="w-4 h-4 text-[#0552A2]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#17212B]">{item.title}</h3>
                      <p className="text-xs text-[#475569] leading-relaxed mt-1">{item.desc}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0552A2]">{item.price} <span className="text-[10px] font-normal text-slate-500">{item.unit}</span></span>
                      <span className="text-[10px] font-mono font-semibold text-white bg-emerald-600 px-2 py-0.5 rounded-md">{item.badge}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        );
      })()}

    </motion.div>
  );
}
