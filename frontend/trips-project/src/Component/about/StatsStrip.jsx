const stats = [
  { value: "100%", title: "Direct Tribal Compensation", text: "Fair-share revenue model directly remitted to Jabaliya, Tarabin, and Siwan Berber elders.", rust: true },
  { value: "24/7", title: "Satellite Telemetry Desk", text: "Cairo logistics desk paired live to dual-frequency Garmin InReach mesh nodes in real time." },
  { value: "Zero", title: "Trace EEAA Protocols", text: "Strict ecological leave-no-trace protocols certified by Egyptian Nature Conservation rangers.", rust: true },
  { value: "4,200+", title: "Safely Guided Explorers", text: "Zero unmanaged emergency field incidents across 6 years of deep desert wilderness routing." },
];

export default function StatsStrip() {
  return (
    <section className="bg-lavender pb-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.title}>
              <p className={`text-4xl font-extrabold tracking-tight ${s.rust ? "text-rust" : "text-brand"}`}>
                {s.value}
              </p>
              <h3 className="mt-2 text-[14px] font-semibold text-brand">{s.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}