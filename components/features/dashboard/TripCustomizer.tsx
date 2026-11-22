'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore } from '@/store/useTravelStore';
import {
  Compass,
  MapPin,
  Clock,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Mountain,
  Camera,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Plane,
  Banknote,
  Smartphone,
  AlertTriangle,
  Hotel,
  Users,
  Luggage,
} from 'lucide-react';
import {
  EXPEDITION_BLUEPRINTS,
  REGION_OPTIONS,
  TREK_STYLES,
  LODGING_STYLES,
  INTEREST_TAGS,
  ExpeditionBlueprint,
  ItineraryDay,
} from './mockCustomizerData';

type TravelSeason = 'autumn' | 'spring' | 'winter' | 'monsoon';
type JourneyPhaseId = 'predeparture' | 'arrival' | 'ontrail' | 'departure';

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

interface JourneyPhase {
  id: JourneyPhaseId;
  label: string;
  subtitle: string;
  items: ChecklistItem[];
}

const SEASON_OPTIONS: { id: TravelSeason; label: string; months: string; note: string }[] = [
  {
    id: 'autumn',
    label: 'Autumn (Peak)',
    months: 'Oct – Nov',
    note: 'Crisp mountain visibility. Lukla flights often operate from Ramechhap (Manthali), requiring a 4–5 hr early-morning drive from Kathmandu.',
  },
  {
    id: 'spring',
    label: 'Spring (Peak)',
    months: 'Mar – May',
    note: 'Blooming rhododendrons and mild days. Book domestic mountain flights and teahouses 2–4 months ahead; Ramechhap diversion applies for Everest.',
  },
  {
    id: 'winter',
    label: 'Winter',
    months: 'Dec – Feb',
    note: 'Quiet trails and clear mornings, but sub-zero nights above 3,500m. High passes (Thorong La, Larkya La) can close after heavy snow.',
  },
  {
    id: 'monsoon',
    label: 'Monsoon',
    months: 'Jun – Aug',
    note: 'Lush valleys with afternoon rain and road landslide delays. Upper Mustang and Dolpo sit in the Himalayan rain shadow and stay dry.',
  },
];

