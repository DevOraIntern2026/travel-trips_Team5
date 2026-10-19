import { User, Building2, BadgeInfo, AtSign, Phone, MapPin } from 'lucide-react';
import { Card, fieldCls, labelCls } from './Card';
import LanguagesField from './LanguagesField';
const BIO_MAX = 500;
function Field({ label, hint, icon: Icon, value, onChange, required }) {
    return (<div>
      <label className={labelCls}>{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="relative">
        <Icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input className={`${fieldCls} pl-8`} value={value} onChange={(e) => onChange(e.target.value)}/>
      </div>
      {hint && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
    </div>);
}
export default function PersonalInfoForm({ profile: p, onChange }) {
    return (<Card eyebrow="Registry Credentials" title="Personal & Business Information">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field required label="Full Legal Name" icon={User} value={p.fullName} onChange={(v) => onChange({ fullName: v })}/>
          <Field required label="Outfitter / Entity Name" icon={Building2} value={p.entityName} onChange={(v) => onChange({ entityName: v })}/>
        </div>
        <Field label="Operational Title & Field Role" icon={BadgeInfo} value={p.title} onChange={(v) => onChange({ title: v })}/>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field required label="Primary Dispatch Email" icon={AtSign} value={p.email} onChange={(v) => onChange({ email: v })} hint="Used for official booking manifests and emergency sat-phone bridge."/>
          <Field required label="Primary Emergency / Satellite Contact" icon={Phone} value={p.phone} onChange={(v) => onChange({ phone: v })} hint="Includes St. Catherine Base Station landline and cellular bridge."/>
        </div>
        <Field required label="Command Base Location" icon={MapPin} value={p.baseLocation} onChange={(v) => onChange({ baseLocation: v })}/>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-700">Outfitter Bio &amp; Heritage Lore</label>
            <span className="font-mono text-[10px] text-slate-400">{p.bio?.length ?? 0} / {BIO_MAX} characters</span>
          </div>
          <textarea rows={5} maxLength={BIO_MAX} value={p.bio ?? ''} onChange={(e) => onChange({ bio: e.target.value })} className="w-full resize-none rounded-md border border-slate-200 bg-indigo-50/60 p-2.5 text-xs leading-relaxed focus:border-brand-800 focus:bg-white focus:outline-none"/>
          <p className="mt-1 text-[10px] text-slate-400">This narrative appears in the "Meet Your Pathfinder" section of all your expedition booking pages.</p>
        </div>
        <LanguagesField value={p.languages} onChange={(languages) => onChange({ languages })}/>
      </div>
    </Card>);
}
