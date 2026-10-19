
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
import laylaImg from "../../assets/images/layla.png";

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
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-10 sm:px-8 lg:px-12 xl:px-16 flex flex-col items-center">

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender-btn px-3.5 py-1 text-[11px] font-semibold text-brand shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-rust" />
            Verified Egypt &amp; Sinai Backcountry Network
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-semibold text-slate-600 shadow-xs">
            <BadgeCheck size={13} className="text-brand" />
            MTA Lic. #4829
            <span className="text-slate-400 font-normal">أهلا وسهلا</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-4xl text-center flex flex-col items-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-brand sm:text-4xl md:text-5xl lg:text-6xl">
            Begin Your Expedition Across Egypt&apos;s Sacred Wilds.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Create your TravelOra account to unlock real-time seat locks on vetted Bedouin treks,
            4×4 Sahara bivouacs, and exclusive regional military permits with zero friction.
          </p>
        </div>

        {/* Mini features */}
        <div className="mx-auto mt-8 flex flex-col sm:flex-row flex-wrap lg:flex-nowrap w-full max-w-6xl gap-4 items-stretch justify-center">
          {miniFeatures.map(({ icon: Icon, title, text, pink }) => (
            <div
              key={title}
              className="flex-1 min-w-[240px] flex flex-col justify-between rounded-xl bg-white p-5 shadow-xs transition-all hover:shadow-md border border-slate-100"
            >
              <div className="flex flex-col items-start">
                <span
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
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
            </div>
          ))}
        </div>

        {/* Image cards */}
        <div className="mx-auto mt-8 flex flex-col md:flex-row w-full max-w-6xl gap-5">

          {/* Sinai image */}
          <div className="relative flex-1 md:flex-[1.45] h-72 sm:h-84 lg:h-96 overflow-hidden rounded-2xl shadow-sm group">
            <img
              src={sinaiImg}
              alt="St. Catherine"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-rust" />
                  South Sinai Trail
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  St. Catherine &amp; Mount Sinai Ridge
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-white/90 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Mountain size={15} />
                    2,285m Golden Dawn
                  </span>

                  <span className="rounded-md bg-white/20 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold">
                    4-Day Traverse
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sahara image */}
          <div className="relative flex-1 md:flex-[1] h-72 sm:h-84 lg:h-96 overflow-hidden rounded-2xl shadow-sm group">
            <img
              src={White}
              alt="Sahara"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 text-white">
              <div className="flex items-center justify-end">
                <span className="rounded-full bg-rust px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                  Bivouac
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Sahara Lunar Monoliths
                </h3>

                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  Farafra White Desert chalk towers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-6 flex w-full max-w-6xl items-start gap-4 rounded-xl bg-lavender-dark/80 p-5 sm:p-6 border border-brand/10 shadow-xs">
          <img
            src={laylaImg}
            alt="Layla"
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
          />

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
              <span className="flex text-rust">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </span>

              <span className="font-bold text-slate-600">
                Verified Trekker #214
              </span>
            </div>

            <p className="mt-2 text-sm italic leading-relaxed text-brand sm:text-base font-medium">
              &quot;The St. Catherine traverse was flawless. Having local Bedouin guides and guaranteed
              EEAA permits pre-cleared made what is usually a bureaucratic nightmare into pure
              wilderness magic.&quot;
            </p>

            <p className="mt-2 text-xs font-bold text-slate-600 sm:text-sm">
              Layla Mansour — <span className="font-normal text-slate-500">Cairo &amp; Sinai Pass Member</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
