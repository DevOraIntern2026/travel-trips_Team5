import { useCallback, useEffect, useState } from 'react';
import { bookingsService } from '../services/bookings';
export function useBookings(query) {
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const key = JSON.stringify(query);
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [list, s] = await Promise.all([bookingsService.list(query), bookingsService.stats()]);
            setData(list);
            setStats(s);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    useEffect(() => { void load(); }, [load]);
    return { data, stats, loading, error, reload: load };
}
