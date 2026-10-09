import { ArrowRight, Heart, Compass, ShieldCheck } from "lucide-react";
import howImg from "../../assets/images/White Desert.png"
const stats = [
  { value: "48-72h", label: "MTA & EEAA Permits" },
  { value: "100%", label: "Direct Clan Tariffs", rust: true },
  { value: "10 min", label: "InReach Satellite Pings" },
  { value: "USD / EGP", label: "Zero Hidden FX Lock" },
];

export default function HowHero() {
  return (
    <section className="relative overflow-hidden bg-lavender">
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1fr_1fr]">
        {/* Left */}
        <div>
          <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-800">
            Zero Broker Friction • Verified Sovereignty
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand md:text-[44px]">
            How TravelOra Works: <span className="text-rust">From Cairo Dispatch</span> to Deep Sahara Bivouac.
          </h1>

          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-slate-600">
            We eliminated the opaque broker markups, endless bureaucracy, and remote communication
            blackouts of Middle Eastern expedition travel. Here is the verified blueprint of how your
            wilderness traversal goes from vetted route selection to telemetry-backed departure.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[13px] font-semibold text-white hover:bg-brand-light">
              Explore Curated Expeditions <ArrowRight size={14} />
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-lavender-btn px-5 py-3 text-[13px] font-semibold text-brand hover:bg-lavender-dark">
              <Heart size={14} className="text-rust" /> Talk to Desert Concierge
            </button>
          </div>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className={`text-[17px] font-extrabold ${s.rust ? "text-rust" : "text-brand"}`}>{s.value}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative pb-8">
          <div className="relative h-[340px] overflow-hidden rounded-2xl bg-slate-300 shadow-xl">
            <img src={howImg } alt="Caravan in the White Desert" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand/90 px-3 py-1 font-mono text-[9px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SAT-LINK 41.229.89 // ONLINE
            </span>
            <span className="absolute right-4 top-4 rounded-md bg-rust px-2.5 py-1 text-[10px] font-semibold text-white">
              Farafra Basin
            </span>

            {/* Waypoint card */}
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white p-3.5 shadow-lg">
              <div className="flex items-start justify-between">
                <p className="flex items-center gap-1.5 text-[13px] font-bold text-brand">
                  <Compass size={14} className="text-rust" /> Caravan Waypoint 07
                </p>
                <span className="font-mono text-[9px] text-slate-500">28°41'N 28°59'E</span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">
                Active Traverse: Jabaliya Guide Mansour + 4 Expeditioners. Next Bivouac: Crystal
                Mountain Outcrop.
              </p>
              <p className="mt-1 text-right font-mono text-[9px] text-slate-400">
                Elev: 420m • Wind: 9kts NW
              </p>
            </div>
          </div>

          {/* Floating EEAA card */}
          <div className="absolute -bottom-0 left-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-2xl md:-left-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-[13px] font-bold text-brand">EEAA Regulated</p>
              <p className="text-[10px] text-slate-500">Zero-Trace Wilderness License #318</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}