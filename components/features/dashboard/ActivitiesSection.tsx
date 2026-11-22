"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTravelStore } from "@/store/useTravelStore";
import {
  Compass,
  Mountain,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  Zap,
  Trees,
  Landmark,
  Wind,
  Waves,
  Bike,
  Coffee,
  Check,
  Leaf,
  Binoculars,
} from "lucide-react";

interface ActivitiesSectionProps {
  activeId: string;
  onNavigate?: (id: string) => void;
}

export interface ActivityItem {
  id: string;
  section:
    | "activities"
    | "trekking"
    | "mountaineering"
    | "wildlife"
    | "cultural"
    | "ecotourism";
  title: string;
  category: string;
  difficulty:
    | "Easy"
    | "Moderate"
    | "Challenging"
    | "Technical / Extreme"
    | "Moderate to Challenging";
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
  // ── ACTIVITIES & ADVENTURE (Paragliding, Bungee, Zip-line, Rafting, etc.) ──
  {
    id: "paragliding-pokhara",
    section: "activities",
    title: "Paragliding from Sarangkot",
    category: "Aerial",
    difficulty: "Easy",
    duration: "30 – 45 mins",
    maxAltitude: "1,600m",
    region: "Pokhara (Sarangkot)",
    season: "Sep – May",
    estimatedCost: 95,
    image: "/pictures/Pokhara_ss_lt_(4)-1624818140.jpg",
    description:
      "Take off from Sarangkot ridge above Phewa Lake with a certified tandem pilot and soar alongside the Annapurna range.",
    highlights: [
      "30-minute tandem thermal flight over Phewa Lake",
      "Panoramic views of Machapuchare (Fishtail)",
      "Hotel pickup & drop-off in Lakeside Pokhara",
    ],
    permits: ["Civil Aviation Paragliding Clearance"],
    gearRequirement: "Windproof jacket, closed-toe shoes, sunglasses",
    guideRequirement: "APPI / FAI Certified Tandem Pilot",
  },
  {
    id: "bungee-kushma",
    section: "activities",
    title: "Bungee Jumping (Kushma & Bhote Koshi)",
    category: "Adventure",
    difficulty: "Moderate",
    duration: "Half Day",
    maxAltitude: "228m Drop",
    region: "Kushma / Sindhupalchok",
    season: "Year-round",
    estimatedCost: 110,
    image: "/pictures/Pokhara_oy_lt_(2)-1624817867.jpg",
    description:
      "Leap from one of the world’s highest cliff-top suspension bungee bridges over the Kali Gandaki or Bhote Koshi river gorge.",
    highlights: [
      "228m Kushma Cliff jump or 160m Bhote Koshi canyon jump",
      "International safety harness & double-check system",
      "Optional canyon swing combo available on site",
    ],
    permits: ["On-site safety waiver & registration"],
    gearRequirement: "Comfortable athletic clothing and secure sneakers",
    guideRequirement: "Certified Jump Master & Safety Crew",
  },
  {
    id: "zipline-pokhara",
    section: "activities",
    title: "HighGround Zip-Liner Pokhara",
    category: "Aerial",
    difficulty: "Easy",
    duration: "2 hours",
    maxAltitude: "1,625m",
    region: "Sarangkot · Pokhara",
    season: "Year-round",
    estimatedCost: 85,
    image: "/pictures/poonhill_pg_adventure-1624431033.jpeg",
    description:
      "Ride one of the steepest and longest zip-lines in the world, dropping 600 meters vertically at speeds over 100 km/h.",
    highlights: [
      "1.8 km zip-line from Sarangkot to Hemja",
      "Direct views of the Annapurna massif during descent",
      "Shuttle transfer from Pokhara Lakeside",
    ],
    permits: ["Included in activity pass"],
    gearRequirement: "Secure footwear, no loose scarves",
    guideRequirement: "Trained Zip-Line Operations Team",
  },
  {
    id: "rafting-trishuli",
    section: "activities",
    title: "Trishuli & Bhote Koshi Whitewater Rafting",
    category: "Water",
    difficulty: "Moderate",
    duration: "1 – 2 Days",
    maxAltitude: "950m",
    region: "Trishuli / Bhote Koshi",
    season: "Sep – Dec & Mar – May",
    estimatedCost: 75,
    image: "/pictures/Pokhara_oy_lt_(2)-1624817867.jpg",
    description:
      "Navigate Class III–IV glacial river rapids through steep Himalayan gorges with riverside lunch or overnight beach camp.",
    highlights: [
      "Class III–IV rapids with full safety kayak support",
      "Riverside lunch and optional canyon cliff jumps",
      "Life jacket, helmet, paddle & dry bags provided",
    ],
    permits: ["Nepal River Rafting Permit"],
    gearRequirement: "Quick-dry shorts/shirt, river sandals, sunscreen",
    guideRequirement: "IRF Certified River Guide & Safety Kayaker",
  },
  {
    id: "ultralight-pokhara",
    section: "activities",
    title: "Ultralight Flight over Pokhara Valley",
    category: "Aerial",
    difficulty: "Easy",
    duration: "30 – 60 mins",
    maxAltitude: "3,500m",
    region: "Pokhara Airport",
    season: "Sep – May",
    estimatedCost: 140,
    image: "/pictures/annapurna-1624804396.jpg",
    description:
      "Fly in a light two-seat aircraft directly toward the Annapurna and Dhaulagiri ridges at sunrise.",
    highlights: [
      "Close-up aerial views of Machapuchare & Annapurna South",
      "15, 30, or 60-minute flight options",
      "Early morning smooth-air departure",
    ],
    permits: ["CAAN Aviation Clearance"],
    gearRequirement: "Warm windproof jacket (cool at altitude)",
    guideRequirement: "Licensed Ultralight Captain",
  },
  {
    id: "mountain-biking",
    section: "activities",
    title: "Kathmandu Valley & Mustang Mountain Biking",
    category: "Cycling",
    difficulty: "Moderate",
    duration: "1 – 3 Days",
    maxAltitude: "2,200m",
    region: "Shivapuri / Nagarkot / Pokhara",
    season: "Oct – May",
    estimatedCost: 120,
    image: "/pictures/Ghale_Gaon_Photo_001-1634812841.jpg",
    description:
      "Ride terraced ridge trails, pine forests, and rural Newari villages around the Kathmandu rim or Pokhara valley.",
    highlights: [
      "Full-suspension mountain bike & helmet included",
      "Ride through Shivapuri National Park & Nagarkot ridge",
      "Support vehicle for uphill transfers on day tours",
    ],
    permits: ["Shivapuri National Park Entry"],
    gearRequirement: "Cycling gloves, athletic shoes, hydration pack",
    guideRequirement: "Certified Trail Bike Guide",
  },
  {
    id: "canyoning-jalabire",
    section: "activities",
    title: "Jalabire & Sundarijal Waterfall Canyoning",
    category: "Water",
    difficulty: "Moderate",
    duration: "Full Day",
    maxAltitude: "1,100m",
    region: "Chitwan Highway / Kathmandu",
    season: "Sep – Jun",
    estimatedCost: 90,
    image: "/pictures/Chitwan_ss_lt_(17)-1624813756.jpg",
    description:
      "Abseil down cascading canyon waterfalls, slide down natural rock chutes, and jump into crystal-clear emerald pools.",
    highlights: [
      "Multiple waterfall rappels up to 45 meters",
      "Wetsuit, harness, helmet, and ropes provided",
      "Ideal day trip between Kathmandu and Chitwan/Pokhara",
    ],
    permits: ["Local Canyon Access Fee"],
    gearRequirement: "Swimwear, towel, spare dry clothes",
    guideRequirement: "Certified Canyoning Instructor",
  },
  {
    id: "everest-heli-flight",
    section: "activities",
    title: "Everest Scenic Helicopter Flight",
    category: "Aerial",
    difficulty: "Easy",
    duration: "4 hours",
    maxAltitude: "5,545m",
    region: "Kathmandu – Khumbu",
    season: "Year-round",
    estimatedCost: 1250,
    image: "/pictures/everest_(1)-1624869402.jpg",
    description:
      "Fly from Kathmandu into the heart of the Khumbu with a brief landing near Kala Patthar and breakfast at Hotel Everest View.",
    highlights: [
      "Close-up views of Mount Everest, Lhotse & Ama Dablam",
      "Stopover at Hotel Everest View (3,880m)",
      "Return to Kathmandu the same morning",
    ],
    permits: ["Sagarmatha National Park Entry"],
    gearRequirement: "Down jacket, sunglasses, warm gloves",
    guideRequirement: "Experienced High-Altitude Helicopter Pilot",
  },

