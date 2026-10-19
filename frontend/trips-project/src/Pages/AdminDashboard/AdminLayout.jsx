import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Shared fetch wrapper: Bearer token from localStorage + one silent refresh on 401.
export async function api(path, { method = "GET", body, params } = {}, retry = true) {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    : "";
  const token = localStorage.getItem("accessToken");
  const res = await fetch(BASE + path + qs, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && retry && localStorage.getItem("refreshToken")) {
    const r = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
    });
    if (r.ok) {
      const t = await r.json();
      localStorage.setItem("accessToken", t.accessToken);
      if (t.refreshToken) localStorage.setItem("refreshToken", t.refreshToken);
      return api(path, { method, body, params }, false);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw Object.assign(new Error([].concat(e.message || `Request failed (${res.status})`).join(", ")), { status: res.status });
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}
// ASSUMPTION: list endpoints return an array or { data | items | results, total }.
export const unwrap = (d) => (Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.results ?? []);
export const totalOf = (d) => d?.total ?? d?.meta?.total ?? d?.pagination?.total ?? unwrap(d).length;
export const initials = (n = "") => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
export const money = (n, c = "EGP") => `${Number(n || 0).toLocaleString()} ${c}`;

const P = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.4 3.4 0 0 1 0 6.6M18 14.4c2.2.6 3.5 2.6 3.5 5.6" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  ticket: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M9 6v12" strokeDasharray="2 2" /></>,
  cog: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>,
  logout: <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  mountain: <path d="m3 20 6-11 4 7 3-4 5 8z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></>,
  waves: <path d="M3 8c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 14c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 20c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></>,
  hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  checks: <path d="m2 13 4 4 8-10M10 17l1 1 10-12" />,
  warn: <path d="M12 3 22 21H2zM12 10v5M12 18v.5" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></>,
  bank: <path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />,
  pulse: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chev: <path d="m9 6 6 6-6 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
  swap: <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
  idcard: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.5-2 5.5-2 6 0M15 10h3M15 14h3" /></>,
  pin: <><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  box: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  tent: <path d="M3 20 12 4l9 16zM12 4v16M9 20l3-6 3 6" />,
};
export const Icon = ({ n, size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{P[n]}</svg>
);

const NAV = [
  ["/admin", "Dashboard", "grid", true],
  ["/admin/users", "Users & Roles", "users"],
  ["/admin/trips", "Trips & Destinations", "compass"],
  ["/admin/bookings", "Bookings", "ticket"],
  ["/admin/operations", "Platform Operations", "cog"],
];
const Logo = () => <span className="ad-logo">T</span>;

export default function AdminLayout({ crumb = "Overview", children, drawer }) {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => { api("/users/me").then(setMe).catch(() => nav("/login")); }, [nav]);

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST", body: { refreshToken: localStorage.getItem("refreshToken") } }); } catch {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    nav("/login");
  };
  const name = me?.name || [me?.firstName, me?.lastName].filter(Boolean).join(" ") || "Admin";
  const role = me?.role === "admin" ? "Super Admin" : me?.role || "Super Admin";

  return (
    <div className="ad">
      <aside className="ad-side">
        <div className="ad-brand">
          <Logo /><b>Travel<i>Ora</i></b>
          <small>Operator<br />Workspace</small>
        </div>
        <p className="ad-navlabel">Main navigation</p>
        <nav>
          {NAV.map(([to, label, icon, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => "ad-link" + (isActive ? " on" : "")}>
              <Icon n={icon} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="ad-me">
          <span className="ad-avatar"><Icon n="user" size={16} /></span>
          <div><b>{name}</b><small>Chief Systems Admin</small></div>
          <button onClick={logout} aria-label="Log out"><Icon n="logout" /></button>
        </div>
      </aside>

      <div className="ad-main">
        <header className="ad-top">
          <span className="ad-tlogo"><Logo /><b>Travel<i>Ora</i></b></span>
          <span className="ad-crumb">Admin <em>›</em> {crumb}</span>
          <label className="ad-search">
            <Icon n="search" size={16} />
            <input placeholder="Global search (trips, users, logs)…" value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && q && nav(`/admin/trips?q=${encodeURIComponent(q)}`)} />
            <kbd>⌘K</kbd>
          </label>
          <span className="ad-env"><i />Production <em>•</em> MENA Cluster</span>
          <span className="ad-bell"><Icon n="bell" /><i /></span>
          <div className="ad-user"><span className="ad-avatar dark"><Icon n="user" size={16} /></span><div><b>{name}</b><small>{role}</small></div></div>
        </header>
        <main className="ad-page">{children}</main>
      </div>
      {drawer}
    </div>
  );
}
