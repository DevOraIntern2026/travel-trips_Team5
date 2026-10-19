import { useState } from 'react';
import { Eye, EyeOff, KeyRound, ExternalLink } from 'lucide-react';
import { profileService } from '../../../services/profile';

function strength(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-4
}

function PwInput({ label, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (<div>
      <label className="mb-1 block text-[11px] font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-indigo-50/60 px-2.5 pr-8 text-xs focus:border-brand-800 focus:bg-white focus:outline-none"/>
        <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle visibility">{show ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
      </div>
    </div>);
}

export default function SecurityCard() {
    const [current, setCurrent] = useState('SinaiSunrise2024!');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [msg, setMsg] = useState(null);
    const s = next ? strength(next) : 4;
    const label = next ? ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s] : 'Strong';

    const submit = async () => {
        if (next !== confirm)
            return setMsg({ ok: false, text: 'Passwords do not match.' });
        try {
            await profileService.changePassword(current, next);
            setMsg({ ok: true, text: 'Password updated.' });
            setNext('');
            setConfirm('');
        }
        catch (e) {
            setMsg({ ok: false, text: e instanceof Error ? e.message : 'Update failed.' });
        }
    };

    return (<section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Security Protocol</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 cursor-pointer hover:text-slate-800">
          Model Mode <ExternalLink size={10} />
        </span>
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-900">Change Password</h2>
      <p className="mb-4 text-[11px] text-slate-500">Ensure your operator credentials use a strong passphrase of at least 8 alphanumeric characters to protect expedition roster privacy.</p>
      <div className="space-y-3">
        <PwInput label="Current Password" value={current} onChange={setCurrent}/>
        <PwInput label="New Strong Password" value={next} onChange={setNext} placeholder="Enter new passphrase"/>
        <div>
          <div className="mb-1 flex justify-between text-[10px] text-slate-500"><span>Complexity Score</span><span className="font-semibold text-emerald-700">{label}</span></div>
          <div className="h-1 rounded bg-slate-100"><div className="h-1 rounded bg-brand-800 transition-all" style={{ width: `${(s / 4) * 100}%` }}/></div>
        </div>
        <PwInput label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new passphrase"/>
        {msg && <p className={`text-[11px] ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}
        <button onClick={submit} disabled={!current || (next && s < 2)} className="flex w-full items-center justify-center gap-1.5 rounded-md bg-indigo-100 py-2 text-xs font-semibold text-brand-900 hover:bg-indigo-200 transition-colors disabled:opacity-60"><KeyRound size={13}/> Update Password</button>
      </div>
    </section>);
}
