import { ShieldCheck } from "lucide-react";

const expeditions = ["Sinai High Mountain Pass", "White Desert Lunar Traverse", "Wadi El Gemal Marine Rim", "Siwa Oasis Deep Dunes"];
const governance = [
  ["Bedouin Guide Accord:", "100% Native-led trails"],
  ["EEAA Protectorate:", "Zero trace biological zones"],
  ["Ministry of Tourism (MTA):", "Certified safety protocol"],
  ["Desert Heritage Fund:", "Tribal revenue split"],
];

export default function Footer() {
  return (
    <footer className="bg-white pt-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1.3fr_1.2fr]">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-brand">TravelOra</h3>
            <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-slate-500">
              Curated wilderness expeditions, deep desert traverses, and Red Sea marine sanctuaries
              operated in sovereign alliance with native tribes.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-brand">
              <ShieldCheck size={13} /> Licensed Tour Operator #4829
            </p>
          </div>

          {/* Expeditions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Expeditions</h4>
            <ul className="mt-3 space-y-1.5 text-[12px] text-slate-500">
              {expeditions.map((e) => (
                <li key={e}><a href="#" className="hover:text-brand">{e}</a></li>
              ))}
            </ul>
          </div>

          {/* Governance */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Governance &amp; Ethics</h4>
            <ul className="mt-3 space-y-1.5 text-[12px] text-slate-500">
              {governance.map(([k, v]) => (
                <li key={k}><span className="font-semibold text-brand">{k}</span> {v}</li>
              ))}
            </ul>
          </div>

          {/* HQ */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand">Headquarters &amp; Dispatch</h4>
            <div className="mt-3 space-y-1 text-[12px] text-slate-500">
              <p>St. Catherine Field Post, South Sinai, Egypt</p>
              <p className="font-mono text-[11px]">SAT: +20 69 347 0021</p>
              <p className="font-mono text-[11px] text-brand">emergency@travelora-expeditions.com</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col justify-between gap-3 rounded-t-xl bg-lavender px-5 py-4 text-[10px] text-slate-500 md:flex-row md:items-center">
          <div>
            <p>
              © 2026 TravelOra Expeditions Ltd. All rights reserved. &nbsp;•&nbsp; Ministry of Tourism
              &amp; Antiquities (MTA) Certified &nbsp;•
            </p>
            <p className="mt-1">EEAA Protectorate Protocol Enforced</p>
          </div>
          <div className="flex gap-8 text-[10px] font-medium text-brand">
            <a href="#">Permits &amp;<br />Clearance</a>
            <a href="#">Expedition<br />Terms</a>
            <a href="#">Environmental<br />Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}