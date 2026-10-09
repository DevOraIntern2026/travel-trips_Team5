import { Search, Headset } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="bg-lavender py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand to-[#2a3a2e] p-10 shadow-xl md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-700/20 blur-3xl" />

          <div className="relative max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100/80">
              Start your Sahara expedition
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white">
              Ready to Experience Egypt Beyond the Ordinary?
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-emerald-100/80">
              Explore fully verified multi-day itineraries departing this cool season, or speak
              directly with our Cairo dispatch desk to structure a custom route manifest.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-rust px-5 py-3 text-[13px] font-semibold text-white hover:opacity-90">
                Explore Active Expeditions <Search size={14} />
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-[13px] font-semibold text-white hover:bg-white/20">
                Speak with Desert Concierge <Headset size={14} />
              </button>
            </div>

            <p className="mt-6 flex items-center gap-4 font-mono text-[10px] text-emerald-100/70">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rust" /> Booking Cool Season 2025/2026
              </span>
              <span>Permit SLA: 72 Hours Guaranteed</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}