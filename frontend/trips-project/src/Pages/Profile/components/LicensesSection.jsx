import { ShieldCheck, Building, HeartHandshake, FileText, CheckCircle2, Download, Plus } from 'lucide-react';
import { Card } from './Card';

const icons = [ShieldCheck, Building, HeartHandshake, FileText];

export default function LicensesSection({ licenses = [] }) {
    return (
      <Card
        eyebrow="Protectorate Governance"
        title="Sovereign Licensing & Guide Accreditations"
        aside={
          <button type="button" className="flex items-center gap-1 text-[11px] font-semibold text-brand-800 hover:text-brand-900 transition-colors">
            <Plus size={12} /> Submit New License
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {licenses.map((l, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={l.id} className="relative rounded-lg bg-indigo-50/60 p-3.5 border border-slate-100 flex flex-col justify-between">
                {l.fileSize ? (
                  <span className="absolute right-3 top-3 rounded bg-slate-200/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-slate-700 leading-tight">
                    {l.fileSize}
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span> {l.state === 'active' ? 'Active' : 'Valid'}
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm border border-slate-200/60">
                    <Icon size={16}/>
                  </span>
                  <div className="min-w-0 pr-12">
                    <p className="text-[13px] font-bold leading-tight text-slate-900">{l.title}</p>
                    <p className="font-mono text-[9px] text-slate-500 mt-0.5">{l.reference}</p>
                  </div>
                </div>
                <div className="mt-3.5 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/40">
                  <span className="font-medium">{l.footer}</span>
                  {l.renewed && <span className="font-semibold text-slate-600">{l.renewed}</span>}
                  {l.action === 'validated' && (
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <CheckCircle2 size={12} className="text-emerald-700"/> Validated
                    </span>
                  )}
                  {l.action === 'download' && (
                    <button type="button" className="flex items-center gap-1 font-semibold text-slate-800 hover:text-black">
                      <Download size={11} /> Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
}