  // ── TREKKING PLACES ──
  {
    id: "trek-ebc",
    section: "trekking",
    title: "Everest Base Camp (Khumbu)",
    category: "Classic Trek",
    difficulty: "Challenging",
    duration: "12 – 14 Days",
    maxAltitude: "5,364m",
    region: "Solukhumbu · Koshi",
    season: "Mar – May & Oct – Dec",
    estimatedCost: 1350,
    image: "/pictures/Everest_tk_trekker_(5)-1630474503.jpg",
    description:
      "The classic Himalayan trek through Namche Bazaar, Tengboche Monastery, and Lobuche to Everest Base Camp and Kala Patthar.",
    highlights: [
      "Sunrise from Kala Patthar (5,545m) facing Everest",
      "Acclimatization days in Namche Bazaar & Dingboche",
      "Suspension bridges & Sherpa mountain villages",
    ],
    permits: [
      "Sagarmatha National Park Permit",
      "Khumbu Rural Municipality Fee",
      "TIMS Card",
    ],
    gearRequirement: "Layered thermal kit, -10°C sleeping bag, trekking boots",
    guideRequirement: "Licensed Trekking Guide + Optional Porter",
  },
  {
    id: "trek-abc",
    section: "trekking",
    title: "Annapurna Base Camp (Sanctuary)",
    category: "Classic Trek",
    difficulty: "Moderate",
    duration: "7 – 10 Days",
    maxAltitude: "4,130m",
    region: "Kaski · Gandaki",
    season: "Mar – May & Oct – Dec",
    estimatedCost: 780,
    image: "/pictures/annapurna-1624804396.jpg",
    description:
      "Walk from terraced Gurung villages and rhododendron forests into the glacial amphitheater beneath Annapurna I and Machapuchare.",
    highlights: [
      "360° glacier bowl at Annapurna Base Camp (4,130m)",
      "Natural hot springs at Jhinu Danda",
      "Easy access from Pokhara",
    ],
    permits: ["ACAP Conservation Permit", "TIMS Card"],
    gearRequirement: "Waterproof shell, warm fleece, broken-in boots",
    guideRequirement: "Licensed Guide Recommended / Required",
  },
  {
    id: "trek-langtang",
    section: "trekking",
    title: "Langtang Valley & Kyanjin Ri",
    category: "Valley Trek",
    difficulty: "Moderate",
    duration: "7 – 9 Days",
    maxAltitude: "4,773m",
    region: "Rasuwa · Bagmati",
    season: "Mar – May & Oct – Nov",
    estimatedCost: 650,
    image: "/pictures/poonhill_pg_adventure-1624431033.jpeg",
    description:
      "Nepal’s closest high-mountain valley trek from Kathmandu, rich in Tamang culture, yak pastures, and glacier viewpoints.",
    highlights: [
      "No domestic flight required (drive from Kathmandu)",
      "Panoramic hike up Kyanjin Ri (4,773m)",
      "Kyanjin Gompa monastery & local yak cheese",
    ],
    permits: ["Langtang National Park Permit", "TIMS Card"],
    gearRequirement: "Warm down layer, trekking poles, daypack",
    guideRequirement: "Licensed Trekking Guide",
  },
  {
    id: "trek-manaslu",
    section: "trekking",
    title: "Manaslu Circuit & Larkya La Pass",
    category: "Circuit Trek",
    difficulty: "Challenging",
    duration: "13 – 16 Days",
    maxAltitude: "5,160m",
    region: "Gorkha · Gandaki",
    season: "Mar – May & Sep – Nov",
    estimatedCost: 1380,
    image: "/pictures/Manaslu_View_from_Lho-1624808940.jpg",
    description:
      "A quieter, remote circuit around the world’s eighth-highest peak crossing the dramatic Larkya La high pass.",
    highlights: [
      "Cross Larkya La Pass (5,160m) with glacier views",
      "Tibetan-influenced villages of Samagaon & Samdo",
      "Birendra Lake & Pungyen Gompa side hike",
    ],
    permits: ["Manaslu Restricted Area Permit (MRAP)", "MCAP", "ACAP"],
    gearRequirement: "Microspikes, -15°C sleeping bag, 4-season layers",
    guideRequirement: "Mandatory Licensed Guide (Min. 2 Trekkers for RAP)",
  },
  {
    id: "trek-mardi",
    section: "trekking",
    title: "Mardi Himal Ridge Trek",
    category: "Short Trek",
    difficulty: "Moderate",
    duration: "5 – 7 Days",
    maxAltitude: "4,500m",
    region: "Kaski · Gandaki",
    season: "Mar – May & Oct – Dec",
    estimatedCost: 520,
    image: "/pictures/Dhaulagiri_1626729219-1635169360.jpeg",
    description:
      "A scenic ridge-line trail east of Annapurna Base Camp offering close-up sunrise views of Machapuchare.",
    highlights: [
      "Ridge walking above the clouds from High Camp",
      "Short 5–7 day duration starting from Pokhara",
      "Quiet forest trails and teahouse hospitality",
    ],
    permits: ["ACAP Conservation Permit", "TIMS Card"],
    gearRequirement: "Warm jacket, headlamp for sunrise ridge hike",
    guideRequirement: "Licensed Trekking Guide",
  },
  {
    id: "trek-mustang",
    section: "trekking",
    title: "Upper Mustang (Lo Manthang)",
    category: "Restricted Area",
    difficulty: "Moderate",
    duration: "10 – 12 Days",
    maxAltitude: "3,840m",
    region: "Mustang · Gandaki",
    season: "Apr – Nov (Monsoon-friendly)",
    estimatedCost: 1850,
    image: "/pictures/mustang_tk_people-1624440754.jpeg",
    description:
      "Explore the trans-Himalayan rain-shadow desert, ancient sky caves, and the walled medieval kingdom of Lo Manthang.",
    highlights: [
      "Dry rain-shadow climate ideal even during monsoon",
      "Walled city of Lo Manthang & Chhoser cave dwellings",
      "Ochre cliffs and centuries-old monasteries",
    ],
    permits: ["Upper Mustang Restricted Area Permit ($500)", "ACAP"],
    gearRequirement: "Sun protection, windproof layers, dust buff",
    guideRequirement: "Mandatory Licensed Guide",
  },

