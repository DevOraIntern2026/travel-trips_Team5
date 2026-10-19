import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Img1 from "../../assets/images/Sinai Mount.png";
import Img2 from "../../assets/images/White Desert.png";
import Img3 from "../../assets/images/siwa.png";

const trips = [
  {
    img: Img1,
    region: "South Sinai",
    badge: { text: "4 Seats Left", dot: true, className: "bg-rust text-white" },
    date: "Nov 14 – Nov 18 • 5 Days",
    title: "Sinai High Mountain Sanctuary Traverse",
    desc: "Trek with the Jebeliya Bedouins through ancient Byzantine orchards, secret rock pools, and sunrise at Mount Catherine.",
    usd: "$480",
    egp: "24,000 EGP",
  },
  {
    img: Img2,
    region: "Western Desert",
    badge: { text: "Cool Season Prime", className: "bg-white text-slate-700" },
    date: "Nov 21 – Nov 24 • 4 Days",
    title: "White Desert Lunar Traverse",
    desc: "Deep off-grid 4×4 navigation across Agabat valley, Crystal Mountain, and silent night camps under the Milky Way.",
    usd: "$420",
    egp: "21,000 EGP",
  },
  {
    img: Img3,
    region: "Siwa Oasis",
    date: "Dec 02 – Dec 07 • 6 Days",
    title: "Siwa Salt Springs & Sand Sea Crossing",
    desc: "Float in hyper-saline pools, traverse mega dunes of the Great Sand Sea, and rest in traditional kershef clay lodges.",
    usd: "$690",
    egp: "34,500 EGP",
  },
];

export default function Departures() {
  return (
    <section className="bg-lavender py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rust">Immediate Booking Access</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-brand">Cool-Season Scheduled Departures</h2>
          </div>
          <Link to="/home/expedition" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-rust transition">
            View all 24 itineraries <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-6 items-stretch">
          {trips.map((t) => (
            <article key={t.title} className="flex-1 flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-xs border border-slate-100 hover:shadow-md transition">
              <div className="flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={t.img} alt={t.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-xs">
                    {t.region}
                  </span>
                  {t.badge && (
                    <span
                      className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-xs ${t.badge.className}`}
                    >
                      {t.badge.dot && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                      {t.badge.text}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Calendar size={13} className="text-rust" /> {t.date}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-snug text-brand">{t.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.desc}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">From</span>
                    <p className="text-lg font-extrabold text-brand leading-none">
                      {t.usd} <span className="text-xs font-normal text-slate-400">/ {t.egp}</span>
                    </p>
                  </div>
                  <Link
                    to="/home/expedition"
                    className="flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-light shadow-xs"
                  >
                    Lock Seat
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}