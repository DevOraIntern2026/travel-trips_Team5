import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  Heart,
  Clock,
  ArrowRight,
  ChevronDown,
  Check,
  RefreshCw,
  AlertTriangle,
  LayoutGrid,
  List,
} from "lucide-react";
import Footer from "../../Component/home/Footer";

import whiteDesertImg from "../../assets/images/White Desert.png";
import siwaImg from "../../assets/images/siwa.png";
import canyonImg from "../../assets/images/expeditionExplore/canyon.png";
import sinaiImg from "../../assets/images/Sinai Mount.png";

const EXPEDITIONS_DATA = [
  {
    id: "white-desert-stargazing",
    title: "White Desert & Black Desert Stargazing Bivouac",
    region: "Western Desert, Egypt",
    badgeType: "4×4 + Camp",
    image: whiteDesertImg,
    seatsLeft: "Only 2 Seats Left",
    seatColor: "bg-rust text-white",
    days: "3 Days",
    dist: "135 km",
    grade: "Grade 2 Desert Trek",
    nextDate: "Nov 29, 2025",
    usd: 320,
    egp: 16000,
    guaranteed: true,
  },
  {
    id: "siwa-deep-sahara",
    title: "Siwa Oasis Deep Sahara & Hot Springs Trek",
    region: "Western Desert, Egypt",
    badgeType: "Off-Road Safari",
    image: siwaImg,
    seatsLeft: "4 Seats Left",
    seatColor: "bg-teal-700 text-white",
    days: "4 Days",
    dist: "85 km",
    grade: "Grade 2",
    nextDate: "Dec 05, 2025",
    usd: 490,
    egp: 24500,
    guaranteed: true,
  },
  {
    id: "petra-wadi-rum",
    title: "Petra to Wadi Rum Bedouin Wilderness Path",
    region: "Jordan & Sinai Gateway",
    badgeType: "Bedouin Desert",
    image: canyonImg,
    seatsLeft: "1 Seat Remaining",
    seatColor: "bg-red-600 text-white",
    days: "5 Days",
    dist: "72 km",
    grade: "Grade 3+",
    nextDate: "Dec 11, 2025",
    usd: 760,
    egp: 38000,
    guaranteed: true,
  },
  {
    id: "sinai-katherina-ascent",
    title: "Sinai High Mountains & Gebel Katherina Ascent",
    region: "South Sinai, Egypt",
    badgeType: "Ridge Traverses",
    image: sinaiImg,
    seatsLeft: "4 Seats Left",
    seatColor: "bg-amber-600 text-white",
    days: "3 Days",
    dist: "32 km",
    grade: "Grade 3",
    nextDate: "Nov 10, 2025",
    usd: 480,
    egp: 24000,
    guaranteed: true,
  },
];

