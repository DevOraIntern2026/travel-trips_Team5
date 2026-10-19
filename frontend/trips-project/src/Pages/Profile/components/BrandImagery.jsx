import { useRef } from 'react';
import { BadgeCheck, FileText, ShieldCheck } from 'lucide-react';
import { Card } from './Card';
import salmanImg from '../../../assets/images/salman.png';

export default function BrandImagery({ profile, onUpload, onAltChange, onRemove }) {
    const portrait = useRef(null);
    const seal = useRef(null);
    const portraitSrc = profile.portraitUrl || salmanImg;

    return (
      <Card
        eyebrow="Public Persona"
        title="Profile & Outfitter Brand Imagery"
        aside={<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">Publicly Visible</span>}
      >
        <div className="flex gap-4">
          <div className="relative h-28 w-28 shrink-0">
            <img src={portraitSrc} alt={profile.portraitAlt || "Primary Guide Portrait"} className="h-full w-full rounded-lg object-cover shadow-sm"/>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white p-0.5 shadow">
              <BadgeCheck size={18} className="text-emerald-700" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-900">Primary Guide Portrait</p>
              <button type="button" onClick={onRemove} className="text-[11px] font-semibold text-red-600 hover:text-red-700">Remove Photo</button>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Recommended 1:1 ratio square (JPG, WebP, or PNG). Maximum file size 5MB.</p>
            <div className="my-2 flex items-center justify-between rounded-md border border-slate-200 bg-indigo-50/60 px-2.5 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={15} className="text-slate-500 shrink-0"/>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-slate-800 leading-tight">
                    {profile.portraitFileName || 'salem_aljabali_portrait_2025.jpg'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {profile.portraitFileSize || '2.8 MB • 1440×1440 px'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => portrait.current?.click()}
                className="shrink-0 rounded border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Replace
              </button>
              <input ref={portrait} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload('portrait', e.target.files[0])}/>
            </div>
            <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Accessibility Image Description (Alt Text)</label>
            <input
              className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-indigo-50/60 px-2 text-[11px] text-slate-700 focus:border-brand-800 focus:bg-white focus:outline-none"
              value={profile.portraitAlt || ''}
              onChange={(e) => onAltChange(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-indigo-50/60 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-800 shadow-sm">
              <ShieldCheck size={22} className="text-brand-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900">Jabaliya Bedouin Expeditions Seal</p>
                <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold text-teal-800 border border-teal-200">
                  Guild #441
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Stamped across digital trip vouchers, baggage tags, and military trail clearances.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => seal.current?.click()}
            className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Upload Seal Graphic
          </button>
          <input ref={seal} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload('seal', e.target.files[0])}/>
        </div>
      </Card>
    );
}
