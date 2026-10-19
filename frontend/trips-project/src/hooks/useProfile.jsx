import { useEffect, useMemo, useState } from 'react';
import { profileService } from '../services/profile';
export function useProfile() {
    const [saved, setSaved] = useState(null);
    const [draft, setDraft] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        profileService.get().then((p) => { setSaved(p); setDraft(p); }).catch((e) => setError(e.message));
    }, []);
    const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
    const patch = (p) => setDraft((d) => (d ? { ...d, ...p } : d));
    const discard = () => setDraft(saved);
    const save = async () => {
        if (!draft)
            return;
        setSaving(true);
        try {
            const next = await profileService.update(draft);
            setSaved(next);
            setDraft(next);
            setError(null);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        }
        finally {
            setSaving(false);
        }
    };
    return { draft, dirty, saving, error, patch, discard, save };
}