export default function ExpeditionDiscovery() {
  const [destination, setDestination] = useState("South Sinai & Red Sea, Egypt");
  const [departureWindow, setDepartureWindow] = useState("Nov 2025 – Mar 2026 (Cool Season)");
  const [manifestCount, setManifestCount] = useState(2);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Switcher states: 'results' | 'empty' | 'loading' | 'error'
  const [viewState, setViewState] = useState("results");

  // Filters
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [savedTrips, setSavedTrips] = useState(new Set());

  const toggleSave = (id) => {
    setSavedTrips((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredTrips = useMemo(() => {
    if (viewState === "empty") return [];
    return EXPEDITIONS_DATA.filter((item) => {
      if (item.usd > maxPrice) return false;
      if (selectedFilter === "sinai" && !item.region.includes("Sinai")) return false;
      if (selectedFilter === "sahara" && !item.region.includes("Western")) return false;
      return true;
    });
  }, [viewState, maxPrice, selectedFilter]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Breadcrumb & Reviewer Switcher */}
      <div className="mx-auto max-w-6xl px-6 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Link to="/" className="hover:text-brand">Home</Link>
            <span>›</span>
            <span className="font-semibold text-slate-800">ExpeditionDiscovery</span>
          </div>

          {/* Reviewer State Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reviewer State Switcher:
            </span>
            <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setViewState("results")}
                className={`rounded-md px-2.5 py-1 transition ${
                  viewState === "results"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Results View (14 Matches)
              </button>
              <button
                type="button"
                onClick={() => setViewState("empty")}
                className={`rounded-md px-2.5 py-1 transition ${
                  viewState === "empty"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Empty State (No Results)
              </button>
              <button
                type="button"
                onClick={() => setViewState("loading")}
                className={`rounded-md px-2.5 py-1 transition ${
                  viewState === "loading"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Loading Skeleton
              </button>
              <button
                type="button"
                onClick={() => setViewState("error")}
                className={`rounded-md px-2.5 py-1 transition ${
                  viewState === "error"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                API Error State
              </button>
            </div>
            <span className="font-mono text-[10px] font-semibold text-slate-400">
              ● LAT:28_SOUTH_RIDGES_OA
            </span>
          </div>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
          {/* Segment 1: Destination */}
          <div className="flex w-full md:w-auto flex-1 items-center gap-3 px-3 py-1 border-b md:border-b-0 md:border-r border-slate-100">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-brand">
              <Compass size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                DESTINATION
              </p>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="South Sinai & Red Sea, Egypt">South Sinai &amp; Red Sea, Egypt</option>
                <option value="Western Desert & White Desert">Western Desert &amp; White Desert</option>
                <option value="Siwa Oasis & Great Sand Sea">Siwa Oasis &amp; Great Sand Sea</option>
                <option value="All Egypt Backcountry Regions">All Egypt Backcountry Regions</option>
              </select>
            </div>
          </div>

          {/* Segment 2: Departure Window */}
          <div className="flex w-full md:w-auto flex-1 items-center gap-3 px-3 py-1 border-b md:border-b-0 md:border-r border-slate-100">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
              <Calendar size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                DEPARTURE WINDOW
              </p>
              <select
                value={departureWindow}
                onChange={(e) => setDepartureWindow(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Nov 2025 – Mar 2026 (Cool Season)">Nov 2025 – Mar 2026 (Cool Season)</option>
                <option value="Dec 2025 – Jan 2026 (Peak Winter)">Dec 2025 – Jan 2026 (Peak Winter)</option>
                <option value="Feb 2026 – Apr 2026 (Spring Ascent)">Feb 2026 – Apr 2026 (Spring Ascent)</option>
              </select>
            </div>
          </div>

          {/* Segment 3: Manifest */}
          <div className="flex w-full md:w-auto flex-1 items-center gap-3 px-3 py-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-rust">
              <Users size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                MANIFEST
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{manifestCount} Explorers</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setManifestCount(Math.max(1, manifestCount - 1))}
                    className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setManifestCount(manifestCount + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action: Modify Search */}
          <button
            type="button"
            onClick={() => setShowSearchModal(!showSearchModal)}
            className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-brand-light transition"
          >
            <SlidersHorizontal size={14} /> Modify Search
          </button>
        </div>
      </div>

      {/* Results Header: Showing Count & Filters */}
      <div className="mx-auto max-w-6xl px-6 py-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Showing {viewState === "results" ? 14 : filteredTrips.length} Verified Expeditions
            </h2>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cross-sync: Inventory open, rate: 230ms/sync
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            {/* View Mode */}
            <div className="flex rounded-md border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-slate-100 text-brand" : "text-slate-400"}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-slate-100 text-brand" : "text-slate-400"}`}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>

            {/* Sort */}
            <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
              Sort: Guaranteed Departures <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              selectedFilter === "all"
                ? "bg-brand text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Filters (3 Active)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === "sinai" ? "all" : "sinai")}
            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
              selectedFilter === "sinai"
                ? "border-brand bg-brand text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Choose Trekking... <ChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={() => setMaxPrice(maxPrice === 500 ? 1500 : 500)}
            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
              maxPrice === 500
                ? "border-brand bg-brand text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Max $1,500/pp... <ChevronDown size={12} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Guaranteed Departure... <ChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter("all");
              setMaxPrice(1500);
            }}
            className="text-xs font-semibold text-rust hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Content Rendering based on viewState */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Case 1: Loading Skeleton State */}
        {viewState === "loading" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-44 w-full rounded-lg bg-slate-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-5 w-16 rounded bg-slate-200" />
                  <div className="h-8 w-20 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Case 2: API Error State */}
        {viewState === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </span>
            <h3 className="mt-3 text-base font-bold text-red-800">
              Egyptian Tourism Ministry permit gateway responded with HTTP 504
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-red-600">
              The live telemetry connection to South Sinai and Western Desert checkpoint hubs timed out.
            </p>
            <button
              type="button"
              onClick={() => setViewState("results")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700"
            >
              <RefreshCw size={13} /> Retry Connection
            </button>
          </div>
        )}

        {/* Case 3: Empty State */}
        {viewState === "empty" && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search size={22} />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-800">
              No matching expeditions found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your destination, departure window, or clear your filters to view active treks.
            </p>
            <button
              type="button"
              onClick={() => {
                setViewState("results");
                setSelectedFilter("all");
              }}
              className="mt-4 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-light"
            >
              Reset Filters &amp; View All
            </button>
          </div>
        )}

        {/* Case 4: Results View (Default matching Image 2) */}
        {viewState === "results" && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredTrips.map((trip) => {
                const isSaved = savedTrips.has(trip.id);
                return (
                  <div
                    key={trip.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      {/* Image + Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={trip.image}
                          alt={trip.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                          <span className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-bold text-slate-800 backdrop-blur">
                            <Check size={11} className="text-emerald-700" /> Guaranteed
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSave(trip.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur transition hover:bg-white"
                            aria-label="Save trip"
                          >
                            <Heart
                              size={13}
                              className={isSaved ? "fill-red-500 text-red-500" : ""}
                            />
                          </button>
                        </div>

                        {/* Seats Left Pill */}
                        <span
                          className={`absolute bottom-2 left-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${trip.seatColor}`}
                        >
                          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                          {trip.seatsLeft}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <p className="text-[10px] font-semibold text-slate-400">
                          {trip.region} • <span className="text-slate-600">{trip.badgeType}</span>
                        </p>

                        <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900 group-hover:text-brand">
                          {trip.title}
                        </h3>

                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                          <Clock size={12} />
                          <span>{trip.days}</span>
                          <span>•</span>
                          <span>{trip.dist}</span>
                          <span>•</span>
                          <span className="text-slate-700">{trip.grade}</span>
                        </div>

                        <p className="mt-2 text-[11px] font-semibold text-slate-500">
                          Next: <span className="text-slate-800">{trip.nextDate}</span>
                        </p>
                      </div>
                    </div>

                    {/* Pricing & View Trip Button */}
                    <div className="flex items-end justify-between border-t border-slate-100 bg-slate-50/50 p-4">
                      <div>
                        <p className="text-[9px] text-slate-400 font-medium">From (All-Inclusive)</p>
                        <p className="text-base font-extrabold text-slate-900">
                          ${trip.usd}{" "}
                          <span className="text-[10px] font-normal text-slate-500">/ person</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {trip.egp.toLocaleString()} EGP
                        </p>
                      </div>
                      <Link
                        to="/destinations"
                        className="flex items-center gap-1 rounded-lg bg-rust px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition"
                      >
                        View Trip <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Section */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                Showing 4 of 14 verified expeditions
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <ChevronDown size={14} /> Load 10 More Trips
              </button>
            </div>
          </>
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
