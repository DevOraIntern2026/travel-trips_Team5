import { ShieldCheck, RefreshCcw, Bot, MapPin, Lock, CloudMoon } from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    iconBg: "bg-lavender-btn text-brand",
    title: "Guaranteed Military & EEAA Permits",
    text: "Skip weeks of paperwork. TravelOra pre-validates passenger manifests with the Egyptian Environmental Affairs Agency and South Sinai border checkpoints.",
    tag: { icon: MapPin, label: "Direct Emergency Satellite Dispatch", color: "text-brand" },
  },
  {
    icon: RefreshCcw,
    iconBg: "bg-rose-100 text-rose-500",
    title: "Dual-Currency Rate Lock",
    text: "Lock reservations in Egyptian Pounds (EGP) for domestic residents or USD for international visitors. Instant transparent checkout with zero hidden bank markups.",
    tag: { icon: Lock, label: "100% Escrow Protection until Departure", color: "text-rust" },
  },
  {
    icon: Bot,
    iconBg: "bg-lavender-btn text-brand",
    title: "AI Desert Concierge & Weather Engine",
    text: "Autonomous logistics agent tracks nocturnal temperature swings in the Great Sand Sea, camel pack weights, and custom water staging points along the trail.",
    tag: { icon: CloudMoon, label: "Micro-climate Nocturnal Warnings", color: "text-emerald-700" },
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-lavender-dark/60 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rust">
              Uncompromising Backcountry Infrastructure
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand">Why Expeditions Choose TravelOra</h2>
          </div>
          <p className="max-w-sm text-[12px] leading-relaxed text-slate-500">
            Unlike generic booking portals, our platform directly integrates with local tribal
            leadership and government environmental bodies for total security.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, iconBg, title, text, tag }) => (
            <div key={title} className="rounded-xl bg-white p-6 shadow-sm">
              <span className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={18} />
              </span>
              <h3 className="text-[16px] font-semibold leading-snug text-brand">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{text}</p>
              <p className={`mt-4 flex items-center gap-1.5 text-[11px] font-semibold ${tag.color}`}>
                <tag.icon size={12} /> {tag.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}