
import {
  ShieldCheck,
  Heart,
  Radio,
  BadgeCheck,
  Mountain,
  Star,
} from "lucide-react";

import sinaiImg from "../../assets/images/Sinai.png";
import White from "../../assets/images/White Desert.png";

const miniFeatures = [
  {
    icon: ShieldCheck,
    title: "100% MTA & EEAA",
    text: "Protectorate certified non-impact wilderness code",
  },
  {
    icon: Heart,
    title: "Bedouin Council Accord",
    text: "Guaranteed direct tribal compensation & safe passage",
    pink: true,
  },
  {
    icon: Radio,
    title: "24/7 Satellite Telemetry",
    text: "Garmin InReach active relay with Cairo HQ",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lavender via-lavender to-emerald-50/60">
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-12 xl:px-16">

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-lavender-btn px-3 py-1 text-[11px] font-semibold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-rust" />
            Verified Egypt &amp; Sinai Backcountry Network
          </span>

          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            <BadgeCheck size={12} />
            MTA Lic. #4829
            <span className="text-slate-400">أهلا وسهلا</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-brand sm:text-4xl md:text-5xl lg:text-6xl">
            Begin Your Expedition Across Egypt&apos;s Sacred Wilds.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Create your TravelOra account to unlock real-time seat locks on vetted Bedouin treks,
            4×4 Sahara bivouacs, and exclusive regional military permits with zero friction.
          </p>
        </div>

        {/* Mini features */}
        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {miniFeatures.map(({ icon: Icon, title, text, pink }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-md ${
                  pink
                    ? "bg-rose-100 text-rose-500"
                    : "bg-lavender-btn text-brand"
                }`}
              >
                <Icon size={17} />
              </span>

              <h3 className="text-sm font-bold text-brand">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Image cards */}
        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-[1.45fr_1fr]">

          {/* Sinai image */}
          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 lg:h-96">
            <img
              src={sinaiImg}
              alt="St. Catherine"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-700 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rust" />
              South Sinai Trail
            </span>

            <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <h3 className="text-lg font-bold sm:text-2xl">
                St. Catherine &amp; Mount Sinai Ridge
              </h3>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/80 sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Mountain size={14} />
                  2,285m Golden Dawn
                </span>

                <span>4-Day Traverse</span>
              </div>
            </div>
          </div>

          {/* Sahara image */}
          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 lg:h-96">
            <img
              src={White}
              alt="Sahara"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <span className="absolute right-4 top-4 rounded-full bg-rust px-3 py-1.5 text-[10px] font-semibold text-white sm:text-xs">
              Bivouac
            </span>

            <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <h3 className="text-lg font-bold sm:text-xl">
                Sahara Lunar Monoliths
              </h3>

              <p className="mt-1 text-xs text-white/80 sm:text-sm">
                Farafra White Desert chalk towers
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-6 flex w-full max-w-6xl items-start gap-4 rounded-xl bg-lavender-dark/70 p-4 sm:p-6">
          <img
            src="/images/avatar.jpg"
            alt="Layla"
            className="h-11 w-11 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
              <span className="flex text-rust">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>

              <span className="font-semibold text-slate-500">
                Verified Trekker #214
              </span>
            </div>

            <p className="mt-2 text-sm italic leading-relaxed text-brand sm:text-base">
              &quot;The St. Catherine traverse was flawless. Having local Bedouin guides and guaranteed
              EEAA permits pre-cleared made what is usually a bureaucratic nightmare into pure
              wilderness magic.&quot;
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-600 sm:text-sm">
              Layla Mansour — Cairo &amp; Sinai Pass Member
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
