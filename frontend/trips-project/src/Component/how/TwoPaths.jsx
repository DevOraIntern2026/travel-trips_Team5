import { Sprout, Compass, CheckCircle2, ArrowRight } from "lucide-react";

const paths = [
  {
    icon: Sprout,
    iconBg: "bg-teal-100 text-teal-800",
    badge: "FOR TRAVELERS",
    badgeCls: "bg-lavender-btn text-brand",
    title: "Fearless Wilderness Travel",
    sub: "Vetted expeditions designed for both solo trekkers and intimate private cohorts.",
    items: [
      ["Guaranteed Military & EEAA Paperwork:", "All border check clearances managed transparently."],
      ["Dual-Currency Rate Parity:", "Zero black-market foreign exchange penalty for international cards."],
      ["24/7 Cairo Command Watch:", "Live telemetry watch and satellite health check-ins twice daily."],
      ["Weather & Security Flexibility:", "Instant rescheduling guarantee if desert storms or border restrictions shift."],
    ],
    cta: "Find Your Next Trek",
    ctaCls: "text-brand",
    note: "100% Escrow Protected",
  },
  {
    icon: Compass,
    iconBg: "bg-rose-100 text-rust",
    badge: "FOR GUIDES & OPERATORS",
    badgeCls: "bg-rose-100 text-rust",
    title: "Operational Dignity & Fair Yield",
    sub: "Built in partnership with South Sinai, Siwa, and Farafra clan councils to end broker exploitation.",
    items: [
      ["Instant Payouts via InstaPay / Bank Misr:", "Funds cleared upon dispatch without 60-day agency delays."],
      ["Free Satellite Hardware Kits:", "We supply solar batteries and Garmin InReach devices for verified leaders."],
      ["Direct Traveler Manifests:", "No predatory tour-agencies taking 50–70% of local tariffs."],
      ["Automated Regulatory Submissions:", "Upload guest passports, let TravelOra handle Ministry filings."],
    ],
    cta: "Join as Certified Guide",
    ctaCls: "text-rust",
    note: "Clan Affiliation Required",
  },
];

export default function TwoPaths() {
  return (
    <section className="bg-lavender-dark/50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Ecosystem Parity</p>
          <h2 className="mt-2 text-3xl font-extrabold text-brand">Two Paths, One Frictionless Platform</h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-500">
            Whether you are an individual explorer strapping on boots or an accredited Bedouin
            operator managing camel caravans, TravelOra coordinates every layer.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {paths.map((p) => (
            <article key={p.title} className="flex flex-col rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${p.iconBg}`}>
                  <p.icon size={20} />
                </span>
                <span className={`rounded px-2 py-1 font-mono text-[9px] font-bold tracking-wide ${p.badgeCls}`}>
                  {p.badge}
                </span>
              </div>

              <h3 className="mt-4 text-[20px] font-semibold text-brand">{p.title}</h3>
              <p className="mt-1 text-[12px] leading-snug text-slate-500">{p.sub}</p>

              <ul className="mt-4 space-y-2.5">
                {p.items.map(([b, t]) => (
                  <li key={b} className="flex items-start gap-2 text-[12px] leading-snug text-slate-500">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-rust" />
                    <span>
                      <b className="font-semibold text-brand">{b}</b> {t}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <a href="#" className={`flex items-center gap-1.5 text-[12px] font-bold ${p.ctaCls} hover:underline`}>
                  {p.cta} <ArrowRight size={13} />
                </a>
                <span className="font-mono text-[9px] text-slate-400">{p.note}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}