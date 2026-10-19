import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const expeditions = [
  { name: "Sinai High Mountain Pass", path: "/destinations" },
  { name: "White Desert Lunar Traverse", path: "/home/expedition" },
  { name: "Wadi El Gemal Marine Rim", path: "/destinations" },
  { name: "Siwa Oasis Deep Dunes", path: "/home/expedition" },
];

const governance = [
  ["Bedouin Guide Accord:", "100% Native-led trails"],
  ["EEAA Protectorate:", "Zero trace biological zones"],
  ["Ministry of Tourism (MTA):", "Certified safety protocol"],
  ["Desert Heritage Fund:", "Tribal revenue split"],
];

export default function Footer() {
  return (
    <footer className="bg-white pt-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1.3fr_1.2fr]">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-black text-brand tracking-tight">TravelOra</h3>
            <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-slate-500">
              Curated wilderness expeditions, deep desert traverses, and Red Sea marine sanctuaries
              operated in sovereign alliance with native tribes.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <ShieldCheck size={14} className="text-emerald-700" /> Licensed Tour Operator #4829
            </p>
          </div>

          {/* Expeditions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Expeditions</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              {expeditions.map((e) => (
                <li key={e.name}>
                  <Link to={e.path} className="hover:text-brand hover:underline transition">
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Governance &amp; Ethics</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              {governance.map(([k, v]) => (
                <li key={k}>
                  <span className="font-semibold text-brand">{k}</span> {v}
                </li>
              ))}
            </ul>
          </div>

          {/* HQ */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Headquarters &amp; Dispatch</h4>
            <div className="mt-3 space-y-1.5 text-xs text-slate-500">
              <p>St. Catherine Field Post, South Sinai, Egypt</p>
              <p className="font-mono text-[11px]">SAT: +20 69 347 0021</p>
              <p className="font-mono text-[11px] text-brand font-medium">emergency@travelora-expeditions.com</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col justify-between gap-4 rounded-t-xl bg-lavender px-6 py-4 text-xs text-slate-500 md:flex-row md:items-center">
          <div>
            <p>
              © 2026 TravelOra Expeditions Ltd. All rights reserved. &nbsp;•&nbsp; Ministry of Tourism
              &amp; Antiquities (MTA) Certified
            </p>
            <p className="mt-0.5 text-slate-400">EEAA Protectorate Protocol Enforced</p>
          </div>
          <div className="flex gap-6 text-[11px] font-bold text-brand">
            <Link to="/how-it-works" className="hover:underline">Permits &amp; Clearance</Link>
            <Link to="/about" className="hover:underline">Expedition Terms</Link>
            <Link to="/destinations" className="hover:underline">Environmental Code</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}