  // ── MOUNTAINEERING PEAKS ──
  {
    id: "peak-island",
    section: "mountaineering",
    title: "Island Peak (Imja Tse) Climb",
    category: "Trekking Peak",
    difficulty: "Challenging",
    duration: "16 – 18 Days",
    maxAltitude: "6,189m",
    region: "Khumbu · Koshi",
    season: "Apr – May & Oct – Nov",
    estimatedCost: 2200,
    image: "/pictures/Everest_tk_trekker_(5)-1630474503.jpg",
    description:
      "Nepal’s most popular 6,000m trekking peak, combining the Everest Base Camp approach with a fixed-line glacier summit push.",
    highlights: [
      "Pre-climb fixed-line & crampon training at Base Camp",
      "Summit ridge overlooking Lhotse South Face",
      "Great first Himalayan 6,000m peak",
    ],
    permits: ["NMA Island Peak Climbing Permit", "Sagarmatha National Park"],
    gearRequirement:
      "Mountaineering boots, crampons, harness, ice axe, ascender",
    guideRequirement: "Certified IFMGA / NMA Climbing Guide",
  },
  {
    id: "peak-amadablam",
    section: "mountaineering",
    title: "Ama Dablam Technical Expedition",
    category: "Expedition Peak",
    difficulty: "Technical / Extreme",
    duration: "24 – 30 Days",
    maxAltitude: "6,812m",
    region: "Khumbu · Koshi",
    season: "Apr – May & Oct – Nov",
    estimatedCost: 4500,
    image: "/pictures/everest_(1)-1624869402.jpg",
    description:
      "A classic technical rock, snow, and ice climb up the southwest ridge of one of the Himalayas’ most iconic peaks.",
    highlights: [
      "Three high camps perched along dramatic granite ridges",
      "Summit views of Everest, Lhotse, Makalu & Cho Oyu",
      "Full Sherpa rope-fixing & high-camp support",
    ],
    permits: ["Dept. of Tourism Expedition Permit", "Sagarmatha National Park"],
    gearRequirement:
      "Full technical alpine kit, 8000m/6000m double boots, down suit",
    guideRequirement: "IFMGA / UIAGM Certified Lead Climbing Sherpa",
  },
  {
    id: "peak-mera",
    section: "mountaineering",
    title: "Mera Peak Summit (Hinku Valley)",
    category: "Trekking Peak",
    difficulty: "Moderate to Challenging",
    duration: "15 – 18 Days",
    maxAltitude: "6,476m",
    region: "Solukhumbu · Koshi",
    season: "Apr – May & Oct – Nov",
    estimatedCost: 2350,
    image: "/pictures/Choyou_1626729673-1635169288.jpeg",
    description:
      "Nepal’s highest permitted trekking peak, featuring a non-technical glacier ascent with views of five 8,000m giants.",
    highlights: [
      "Panoramic summit view of Everest, Lhotse, Makalu, Cho Oyu & Kanchenjunga",
      "Gradual acclimatization through remote Hinku Valley",
      "Ideal for strong trekkers stepping into 6,000m+",
    ],
    permits: ["NMA Mera Peak Permit", "Makalu Barun National Park"],
    gearRequirement:
      "Double mountaineering boots, crampons, harness, down jacket",
    guideRequirement: "NMA Certified Climbing Guide",
  },
  {
    id: "peak-lobuche",
    section: "mountaineering",
    title: "Lobuche East Summit",
    category: "Trekking Peak",
    difficulty: "Challenging",
    duration: "16 – 18 Days",
    maxAltitude: "6,119m",
    region: "Khumbu · Koshi",
    season: "Apr – May & Oct – Nov",
    estimatedCost: 2150,
    image: "/pictures/Manaslu_View_from_Lho-1624808940.jpg",
    description:
      "A steep snow-and-ice ridge climb near Everest Base Camp with sweeping views across the Khumbu Glacier.",
    highlights: [
      "High Camp set on rocky moraine at 5,400m",
      "Steep 45° snow-and-ice fixed-rope ascent",
      "Combines smoothly with Everest Base Camp trek",
    ],
    permits: ["NMA Lobuche East Permit", "Sagarmatha National Park"],
    gearRequirement: "Crampons, ice axe, Jumar ascender, figure-8 descender",
    guideRequirement: "NMA / IFMGA Certified Climbing Guide",
  },

