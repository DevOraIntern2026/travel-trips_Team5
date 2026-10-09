import { ShieldCheck, Banknote } from "lucide-react";
import svgImg from "../../assets/images/SVG.png"
const points = [
  { icon: ShieldCheck, title: "Permit Direct Clearances", text: "Automated manifest clearances directly approved with the MTA and Frontier Border Guard." },
  { icon: Banknote, title: "Sovereign Remittance", text: "Guaranteed, immediate disbursements directly into Bedouin clan council reserve funds.", rust: true },
];

export default function MissionSection() {
  return (
    <section className="bg-lavender-dark/60 py-14">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Text */}
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-rust">
            <span className="h-px w-5 bg-rust" /> Why we built this platform
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-brand">
            Fixing the Broken Wilderness Ecosystem of the Great Sahara &amp; Sinai
          </h2>

          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-slate-600">
            <p>
              Egypt's remote backcountry contains some of the planet's most dramatic geological and
              spiritual treasures: the wind-carved chalk monoliths of the White Desert, the sacred
              granite corridors of Sinai, and the fossilized prehistoric seas of Wadi El Hitan. Yet
              for decades, traversing these frontiers remained notoriously fraught.
            </p>
            <p>
              Independent adventurers faced impenetrable bureaucracy navigating Egyptian military
              permits, while native Bedouin and Berber pathfinders—the true custodians of these
              lands—were systematically underpaid by urban middlemen who took up to 70% of tour
              margins. Worse, rudimentary emergency planning frequently put travelers at grave risk
              once off-grid cellular coverage dropped.
            </p>
            <p>
              TravelOra was born inside a Cairo expedition loft to change the rules. We created an
              integrated platform that:
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, text, rust }) => (
              <div key={title} className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 text-[13px] font-semibold text-brand">
                  <Icon size={15} className={rust ? "text-rust" : "text-brand"} /> {title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry card */}
        <div className="rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-brand">
              <span className="h-2 w-2 rounded-full bg-rust" /> Cairo Telemetry Engine
            </p>
            <p className="font-mono text-[9px] uppercase text-slate-400">Transceiver Mesh: Active</p>
          </div>

          <div className="relative mt-4 h-52 overflow-hidden rounded-lg bg-slate-300">
            <img
              src={svgImg}
              alt="Desert routes map"
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Active Desert Routes Today</span>
            <span className="font-mono font-bold text-brand">06 Teams In-Field</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lavender-btn">
            <div className="h-full w-[92%] rounded-full bg-brand" />
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-slate-500">
            <span>Signal Integrity: 99.8%</span>
            <span>Evac Latency: &lt; 42 mins</span>
          </div>
        </div>
      </div>
    </section>
  );
}