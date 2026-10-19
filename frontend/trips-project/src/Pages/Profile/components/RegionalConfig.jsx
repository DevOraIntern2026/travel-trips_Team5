import { Globe, Clock, Coins } from 'lucide-react';
function Row({ label, icon: Icon, value, onChange, options }) {
    return (<div>
      <label className="mb-1 block text-[11px] font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <Icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-indigo-50/60 pl-8 pr-2 text-xs focus:border-brand-800 focus:outline-none">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>);
}
export default function RegionalConfig({ profile: p, onChange }) {
    return (<section className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Regional Configuration</p>
      <h2 className="mb-3 text-base font-bold text-slate-900">Localization &amp; Operational Timezone</h2>
      <div className="space-y-3">
        <Row label="Portal Language" icon={Globe} value={p.portalLanguage} onChange={(v) => onChange({ portalLanguage: v })} options={['English (US) – Operator Standard', 'العربية (مصر)']}/>
        <Row label="Operational Expedition Timezone" icon={Clock} value={p.timezone} onChange={(v) => onChange({ timezone: v })} options={['Cairo (GMT+2) – Eastern European Time (EET)']}/>
        <Row label="Financial Ledger Display Currency" icon={Coins} value={p.currencyDisplay} onChange={(v) => onChange({ currencyDisplay: v })} options={['Dual Display (Recommended) – USD ($) / EGP (ج.م)', 'EGP only', 'USD only']}/>
        <p className="text-[10px] text-slate-400">Real-time peg synchronized with Central Bank of Egypt daily fixes.</p>
      </div>
    </section>);
}