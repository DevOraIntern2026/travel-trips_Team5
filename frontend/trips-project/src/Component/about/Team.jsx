import tarekImg from "../../assets/images/tarek.png"
import salemImg from "../../assets/images/salman.png"
import laylakImg from "../../assets/images/layla.png"
import kareemImg from "../../assets/images/kareem.png"



const team = [
  {
    img: tarekImg,
    tag: "LOGISTICS CHIEF",
    name: "Tarek El-Sayed",
    role: "Co-Founder & CEO",
    bio: "Former Alpine trekker and logistics strategist who pioneered real-time GPS fleet clearances across Egypt's Western Oases.",
  },
  {
    img: salemImg ,
    tag: "TRIBAL ELDER",
    name: "Sheikh Salem Al-Jabali",
    role: "Co-Founder & Tribal Relations",
    bio: "Jabaliya elder who has navigated St. Catherine's treacherous canyons for over 45 years. Spokesperson for South Sinai clan councils.",
  },
  {
    img: laylakImg,
    tag: "MEDICAL CONTROL",
    name: "Dr. Layla Mansour",
    role: "Chief Safety Officer",
    bio: "Specialized in desert wilderness trauma, heat pathology, and satellite-guided search and rescue dispatch.",
  },
  {
    img: kareemImg ,
    tag: "EEAA LIAISON",
    name: "Kareem Fouad",
    role: "Lead Field Ranger & Ecology",
    bio: "Ten-year veteran ranger with the Egyptian Environmental Affairs Agency, overseeing zero-trace waste manifests.",
  },
];

export default function Team() {
  return (
    <section className="bg-lavender pb-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Field Leadership</p>
            <h2 className="mt-1 text-3xl font-extrabold text-brand">The Architects of Your Expedition</h2>
          </div>
          <p className="max-w-xs text-[11px] leading-relaxed text-slate-500">
            Combining decades of Cairo command dispatch, emergency medicine, Bedouin elder
            navigation, and environmental oversight.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <article key={m.name} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative h-52 bg-slate-300">
                <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded bg-brand px-2 py-1 font-mono text-[9px] font-semibold tracking-wide text-white">
                  {m.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-bold text-brand">{m.name}</h3>
                <p className="mt-0.5 text-[11px] font-semibold text-rust">{m.role}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}