const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 'predeparture',
    label: 'Before Leaving Home',
    subtitle: 'Documents, cash & insurance before boarding',
    items: [
      {
        id: 'visa-form',
        title: 'Online Nepal Visa Form & Crisp USD Cash',
        detail: 'Complete the Nepal Immigration online arrival form within 15 days of flying and save the barcode. Bring crisp post-2003 USD bills ($30 for 15d, $50 for 30d, $125 for 90d) — airport ATMs at the visa counter frequently fail.',
      },
      {
        id: 'heli-insurance',
        title: 'High-Altitude Helicopter Rescue Insurance',
        detail: 'Verify your policy explicitly covers trekking up to your route’s maximum elevation (e.g. 5,545m) and includes emergency helicopter evacuation.',
      },
      {
        id: 'photos-copies',
        title: 'Passport Photos & Paper Copies',
        detail: 'Pack 4 passport-size photos and 2 copies of your passport bio page. You will need them for SIM registration, TIMS, and National Park permits.',
      },
      {
        id: 'water-gear',
        title: 'Water Purifier & 3-Layer Clothing',
        detail: 'Bring a Sawyer Squeeze, SteriPEN, or Aquatabs instead of buying plastic bottles on the trail, plus a base layer, fleece/down jacket, and windproof shell.',
      },
    ],
  },
  {
    id: 'arrival',
    label: 'Arrival in Kathmandu (TIA)',
    subtitle: 'First 24 hours from airport to trailhead',
    items: [
      {
        id: 'tia-taxi',
        title: 'Airport Taxi & Thamel Transfer',
        detail: 'Skip unmetered touts outside arrivals. Use the official prepaid taxi counter or walk out to book InDrive/Yango (~700–1,200 NPR to Thamel).',
      },
      {
        id: 'sim-card',
        title: 'Local SIM: NTC for Trails, Ncell for Cities',
        detail: 'Pick up a SIM at TIA arrivals or in Thamel with your passport and photo. Nepal Telecom (NTC) has better high-altitude coverage; Ncell is fastest in Kathmandu/Pokhara.',
      },
      {
        id: 'npr-cash',
        title: 'Withdraw NPR & Break Large 1,000 Notes',
        detail: 'Mountain teahouses are strictly cash-only and ATMs are scarce or empty past Namche/Manang. Withdraw your full trail budget plus a 20% buffer in small notes.',
      },
      {
        id: 'rest-storage',
        title: '1-Day Jet Lag Buffer & Hotel Luggage Storage',
        detail: 'Spend at least 1 full day in Kathmandu for rest, last-minute gear rental in Thamel, and permit checks. Leave city suitcases in free hotel storage.',
      },
    ],
  },
  {
    id: 'ontrail',
    label: 'On the Trail & Travel',
    subtitle: 'Safety, altitude, connectivity & culture',
    items: [
      {
        id: 'guide-permits',
        title: 'Licensed Guide & Official Trail Permits',
        detail: 'Solo trekking without a licensed guide is restricted on major Nepal trails. Carry your TIMS card and National Park / Restricted Area permits at all checkpoints.',
      },
      {
        id: 'acclimatization',
        title: 'Acclimatization & Altitude Pacing',
        detail: 'Above 3,000m, limit sleeping elevation gains to 400–500m per day, follow "climb high, sleep low", hydrate well, and carry Diamox if advised by your doctor.',
      },
      {
        id: 'charging-wifi',
        title: 'Power Bank & Paid Teahouse Charging',
        detail: 'Higher-altitude lodges charge per hour for solar/generator charging, hot showers, and Wi-Fi. Carry a 10,000–20,000mAh power bank and universal adapter.',
      },
      {
        id: 'etiquette',
        title: 'Trail & Temple Etiquette',
        detail: 'Walk clockwise around Buddhist stupas and mani walls, dress modestly at religious sites, and pack out all wrappers.',
      },
    ],
  },
  {
    id: 'departure',
    label: 'Heading Home',
    subtitle: 'Flight buffers, tipping & departure',
    items: [
      {
        id: 'return-buffer',
        title: '2–3 Buffer Days Before International Flight',
        detail: 'Lukla and mountain flights cancel frequently due to fog or wind, and highways can delay. Keep 2–3 spare days in Kathmandu before flying home.',
      },
      {
        id: 'tipping',
        title: 'Guide & Porter Tipping in NPR',
        detail: 'Tipping is customary at the end of the trek: roughly 10–15% of trek cost, or ~1,500–2,000 NPR/day for your guide and ~1,000–1,200 NPR/day for porters.',
      },
      {
        id: 'tia-departure',
        title: 'TIA Departure & Handicraft Receipts',
        detail: 'Arrive 3 hours early for international departure at Tribhuvan International Airport and keep receipts for any traditional thangka or handicraft purchases.',
      },
    ],
  },
];

