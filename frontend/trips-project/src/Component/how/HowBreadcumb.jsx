export default function HowBreadcrumb() {
  return (
    <div className="bg-lavender-dark/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2.5">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <a href="/" className="hover:text-brand">Home</a>
          <span>/</span>
          <span className="font-semibold text-brand">How It Works</span>
          <span>/</span>
          <span>Verified Egypt &amp; Sinai Backcountry Logistics</span>
        </nav>

        <div className="hidden items-center gap-4 text-[10px] font-semibold md:flex">
          <span className="flex items-center gap-1.5 text-rust">
            <span className="h-1.5 w-1.5 rounded-full bg-rust" />
            Fall/Winter 2025/26 Clearance Active
          </span>
          <span className="font-mono uppercase tracking-wide text-brand">
            EEAA Protocol Ref: #TRV-894-EGY
          </span>
        </div>
      </div>
    </div>
  );
}