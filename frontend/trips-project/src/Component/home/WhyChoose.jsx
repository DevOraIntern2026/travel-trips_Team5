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
    <section className="bg-lavender-dark/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rust">
              Uncompromising Backcountry Infrastructure
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-brand">
              Why Expeditions Choose TravelOra
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-slate-500">
            Unlike generic booking portals, our platform directly integrates with local tribal
            leadership and government environmental bodies for total security.
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-5 items-stretch">
          {cards.map(({ icon: Icon, iconBg, title, text, tag }) => (
            <div
              key={title}
              className="flex-1 flex flex-col justify-between rounded-xl bg-white p-6 shadow-xs border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-start">
                <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                  <Icon size={18} />
                </span>
                <h3 className="text-base font-bold leading-snug text-brand">{title}</h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500">{text}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-50">
                <p className={`flex items-center gap-1.5 text-[11px] font-semibold ${tag.color}`}>
                  <tag.icon size={13} /> {tag.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}