export default function TripCustomizer() {
  const {
    bookings,
    addBooking,
    customPreferences,
    setCustomPreference,
    generatedItinerary,
    setGeneratedItinerary,
  } = useTravelStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(EXPEDITION_BLUEPRINTS[0].id);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '8,000m Himalayan Peaks',
    'Ancient Monasteries & Stupas',
    'Golden Hour Alpine Sunrises',
  ]);
  const [selectedTrekStyle, setSelectedTrekStyle] = useState<string>('balanced');
  const [selectedLodgingStyle, setSelectedLodgingStyle] = useState<string>('ecolodge');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [arrivalSeason, setArrivalSeason] = useState<TravelSeason>('autumn');
  const [returnBufferDays, setReturnBufferDays] = useState<number>(2);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activePhase, setActivePhase] = useState<JourneyPhaseId>('predeparture');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'visa-form': true,
    'heli-insurance': false,
  });
  const [bookSuccess, setBookSuccess] = useState<boolean>(false);

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
      days: blueprint.days,
    });
  };

  const activeItinerary = generatedItinerary || EXPEDITION_BLUEPRINTS[0];

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdatePlan = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      const matched =
        EXPEDITION_BLUEPRINTS.find((b) =>
          b.region.toLowerCase().includes(customPreferences.preferredRegion.toLowerCase())
        ) || EXPEDITION_BLUEPRINTS[0];

      let costMult = 1;
      if (selectedLodgingStyle === 'luxury' || customPreferences.budget === 'luxury') costMult = 2.1;
      else if (selectedLodgingStyle === 'teahouse' || customPreferences.budget === 'budget') costMult = 0.78;

      const duration = customPreferences.duration || matched.duration;
      const customDays: ItineraryDay[] = matched.days.slice(0, duration).map((d, idx) => ({
        ...d,
        day: idx + 1,
      }));

      while (customDays.length < duration) {
        const nextDayNum = customDays.length + 1;
        customDays.push({
          day: nextDayNum,
          title: `Alpine Exploration & Cultural Immersion (Day ${nextDayNum})`,
          activity:
            'Guided valley trek exploring ancient sacred chortens, traditional settlement architecture, and high-altitude trails.',
          alt: matched.maxAlt,
          distance: '7.5 km',
          duration: '4.5 hrs',
          stay:
            selectedLodgingStyle === 'luxury'
              ? 'Himalayan Boutique Eco Resort'
              : selectedLodgingStyle === 'ecolodge'
                ? 'Comfort Mountain Lodge'
                : 'Traditional Tea House',
          meals: 'B, L, D',
        });
      }

      setGeneratedItinerary({
        id: `custom-${Date.now()}`,
        title: `${duration}-Day ${matched.region} Plan`,
        region: matched.region,
        difficulty:
          customPreferences.difficulty.charAt(0).toUpperCase() +
          customPreferences.difficulty.slice(1),
        duration,
        maxAlt: matched.maxAlt,
        distance: `${Math.round(duration * 9.2)} km`,
        costEstimate: Math.round(matched.costEstimate * costMult * (duration / matched.duration)),
        highlights: [...matched.highlights.slice(0, 3), ...selectedInterests.slice(0, 2)],
        permits: matched.permits,
        guideRequirement: matched.guideRequirement,
        imageUrl: matched.imageUrl,
        days: customDays,
      });
    }, 450);
  };

  const handleBookPlan = () => {
    addBooking({
      id: `BK-${Date.now()}`,
      type: 'Custom Trip',
      title: activeItinerary.title,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      details: `${totalDoorToDoorDays} Days Total (${activeItinerary.duration}d route + 1d arrival + ${returnBufferDays}d buffer) · ${travelersCount} Travelers`,
      cost: activeItinerary.costEstimate * travelersCount,
      status: 'Confirmed',
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setBookSuccess(true);
    setTimeout(() => setBookSuccess(false), 3500);
  };

  const selectedSeasonMeta = useMemo(
    () => SEASON_OPTIONS.find((s) => s.id === arrivalSeason) || SEASON_OPTIONS[0],
    [arrivalSeason]
  );

  const totalChecklistCount = useMemo(
    () => JOURNEY_PHASES.reduce((acc, p) => acc + p.items.length, 0),
    []
  );
  const completedChecklistCount = useMemo(
    () =>
      JOURNEY_PHASES.reduce(
        (acc, p) => acc + p.items.filter((i) => checkedItems[i.id]).length,
        0
      ),
    [checkedItems]
  );

  const currentPhaseObj =
    JOURNEY_PHASES.find((p) => p.id === activePhase) || JOURNEY_PHASES[0];

  const totalDoorToDoorDays = activeItinerary.duration + 1 + returnBufferDays;

  return (
    <div className="flex flex-col gap-7 max-w-[1440px] w-full mx-auto py-2 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
            Plan Your Nepal Trip
          </h2>
          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1">
            Door-to-door planner from your home country through arrival in Kathmandu, permits, trail logistics, and your flight home.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Door-to-door trip</span>
            <span className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#0552A2]">
              {totalDoorToDoorDays} Days ({travelersCount} {travelersCount === 1 ? 'traveler' : 'travelers'})
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Curated Routes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-[#0552A2]" />
            <h3 className="font-[family-name:var(--font-quicksand)] text-base sm:text-lg font-bold text-[#17212B]">
              1. Choose a Starting Route
            </h3>
          </div>
          <span className="text-xs text-slate-500">Select any route to customize</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPEDITION_BLUEPRINTS.map((bp) => {
            const isSelected = selectedBlueprintId === bp.id;
            const difficultyColor =
              bp.difficulty === 'Challenging'
                ? 'bg-rose-600 text-white border-rose-600'
                : bp.difficulty === 'Moderate'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-emerald-600 text-white border-emerald-600';

            return (
              <div
                key={bp.id}
                onClick={() => handleLoadBlueprint(bp)}
                className={`group cursor-pointer rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0552A2] ring-2 ring-[#0552A2]/15 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={bp.imageUrl}
                      alt={bp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-white/95 backdrop-blur-xs text-[#0552A2] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                        {bp.maxAlt}
                      </span>
                      <span className="bg-[#0552A2] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                        {bp.duration} Days
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-xs font-medium text-white/95">
                      <MapPin className="w-3.5 h-3.5 text-[#92C4EA]" />
                      <span>{bp.region}</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="font-[family-name:var(--font-quicksand)] text-sm sm:text-base font-bold text-[#17212B] line-clamp-1 group-hover:text-[#0552A2] transition-colors">
                      {bp.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${difficultyColor}`}
                      >
                        {bp.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">{bp.distance} total</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {bp.highlights.slice(0, 2).map((h, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-[#4B5563] bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md line-clamp-1"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Est. per traveler</span>
                    <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                      ${bp.costEstimate}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0552A2] text-white'
                        : 'bg-white border border-slate-200 text-[#0552A2] hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Selected
                      </>
                    ) : (
                      'Select Route'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2 & 3: Calibration + Itinerary & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Traveler & Route Calibration (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col gap-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0552A2]" />
              <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                2. Customize Your Trip
              </h3>
            </div>
            <span className="text-xs text-slate-500">{customPreferences.preferredRegion}</span>
          </div>

          <div className="flex flex-col gap-4 text-left">
            {/* Target Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#17212B]">Region</label>
              <div className="grid grid-cols-2 gap-2">
                {REGION_OPTIONS.map((reg) => {
                  const isRegActive = customPreferences.preferredRegion === reg.id;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => {
                        setCustomPreference('preferredRegion', reg.id);
                        const matched = EXPEDITION_BLUEPRINTS.find((b) =>
                          b.region.toLowerCase().includes(reg.id.toLowerCase())
                        );
                        if (matched) handleLoadBlueprint(matched);
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isRegActive
                          ? 'bg-[#0552A2]/5 border-[#0552A2] ring-1 ring-[#0552A2]'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#17212B]">
                          {reg.id}
                        </span>
                        <span className="text-[10px] text-[#0552A2] font-semibold">{reg.badge}</span>
                      </div>
                      <span className="text-[11px] text-[#64748B] line-clamp-1">{reg.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Season & Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#17212B]">Arrival Season</label>
                <select
                  value={arrivalSeason}
                  onChange={(e) => setArrivalSeason(e.target.value as TravelSeason)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                >
                  {SEASON_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.months})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#17212B] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0552A2]" />
                  <span>Travelers</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 4, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTravelersCount(count)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        travelersCount === count
                          ? 'bg-[#0552A2] text-white border-[#0552A2]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seasonal Real-World Advisory */}
            <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 flex items-start gap-2.5 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">{selectedSeasonMeta.note}</p>
            </div>

            {/* Trail Duration */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#17212B]">Route Days</label>
                <span className="font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#0552A2]">
                  {customPreferences.duration} Days
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="21"
                value={customPreferences.duration}
                onChange={(e) => setCustomPreference('duration', parseInt(e.target.value))}
                className="w-full accent-[#0552A2] cursor-pointer"
              />
              <div className="flex justify-between gap-1 text-[11px]">
                {[5, 8, 10, 12, 14, 18].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setCustomPreference('duration', d)}
                    className={`px-2.5 py-1 rounded-md border cursor-pointer font-medium ${
                      customPreferences.duration === d
                        ? 'bg-[#0552A2] text-white border-[#0552A2]'
                        : 'bg-white border-slate-200 text-[#64748B] hover:border-slate-300'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Return Flight Buffer Days */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#17212B] flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#0552A2]" />
                  <span>Return Flight Buffer (Kathmandu)</span>
                </label>
                <span className="text-xs font-semibold text-[#0552A2]">{returnBufferDays}d</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Recommended 2–3 days before flying home in case mountain flights or roads delay.
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setReturnBufferDays(b)}
                    className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      returnBufferDays === b
                        ? 'bg-[#0552A2] text-white border-[#0552A2]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b === 0 ? 'None' : `+${b} Day${b > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Pace & Lodging */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#17212B]">Pace &amp; Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {TREK_STYLES.map((ts) => {
                  const isActive = selectedTrekStyle === ts.id;
                  return (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setSelectedTrekStyle(ts.id)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-[#0552A2]/5 border-[#0552A2] text-[#0552A2]'
                          : 'bg-white border-slate-200 text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <span className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center text-[#0552A2] shrink-0">
                        {ts.icon === 'compass' && <Compass className="h-3.5 w-3.5" />}
                        {ts.icon === 'camera' && <Camera className="h-3.5 w-3.5" />}
                        {ts.icon === 'mountain' && <Mountain className="h-3.5 w-3.5" />}
                      </span>
                      <span className="text-[11px] font-semibold line-clamp-1">{ts.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#17212B]">Lodging Tier</label>
              <div className="grid grid-cols-3 gap-1.5">
                {LODGING_STYLES.map((ls) => {
                  const isActive = selectedLodgingStyle === ls.id;
                  return (
                    <button
                      key={ls.id}
                      type="button"
                      onClick={() => {
                        setSelectedLodgingStyle(ls.id);
                        setCustomPreference(
                          'budget',
                          ls.id === 'luxury' ? 'luxury' : ls.id === 'teahouse' ? 'budget' : 'premium'
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-0.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#0552A2]/5 border-[#0552A2]'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#0552A2]">{ls.price}</span>
                      <span className="text-[11px] font-semibold text-[#17212B] line-clamp-1">
                        {ls.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#17212B]">Focus Areas</label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_TAGS.map((tag) => {
                  const active = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0552A2] text-white border-[#0552A2]'
                          : 'bg-white text-[#475569] border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdatePlan}
              disabled={isUpdating}
              className="bg-[#0552A2] hover:bg-[#044080] text-white py-3 px-4 rounded-xl font-semibold text-xs mt-1 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Updating Trip Plan...</span>
                </>
              ) : (
                <span>Update Trip Plan</span>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Door-to-Door Readiness & Itinerary (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* A-to-Z Foreign Tourist Readiness Checklist */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                  3. Nepal A-to-Z Readiness Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Everything a foreign visitor needs from home departure until flying back.
                </p>
              </div>
              <span className="text-xs font-semibold text-white bg-[#0552A2] px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
                {completedChecklistCount}/{totalChecklistCount} Ready
              </span>
            </div>

            {/* Phase Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {JOURNEY_PHASES.map((phase) => {
                const isActive = activePhase === phase.id;
                const phaseDone = phase.items.filter((i) => checkedItems[i.id]).length;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setActivePhase(phase.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0552A2]/5 border-[#0552A2] text-[#0552A2]'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      {phase.id === 'predeparture' && <Luggage className="w-3.5 h-3.5 shrink-0" />}
                      {phase.id === 'arrival' && <Smartphone className="w-3.5 h-3.5 shrink-0" />}
                      {phase.id === 'ontrail' && <Banknote className="w-3.5 h-3.5 shrink-0" />}
                      {phase.id === 'departure' && <Plane className="w-3.5 h-3.5 shrink-0" />}
                      <span className="text-[10px] font-semibold">
                        {phaseDone}/{phase.items.length}
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-quicksand)] text-xs font-bold block mt-1.5 text-[#17212B] truncate">
                      {phase.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Phase Items */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500">{currentPhaseObj.subtitle}</p>
              {currentPhaseObj.items.map((item) => {
                const checked = !!checkedItems[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs font-bold block ${
                          checked ? 'text-emerald-900 line-through' : 'text-[#17212B]'
                        }`}
                      >
                        {item.title}
                      </span>
                      <p className="text-[11px] text-[#4B5563] mt-0.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip Summary & Itinerary */}
          <AnimatePresence mode="wait">
            {isUpdating ? (
              <motion.div
                key="updating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 min-h-[300px] rounded-2xl flex flex-col items-center justify-center text-center text-xs text-[#64748B] p-8 shadow-xs"
              >
                <span className="h-7 w-7 border-2 border-t-transparent border-[#0552A2] rounded-full animate-spin mb-3" />
                <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-1">
                  Updating Your Itinerary
                </span>
                <span className="text-xs text-[#64748B]">
                  Recalculating stages, elevation, permits, and buffer days...
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="itinerary-output"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Summary Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0552A2] text-white">
                          {activeItinerary.region}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-600 text-white border border-amber-600">
                          {activeItinerary.difficulty}
                        </span>
                      </div>
                      <h4 className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#17212B]">
                        {activeItinerary.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        1 arrival day in Kathmandu + {activeItinerary.duration} route days +{' '}
                        {returnBufferDays} return buffer day{returnBufferDays === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="text-[11px] text-slate-500 block">
                        Est. total ({travelersCount} {travelersCount === 1 ? 'person' : 'people'})
                      </span>
                      <span className="font-[family-name:var(--font-quicksand)] text-xl font-bold text-[#0552A2]">
                        ${(activeItinerary.costEstimate * travelersCount).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        ${activeItinerary.costEstimate} / person
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                    <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl flex flex-col items-center">
                      <Clock className="w-3.5 h-3.5 text-[#0552A2] mb-1" />
                      <span className="text-[11px] text-[#64748B]">Total Trip</span>
                      <span className="font-bold text-[#17212B]">{totalDoorToDoorDays} Days</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl flex flex-col items-center">
                      <Mountain className="w-3.5 h-3.5 text-[#0552A2] mb-1" />
                      <span className="text-[11px] text-[#64748B]">Max Altitude</span>
                      <span className="font-bold text-[#17212B] truncate max-w-full">
                        {activeItinerary.maxAlt || '4,130m'}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl flex flex-col items-center">
                      <Compass className="w-3.5 h-3.5 text-[#0552A2] mb-1" />
                      <span className="text-[11px] text-[#64748B]">Distance</span>
                      <span className="font-bold text-[#17212B]">
                        {activeItinerary.distance || '115 km'}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl flex flex-col items-center">
                      <Hotel className="w-3.5 h-3.5 text-[#0552A2] mb-1" />
                      <span className="text-[11px] text-[#64748B]">Lodging</span>
                      <span className="font-bold text-[#17212B] capitalize">{selectedLodgingStyle}</span>
                    </div>
                  </div>

                  {/* Guide & Permits */}
                  {activeItinerary.guideRequirement && (
                    <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs text-[#475569]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold text-[#17212B] text-xs block">
                          Guide &amp; Safety Requirement
                        </span>
                        <span className="text-[11px]">{activeItinerary.guideRequirement}</span>
                      </div>
                    </div>
                  )}

                  {activeItinerary.permits && activeItinerary.permits.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-[#17212B]">Required Permits</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeItinerary.permits.map((p: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-600 text-white border border-emerald-600 px-2.5 py-0.5 rounded-md"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Day-by-Day Stages */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                      Day-by-Day Trail Stages ({activeItinerary.days.length} Days)
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedDay(expandedDay === null ? 1 : null)}
                      className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
                    >
                      {expandedDay === null ? 'Expand Day 1' : 'Collapse All'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {activeItinerary.days.map((day: ItineraryDay) => {
                      const isExpanded = expandedDay === day.day;
                      return (
                        <div
                          key={day.day}
                          className={`border rounded-xl p-3.5 transition-all text-left ${
                            isExpanded
                              ? 'bg-slate-50/70 border-slate-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                            className="flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[11px] font-semibold bg-[#0552A2] text-white px-2 py-0.5 rounded-md shrink-0">
                                Day {day.day}
                              </span>
                              <span className="text-xs font-bold text-[#17212B] truncate">
                                {day.title || day.activity.slice(0, 48)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="text-[11px] font-semibold text-[#0552A2] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                {day.alt}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-[#64748B]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#64748B]" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="pt-3 mt-2.5 border-t border-slate-200/80 flex flex-col gap-2.5 text-xs">
                              <p className="text-xs text-[#475569] leading-relaxed">{day.activity}</p>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                {day.distance && (
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[#64748B] block">Distance</span>
                                    <span className="font-semibold text-[#17212B]">{day.distance}</span>
                                  </div>
                                )}
                                {day.duration && (
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[#64748B] block">Duration</span>
                                    <span className="font-semibold text-[#17212B]">{day.duration}</span>
                                  </div>
                                )}
                                {day.stay && (
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[#64748B] block">Overnight</span>
                                    <span className="font-semibold text-[#17212B] line-clamp-1">
                                      {day.stay}
                                    </span>
                                  </div>
                                )}
                                {day.meals && (
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[#64748B] block">Meals</span>
                                    <span className="font-semibold text-[#0552A2]">{day.meals}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div>
                    {bookSuccess ? (
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Trip plan saved to your Bookings ({bookings.length} total).</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#64748B]">
                        Includes certified guide coordination, permit prep &amp; {returnBufferDays}-day return buffer
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleBookPlan}
                    className="w-full sm:w-auto bg-[#0552A2] hover:bg-[#044080] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save &amp; Book Trip Plan</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