  // ── WILDLIFE PLACES ──
  {
    id: "wild-chitwan",
    section: "wildlife",
    title: "Chitwan National Park Safari",
    category: "UNESCO Park",
    difficulty: "Easy",
    duration: "2 – 4 Days",
    maxAltitude: "150m",
    region: "Chitwan · Bagmati",
    season: "Oct – Apr",
    estimatedCost: 340,
    image: "/pictures/Chitwan_ss_jungleactivities-1630491399.JPG",
    description:
      "Spot one-horned rhinoceros, gharial crocodiles, and Bengal tigers via jeep safari, dugout canoe, and guided jungle walks.",
    highlights: [
      "4x4 jungle jeep safari & Rapti River canoe drift",
      "High probability of one-horned rhino sightings",
      "Tharu cultural village walk & evening program",
    ],
    permits: ["Chitwan National Park Entry Permit"],
    gearRequirement: "Neutral khaki clothing, binoculars, insect repellent",
    guideRequirement: "Licensed Jungle Naturalist",
  },
  {
    id: "wild-bardia",
    section: "wildlife",
    title: "Bardia National Park Tiger Tracking",
    category: "Wilderness",
    difficulty: "Easy",
    duration: "3 – 5 Days",
    maxAltitude: "152m",
    region: "Bardiya · Lumbini",
    season: "Oct – Apr",
    estimatedCost: 420,
    image: "/pictures/Bardiya_ss_lt_(12)-1624817484.jpg",
    description:
      "Nepal’s largest undisturbed Terai wilderness, famous for quiet walking safaris and strong Royal Bengal Tiger sightings.",
    highlights: [
      "Full-day guided walking & jeep safaris along Karnali River",
      "Wild Asian elephants, Gangetic dolphins & Bengal tigers",
      "Un-crowded eco-lodges near Thakurdwara",
    ],
    permits: ["Bardia National Park Entry Permit"],
    gearRequirement: "Neutral-toned breathable clothes, 8x42 binoculars",
    guideRequirement: "Senior Wildlife Tracker & Naturalist",
  },
  {
    id: "wild-koshi",
    section: "wildlife",
    title: "Koshi Tappu Wildlife Reserve",
    category: "Birding & Wetlands",
    difficulty: "Easy",
    duration: "2 – 3 Days",
    maxAltitude: "90m",
    region: "Sunsari · Koshi",
    season: "Nov – Mar",
    estimatedCost: 260,
    image: "/pictures/Chitwan_ss_lt_(17)-1624813756.jpg",
    description:
      "Premier wetland sanctuary in eastern Nepal home to over 500 bird species, wild water buffalo (Arna), and river dolphins.",
    highlights: [
      "Over 500 migratory and resident bird species",
      "Last remaining wild water buffalo habitat in Nepal",
      "Peaceful boat rides on the Koshi River",
    ],
    permits: ["Koshi Tappu Reserve Permit"],
    gearRequirement: "Spotting scope / binoculars, sun hat, light jacket",
    guideRequirement: "Ornithologist / Wetland Naturalist",
  },

