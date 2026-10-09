import { ShieldCheck, Leaf, Handshake, MapPin } from "lucide-react";

const badges = [
  { icon: null, dot: true, text: "MTA Lic. #4829" },
  { icon: Leaf, text: "EEAA Protected Custodian" },
  { icon: Handshake, text: "Bedouin Sheikh Council Partner" },
  { icon: MapPin, text: "CAIRO HQ: 30.0444° N, 31.2357° E" },
];

export default function BreadcrumbBar() {
  return (
    <div className="bg-lavender-dark/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2.5">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <a href="/" className="hover:text-brand">Home</a>
          <span>/</span>
          <span>Company</span>
          <span>/</span>
          <span className="font-semibold text-brand">About TravelOra</span>
        </nav>

        <div className="hidden flex-wrap gap-2 lg:flex">
          {badges.map(({ icon: Icon, dot, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-700 shadow-sm"
            >
              {dot && <span className="h-1.5 w-1.5 rounded-full bg-rust" />}
              {Icon && <Icon size={11} className="text-brand" />}
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}