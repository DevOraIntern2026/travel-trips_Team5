import { RefreshCcw, Scale, BadgeCheck } from "lucide-react";

const councils = [
  { name: "Jabaliya Tribe", sub: "High Sinai Mountain Custodians", guides: "148+ Guides Active" },
  { name: "Tarabin Bedouin", sub: "Gulf of Aqaba & Red Sea Ridges", guides: "85+ Guides Active" },
  { name: "Siwan Amazigh Council", sub: "Western Great Sand Sea Logistics", guides: "60+ Guides Active" },
];

export default function TribalAccord() {
  return (
    <section className="bg-lavender pb-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-8 rounded-2xl bg-brand p-8 shadow-xl md:p-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-200">
                Tribal Accord Deed
              </span>
              <span className="font-mono text-[10px] uppercase text-emerald-100/70">Ratified 2024</span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white">
              The Bedouin Sheikh Council Accord &amp; Fair Pricing Standard
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-emerald-100/80">
              TravelOra operates on sovereign agreements signed between our Cairo Command Desk and
              the elder councils of the Jabaliya (St. Catherine), Tarabin (Nuweiba &amp; Ras Shitan),
              and Berber elders of the Siwa Oasis depression.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <RefreshCcw size={14} className="text-orange-400" /> Dual-Currency Rate Lock
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-100/70">
                  Book seamlessly in USD or Egyptian Pounds (EGP). Rates are pegged with 0 hidden FX
                  markups, protecting travelers and securing guaranteed wages for local camel-masters.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <Scale size={14} className="text-orange-400" /> Direct Community Dividend
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-100/70">
                  12% of every booking total is placed directly into sovereign clan wells
                  maintenance, winter thermal gear funds, and indigenous trail conservancy.
                </p>
              </div>
            </div>
          </div>

          {/* Right card */}
          <div className="rounded-2xl bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-brand">Active Clan Councils</h3>
              <BadgeCheck size={16} className="text-rust" />
            </div>

            <div className="mt-4 space-y-2.5">
              {councils.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-lg bg-lavender-btn/70 px-4 py-3">
                  <div>
                    <p className="text-[13px] font-bold text-brand">{c.name}</p>
                    <p className="text-[10px] text-slate-500">{c.sub}</p>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-brand">{c.guides}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-wider text-slate-400">
              All expeditions insured via Allianz Egypt
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}