  // ── CULTURAL & RELIGIOUS PLACES ──
  {
    id: "cult-ktm",
    section: "cultural",
    title: "Kathmandu, Patan & Bhaktapur Heritage",
    category: "UNESCO World Heritage",
    difficulty: "Easy",
    duration: "1 – 3 Days",
    maxAltitude: "1,400m",
    region: "Kathmandu Valley",
    season: "Year-round",
    estimatedCost: 140,
    image:
      "/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg",
    description:
      "Walk medieval brick courtyards, pagoda temples, and Newari woodcarving squares across the valley’s three royal cities.",
    highlights: [
      "Bhaktapur Nyatapola Temple & Pottery Square",
      "Patan Museum & Golden Temple (Hiranya Varna)",
      "Kathmandu Durbar Square & Kumari Ghar",
    ],
    permits: ["Municipal Heritage Site Tickets"],
    gearRequirement: "Comfortable walking shoes, modest attire",
    guideRequirement: "Licensed Cultural Heritage Guide",
  },
  {
    id: "cult-lumbini",
    section: "cultural",
    title: "Lumbini Sacred Garden (Birthplace of Buddha)",
    category: "Pilgrimage",
    difficulty: "Easy",
    duration: "2 – 3 Days",
    maxAltitude: "150m",
    region: "Rupandehi · Lumbini",
    season: "Oct – Apr",
    estimatedCost: 210,
    image: "/pictures/Lumbini_tk_pilgrimage_(3)-1624819677.jpg",
    description:
      "Visit the Maya Devi Temple, the 3rd-century BC Ashokan Pillar, and international Buddhist monasteries in peaceful parkland.",
    highlights: [
      "Maya Devi Temple & Sacred Marker Stone",
      "Emperor Ashoka Pillar & Puskarini Sacred Pond",
      "Cycle or rickshaw tour of the Monastic Zone",
    ],
    permits: ["Lumbini Development Trust Entry"],
    gearRequirement: "Light cotton clothing, slip-off shoes for temples",
    guideRequirement: "Optional Local Heritage Guide",
  },
  {
    id: "cult-janakpur",
    section: "cultural",
    title: "Janakpur & Janaki Mandir",
    category: "Pilgrimage & Art",
    difficulty: "Easy",
    duration: "2 Days",
    maxAltitude: "74m",
    region: "Dhanusha · Madhesh",
    season: "Oct – Mar",
    estimatedCost: 180,
    image: "/pictures/Janakpur_ss_pilgrimage_(1)-1624818475.jpg",
    description:
      "Explore the marble palace temple of Janaki Mandir, sacred ponds, and vibrant Maithil folk painting communities.",
    highlights: [
      "Evening aarti at the marble Janaki Mandir",
      "Janakpur Women’s Development Center (Mithila art)",
      "Ganga Sagar & Dhanush Sagar sacred ponds",
    ],
    permits: ["No special permit required"],
    gearRequirement: "Modest temple attire, light footwear",
    guideRequirement: "Optional Local Cultural Guide",
  },
  {
    id: "cult-stupas",
    section: "cultural",
    title: "Boudhanath, Swayambhunath & Pashupatinath",
    category: "Sacred Circuit",
    difficulty: "Easy",
    duration: "1 Day",
    maxAltitude: "1,400m",
    region: "Kathmandu Valley",
    season: "Year-round",
    estimatedCost: 95,
    image: "/pictures/boudha-1624805151.jpg",
    description:
      "Experience Nepal’s living Buddhist and Hindu traditions from sunrise butter lamps at Swayambhu to evening kora at Boudha.",
    highlights: [
      "Circumambulate Boudhanath Stupa at dusk",
      "Hilltop panoramic views from Swayambhunath",
      "Bagmati River ghats at Pashupatinath Temple",
    ],
    permits: ["Heritage Entry Tickets"],
    gearRequirement: "Modest clothing, walking shoes",
    guideRequirement: "Licensed City Guide",
  },

