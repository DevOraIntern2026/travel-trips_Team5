import { AlertCircle } from 'lucide-react';
export default function UnsavedBar({ onDiscard, onSave, saving }) {
    return (<div className="fixed bottom-4 left-[210px] right-0 z-20 mx-auto flex w-[calc(100%-250px)] max-w-[1060px] items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white shadow-xl">
      <div className="flex items-center gap-2.5">
        <AlertCircle size={16} className="text-red-400"/>
        <div>
          <p className="text-xs font-bold">Unsaved adjustments detected</p>
          <p className="text-[10px] text-white/60">Outfitter bio and field alert dispatch settings modified.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onDiscard} className="text-[11px] font-medium text-white/80">Discard</button>
        <button onClick={onSave} disabled={saving} className="rounded-md bg-brand-800 px-4 py-1.5 text-[11px] font-semibold disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </div>);
}
