import { ArrowRight, Clock, ShieldCheck, Bot } from "lucide-react";

export default function HowCTA() {
  return (
    <section className="bg-lavender pb-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-[#1f5a4f] p-8 shadow-xl md:p-10">
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rust">
                Cool-Season Departures Now Booking
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">Ready to Step Beyond the Tourist Trail?</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-emerald-100/70">
                Secure your vetted permits, lock your sovereign exchange rate, and trek under crystal
                Saharan starfields with generational tribal guides.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-emerald-100/80">
                <span className="flex items-center gap-1.5"><Clock size={12} /> 48h Average Clearance</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> 100% Money-Back Permit SLA</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-rust px-6 py-3 text-[13px] font-semibold text-white hover:opacity-90">
                View Upcoming Departures <ArrowRight size={14} />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-[13px] font-semibold text-white ring-1 ring-white/10 hover:bg-white/20">
                <Bot size={14} className="text-rust" /> Chat with AI Concierge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}