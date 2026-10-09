import { Map, Leaf, Droplets, HandCoins } from "lucide-react";

const perks = [
  { icon: Leaf, text: "Leave No Trace Certified" },
  { icon: Droplets, text: "Solar Water Desalination Kits" },
  { icon: HandCoins, text: "Fair-Wage Tribal Guarantee" },
];

export default function QuoteBanner() {
  return (
    <section className="bg-lavender pb-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-brand shadow-xl">
          <img
            src="/images/wadi-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-brand/30" />

          <div className="relative max-w-xl p-10 md:p-14">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100">
              <Map size={11} /> WADI &amp; CANYON CARTOGRAPHY
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-snug text-white">
              "We don't sell tourist packages. We coordinate self-contained wilderness traversals."
            </h2>

            <p className="mt-4 text-[13px] leading-relaxed text-emerald-100/75">
              Our expeditions are built in strict compliance with the Egyptian Environmental Affairs
              Agency (EEAA). That means no disposable plastic waste, strict bivouac campfire
              containment, ethical animal pack limits, and preservation of prehistoric petroglyphs in
              remote wadis.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {perks.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2 text-[11px] font-semibold text-white">
                  <Icon size={14} className="text-orange-400" /> {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}