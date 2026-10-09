import {
  CheckCircle2, Footprints, Wallet, Users, Smartphone, Snowflake, Lock,
  Tag, Asterisk, Home,
} from "lucide-react";

/* ---------- Wrapper ---------- */
function PhaseCard({ phase, rose, metaIcon: MetaIcon, meta, title, text, footer, footerIcon: FooterIcon, footerRust, children }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-sm">
      {/* decorative circle */}
      <span className={`pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full ${rose ? "bg-rose-100/70" : "bg-lavender-dark"}`} />

      <div className="relative flex items-center justify-between">
        <span
          className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider ${
            rose ? "bg-rose-100 text-rust" : "bg-teal-100 text-teal-800"
          }`}
        >
          {phase}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
          <MetaIcon size={11} /> {meta}
        </span>
      </div>

      <h3 className="relative mt-4 text-[20px] font-semibold leading-snug text-brand">{title}</h3>
      <p className="relative mt-2 text-[13px] leading-relaxed text-slate-500">{text}</p>

      <div className="relative mt-4">{children}</div>

      <div className="relative mt-auto flex items-center justify-between pt-5 text-[10px] font-medium text-brand">
        <span>{footer}</span>
        <FooterIcon size={14} className={footerRust ? "text-rust" : "text-brand"} />
      </div>
    </article>
  );
}

/* ---------- Section ---------- */
export default function Phases() {
  return (
    <section className="bg-lavender py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Standard Operating Procedure</p>
            <h2 className="mt-1 text-3xl font-extrabold text-brand">The 4-Stage Wilderness Architecture</h2>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-500">
              From algorithmic equipment calculations to frontier checkpoint approvals, every
              expedition runs on a transparent, safety-tested framework.
            </p>
          </div>
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-brand shadow-sm">
            <CheckCircle2 size={12} /> Verified by Egyptian Ministry of Tourism &amp; Antiquities
          </span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* PHASE 01 */}
          <PhaseCard
            phase="PHASE 01"
            metaIcon={Footprints}
            meta="Discovery & Terrain Match"
            title="Select & Vetted Trail Curation"
            text="Select your route across South Sinai's high granite peaks, White Desert chalk labyrinths, Siwa's dunes, or Red Sea deep sandstone canyons. Each trail comes graded by physical endurance, bivouac style, and altitude metrics."
            footer="Pack Lists & Season Windows Provided"
            footerIcon={Snowflake}
          >
            <div className="rounded-lg bg-lavender-btn/70 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-brand">▲ Sample Grading: Sinai High Summit Circuit</p>
                <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rust">GRADE 3 / 4</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["64.5 km", "Total Distance"],
                  ["2,629 m", "Max Elevation"],
                  ["Bedouin Hearth", "Bivouac Standard"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-md bg-white px-2 py-2">
                    <p className="text-[12px] font-bold text-brand">{v}</p>
                    <p className="text-[9px] text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </PhaseCard>

          {/* PHASE 02 */}
          <PhaseCard
            phase="PHASE 02"
            rose
            metaIcon={Wallet}
            meta="Dual-Currency & Sovereign Permits"
            title="Automated Clearance & Zero-FX Lock"
            text="Lock your departure in Egyptian Pounds (EGP) for domestic trekkers or USD for global travelers with zero shadow exchange fees. Booking automatically activates security manifests sent direct to Border Guards, EEAA, and local police."
            footer="Funds Held in Licensed Central Bank Escrow"
            footerIcon={Lock}
            footerRust
          >
            <div className="rounded-lg bg-lavender-btn/70 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-brand">Permit Issuance Pipeline (72h SLA)</p>
                <span className="font-mono text-[9px] font-semibold text-rust">Automated Status</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full w-full rounded-full bg-brand" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                <span>1. Passport Tokenized</span>
                <span className="font-bold text-brand">2. EEAA Approved</span>
                <span>3. Checkpoint Manifest</span>
              </div>
            </div>
          </PhaseCard>

          {/* PHASE 03 */}
          <PhaseCard
            phase="PHASE 03"
            metaIcon={Users}
            meta="Indigenous Leadership"
            title="Generational Tribal Pathfinders"
            text="You are paired directly with master pathfinders from recognized clan federations: Jabaliya around Mt. Sinai, Tarabin on coastal ridges, and Siwan Berbers. 100% of guide stipends flow to tribal councils without intermediary dilution."
            footer="Chartered Tribal Union Protocol Approved"
            footerIcon={Tag}
          >
            <div className="flex items-center gap-3 rounded-lg bg-lavender-btn/70 p-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Home size={18} />
              </span>
              <div>
                <p className="text-[12px] font-bold text-brand">Authentic Campcraft & Desert Hearth</p>
                <p className="text-[10px] leading-snug text-slate-500">
                  Traditional Libba flatbread baked on coals, medicinal desert botany, and oral star
                  navigation lore.
                </p>
              </div>
            </div>
          </PhaseCard>

          {/* PHASE 04 */}
          <PhaseCard
            phase="PHASE 04"
            rose
            metaIcon={Smartphone}
            meta="Real-Time Telemetry & Evac"
            title="Garmin InReach Backcountry Mesh"
            text="Unplug without risking safety. Every expedition pack includes a live satellite transceiver transmitting coordinates every 10 minutes to our 24/7 Cairo Command Hub, maintaining an active emergency extraction chain."
            footer="Continuous Satellite Geofencing"
            footerIcon={Asterisk}
            footerRust
          >
            <div className="rounded-lg bg-lavender-btn/70 p-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active Transponder Mesh
                </p>
                <span className="font-mono text-[9px] font-bold text-brand">&lt; 42 MIN RESPONSE TIME</span>
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-slate-500">
                Cairo HQ monitors SOS dispatch corridors, 4×4 staging points, and hyperbaric / desert
                medical facilities across Dahab, Sharm, and Bahariya.
              </p>
            </div>
          </PhaseCard>
        </div>
      </div>
    </section>
  );
}