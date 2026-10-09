import { ArrowRight } from "lucide-react";
import aboutImg from "../../assets/images/White Desert.png"
import aboutImg1 from "../../assets/images/Sinai Mount.png"
const avatars = [
  { t: "EJ", c: "bg-brand" },
  { t: "SK", c: "bg-rust" },
  { t: "LM", c: "bg-sky-900" },
];

export default function AboutHero() {
  return (
    <section className="bg-lavender">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rust">
              Field Philosophy &amp; Mission
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Est. 2018 · Cairo
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand md:text-[44px]">
            Bridging Ancient Bedouin Wisdom with Modern Backcountry Safety.
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-600">
            TravelOra was founded in Cairo to unlock Egypt's sacred granite massifs, surreal chalk
            deserts, and remote Sahara oases through sovereign tribal alliances, transparent
            dual-currency booking, and real-time satellite telemetry.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[13px] font-semibold text-white hover:bg-brand-light">
              Explore Active Expeditions <ArrowRight size={14} />
            </button>
            <button className="rounded-lg bg-lavender-btn px-5 py-3 text-[13px] font-semibold text-brand hover:bg-lavender-dark">
              Read Tribal Accord
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <span
                  key={a.t}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-lavender text-[10px] font-bold text-white ${a.c}`}
                >
                  {a.t}
                </span>
              ))}
            </div>
            <p className="max-w-xs text-[12px] leading-snug text-slate-500">
              Vetted continuously by 14 Bedouin clan elders across South Sinai &amp; the Western Oases.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="relative pb-8">
          <div className="relative h-[380px] overflow-hidden rounded-2xl bg-slate-300 shadow-xl">
            <img src={aboutImg1} alt="Mount Sinai massif" className="h-full w-full object-cover brightness-110 contrast-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl bg-white/90 px-5 py-3 backdrop-blur md:pl-56">
              <div>
                <p className="text-[13px] font-bold text-brand">Mount Catherine Massif</p>
                <p className="text-[11px] text-slate-500">2,629m elevation</p>
              </div>
              <span className="rounded-md bg-lavender-btn px-2.5 py-1 font-mono text-[10px] font-semibold text-brand">
                JABALIYA CLAN LED
              </span>
            </div>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-0 left-4 w-52 rounded-xl bg-white p-2.5 shadow-2xl md:-left-12">
            <div className="relative h-28 overflow-hidden rounded-lg bg-slate-300">
              <img src={aboutImg} alt="Farafra Basin" className="h-full w-full object-cover" />
              <span className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 font-mono text-[9px] font-semibold text-white">
                Farafra Basin
              </span>
            </div>
            <p className="mt-2 text-[12px] font-bold text-brand">White Desert National Park</p>
            <p className="text-[10px] text-slate-500">EEAA Wilderness Zone A</p>
          </div>
        </div>
      </div>
    </section>
  );
}