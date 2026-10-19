export const fieldCls = 'h-9 w-full rounded-md border border-slate-200 bg-indigo-50/60 px-2.5 text-xs text-slate-900 focus:border-brand-800 focus:bg-white focus:outline-none';
export const labelCls = 'mb-1 block text-[11px] font-semibold text-slate-700';
export function Card({ eyebrow, title, aside, children, className = '' }) {
    return (<section className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{eyebrow}</p>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>);
}
