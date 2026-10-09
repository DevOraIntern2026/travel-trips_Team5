import { ShieldCheck, TreePine, Asterisk, Satellite } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "MTA Egypt", sub: "Tour Operator Lic. #4829" },
  { icon: TreePine, title: "EEAA Protectorates", sub: "Class-A Conservation Custodian" },
  { icon: Asterisk, title: "Wilderness Med (WMS)", sub: "Certified Remote First Responders" },
  { icon: Satellite, title: "Garmin InReach", sub: "Authorized Field Telemetry Node" },
];

export default function Accreditations() {
  return (
    <section className="bg-lavender-dark/60 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Officially Accredited &amp; Field Verified By
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
              <Icon size={18} className="text-brand" />
              <div>
                <p className="text-[13px] font-semibold leading-tight text-brand">{title}</p>
                <p className="text-[9px] text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}