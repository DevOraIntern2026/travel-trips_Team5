import { Eye } from 'lucide-react';
export default function ProfileHeading({ onPreview, onSave, saving, dirty }) {
    return (<div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Operator Workspace • Profile Settings</p>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900">Operator Profile &amp; Outfitter<br />Accreditations</h1>
        <p className="mt-1 max-w-xl text-xs text-slate-500">
          Manage your public outfitter profile, company details, expedition licensing, and account security. Profile information is dynamically displayed on your published South Sinai trip catalog listings and permits.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onPreview} className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700"><Eye size={13}/> Preview Outfitter Card</button>
        <button onClick={onSave} disabled={!dirty || saving} className="rounded-md bg-brand-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </div>);
}
