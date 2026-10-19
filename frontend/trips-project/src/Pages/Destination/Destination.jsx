import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  Clock,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  Sun,
  FileCheck,
  Building,
} from "lucide-react";
import Footer from "../../Component/home/Footer";

import sinaiHero from "../../assets/images/expeditionExplore/Mount Sinai and St. Catherine High Mountain Range in Egypt.png";
import sinaiImg from "../../assets/images/Sinai Mount.png";
import whiteDesertImg from "../../assets/images/White Desert.png";
import siwaImg from "../../assets/images/siwa.png";
import canyonImg from "../../assets/images/expeditionExplore/canyon.png";

import tarekImg from "../../assets/images/tarek.png";
import salmanImg from "../../assets/images/salman.png";
import laylaImg from "../../assets/images/layla.png";
import kareemImg from "../../assets/images/kareem.png";

const EXPEDITIONS = [
  {
    id: "sinai-high",
    title: "Sinai High Mountain Sanctuary & Gebel Katherina Traverse",
    category: "sinai",
    location: "St. Catherine & Gebel Katherina, South Sinai",
    image: sinaiImg,
    seats: "4 SEATS LEFT",
    seatCls: "bg-rust text-white",
    days: "5 Days",
    dist: "52 km",
    grade: "Grade: 3",
    guide: "Sinai Trekking Co.",
    role: "EEAA Certified Guide",
    avatar: tarekImg,
    usd: "$480",
    egp: "24,000 EGP",
  },
  {
    id: "white-desert",
    title: "White Desert Chalk Monoliths & Stargazing Bivouac",
    category: "desert",
    location: "White Desert & Farafra Oasis, Egypt",
    image: whiteDesertImg,
    seats: "2 SEATS LEFT",
    seatCls: "bg-rust text-white",
    days: "4 Days",
    dist: "4x4 Overland",
    grade: "Grade: 2",
    guide: "Sahara Nomads Co.",
    role: "EEAA Desert Ranger Escort",
    avatar: salmanImg,
    usd: "$420",
    egp: "21,000 EGP",
  },
  {
    id: "siwa-oasis",
    title: "Great Sand Sea Dunes & Siwa Salt Springs Expedition",
    category: "desert",
    location: "Siwa Oasis & Great Sand Sea, Western Desert",
    image: siwaImg,
    seats: "6 SEATS AVAILABLE",
    seatCls: "bg-sky-600 text-white",
    days: "6 Days",
    dist: "140 km",
    grade: "Grade: 2+",
    guide: "Siwa Heritage Treks",
    role: "Certified Siwan Guide",
    avatar: laylaImg,
    usd: "$690",
    egp: "34,500 EGP",
  },
  {
    id: "coloured-canyon",
    title: "Coloured Canyon & Red Sea Coastal Sandstone Gorges",
    category: "canyon",
    location: "Coloured Canyon & Nuweiba, Red Sea Coast",
    image: canyonImg,
    seats: "LAST SEAT LEFT",
    seatCls: "bg-red-600 text-white",
    days: "3 Days",
    dist: "28 km",
    grade: "Grade: 2",
    guide: "Tarabin Bedouin Guides",
    role: "Tribal Accord Escort",
    avatar: kareemImg,
    usd: "$360",
    egp: "18,000 EGP",
  },
];

const FILTERS = [
  { key: "all", label: "Filters: All" },
  { key: "sinai", label: "Sinai High Peak Traverses" },
  { key: "bivouac", label: "Bedouin Bivouac & Camels" },
  { key: "desert", label: "White Desert Overlands" },
  { key: "canyon", label: "Red Sea Canyon Treks" },
];

const WEATHER_MONTHS = [
  { month: "OCT", status: "Peak", temp: "24°C" },
  { month: "NOV", status: "Peak", temp: "19°C" },
  { month: "DEC", status: "Peak", temp: "15°C" },
  { month: "JAN", status: "Prime", temp: "12°C" },
  { month: "FEB", status: "Prime", temp: "14°C" },
  { month: "MAR", status: "Peak", temp: "19°C" },
  { month: "APR", status: "Shoulder", temp: "23°C" },
];

