'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTravelStore, Guide } from '@/store/useTravelStore';
import {
  Search,
  X,
  Star,
  Phone,
  Globe,
  Award,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  BadgeCheck,
  Briefcase,
  Camera,
  FileText,
  Building2,
  Clock,
  QrCode,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
} from 'lucide-react';

function getGuideProfileMedia(type: string) {
  switch (type) {
    case 'Mountaineering':
      return {
        cover: '/pictures/The_Glaciers_in_the_Khumbu_Region_of_Nepal_Himalaya_2-1765456544.jpeg',
        base: 'Kathmandu & Lukla, Nepal',
        gallery: [
          { src: '/pictures/ebc_tk_adventure_2-1624450606.jpeg', label: 'Everest Base Camp' },
          { src: '/pictures/everest_(1)-1624869402.jpg', label: 'Khumbu Ridge' },
          { src: '/pictures/Everest_mp_trekker_(3)-1624814609.jpg', label: 'High Pass Ascent' },
          { src: '/pictures/Choyou_1626729673-1635169288.jpeg', label: 'Cho Oyu Horizon' },
          { src: '/pictures/Manaslu_View_from_Lho-1624808940.jpg', label: 'Manaslu Morning' },
          { src: '/pictures/Dhaulagiri_1626729219-1635169360.jpeg', label: 'Dhaulagiri Massif' },
        ],
      };
    case 'Cultural':
      return {
        cover: '/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg',
        base: 'Kathmandu Valley, Nepal',
        gallery: [
          { src: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg', label: 'Kathmandu Durbar' },
          { src: '/pictures/Patan___Shikhar_Bhattarai-1629279746.jpg', label: 'Patan Courtyard' },
          { src: '/pictures/boudha-1624805151.jpg', label: 'Boudhanath Stupa' },
          { src: '/pictures/pashupatinath_bagmati_aarati_pilgrimage_in_kathmandu_nepal-1624432580.jpeg', label: 'Evening Aarati' },
          { src: '/pictures/Swayambhu_ss_lt_(1)-1624804990.jpg', label: 'Swayambhunath' },
          { src: '/pictures/yomari_traditional_newari_delicacy_from_nepal_2-1624430457.jpg', label: 'Newari Heritage' },
        ],
      };
    case 'Safari':
      return {
        cover: '/pictures/chitwan-1624804397.jpg',
        base: 'Chitwan & Bardiya, Nepal',
        gallery: [
          { src: '/pictures/Chitwan_ss_jungleactivities-1630491399.JPG', label: 'Rapti River Canoe' },
          { src: '/pictures/Bardiya_ss_lt_(12)-1624817484.jpg', label: 'Bardiya Plains' },
          { src: '/pictures/junglesafari_ss_nature-1624432644.jpeg', label: 'Terai Grasslands' },
          { src: '/pictures/Chitwan_ss_lt_(17)-1624813756.jpg', label: 'Sal Forest Trail' },
          { src: '/pictures/Blue_Sheep_Dhorpatan_CS-1630663097.JPG', label: 'Wildlife Spotting' },
          { src: '/pictures/lumbini-1624821139.jpg', label: 'Terai Wetlands' },
        ],
      };
    default:
      return {
        cover: '/pictures/annapurna-1624804396.jpg',
        base: 'Pokhara & Annapurna, Nepal',
        gallery: [
          { src: '/pictures/Abctrek_sbc_trekker_(7)-1624858181.jpg', label: 'Annapurna Sanctuary' },
          { src: '/pictures/poonhill_pg_adventure-1624431033.jpeg', label: 'Poon Hill Dawn' },
          { src: '/pictures/mustang_tk_people-1624440754.jpeg', label: 'Mustang Trail' },
          { src: '/pictures/gurans_trekking_ar-1624440965.jpeg', label: 'Rhododendron Ridge' },
          { src: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg', label: 'Phewa Lakeside' },
          { src: '/pictures/shey-1626727697.jpeg', label: 'Dolpo Traverse' },
        ],
      };
  }
}

function createBookingRefs(idPrefix: string, invPrefix: string) {
  return {
    id: `${idPrefix}-${Date.now()}`,
    invoiceNo: `${invPrefix}-${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

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
    specialty: 'Heritage & City Concierge',
    rating: 4.9,
    experience: 9,
    languages: ['English', 'Nepali', 'French'],
    bio: 'Personal concierge for Kathmandu arrival logistics, SIM & currency setup, heritage tours, and hotel luggage storage.',
    pricePerDay: 95,
    avatar: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg',
  },
  {
    id: 'butler-2',
    name: 'Sonam Dolma',
    specialty: 'Mountain Lodge Host',
    rating: 5.0,
    experience: 7,
    languages: ['English', 'Nepali', 'Tibetan'],
    bio: 'Specialized in high-altitude lodge hospitality, acclimatization meal planning, and warm gear preparation.',
    pricePerDay: 110,
    avatar: '/pictures/Everest_tk_trekker_(5)-1630474503.jpg',
  },
  {
    id: 'butler-3',
    name: 'Bikash Thapa',
    specialty: 'Transit & Flight Coordinator',
    rating: 4.8,
    experience: 11,
    languages: ['English', 'Nepali', 'Hindi', 'Japanese'],
    bio: 'Coordinates TIA airport transfers, Ramechhap/Lukla domestic flights, 4x4 jeeps, and buffer-day adjustments.',
    pricePerDay: 85,
    avatar: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg',
  },
  {
    id: 'butler-4',
    name: 'Prerana Shrestha',
    specialty: 'Lakeside Retreat Host',
    rating: 4.9,
    experience: 6,
    languages: ['English', 'Nepali', 'German'],
    bio: 'Arranges Pokhara lakeside stays, spa & recovery bookings, and local artisan visits after your trek.',
    pricePerDay: 90,
    avatar: '/pictures/Ghale_Gaon_Photo_001-1634812841.jpg',
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
      comment:
        'Nima managed our Khumbu crossing with total calm. His altitude pacing kept our entire team healthy to Base Camp.',
    },
    {
      id: 'rev-g1-2',
      author: 'Elena Rostova',
      rating: 5,
      date: 'April 2026',
      comment:
        'Unmatched mountain judgment and clear communication. Worth every dollar for high-altitude safety.',
    },
  ],
  g2: [
    {
      id: 'rev-g2-1',
      author: 'Daniel Kim',
      rating: 5,
      date: 'May 2026',
      comment:
        'Priya spotted a Bengal tiger and two rhinos on our first morning in Chitwan. Her nature knowledge made every walk memorable.',
    },
    {
      id: 'rev-g2-2',
      author: 'Sofia Alvarez',
      rating: 5,
      date: 'March 2026',
      comment:
        'Patient, knowledgeable, and spoke fluent Spanish with our family throughout the trip.',
    },
  ],
  g3: [
    {
      id: 'rev-g3-1',
      author: 'Hannah Weber',
      rating: 5,
      date: 'April 2026',
      comment:
        'Lobsang opened doors to monasteries in Upper Mustang we would never have experienced on our own.',
    },
  ],
};

const INITIAL_BUTLER_REVIEWS: Record<string, GuideReview[]> = {
  'butler-1': [
    {
      id: 'rev-b1-1',
      author: 'Claire Dubois',
      rating: 5,
      date: 'May 2026',
      comment: 'Aarav had our SIM cards, currency, and hotel transfer ready within 15 minutes of landing in Kathmandu.',
    },
  ],
  'butler-2': [
    {
      id: 'rev-b2-1',
      author: 'Oliver Grant',
      rating: 5,
      date: 'April 2026',
      comment: 'Sonam coordinated our Lukla rebooking effortlessly when weather delayed our flight and arranged warm lodge suites.',
    },
  ],
  'butler-3': [
    {
      id: 'rev-b3-1',
      author: 'Kenji Sato',
      rating: 5,
      date: 'March 2026',
      comment: 'Every gear rental and jeep dispatch was punctual and stress-free.',
    },
  ],
  'butler-4': [
    {
      id: 'rev-b4-1',
      author: 'Maya Lin',
      rating: 5,
      date: 'May 2026',
      comment: 'Prerana organized the most thoughtful lakeside dinner in Pokhara and handled all our spa bookings.',
    },
  ],
};

const GUIDE_SPECIALTIES = ['All', 'Mountaineering', 'Trekking', 'Culture', 'Wildlife', 'Spiritual'] as const;

const ROUTE_OPTIONS = [
  'Everest Base Camp (Khumbu)',
  'Annapurna Base Camp / Circuit',
  'Langtang Valley & Kyanjin Ri',
  'Manaslu Circuit (Larkya La)',
  'Upper Mustang (Lo Manthang)',
  'Chitwan / Pokhara / Kathmandu',
];

interface PermitCatalogItem {
  id: string;
  label: string;
  type: 'Trekking' | 'Mountaineering' | 'National Park' | 'Special Restricted';
  fee: number;
  feeDetail: string;
  authority: string;
  issuingLocations: string;
  processingTime: string;
  validity: string;
  guideRequired: string;
  docs: string[];
  notes: string;
}

const PERMIT_CATALOG: PermitCatalogItem[] = [
  {
    id: 'acap-tims',
    label: 'Annapurna Conservation Area (ACAP) + TIMS',
    type: 'Trekking',
    fee: 30,
    feeDetail: 'NPR 3,000 ACAP + NPR 2,000 TIMS (~$30)',
    authority: 'Nepal Tourism Board (NTB) & NTNC',
    issuingLocations: 'Bhrikutimandap (Kathmandu) or Damside (Pokhara)',
    processingTime: 'Same day (15–30 mins)',
    validity: 'Single entry for trek duration',
    guideRequired: 'Mandatory (licensed guide required for TIMS)',
    docs: ['Original passport (6+ months validity)', '2–4 passport-size photos', 'Trekking itinerary & guide license'],
    notes: 'Required for Annapurna Base Camp, Annapurna Circuit, Ghorepani Poon Hill, and Mardi Himal.',
  },
  {
    id: 'sagarmatha',
    label: 'Sagarmatha National Park + Khumbu Fee',
    type: 'National Park',
    fee: 40,
    feeDetail: 'NPR 3,000 Park + NPR 2,000 Khumbu Rural (~$40)',
    authority: 'Dept. of National Parks & Khumbu Pasang Lhamu',
    issuingLocations: 'Monjo Entry Gate, Lukla, or NTB Kathmandu',
    processingTime: 'Instant at entry checkpoint',
    validity: 'Single entry for Everest region trek',
    guideRequired: 'Recommended (mandatory for restricted side valleys)',
    docs: ['Original passport', 'Cash in NPR (cards not accepted at Monjo)', '2 passport photos (if registering TIMS)'],
    notes: 'Covers Everest Base Camp, Gokyo Lakes, and Three Passes. Keep receipts for trail checkpoints.',
  },
  {
    id: 'langtang-tims',
    label: 'Langtang National Park + TIMS',
    type: 'Trekking',
    fee: 30,
    feeDetail: 'NPR 3,000 Park + TIMS (~$30)',
    authority: 'Nepal Tourism Board & DNPWC',
    issuingLocations: 'NTB Kathmandu or Dhunche Checkpoint',
    processingTime: 'Same day',
    validity: 'Single entry for Langtang / Gosainkunda',
    guideRequired: 'Mandatory for TIMS card',
    docs: ['Original passport', '2 passport-size photos', 'Licensed guide registration'],
    notes: 'Covers Langtang Valley, Kyanjin Ri, and Gosainkunda Alpine Lakes.',
  },
  {
    id: 'upper-mustang',
    label: 'Upper Mustang Restricted Area (RAP)',
    type: 'Special Restricted',
    fee: 500,
    feeDetail: '$500 for first 10 days (+$50 per extra day)',
    authority: 'Department of Immigration, Nepal',
    issuingLocations: 'Kalikasthan (Kathmandu) via registered agency',
    processingTime: '1–2 business days',
    validity: '10 days minimum (extendable per day)',
    guideRequired: 'Mandatory (minimum 2 trekkers + licensed guide)',
    docs: ['Original passport & valid Nepal visa', '2 passport-size photos', 'Registered agency application & ACAP permit'],
    notes: 'Restricted border zone north of Kagbeni. Solo trekking permits are not issued.',
  },
  {
    id: 'manaslu',
    label: 'Manaslu Conservation & Restricted Area (MCAP + RAP)',
    type: 'Special Restricted',
    fee: 100,
    feeDetail: '$100 (Sep–Nov) / $75 (Dec–Aug) + NPR 3,000 MCAP',
    authority: 'Department of Immigration & NTNC',
    issuingLocations: 'Kalikasthan & Bhrikutimandap (Kathmandu)',
    processingTime: '1–2 business days',
    validity: '7 days base (extendable per extra day)',
    guideRequired: 'Mandatory (minimum 2 trekkers + licensed guide)',
    docs: ['Original passport & Nepal visa', '2 passport-size photos', 'Agency endorsement & MCAP/ACAP permits'],
    notes: 'Required for Manaslu Circuit and Larkya La Pass. Includes Annapurna exit zone.',
  },
  {
    id: 'chitwan-bardia',
    label: 'Chitwan / Bardia National Park Entry',
    type: 'National Park',
    fee: 20,
    feeDetail: 'NPR 2,000 per day (~$20)',
    authority: 'Dept. of National Parks & Wildlife Conservation',
    issuingLocations: 'Sauraha / Kasara (Chitwan) or Thakurdwara (Bardia)',
    processingTime: 'Instant at park gate',
    validity: '1 day per ticket (renewable)',
    guideRequired: 'Mandatory for walking safaris inside core park',
    docs: ['Original passport or photocopy at counter', 'Cash in NPR'],
    notes: 'Required for jungle jeep safaris, canoeing, and guided wildlife walks.',
  },
  {
    id: 'nma-peak',
    label: 'NMA Trekking Peak Permit (Island / Mera)',
    type: 'Mountaineering',
    fee: 250,
    feeDetail: '$250 (Spring) / $125 (Autumn) / $70 (Winter/Summer)',
    authority: 'Nepal Mountaineering Association (NMA)',
    issuingLocations: 'NMA Secretariat, Nagpokhari, Kathmandu',
    processingTime: '2–3 business days',
    validity: '30 days climbing window',
    guideRequired: 'Mandatory (NMA-certified climbing guide)',
    docs: ['Original passport & Nepal visa', 'High-altitude rescue & medical insurance', 'Agency endorsement & garbage deposit'],
    notes: 'Covers Group B trekking peaks including Island Peak (Imja Tse), Mera Peak, and Lobuche East.',
  },
];

export default function GuidesPermitsSection({ activeId }: GuidesPermitsSectionProps) {
  const { guides, permits, addPermit, addBooking } = useTravelStore();

  // Permits Form states
  const [isApplyingPermit, setIsApplyingPermit] = useState(false);
  const [permitSearch, setPermitSearch] = useState('');
  const [permitStep, setPermitStep] = useState<1 | 2 | 3>(1);
  const [permitPaymentMethod, setPermitPaymentMethod] = useState<'esewa' | 'card' | 'counter'>('esewa');
  const [paymentRefInput, setPaymentRefInput] = useState('');
  const [selectedPermitId, setSelectedPermitId] = useState(PERMIT_CATALOG[0].id);
  const [applicantName, setApplicantName] = useState('Alex Mercer');
  const [passportNumber, setPassportNumber] = useState('NPL-9988221A');
  const [nationality, setNationality] = useState('United States');
  const [permitType, setPermitType] = useState<'Trekking' | 'Mountaineering' | 'National Park' | 'Special Restricted'>(PERMIT_CATALOG[0].type);
  const [zone, setZone] = useState(PERMIT_CATALOG[0].label);
  const [startDate, setStartDate] = useState('2026-06-05');
  const [endDate, setEndDate] = useState('2026-06-15');
  const [docsConfirmed, setDocsConfirmed] = useState(false);
  const [expandedPermitId, setExpandedPermitId] = useState<string | null>(null);
  const [permitSubmittedMsg, setPermitSubmittedMsg] = useState<string | null>(null);

  const selectedPermitMeta = useMemo(
    () => PERMIT_CATALOG.find((p) => p.id === selectedPermitId) || PERMIT_CATALOG[0],
    [selectedPermitId]
  );

  const permitDurationDays = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 10;
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
  }, [startDate, endDate]);

  const computedPermitFee = useMemo(() => {
    if (selectedPermitMeta.id === 'upper-mustang') {
      return 500 + Math.max(0, permitDurationDays - 10) * 50;
    }
    return selectedPermitMeta.fee;
  }, [selectedPermitMeta, permitDurationDays]);

  // Guides search, filter, sort, inline detail & reviews state
  const [guideSearch, setGuideSearch] = useState('');
  const [guideSpecialty, setGuideSpecialty] = useState<string>('All');
  const [guideSort, setGuideSort] = useState<'rating' | 'experience' | 'price-asc' | 'price-desc'>('rating');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [guideProfileTab, setGuideProfileTab] = useState<'about' | 'photos' | 'reviews'>('about');
  const [showGuideBooking, setShowGuideBooking] = useState(false);
  const [hireDays, setHireDays] = useState(5);
  const [hireStartDate, setHireStartDate] = useState('2026-06-05');
  const [hireRoute, setHireRoute] = useState(ROUTE_OPTIONS[0]);
  const [hireGroupSize, setHireGroupSize] = useState(2);
  const [hireMeetingPoint, setHireMeetingPoint] = useState('Kathmandu (Thamel)');
  const [guideBookedBanner, setGuideBookedBanner] = useState<string | null>(null);

  // Butler inline detail state
  const [selectedButler, setSelectedButler] = useState<Butler | null>(null);
  const [butlerProfileTab, setButlerProfileTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [showButlerBooking, setShowButlerBooking] = useState(false);
  const [butlerDays, setButlerDays] = useState(3);
  const [butlerStartDate, setButlerStartDate] = useState('2026-06-05');
  const [butlerLocation, setButlerLocation] = useState('Kathmandu (Thamel)');
  const [butlerBookedBanner, setButlerBookedBanner] = useState<string | null>(null);

  // Reviews
  const [guideReviews, setGuideReviews] = useState<Record<string, GuideReview[]>>(INITIAL_GUIDE_REVIEWS);
  const [butlerReviews, setButlerReviews] = useState<Record<string, GuideReview[]>>(INITIAL_BUTLER_REVIEWS);
  const [reviewAuthor, setReviewAuthor] = useState('Alex Mercer');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const getButlerStats = (butler: Butler) => {
    const reviews = butlerReviews[butler.id] || [];
    if (reviews.length === 0) return { avgRating: butler.rating, count: 0 };
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avgRating: Number(((butler.rating + total) / (reviews.length + 1)).toFixed(2)),
      count: reviews.length,
    };
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guides, guideSearch, guideSpecialty, guideSort, guideReviews]);

  const handleApplyPermit = (e: React.FormEvent) => {
    e.preventDefault();
    addPermit({
      type: permitType,
      zone,
      applicantName,
      passportNumber,
      startDate,
      endDate,
      cost: computedPermitFee,
    });
    setDocsConfirmed(false);
    setPermitStep(1);
    setIsApplyingPermit(false);
    setPaymentRefInput('');
    const methodLabel =
      permitPaymentMethod === 'esewa'
        ? 'eSewa / Khalti'
        : permitPaymentMethod === 'card'
          ? 'Card'
          : 'NTB Counter';
    setPermitSubmittedMsg(`Submitted ${zone} (${nationality}) · $${computedPermitFee} via ${methodLabel}. Added to Your Permits.`);
    setTimeout(() => setPermitSubmittedMsg(null), 4000);
  };

  const handleDownloadPermit = (permit: {
    id: string;
    type: string;
    zone: string;
    applicantName: string;
    passportNumber: string;
    startDate: string;
    endDate: string;
    status: string;
    qrCode: string;
    cost: number;
  }) => {
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Nepal Trekking & Park Permit - ${permit.zone}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #17212B; background: #f8fafc; margin: 0; padding: 32px; }
    .card { max-width: 640px; margin: 0 auto; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 28px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 700; margin: 0; color: #0552A2; }
    .sub { font-size: 12px; color: #64748B; margin-top: 4px; }
    .badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: #ecfdf5; color: #047857; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px; }
    .label { font-size: 11px; color: #64748B; display: block; margin-bottom: 2px; }
    .val { font-weight: 600; color: #17212B; }
    .footer { margin-top: 22px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #475569; display: flex; justify-content: space-between; align-items: center; }
    .ref { font-family: monospace; font-weight: 700; color: #0552A2; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="title">Visit Nepal — Trekking &amp; Park Permit</h1>
        <div class="sub">${permit.type} · ${permit.zone}</div>
      </div>
      <span class="badge">${permit.status}</span>
    </div>
    <div class="grid">
      <div><span class="label">Applicant Name</span><span class="val">${permit.applicantName}</span></div>
      <div><span class="label">Passport Number</span><span class="val">${permit.passportNumber}</span></div>
      <div><span class="label">Entry Date</span><span class="val">${permit.startDate}</span></div>
      <div><span class="label">Exit Date</span><span class="val">${permit.endDate}</span></div>
      <div><span class="label">Permit Fee</span><span class="val">$${permit.cost}</span></div>
      <div><span class="label">Checkpoint Reference</span><span class="val ref">${permit.qrCode}</span></div>
    </div>
    <div class="footer">
      <span>Present this pass with your original passport at trailhead checkpoints.</span>
      <span class="ref">ID: ${permit.id}</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepal-permit-${permit.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleHireGuide = (guide: Guide, days = hireDays) => {
    const total = guide.pricePerDay * days;
    const start = new Date(`${hireStartDate}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    const fmt = (d: Date) =>
      Number.isNaN(d.getTime())
        ? `${days} days`
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateRange = Number.isNaN(start.getTime()) ? `${days} days` : `${fmt(start)} - ${fmt(end)}`;

    const { id, invoiceNo } = createBookingRefs('b-guide', 'INV-GUIDE');
    addBooking({
      id,
      type: 'Guide',
      title: `${guide.name} — ${guide.type} Guide`,
      date: dateRange,
      details: `${days} days · ${hireRoute} · ${hireGroupSize} travelers · Meet: ${hireMeetingPoint}`,
      cost: total,
      status: 'Confirmed',
      invoiceNo,
    });

    setGuideBookedBanner(`Booked ${guide.name} for ${days} days ($${total}). Added to your Bookings.`);
    setTimeout(() => setGuideBookedBanner(null), 4000);
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

  const handleSubmitButlerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedButler || !reviewComment.trim()) return;
    const newRev: GuideReview = {
      id: `rev-b-${Date.now()}`,
      author: reviewAuthor.trim() || 'Traveler',
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
    };
    setButlerReviews((prev) => ({
      ...prev,
      [selectedButler.id]: [newRev, ...(prev[selectedButler.id] || [])],
    }));
    setReviewComment('');
    setReviewRating(5);
  };

  const handleHireButler = (butler: Butler) => {
    const total = butler.pricePerDay * butlerDays;
    const { id, invoiceNo } = createBookingRefs('b-butler', 'INV-BUTLER');
    addBooking({
      id,
      type: 'Guide',
      title: `${butler.name} — ${butler.specialty}`,
      date: `${butlerStartDate} (${butlerDays} days)`,
      details: `${butlerLocation} · Languages: ${butler.languages.join(', ')}`,
      cost: total,
      status: 'Confirmed',
      invoiceNo,
    });

    setButlerBookedBanner(`Reserved ${butler.name} for ${butlerDays} days ($${total}). Added to your Bookings.`);
    setTimeout(() => setButlerBookedBanner(null), 4000);
  };

  return (
    <motion.div
      key={activeId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full text-left"
    >
      {/* ── GUIDES VIEW ────────────────────────────────────────────────── */}
      {activeId === 'guides' && (
        <div
          className={
            selectedGuide
              ? '-mx-2.5 -mt-2.5 sm:-mx-3.5 sm:-mt-3.5 md:-mx-4 md:-mt-4 -mb-4'
              : 'flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2'
          }
        >
          {selectedGuide ? (
            /* ── SOCIAL-STYLE PROFILE + ON-DEMAND SIDE BOOKING TAB ── */
            (() => {
              const stats = getGuideStats(selectedGuide);
              const reviews = guideReviews[selectedGuide.id] || [];
              const media = getGuideProfileMedia(selectedGuide.type);
              return (
                <div className="flex flex-col lg:flex-row items-stretch min-h-full bg-white">
                  {/* Main Profile Column */}
                  <div className="flex-1 min-w-0">
                    {guideBookedBanner && (
                      <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-5 py-3 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{guideBookedBanner}</span>
                      </div>
                    )}

                    {/* Cover Photo + Arrow-only Back Button */}
                    <div className="relative h-40 sm:h-52 bg-slate-200">
                      <img
                        src={media.cover}
                        alt={`${selectedGuide.type} region in Nepal`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
                      <button
                        type="button"
                        aria-label="Back to guides"
                        onClick={() => {
                          setSelectedGuide(null);
                          setShowGuideBooking(false);
                          setGuideBookedBanner(null);
                          setGuideProfileTab('about');
                        }}
                        className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#17212B] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Profile Identity Header */}
                    <div className="px-5 sm:px-6 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 relative z-10">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                          <img
                            src={selectedGuide.avatar}
                            alt={selectedGuide.name}
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-md bg-white"
                          />
                          <span
                            title={selectedGuide.status}
                            className={`absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-white ${
                              selectedGuide.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                        </div>

                        <div className="flex items-center gap-2 sm:pb-1">
                          <a
                            href={`tel:${selectedGuide.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#17212B] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#0552A2]" />
                            <span>Call</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setShowGuideBooking((prev) => !prev)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                              showGuideBooking
                                ? 'bg-[#17212B] text-white'
                                : 'bg-[#0552A2] hover:bg-[#044080] text-white'
                            }`}
                          >
                            <span>
                              {showGuideBooking ? 'Hide Booking' : `Book · $${selectedGuide.pricePerDay}/day`}
                            </span>
                          </button>
                        </div>
                      </div>

                        <div className="mt-3">
                          <div className="flex items-center gap-1.5">
                            <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-[#17212B]">
                              {selectedGuide.name}
                            </h2>
                            <BadgeCheck className="w-5 h-5 text-[#0552A2] shrink-0" aria-label="Verified Guide" />
                          </div>
                          <p className="text-sm text-[#334155] mt-0.5">
                            {selectedGuide.type} Specialist · {media.base}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1 font-semibold text-[#17212B]">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {stats.avgRating}
                              <span className="font-normal text-[#64748B]">
                                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                              </span>
                            </span>
                            <span>{selectedGuide.experience} years experience</span>
                            <span>{selectedGuide.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Profile Tabs (Facebook / Instagram / LinkedIn style) */}
                      <div className="flex border-t border-b border-slate-100 px-5 sm:px-6 gap-6">
                        {[
                          { id: 'about' as const, label: 'About' },
                          { id: 'photos' as const, label: 'Expeditions' },
                          { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
                        ].map((tab) => {
                          const active = guideProfileTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setGuideProfileTab(tab.id)}
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
                        {guideProfileTab === 'about' && (
                          <div className="space-y-5">
                            <div>
                              <h3 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-1.5">
                                Bio
                              </h3>
                              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#475569] leading-relaxed">
                                {selectedGuide.bio}
                              </p>
                            </div>

                            {/* LinkedIn-style Experience & Credentials List */}
                            <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                              <div className="py-3 flex items-start gap-3">
                                <ShieldCheck className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-[#17212B]">
                                    Nepal Tourism Board &amp; TAAN Licensed
                                  </p>
                                  <p className="text-xs text-[#64748B] mt-0.5">
                                    Active government trekking license, wilderness first-aid trained, and altitude safety certified.
                                  </p>
                                </div>
                              </div>
                              <div className="py-3 flex items-start gap-3">
                                <Briefcase className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-[#17212B]">
                                    {selectedGuide.experience} Years Guiding in Nepal
                                  </p>
                                  <p className="text-xs text-[#64748B] mt-0.5">
                                    Daily rate (${selectedGuide.pricePerDay}) covers the guide&apos;s trail meals, lodge accommodation, and insurance.
                                  </p>
                                </div>
                              </div>
                              <div className="py-3 flex items-start gap-3">
                                <Globe className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-[#17212B]">Languages</p>
                                  <p className="text-xs text-[#64748B] mt-0.5">
                                    {selectedGuide.languages.join(' · ')}
                                  </p>
                                </div>
                              </div>
                              <div className="py-3 flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-[#17212B]">Base &amp; Direct Contact</p>
                                  <p className="text-xs text-[#64748B] mt-0.5">
                                    {media.base} · {selectedGuide.phone}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {guideProfileTab === 'photos' && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-[#0552A2]" />
                                <span>Recent routes &amp; regions led by {selectedGuide.name}</span>
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {media.gallery.map((photo) => (
                                <div
                                  key={photo.label}
                                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100"
                                >
                                  <img
                                    src={photo.src}
                                    alt={photo.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5">
                                    <span className="text-[11px] font-medium text-white">
                                      {photo.label}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {guideProfileTab === 'reviews' && (
                          <div>
                            <form
                              onSubmit={handleSubmitReview}
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
                                  placeholder={`Write a review for ${selectedGuide.name}...`}
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
                                  No reviews yet. Be the first to review {selectedGuide.name}.
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
                  </div>

                  {/* Right: Side Booking Tab (opens when Book is pressed) */}
                  {showGuideBooking && (
                    <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/40 p-5 sm:p-6 space-y-4">
                      <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                            Book {selectedGuide.name}
                          </h3>
                          <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#0552A2]">
                            ${selectedGuide.pricePerDay}
                            <span className="text-xs font-normal text-slate-500"> / day</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label="Close booking tab"
                          onClick={() => setShowGuideBooking(false)}
                          className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <label className="flex flex-col gap-1">
                          <span className="font-semibold text-[#17212B]">Route / Trek</span>
                          <select
                            value={hireRoute}
                            onChange={(e) => setHireRoute(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                          >
                            {ROUTE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex flex-col gap-1">
                            <span className="font-semibold text-[#17212B]">Start Date</span>
                            <input
                              type="date"
                              value={hireStartDate}
                              onChange={(e) => setHireStartDate(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="font-semibold text-[#17212B]">Duration</span>
                            <select
                              value={hireDays}
                              onChange={(e) => setHireDays(Number(e.target.value))}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                            >
                              {[1, 2, 3, 5, 7, 10, 14, 21].map((d) => (
                                <option key={d} value={d}>
                                  {d} {d === 1 ? 'day' : 'days'}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex flex-col gap-1">
                            <span className="font-semibold text-[#17212B]">Travelers</span>
                            <select
                              value={hireGroupSize}
                              onChange={(e) => setHireGroupSize(Number(e.target.value))}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                            >
                              {[1, 2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'traveler' : 'travelers'}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="font-semibold text-[#17212B]">Meeting Point</span>
                            <select
                              value={hireMeetingPoint}
                              onChange={(e) => setHireMeetingPoint(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                            >
                              <option value="Kathmandu (Thamel)">Kathmandu (Thamel)</option>
                              <option value="Kathmandu Airport (TIA)">Kathmandu Airport (TIA)</option>
                              <option value="Pokhara (Lakeside)">Pokhara (Lakeside)</option>
                              <option value="Lukla / Trailhead">Lukla / Trailhead</option>
                            </select>
                          </label>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex justify-between text-slate-600">
                            <span>
                              ${selectedGuide.pricePerDay} × {hireDays} days
                            </span>
                            <span className="font-semibold text-[#17212B]">
                              ${selectedGuide.pricePerDay * hireDays}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Guide food &amp; mountain lodging</span>
                            <span>Included</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-200/70 font-bold text-[#17212B]">
                            <span>Total Estimate</span>
                            <span className="font-[family-name:var(--font-quicksand)] text-base text-[#0552A2]">
                              ${selectedGuide.pricePerDay * hireDays}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleHireGuide(selectedGuide, hireDays)}
                          className="w-full bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                        >
                          Confirm Guide Booking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            /* ── GUIDES DIRECTORY LIST ── */
            <>
              <div className="flex flex-col gap-1 pb-3 border-b border-slate-200/70">
                <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                  Licensed Guides &amp; Sherpas
                </h2>
                <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563]">
                  Licensed guides are required on major Nepal trekking routes. Compare experience, languages, and verified traveler reviews.
                </p>
              </div>

              {guideBookedBanner && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{guideBookedBanner}</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
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
                      Showing <strong className="text-[#0552A2]">{filteredGuides.length}</strong>{' '}
                      {filteredGuides.length === 1 ? 'guide' : 'guides'}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                              <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] group-hover:text-[#0552A2] transition-colors truncate">
                                {guide.name}
                              </h3>
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {stats.avgRating}
                              </span>
                            </div>

                            <div className="flex flex-col items-start gap-1 mt-1">
                              <span className="text-[11px] font-semibold text-[#0552A2] bg-[#0552A2]/8 px-2 py-0.5 rounded-md">
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

                        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#475569] leading-relaxed line-clamp-2 mt-3 min-h-[2.4rem]">
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
                          <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                            ${guide.pricePerDay}
                          </span>
                          <span className="text-xs text-[#64748B]"> / day</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGuide(guide);
                          }}
                          className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          View &amp; Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredGuides.length === 0 && (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-2">
                  <p className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                    No guides matched your search
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Try clearing your search or selecting another specialty.
                  </p>
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
            </>
          )}
        </div>
      )}

      {/* ── BUTLER VIEW (SOCIAL PROFILE + ON-DEMAND BOOKING TAB) ─────────── */}
      {activeId === 'butler' && (
        <div
          className={
            selectedButler
              ? '-mx-2.5 -mt-2.5 sm:-mx-3.5 sm:-mt-3.5 md:-mx-4 md:-mt-4 -mb-4'
              : 'flex flex-col gap-6 max-w-[1440px] w-full mx-auto py-2'
          }
        >
          {selectedButler ? (
            <div className="flex flex-col lg:flex-row items-stretch min-h-full bg-white">
              {/* Left: Social-style Concierge Profile */}
              <div className="flex-1 min-w-0">
                {butlerBookedBanner && (
                  <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-5 py-3 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{butlerBookedBanner}</span>
                  </div>
                )}

                <div className="relative h-40 sm:h-52 bg-slate-200">
                  <img
                    src="/pictures/pkr_ss_leisure_1624443753_resized1920-1625157322.jpeg"
                    alt="Nepal concierge hospitality"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
                  <button
                    type="button"
                    aria-label="Back to concierges"
                    onClick={() => {
                      setSelectedButler(null);
                      setShowButlerBooking(false);
                      setButlerBookedBanner(null);
                      setButlerProfileTab('about');
                    }}
                    className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#17212B] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-5 sm:px-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 relative z-10">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                      <img
                        src={selectedButler.avatar}
                        alt={selectedButler.name}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-md bg-white"
                      />
                      <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowButlerBooking((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto ${
                        showButlerBooking
                          ? 'bg-[#17212B] text-white'
                          : 'bg-[#0552A2] hover:bg-[#044080] text-white'
                      }`}
                    >
                      <span>
                        {showButlerBooking ? 'Hide Booking' : `Reserve · $${selectedButler.pricePerDay}/day`}
                      </span>
                    </button>
                  </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold text-[#17212B]">
                          {selectedButler.name}
                        </h2>
                        <BadgeCheck className="w-5 h-5 text-[#0552A2] shrink-0" aria-label="Verified Concierge" />
                      </div>
                      <p className="text-sm text-[#334155] mt-0.5">
                        {selectedButler.specialty} · Kathmandu &amp; Pokhara
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1 font-semibold text-[#17212B]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {getButlerStats(selectedButler).avgRating}
                        </span>
                        <span>{selectedButler.experience} years experience</span>
                        <span>{selectedButler.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t border-b border-slate-100 px-5 sm:px-6 gap-6">
                    {[
                      { id: 'about' as const, label: 'About' },
                      { id: 'services' as const, label: 'Included Services' },
                      { id: 'reviews' as const, label: `Reviews (${(butlerReviews[selectedButler.id] || []).length})` },
                    ].map((tab) => {
                      const active = butlerProfileTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setButlerProfileTab(tab.id)}
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

                  <div className="p-5 sm:p-6">
                    {butlerProfileTab === 'about' && (
                      <div className="space-y-4">
                        <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {selectedButler.bio}
                        </p>
                        <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                          <div className="py-3 flex items-start gap-3">
                            <Briefcase className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-[#17212B]">
                                {selectedButler.experience} Years Hospitality &amp; Trip Logistics
                              </p>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                Airport fast-track, domestic flight rebooking, SIM/currency setup, and gear rentals in Thamel.
                              </p>
                            </div>
                          </div>
                          <div className="py-3 flex items-start gap-3">
                            <Globe className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-[#17212B]">Languages</p>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {selectedButler.languages.join(' · ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {butlerProfileTab === 'services' && (
                      <ul className="space-y-2.5 text-xs text-[#475569]">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>TIA airport pickup coordination, local NTC/Ncell eSIM, and forex guidance.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Lukla / Pokhara flight weather rebooking and hotel luggage storage while trekking.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Direct dining reservations, heritage site tickets, and private vehicle dispatch.</span>
                        </li>
                      </ul>
                    )}

                    {butlerProfileTab === 'reviews' && (() => {
                      const bReviews = butlerReviews[selectedButler.id] || [];
                      return (
                        <div>
                          <form
                            onSubmit={handleSubmitButlerReview}
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
                                placeholder={`Write a review for ${selectedButler.name}...`}
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
                            {bReviews.length === 0 ? (
                              <p className="text-sm text-[#64748B] py-3">
                                No reviews yet. Be the first to review {selectedButler.name}.
                              </p>
                            ) : (
                              bReviews.map((rev) => (
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
                      );
                    })()}
                  </div>
                </div>

                {/* Right: Side Reservation Tab (opens when Reserve is pressed) */}
                {showButlerBooking && (
                  <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/40 p-5 sm:p-6 space-y-4 text-xs">
                    <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                          Reserve Concierge
                        </h3>
                        <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#0552A2]">
                          ${selectedButler.pricePerDay}
                          <span className="text-xs font-normal text-slate-500"> / day</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Close reservation tab"
                        onClick={() => setShowButlerBooking(false)}
                        className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-semibold text-[#17212B]">Start Date</span>
                      <input
                        type="date"
                        value={butlerStartDate}
                        onChange={(e) => setButlerStartDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-semibold text-[#17212B]">Days</span>
                      <select
                        value={butlerDays}
                        onChange={(e) => setButlerDays(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                      >
                        {[1, 2, 3, 5, 7, 10].map((d) => (
                          <option key={d} value={d}>
                            {d} {d === 1 ? 'day' : 'days'}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="font-semibold text-[#17212B]">City / Location</span>
                    <select
                      value={butlerLocation}
                      onChange={(e) => setButlerLocation(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                    >
                      <option value="Kathmandu (Thamel)">Kathmandu (Thamel)</option>
                      <option value="Pokhara (Lakeside)">Pokhara (Lakeside)</option>
                      <option value="Khumbu Mountain Lodge">Khumbu Mountain Lodge</option>
                    </select>
                  </label>

                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex justify-between items-center font-bold text-[#17212B]">
                    <span>Total ({butlerDays} days)</span>
                    <span className="font-[family-name:var(--font-quicksand)] text-base text-[#0552A2]">
                      ${selectedButler.pricePerDay * butlerDays}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHireButler(selectedButler)}
                    className="w-full bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Confirm Reservation
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1 pb-3 border-b border-slate-200/70">
                <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                  Personal Concierge &amp; Butlers
                </h2>
                <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563]">
                  Book local concierge support for TIA airport arrival, transit coordination, and lodge hospitality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {BUTLERS.map((butler) => (
                  <div
                    key={butler.id}
                    onClick={() => setSelectedButler(butler)}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-[#0552A2]/50 hover:shadow-md transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <div>
                      <div className="flex gap-3.5 items-start">
                        <img
                          src={butler.avatar}
                          alt={butler.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B] truncate">
                              {butler.name}
                            </h3>
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {butler.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-[#0552A2] block mt-0.5">
                            {butler.specialty}
                          </span>
                          <span className="text-[11px] text-[#64748B] block mt-0.5">
                            {butler.experience} yrs exp
                          </span>
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#475569] leading-relaxed line-clamp-2 mt-3">
                        {butler.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {butler.languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-[11px] text-[#475569] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3.5">
                      <div>
                        <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                          ${butler.pricePerDay}
                        </span>
                        <span className="text-xs text-[#64748B]"> / day</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedButler(butler);
                        }}
                        className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        View &amp; Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PERMITS VIEW ───────────────────────────────────────────────── */}
      {activeId === 'permits' && (() => {
        const pq = permitSearch.trim().toLowerCase();
        const filteredPermits = permits.filter(
          (p) =>
            !pq ||
            p.zone.toLowerCase().includes(pq) ||
            p.type.toLowerCase().includes(pq) ||
            p.status.toLowerCase().includes(pq) ||
            p.passportNumber.toLowerCase().includes(pq)
        );

        if (isApplyingPermit) {
          const stepPercent = permitStep === 1 ? '33%' : permitStep === 2 ? '66%' : '100%';
          return (
            <div className="max-w-[1440px] w-full mx-auto py-2 flex flex-col gap-6">
              {/* Top Header + Arrow Back */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Back to permits"
                    onClick={() => {
                      setIsApplyingPermit(false);
                      setPermitStep(1);
                    }}
                    className="p-1.5 text-[#17212B] hover:text-[#0552A2] transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl font-bold tracking-tight text-[#17212B]">
                      New Permit Application
                    </h2>
                    <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
                      Complete each step in order to issue your Nepal trekking or park permit.
                    </p>
                  </div>
                </div>

                {/* Strict Step-by-Step Progress (cannot jump ahead) */}
                <div className="flex flex-col gap-1.5 sm:w-80">
                  <div className="flex items-center justify-between text-xs font-[family-name:var(--font-quicksand)] font-bold">
                    {[
                      { step: 1 as const, label: '1. Permit' },
                      { step: 2 as const, label: '2. Details' },
                      { step: 3 as const, label: '3. Payment' },
                    ].map((s) => {
                      const isCurrent = permitStep === s.step;
                      const isDone = permitStep > s.step;
                      return (
                        <span
                          key={s.step}
                          className={
                            isCurrent
                              ? 'text-[#0552A2]'
                              : isDone
                                ? 'text-emerald-600'
                                : 'text-slate-400'
                          }
                        >
                          {isDone ? `✓ ${s.label}` : s.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0552A2] transition-all duration-300"
                      style={{ width: stepPercent }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 1: Permit Type (Full-width 2-col interactive layout) */}
              {permitStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 divide-y divide-slate-100">
                    {PERMIT_CATALOG.map((item) => {
                      const isSelected = selectedPermitId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedPermitId(item.id);
                            setZone(item.label);
                            setPermitType(item.type);
                          }}
                          className={`w-full text-left px-3.5 py-3.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#0552A2]/[0.06]' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#0552A2]' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-[#0552A2]" />}
                            </span>
                            <div className="min-w-0">
                              <p className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] truncate">
                                {item.label}
                              </p>
                              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B] mt-0.5">
                                {item.type} · {item.processingTime}
                              </p>
                            </div>
                          </div>

                          <span className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#0552A2] shrink-0">
                            ${item.fee}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Live Permit Summary & Continue */}
                  <div className="lg:col-span-5 lg:sticky lg:top-6 bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 font-[family-name:var(--font-ibm-plex-sans)]">
                    <div>
                      <span className="text-[11px] font-semibold text-[#0552A2] block">
                        {selectedPermitMeta.type}
                      </span>
                      <h3 className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#17212B] mt-0.5">
                        {selectedPermitMeta.label}
                      </h3>
                      <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                        {selectedPermitMeta.notes}
                      </p>
                    </div>

                    <div className="divide-y divide-slate-200/70 border-t border-slate-200/70 text-xs">
                      <div className="py-2.5 flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#17212B] block">Issuing Authority</span>
                          <span className="text-[#475569]">{selectedPermitMeta.authority}</span>
                        </div>
                      </div>
                      <div className="py-2.5 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#0552A2] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#17212B] block">Guide Policy</span>
                          <span className="text-[#475569]">{selectedPermitMeta.guideRequired}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/70 pt-3 text-xs space-y-1.5">
                      <span className="font-semibold text-[#17212B] block">Required Documents</span>
                      {selectedPermitMeta.docs.map((doc) => (
                        <div key={doc} className="flex items-center gap-1.5 text-[#475569]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200/70 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Base Fee</span>
                        <span className="font-[family-name:var(--font-quicksand)] text-xl font-bold text-[#0552A2]">
                          ${selectedPermitMeta.fee}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPermitStep(2)}
                        className="bg-[#0552A2] hover:bg-[#044080] text-white font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Continue to Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Applicant & Trip Details + Live Pass Preview */}
              {permitStep === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPermitStep(3);
                  }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs font-[family-name:var(--font-ibm-plex-sans)]"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Applicant Full Name (as on Passport)</label>
                        <input
                          type="text"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Passport Number</label>
                        <input
                          type="text"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Nationality</label>
                        <input
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Region / Conservation Area</label>
                        <input
                          type="text"
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Entry Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Exit Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={docsConfirmed}
                        onChange={(e) => setDocsConfirmed(e.target.checked)}
                        required
                        className="mt-0.5 rounded border-slate-300 text-[#0552A2] focus:ring-[#0552A2]"
                      />
                      <span className="text-xs text-[#475569] leading-relaxed">
                        I confirm my passport details are accurate and I will carry original passport, visa, and required photos to the checkpoint.
                      </span>
                    </label>
                  </div>

                  {/* Live Pass Preview */}
                  <div className="lg:col-span-5 bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                      <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                        Live Pass Preview
                      </span>
                      <span className="text-[11px] font-semibold text-[#0552A2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {permitDurationDays} {permitDurationDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Permit</span>
                        <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#17212B] text-sm">
                          {zone}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-[#64748B] block">Applicant</span>
                          <span className="font-semibold text-[#17212B]">{applicantName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#64748B] block">Passport</span>
                          <span className="font-semibold text-[#17212B]">{passportNumber || '—'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-[#64748B] block">Nationality</span>
                          <span className="font-semibold text-[#17212B]">{nationality || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#64748B] block">Dates</span>
                          <span className="font-semibold text-[#17212B]">
                            {startDate} → {endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/70 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Calculated Fee</span>
                        <span className="font-[family-name:var(--font-quicksand)] text-xl font-bold text-[#0552A2]">
                          ${computedPermitFee}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPermitStep(1)}
                          className="text-xs font-semibold text-[#475569] hover:text-[#17212B] px-3 py-2 rounded-lg cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="bg-[#0552A2] hover:bg-[#044080] text-white font-[family-name:var(--font-quicksand)] font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors text-xs"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Payment & Submit */}
              {permitStep === 3 && (
                <form
                  onSubmit={handleApplyPermit}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs font-[family-name:var(--font-ibm-plex-sans)]"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] block">
                      Select Payment Method
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'esewa' as const, label: 'eSewa / Khalti', sub: 'Instant QR / Wallet' },
                        { id: 'card' as const, label: 'Visa / Mastercard', sub: 'International Card' },
                        { id: 'counter' as const, label: 'NTB Counter', sub: 'Pay NPR at Desk' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPermitPaymentMethod(m.id)}
                          className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                            permitPaymentMethod === m.id
                              ? 'bg-[#0552A2]/[0.05] border-[#0552A2]'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#17212B] block">
                            {m.label}
                          </span>
                          <span className="text-[11px] text-[#64748B]">{m.sub}</span>
                        </button>
                      ))}
                    </div>

                    {permitPaymentMethod === 'esewa' && (
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">eSewa / Khalti Mobile ID</label>
                        <input
                          type="text"
                          value={paymentRefInput}
                          onChange={(e) => setPaymentRefInput(e.target.value)}
                          placeholder="98XXXXXXXX"
                          required
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                        />
                      </div>
                    )}

                    {permitPaymentMethod === 'card' && (
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#17212B]">Card Number</label>
                        <input
                          type="text"
                          value={paymentRefInput}
                          onChange={(e) => setPaymentRefInput(e.target.value)}
                          placeholder="4242 •••• •••• 4242"
                          required
                          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0552A2] text-[#17212B]"
                        />
                      </div>
                    )}

                    {permitPaymentMethod === 'counter' && (
                      <p className="text-xs text-[#475569] bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 leading-relaxed">
                        Your application will be queued for payment in NPR cash at {selectedPermitMeta.issuingLocations}.
                      </p>
                    )}
                  </div>

                  {/* Application Receipt & Submit */}
                  <div className="lg:col-span-5 bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] border-b border-slate-200/70 pb-3">
                      Application Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between gap-2">
                        <span className="text-[#64748B]">Permit</span>
                        <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#17212B] text-right">
                          {zone}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#64748B]">Applicant</span>
                        <span className="font-medium text-[#17212B]">
                          {applicantName} ({passportNumber})
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#64748B]">Validity</span>
                        <span className="font-medium text-[#17212B]">
                          {startDate} to {endDate} ({permitDurationDays}d)
                        </span>
                      </div>
                      <div className="flex justify-between gap-2 pt-2 border-t border-slate-200/80">
                        <span className="font-semibold text-[#17212B]">Total Fee</span>
                        <span className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#0552A2]">
                          ${computedPermitFee}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setPermitStep(2)}
                        className="text-xs font-semibold text-[#475569] hover:text-[#17212B] px-3 py-2 rounded-lg cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-[#0552A2] hover:bg-[#044080] text-white font-[family-name:var(--font-quicksand)] font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors text-xs"
                      >
                        {permitPaymentMethod === 'counter'
                          ? 'Submit Application'
                          : `Pay $${computedPermitFee} & Submit`}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6 max-w-[1440px] w-full mx-auto pt-2 pb-0 min-h-[calc(100vh-5.5rem)]">
            {/* Header (left) + Search (right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                  Trekking &amp; Park Permits
                </h2>
                <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1">
                  Manage your active Nepal trekking passes and national park entry permits.
                </p>
              </div>

              <div className="relative w-full md:w-80 lg:w-96 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={permitSearch}
                  onChange={(e) => setPermitSearch(e.target.value)}
                  placeholder="Search permits by region, type, or status..."
                  className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-9 py-2.5 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] transition-colors"
                />
                {permitSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setPermitSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {permitSubmittedMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{permitSubmittedMsg}</span>
              </div>
            )}

            {/* Clean Active Permits List */}
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {filteredPermits.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                    No permits found
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#64748B]">
                    Tap the + button below to apply for a trekking or national park permit.
                  </p>
                </div>
              ) : (
                filteredPermits.map((permit) => {
                  const isExpanded = expandedPermitId === permit.id;
                  return (
                    <div key={permit.id} className="py-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] font-medium text-[#0552A2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                              {permit.type}
                            </span>
                            <span
                              className={`font-[family-name:var(--font-ibm-plex-sans)] text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                permit.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {permit.status}
                            </span>
                          </div>
                          <h4 className="font-[family-name:var(--font-quicksand)] text-base font-bold mt-2 text-[#17212B]">
                            {permit.zone}
                          </h4>
                          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs text-[#475569] mt-0.5">
                            {permit.applicantName} · Passport: {permit.passportNumber}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] text-[#64748B] mt-0.5">
                            Valid: {permit.startDate} to {permit.endDate}
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2 shrink-0">
                          <span className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                            ${permit.cost}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleDownloadPermit(permit)}
                              className="inline-flex items-center gap-1 font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#475569] hover:text-[#0552A2] cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setExpandedPermitId(isExpanded ? null : permit.id)}
                              className="inline-flex items-center gap-1 font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#0552A2] hover:underline cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Pass' : 'Pass Details'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3 text-xs bg-slate-50/70 rounded-xl p-3">
                          <div className="flex items-center gap-2.5">
                            <QrCode className="w-8 h-8 text-[#0552A2] shrink-0" />
                            <div>
                              <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] text-[#64748B] block">
                                Checkpoint Reference
                              </span>
                              <span className="font-[family-name:var(--font-quicksand)] font-bold text-[#17212B]">
                                {permit.qrCode}
                              </span>
                            </div>
                          </div>
                          <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] text-[#475569] text-right">
                            Present with original passport at trailhead
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* + Issue Permit Button at Bottom-Right */}
            <div className="mt-auto pt-4 flex justify-end">
              <button
                type="button"
                aria-label="Issue permit"
                onClick={() => {
                  setPermitStep(1);
                  setIsApplyingPermit(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0552A2] hover:bg-[#044080] text-white font-[family-name:var(--font-quicksand)] text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Permit</span>
              </button>
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}
