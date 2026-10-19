import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
export default function SyncBanner({ message }) {
    const [open, setOpen] = useState(true);
    if (!open)
        return null;
    return (<div className="mb-4 flex items-center justify-between rounded-lg bg-brand-800 px-4 py-2.5 text-xs font-medium text-white shadow-sm">
      <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-white"/> {message}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-wider text-emerald-200/80">REV #441-2026</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss" className="text-white/80 hover:text-white"><X size={14}/></button>
      </div>
    </div>);
}
