import { Languages, Plus } from 'lucide-react';
export default function LanguagesField({ value, onChange }) {
    const add = () => {
        const name = window.prompt('Language name');
        if (name)
            onChange([...value, { name, level: 'Fluent' }]);
    };
    return (<div>
      <label className="mb-1 block text-[11px] font-semibold text-slate-700">Expedition Languages Spoken on Trail</label>
      <div className="flex flex-wrap items-center gap-2">
        {value.map((l, i) => (<button key={l.name} onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remove" className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${i < 2 ? 'bg-brand-800 text-white' : 'bg-indigo-50 text-slate-700'}`}>
            <Languages size={11}/> {l.name} <span className="font-normal opacity-80">({l.level})</span>
          </button>))}
        <button onClick={add} className="flex items-center gap-1 text-[11px] font-semibold text-slate-600"><Plus size={11}/> Add Language</button>
      </div>
    </div>);
}