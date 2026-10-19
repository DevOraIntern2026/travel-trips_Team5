const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export async function api(path, init = {}) {
    const token = localStorage.getItem('access_token');
    const isForm = init.body instanceof FormData;
    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(isForm ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.message ?? res.statusText);
    }
    return res.status === 204 ? undefined : res.json();
}
