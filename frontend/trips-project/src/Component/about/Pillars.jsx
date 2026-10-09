import { Users, ShieldPlus, Leaf, Check } from "lucide-react";

const pillars = [
  {
    icon: Users,
    iconBg: "bg-slate-200 text-brand",
    label: "PILLAR 01",
    title: "Sovereign Tribal Partnership",
    text: "Native Bedouin pathfinders lead every expedition. We guarantee prompt, transparent direct payments with 0 middleman commissions, preserving generational nomadic heritage and sustaining ancient wellsprings and desert camps.",
    list: ["Direct payouts to Clan Elder Councils", "Interpreted oral desert cartography"],
  },
  {
    icon: ShieldPlus,
    iconBg: "bg-rose-100 text-rust",
    label: "PILLAR 02",
    title: "Wilderness Safety & Telemetry",
    text: "Every expedition carries dual-frequency satellite transceivers, wilderness trauma kits curated by specialized desert emergency physicians, and predetermined GPS off-road rendezvous corridors for swift extraction.",
    list: ["SOS Iridium constellation tethering", "WFR-certified lead expedition captains"],
  },
  {
    icon: Leaf,
    iconBg: "bg-slate-200 text-brand",
    label: "PILLAR 03",
    title: "Environmental Custodianship",
    text: "In strict partnership with the Egyptian Environmental Affairs Agency (EEAA), our groups uphold a rigid zero-trace charter. We pack out 100% of non-organic waste, utilize solar basecamp generation, and steer clear of fragile geological yardangs.",
    list: ["Zero single-use plastics field policy", "Protectorate carbon offsets per passenger"],
  },
];

export default function Pillars() {
  return (
    <section className="bg-lavender py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Operating Standards</p>
          <h2 className="mt-2 text-3xl font-extrabold text-brand">The Three Pillars of TravelOra Field Practice</h2>
          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-slate-500">
            Every route we sanction is governed by unbending commitments to indigenous dignity,
            backcountry technology, and environmental integrity.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, iconBg, label, title, text, list }) => (
            <div key={title} className="flex flex-col rounded-xl bg-white p-6 shadow-sm">
              <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={20} />
              </span>
              <p className="mt-4 font-mono text-[10px] font-semibold tracking-wider text-rust">{label}</p>
              <h3 className="mt-1 text-[18px] font-semibold leading-snug text-brand">{title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{text}</p>

              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                {list.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Check size={12} className="text-rust" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}