  // ── ECO-TOURISM & HOMESTAYS ──
  {
    id: "eco-ilam",
    section: "ecotourism",
    title: "Ilam Rolling Tea Highlands",
    category: "Tea & Nature",
    difficulty: "Easy",
    duration: "3 – 5 Days",
    maxAltitude: "1,673m",
    region: "Ilam · Koshi",
    season: "Mar – Nov",
    estimatedCost: 310,
    image: "/pictures/Illam-1631441491.jpg",
    description:
      "Stay with organic tea farming families in misty eastern hills with sunrise views toward Mount Kanchenjunga from Shree Antu.",
    highlights: [
      "Sunrise over Kanchenjunga from Antu Danda",
      "Organic orthodox tea estate walks & tastings",
      "Mai Pokhari wetland & cardamom farms",
    ],
    permits: ["No special trekking permit needed"],
    gearRequirement: "Light fleece, rain jacket, walking shoes",
    guideRequirement: "Local Homestay Host / Guide",
  },
  {
    id: "eco-ghalegaon",
    section: "ecotourism",
    title: "Ghale Gaon Gurung Community Homestay",
    category: "Community Tourism",
    difficulty: "Easy",
    duration: "2 – 4 Days",
    maxAltitude: "2,100m",
    region: "Lamjung · Gandaki",
    season: "Sep – May",
    estimatedCost: 220,
    image: "/pictures/Ghale_Gaon_Photo_001-1634812841.jpg",
    description:
      "Experience South Asia’s model community-run village homestay perched beneath Lamjung Himal and Manaslu.",
    highlights: [
      "Traditional stone houses & Gurung hospitality",
      "Farm-to-table millet, gundruk, and organic meals",
      "Views of Annapurna II, Lamjung Himal & Manaslu",
    ],
    permits: ["ACAP Conservation Permit"],
    gearRequirement: "Daypack, warm evening layer",
    guideRequirement: "Community Homestay Coordinator",
  },
  {
    id: "eco-bandipur",
    section: "ecotourism",
    title: "Bandipur Heritage Hilltown",
    category: "Slow Travel",
    difficulty: "Easy",
    duration: "2 – 3 Days",
    maxAltitude: "1,030m",
    region: "Tanahun · Gandaki",
    season: "Year-round",
    estimatedCost: 190,
    image: "/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg",
    description:
      "A car-free preserved Newari hilltop bazaar halfway between Kathmandu and Pokhara with sweeping Himalayan ridge views.",
    highlights: [
      "Traffic-free cobbled main bazaar & boutique stays",
      "Short hikes to Siddha Cave & Thani Mai temple",
      "Ideal slow-travel stop between Kathmandu & Pokhara",
    ],
    permits: ["No permit required"],
    gearRequirement: "Walking shoes, light evening layer",
    guideRequirement: "Self-guided or local walking guide",
  },
];

const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  activities: {
    title: "Activities & Adventure",
    subtitle:
      "Paragliding, bungee jumping, zip-lining, whitewater rafting, and aerial experiences across Nepal.",
  },
  adventure: {
    title: "Adventure Sports",
    subtitle:
      "Paragliding, bungee jumping, zip-lining, whitewater rafting, and canyoning across Nepal.",
  },
  trekking: {
    title: "Trekking Places in Nepal",
    subtitle:
      "Explore classic and remote Himalayan trekking routes from Everest and Annapurna to Langtang and Mustang.",
  },
  mountaineering: {
    title: "Mountaineering Peaks",
    subtitle:
      "6,000m trekking peaks and technical Himalayan climbs across the Khumbu and central ranges.",
  },
  wildlife: {
    title: "Wildlife Sanctuaries",
    subtitle:
      "National parks and wetland reserves for rhinos, Bengal tigers, wild elephants, and birding.",
  },
  cultural: {
    title: "Cultural & Religious Sites",
    subtitle:
      "UNESCO heritage squares, sacred Buddhist stupas, Lumbini, and Janakpur.",
  },
  ecotourism: {
    title: "Eco-Tourism & Homestays",
    subtitle:
      "Community-run mountain villages, organic tea highlands, and slow-travel hilltowns.",
  },
};