export default function Destination() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedItems, setSavedItems] = useState(new Set());

  const toggleSave = (id) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredExpeditions = EXPEDITIONS.filter((exp) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "sinai") return exp.category === "sinai";
    if (activeFilter === "desert") return exp.category === "desert";
    if (activeFilter === "canyon") return exp.category === "canyon";
    if (activeFilter === "bivouac") return exp.id === "white-desert" || exp.id === "sinai-high";
    return true;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb Bar */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span>›</span>
          <Link to="/home/expedition" className="hover:text-brand">Expeditions</Link>
          <span>›</span>
          <span className="hover:text-brand">Egypt &amp; Middle East</span>
          <span>›</span>
          <span className="font-semibold text-slate-800">South Sinai &amp; Red Sea</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-light">
            <Compass size={13} /> All Destination Detail: Sinai &amp; Red Sea
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Layers size={13} /> All Curated Destinations (12)
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-md">
        <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
          <img
            src={sinaiHero}
            alt="Sinai Mountains"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-[#072d27]/40 mix-blend-multiply" />

          {/* Badges on Top */}
          <div className="absolute left-6 right-6 top-6 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur border border-white/20">
                Egypt &amp; Middle East
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur">
                South Sinai &amp; Red Sea
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-rust px-3 py-1 text-[11px] font-bold text-white shadow">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                COOL SEASON ACTIVE
              </span>
              <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium text-white/90 backdrop-blur border border-white/20">
                Exclusive Bedouin Councils &amp; Tribal Accreditations
              </span>
            </div>
          </div>

          {/* Title & Coordinates at Bottom */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="font-mono text-[11px] text-emerald-200/90 tracking-wider">
              28°32&apos; N, 33°58&apos; E — Elev 2,629m — Gebel Katherina
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Sinai High Mountains &amp; Red Sea Canyons, Egypt
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Verified Expeditions
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                14 Active
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
              Independent local operators vetted for remote emergency evacuation protocols and wilderness first aid across South Sinai &amp; Western Desert.
            </p>
          </div>
        </div>

        {/* Filter Pills & Sorting */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === f.key
                    ? "bg-brand text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Sort:</span>
            <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50">
              Guaranteed Departures <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredExpeditions.map((exp) => {
            const isSaved = savedItems.has(exp.id);
            return (
              <div
                key={exp.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span
                      className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${exp.seatCls}`}
                    >
                      <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                      {exp.seats}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSave(exp.id)}
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur transition hover:bg-white"
                      aria-label="Bookmark expedition"
                    >
                      <Bookmark
                        size={13}
                        className={isSaved ? "fill-brand text-brand" : ""}
                      />
                    </button>
                    <p className="absolute bottom-2 left-3 right-3 truncate text-[11px] font-semibold text-white/95">
                      {exp.location}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Duration, Dist, Grade */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {exp.days} • {exp.dist}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
                        {exp.grade}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-brand">
                      {exp.title}
                    </h3>

                    {/* Operator Avatar + Name */}
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
                      <img
                        src={exp.avatar}
                        alt={exp.guide}
                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-slate-800">
                          {exp.guide}
                        </p>
                        <p className="truncate text-[9px] text-slate-400">
                          {exp.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      PER PERSON
                    </p>
                    <p className="text-base font-extrabold text-slate-900">
                      {exp.usd}{" "}
                      <span className="text-[10px] font-medium text-slate-400">
                        {exp.egp}
                      </span>
                    </p>
                  </div>
                  <Link
                    to="/home/expedition"
                    className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-brand-light transition"
                  >
                    View Trip <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Information Cards Section */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Seasonality & Weather Matrix */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sun size={15} className="text-amber-500" /> Seasonality &amp; Weather Matrix (Sinai &amp; Desert)
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  2025–2026
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Optimal desert and high-mountain trekking conditions coincide with the Egyptian cool season (October through April). High-summit night temperatures drop below freezing.
              </p>

              {/* Month pills matrix */}
              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {WEATHER_MONTHS.map((m) => (
                  <div key={m.month} className="rounded-lg bg-slate-50 p-1 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-700">{m.month}</p>
                    <span className="block mt-0.5 rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-bold text-emerald-800">
                      {m.status}
                    </span>
                    <p className="mt-1 text-[9px] font-semibold text-slate-500">{m.temp}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
              <span>
                <b className="text-slate-700">Recommended Window:</b> Oct to Apr
              </span>
              <span>
                <b className="text-slate-700">Avg Temp:</b> 16°C – 24°C (Day)
              </span>
            </div>
          </div>

          {/* Card 2: Permits & Conservation Protocols */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <FileCheck size={15} className="text-brand" /> Permits &amp; Conservation Protocols
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                  Gov-sync
                </span>
              </div>

              <div className="mt-3 space-y-2.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-slate-600">
                    <b className="text-slate-800">MTA Commercial Wilderness Pass:</b> All high-mountain crossings require pre-cleared MTA permits and registered local Bedouin pathfinder.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-slate-600">
                    <b className="text-slate-800">EEAA Protected Area Conservation:</b> Strict Leave-No-Trace protocol inside St. Catherine Protectorate and White Desert National Park.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Building size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-slate-600">
                    <b className="text-slate-800">Bedouin Sheikh Council Accord:</b> Direct integration and tribal consensus safety relays across Gebel Katherine and Serbal.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-emerald-50/70 p-2 text-center text-[10px] font-semibold text-emerald-800 border border-emerald-200/60">
              All TravelOra bookings include verified permits &amp; Bedouin escort crew.
            </div>
          </div>

          {/* Card 3: Assembly Hubs & Desert Gates */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <MapPin size={15} className="text-rust" /> Assembly Hubs &amp; Desert Gates
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Transfers
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[11px]">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100 flex items-center justify-between">
                  <div>
                    <b className="text-slate-800">Cairo International (CAI)</b>
                    <p className="text-[10px] text-slate-400">Direct &amp; Western Desert Flights Hub</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 text-right">
                    5.5h 4×4 Shuttle<br />to St. Catherine
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100 flex items-center justify-between">
                  <div>
                    <b className="text-slate-800">Sharm El Sheikh (SSH)</b>
                    <p className="text-[10px] text-slate-400">South Sinai Gulf Coastal Airport</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 text-right">
                    2.5h Express Van<br />to Basecamp
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100 flex items-center justify-between">
                  <div>
                    <b className="text-slate-800">Bahariya Oasis Hub (BHY)</b>
                    <p className="text-[10px] text-slate-400">Coastal/Sahara Checkpoint</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 text-right">
                    Ranger Checkpoint<br />to White Desert
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              <a
                href="#"
                className="flex items-center justify-center gap-1 text-[11px] font-bold text-brand hover:underline"
              >
                Download Egypt Desert Packing &amp; Travel Guide PDF <Download size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
