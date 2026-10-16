import { Calendar, ArrowRight } from "lucide-react";
import Img1 from "../../assets/images/Sinai Mount.png"
import Img2 from "../../assets/images/White Desert.png"
import Img3 from "../../assets/images/siwa.png"
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
    <section className="bg-lavender py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Immediate Booking Access</p>
            <h2 className="mt-1 text-3xl font-extrabold text-brand">Cool-Season Scheduled Departures</h2>
          </div>
          <a href="#" className="flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline">
            View all 24 itineraries <ArrowRight size={13} />
          </a>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {trips.map((t) => (
            <article key={t.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative h-44">
                <img src={t.img} alt={t.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                  {t.region}
                </span>
                {t.badge && (
                  <span
                    className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${t.badge.className}`}
                  >
                    {t.badge.dot && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    {t.badge.text}
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <Calendar size={12} /> {t.date}
                </p>
                <h3 className="mt-2 text-[15px] font-bold leading-snug text-brand">{t.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">{t.desc}</p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">From</p>
                    <p className="text-xl font-extrabold text-brand">
                      {t.usd} <span className="text-[11px] font-normal text-slate-400">/ {t.egp}</span>
                    </p>
                  </div>
                  <button className="rounded-lg bg-lavender-btn px-4 py-2 text-[12px] font-semibold text-brand transition hover:bg-brand hover:text-white">
                    Lock Seat
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}