export default function ActivitiesSection({
  activeId,
  onNavigate,
}: ActivitiesSectionProps) {
  const router = useRouter();
  const { addBooking } = useTravelStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(
    null,
  );
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookedActivity, setBookedActivity] = useState<{
    activity: ActivityItem;
    invoiceNo: string;
  } | null>(null);

  const normalizedSection: ActivityItem["section"] =
    activeId === "adventure" || activeId === "activities"
      ? "activities"
      : [
            "trekking",
            "mountaineering",
            "wildlife",
            "cultural",
            "ecotourism",
          ].includes(activeId)
        ? (activeId as ActivityItem["section"])
        : "activities";

  const [prevSection, setPrevSection] = useState(normalizedSection);
  if (prevSection !== normalizedSection) {
    setPrevSection(normalizedSection);
    setSelectedCategory("All");
    setSearchQuery("");
    setDifficultyFilter("All");
    setSelectedActivity(null);
  }

  const [showActivityBooking, setShowActivityBooking] = useState(false);
  const [activityDate, setActivityDate] = useState("2026-06-05");
  const [activityGuests, setActivityGuests] = useState(2);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedActivity(null);
        setBookedActivity(null);
      }
    };
    if (selectedActivity || bookedActivity) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedActivity, bookedActivity]);

  const sectionItems = useMemo(
    () => ACTIVITIES_LIST.filter((item) => item.section === normalizedSection),
    [normalizedSection],
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(sectionItems.map((i) => i.category)));
    return ["All", ...unique];
  }, [sectionItems]);

  const filteredActivities = useMemo(() => {
    return sectionItems.filter((act) => {
      const matchesCategory =
        selectedCategory === "All" || act.category === selectedCategory;
      const matchesDifficulty =
        difficultyFilter === "All" ||
        act.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase());
      const matchesSearch =
        searchQuery.trim() === "" ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [sectionItems, selectedCategory, difficultyFilter, searchQuery]);

  const handleBook = (activity: ActivityItem, guests = 1) => {
    const inv = `INV-ACT-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalCost = activity.estimatedCost * guests;
    addBooking({
      id: `b-act-${Date.now()}`,
      type: "Adventure Package",
      title: activity.title,
      date: activityDate || "Flexible Seasonal Booking - 2026",
      details: `${activity.category} in ${activity.region}. Duration: ${activity.duration}. ${guests} ${guests === 1 ? "traveler" : "travelers"}.`,
      cost: totalCost,
      status: "Confirmed",
      invoiceNo: inv,
    });

    setBookedActivity({ activity, invoiceNo: inv });
    setBookingSuccess(`Booked "${activity.title}" ($${totalCost})`);
    setTimeout(() => {
      setBookingSuccess(null);
    }, 4000);
  };

  const getDifficultyBadge = (difficulty: string) => {
    if (difficulty.includes("Technical") || difficulty.includes("Extreme")) {
      return "bg-rose-600 text-white border-rose-600";
    }
    if (difficulty.includes("Challenging")) {
      return "bg-amber-600 text-white border-amber-600";
    }
    if (difficulty.includes("Moderate")) {
      return "bg-[#0552A2] text-white border-[#0552A2]";
    }
    return "bg-emerald-600 text-white border-emerald-600";
  };

  const getSectionIcon = (section: ActivityItem["section"]) => {
    switch (section) {
      case "trekking":
        return <Mountain className="h-3.5 w-3.5" />;
      case "mountaineering":
        return <Zap className="h-3.5 w-3.5" />;
      case "wildlife":
        return <Trees className="h-3.5 w-3.5" />;
      case "cultural":
        return <Landmark className="h-3.5 w-3.5" />;
      case "ecotourism":
        return <Coffee className="h-3.5 w-3.5" />;
      case "activities":
      default:
        return <Wind className="h-3.5 w-3.5" />;
    }
  };

  const getCategoryIcon = (
    category: string,
    fallbackSection: ActivityItem["section"],
  ) => {
    switch (category) {
      case "Aerial":
        return <Wind className="h-3.5 w-3.5" />;
      case "Adventure":
        return <Zap className="h-3.5 w-3.5" />;
      case "Water":
        return <Waves className="h-3.5 w-3.5" />;
      case "Cycling":
        return <Bike className="h-3.5 w-3.5" />;
      case "Classic Trek":
      case "Circuit Trek":
      case "Valley Trek":
      case "Short Trek":
        return <Mountain className="h-3.5 w-3.5" />;
      case "Restricted Area":
        return <Compass className="h-3.5 w-3.5" />;
      case "Trekking Peak":
      case "Expedition Peak":
        return <Zap className="h-3.5 w-3.5" />;
      case "UNESCO Park":
      case "Wilderness":
        return <Trees className="h-3.5 w-3.5" />;
      case "Birding & Wetlands":
        return <Binoculars className="h-3.5 w-3.5" />;
      case "UNESCO World Heritage":
      case "Pilgrimage":
      case "Pilgrimage & Art":
      case "Sacred Circuit":
        return <Landmark className="h-3.5 w-3.5" />;
      case "Tea & Nature":
        return <Coffee className="h-3.5 w-3.5" />;
      case "Community Tourism":
      case "Slow Travel":
        return <Leaf className="h-3.5 w-3.5" />;
      default:
        return getSectionIcon(fallbackSection);
    }
  };

  const meta = SECTION_META[activeId] || SECTION_META[normalizedSection];

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
              <p className="text-[11px] text-white/80">
                Added to your Bookings.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmed Modal */}
      <AnimatePresence>
        {bookedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto mb-3.5">
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

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 my-4 text-left flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                  <span className="text-slate-500 text-xs">Reference</span>
                  <span className="font-semibold text-[#0552A2]">
                    {bookedActivity.invoiceNo}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Location</span>
                  <span className="font-semibold text-[#17212B]">
                    {bookedActivity.activity.region}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Duration</span>
                  <span className="font-semibold text-[#17212B]">
                    {bookedActivity.activity.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/70">
                  <span className="font-bold text-[#17212B]">
                    Estimated Cost
                  </span>
                  <span className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#0552A2]">
                    ${bookedActivity.activity.estimatedCost}{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      / person
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setBookedActivity(null);
                    if (onNavigate) {
                      onNavigate("profile");
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setBookedActivity(null)}
                  className="py-3 px-5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedActivity ? (
        <div className="-mx-2.5 -mt-2.5 sm:-mx-3.5 sm:-mt-3.5 md:-mx-4 md:-mt-4 -mb-4">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[calc(100dvh-3.5rem)] bg-white overflow-hidden">
            {/* Left: Full-screen Activity Profile */}
            <motion.div
              layout="position"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0"
            >
              {/* Cover Banner */}
              <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden bg-slate-900">
                <Image
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15" />

                <button
                  type="button"
                  aria-label="Back to activities"
                  onClick={() => {
                    setSelectedActivity(null);
                    setShowActivityBooking(false);
                  }}
                  className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#17212B] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      {getCategoryIcon(
                        selectedActivity.category,
                        selectedActivity.section,
                      )}
                      <span>{selectedActivity.category}</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getDifficultyBadge(selectedActivity.difficulty)}`}
                    >
                      {selectedActivity.difficulty}
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-quicksand)] text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#92C4EA]" />
                    <span>{selectedActivity.region}</span>
                    <span>·</span>
                    <span>{selectedActivity.maxAltitude}</span>
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-[#475569]">
                  <span>
                    Duration:{" "}
                    <strong className="text-[#17212B]">
                      {selectedActivity.duration}
                    </strong>
                  </span>
                  <span>
                    Best Season:{" "}
                    <strong className="text-[#17212B]">
                      {selectedActivity.season}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowActivityBooking((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0 ${
                    showActivityBooking
                      ? "bg-[#17212B] text-white"
                      : "bg-[#0552A2] hover:bg-[#044080] text-white"
                  }`}
                >
                  <span>
                    {showActivityBooking
                      ? "Hide Booking"
                      : `Book Now · $${selectedActivity.estimatedCost}/person`}
                  </span>
                </button>
              </div>

              {/* Body Details */}
              <div className="p-5 sm:p-6 flex flex-col gap-5">
                <div>
                  <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-1.5">
                    Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-t border-b border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Duration
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#17212B] mt-0.5 block">
                      {selectedActivity.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Best Season
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#17212B] mt-0.5 block">
                      {selectedActivity.season}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Elevation
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#17212B] mt-0.5 block">
                      {selectedActivity.maxAltitude}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Est. Cost
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0552A2] mt-0.5 block">
                      ${selectedActivity.estimatedCost} / person
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] mb-2">
                    Key Highlights
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedActivity.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#475569]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between py-2.5 text-[#475569] gap-3">
                    <span className="font-semibold text-[#17212B] shrink-0">
                      Guide Requirement
                    </span>
                    <span className="text-right">
                      {selectedActivity.guideRequirement}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 text-[#475569] gap-3">
                    <span className="font-semibold text-[#17212B] shrink-0">
                      What to Bring
                    </span>
                    <span className="text-right">
                      {selectedActivity.gearRequirement}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 text-[#475569] gap-3">
                    <span className="font-semibold text-[#17212B] shrink-0">
                      Permits
                    </span>
                    <span className="text-right text-[#0552A2] font-semibold">
                      {selectedActivity.permits.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Side Booking Panel with Smooth Swipe */}
            <AnimatePresence mode="wait">
              {showActivityBooking && (
                <motion.div
                  key="activity-booking-panel"
                  initial={{ opacity: 0, x: 48 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 48 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/40 p-5 sm:p-6 space-y-4 text-xs"
                >
                  <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#17212B]">
                        Book Activity
                      </h3>
                      <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#0552A2]">
                        ${selectedActivity.estimatedCost}
                        <span className="text-xs font-normal text-slate-500">
                          {" "}
                          / person
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Close booking panel"
                      onClick={() => setShowActivityBooking(false)}
                      className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-[#475569]">
                        Preferred Date
                      </span>
                      <input
                        type="date"
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-[#475569]">
                        Travelers
                      </span>
                      <select
                        value={activityGuests}
                        onChange={(e) =>
                          setActivityGuests(Number(e.target.value))
                        }
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-[#17212B] focus:outline-none focus:border-[#0552A2]"
                      >
                        {[1, 2, 3, 4, 5, 6, 8].map((g) => (
                          <option key={g} value={g}>
                            {g} {g === 1 ? "traveler" : "travelers"}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">
                        Total ({activityGuests}{" "}
                        {activityGuests === 1 ? "traveler" : "travelers"})
                      </span>
                      <span className="font-[family-name:var(--font-quicksand)] text-lg font-bold text-[#0552A2]">
                        ${selectedActivity.estimatedCost * activityGuests}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleBook(selectedActivity, activityGuests)
                      }
                      className="bg-[#0552A2] hover:bg-[#044080] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Main Directory View */
        <div className="flex flex-col gap-5 max-w-[1440px] w-full mx-auto py-1">
          {/* Header (left) + Search (right) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
            <div>
              <h1 className="font-[family-name:var(--font-quicksand)] text-2xl sm:text-3xl font-bold tracking-tight text-[#17212B]">
                {meta.title}
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] mt-1 max-w-2xl">
                {meta.subtitle}
              </p>
            </div>

            <div className="relative w-full md:w-80 lg:w-96 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${meta.title.toLowerCase()}, regions...`}
                className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-9 py-2.5 font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#17212B] placeholder:text-slate-400 focus:outline-none focus:border-[#0552A2] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-category Pills + Difficulty Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {categories.length > 2 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none max-w-full">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-4 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#0552A2] text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {cat === "All"
                        ? getSectionIcon(normalizedSection)
                        : getCategoryIcon(cat, normalizedSection)}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                aria-label="Filter by difficulty level"
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#17212B] focus:outline-none focus:border-[#0552A2] font-medium cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Technical">Technical / Extreme</option>
              </select>
            </div>
          </div>

          {/* Card Grid */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                No matching places or activities
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm">
                Try resetting your search or selecting a different filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setDifficultyFilter("All");
                  setSearchQuery("");
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
                  onClick={() => {
                    setSelectedActivity(act);
                    setShowActivityBooking(false);
                  }}
                >
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
                        {getCategoryIcon(act.category, act.section)}
                        <span>{act.category}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="text-[11px] font-medium text-amber-200 block truncate">
                        {act.region} · {act.maxAltitude}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>{act.duration}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadge(
                            act.difficulty,
                          )}`}
                        >
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

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500">
                          From{" "}
                        </span>
                        <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B]">
                          ${act.estimatedCost}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {" "}
                          / person
                        </span>
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
    </div>
  );
}
