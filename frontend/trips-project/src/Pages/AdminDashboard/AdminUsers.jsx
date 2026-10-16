import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout, { api, unwrap, totalOf, initials, Icon } from "./AdminLayout";
import "./AdminUsers.css";

/*
 * Endpoints used on this page (all under /api/v1):
 *   GET   /users?page&limit&search&role&status&region   list + filters (+ limit=1 calls for tab counts)
 *   GET   /users/me                                     to mark the "YOU" row
 *   GET   /users/:userId                                dossier drawer
 *   PUT   /users/:userId        { role }                role assignment
 *   PATCH /users/:userId/status { status }              active <-> suspended
 *   POST  /auth/register        { name, email, password, role }   "Create New Admin Account"
 * ASSUMPTIONS: user fields are name, email, phone, role (customer|operator|admin), status
 * (active|pending|suspended), createdAt, lastLoginAt, region, licenseNumber, nationalId,
 * isVerified. Adjust the accessors in the helpers below if your DTO differs.
 */

const LIMIT = 6;
const REGIONS = ["Cairo", "Sinai", "Western Desert", "Siwa", "Red Sea"];
const ROLES = [
  { key: "customer", label: "Customer", sub: "Traveler Pass", icon: "user" },
  { key: "operator", label: "Operator", sub: "Outfitter & Guild", icon: "compass" },
  { key: "admin", label: "Admin", sub: "Elevated 2FA", icon: "shield", warn: true },
];
const TABS = [
  ["all", "All Users"], ["customer", "Customers"], ["operator", "Operators"],
  ["admin", "Admins"], ["pending", "Pending Verification"],
];

const uid = (u) => u.id || u._id;
const nm = (u) => u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
const role = (u) => String(u.role || "customer").toLowerCase();
const status = (u) => {
  const s = String(u.status || "active").toLowerCase();
  return s === "pending" || /review|verif/.test(s) ? "pending" : s === "active" ? "active" : "suspended";
};
const verified = (u) => u.isVerified ?? u.verified ?? u.emailVerified ?? status(u) === "active";
const n = (v) => Number(v ?? 0).toLocaleString();
const day = (d) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—");
const ago = (d) => {
  if (!d) return "never";
  const m = Math.max(1, Math.round((Date.now() - new Date(d)) / 60000));
  return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
const ROLE_ICON = { customer: "user", operator: "compass", admin: "shield" };
const ROLE_SUB = { customer: "Expedition Passholder", operator: "Outfitter & Guild", admin: "Platform Staff" };

function verification(u) {
  const r = role(u), ok = verified(u);
  if (r === "admin") return { tone: "navy", label: "Hardware Key MFA Enforced", ico: "shield", sub: u.region || "HQ Authority" };
  if (r === "operator") return ok
    ? { tone: "mint", label: "EEAA Certified", ico: "shield", sub: u.region || u.operatingBase }
    : { tone: "rust", label: "License Review Pending", ico: "hourglass", sub: "Awaiting documents", subRed: true };
  return ok
    ? { tone: "blue", label: "Citizen Verified", ico: "idcard", sub: u.nationalId && `NID: ${u.nationalId}` }
    : { tone: "rust", label: "Verification Pending", ico: "hourglass", sub: "Awaiting ID upload", subRed: true };
}

export default function AdminUsers() {
  const [sp, setSp] = useSearchParams();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState(sp.get("q") || "");
  const [f, setF] = useState({ role: "", status: "", region: "" });
  const [page, setPage] = useState(1);
  const [list, setList] = useState(null);
  const [counts, setCounts] = useState({});
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);
  const [sel, setSel] = useState(new Set());
  const [bulk, setBulk] = useState({ open: false, role: "customer" });
  const [open, setOpen] = useState(null); // dossier: { user, role, active, saving, error }
  const [create, setCreate] = useState(null); // { name, email, password, error, saving }
  const [toast, setToast] = useState("");

  const params = useMemo(() => ({
    page, limit: LIMIT, search: q.trim(), region: f.region,
    role: tab === "pending" ? f.role : tab !== "all" ? tab : f.role,
    status: tab === "pending" ? "pending" : f.status,
  }), [page, q, f, tab]);

  const load = useCallback(async () => {
    setBusy(true); setErr("");
    try { setList(await api("/users", { params })); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }, [params]);
  useEffect(() => { load(); }, [load]);

  const loadCounts = useCallback(async () => {
    const one = (p) => api("/users", { params: { limit: 1, ...p } }).then(totalOf).catch(() => 0);
    const [all, customer, operator, admin, pending] = await Promise.all([
      one({}), one({ role: "customer" }), one({ role: "operator" }), one({ role: "admin" }), one({ status: "pending" }),
    ]);
    setCounts({ all, customer, operator, admin, pending });
  }, []);
  useEffect(() => { loadCounts(); api("/users/me").then(setMe).catch(() => {}); }, [loadCounts]);
  useEffect(() => { setPage(1); setSel(new Set()); }, [tab, q, f]);

  const rows = unwrap(list);
  const total = totalOf(list);
  const pages = Math.max(1, Math.ceil(total / LIMIT));
  const pageNums = pages <= 5 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, "…", pages];
  const isMe = (u) => me && uid(me) === uid(u);
  const selectable = rows.filter((u) => !isMe(u));
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const resetFilters = () => { setQ(""); setF({ role: "", status: "", region: "" }); setTab("all"); setSp({}); };

  const exportCsv = () => {
    const csv = ["id,name,email,role,status,created_at", ...rows.map((u) =>
      [uid(u), `"${nm(u)}"`, u.email, role(u), status(u), u.createdAt].join(","))].join("\n");
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "users-directory.csv" }).click();
  };

  const toggleAll = (on) => setSel(on ? new Set(selectable.map(uid)) : new Set());
  const toggleOne = (id) => setSel((s) => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x; });

  const applyBulk = async () => {
    const ids = [...sel];
    const r = await Promise.allSettled(ids.map((id) => api(`/users/${id}`, { method: "PUT", body: { role: bulk.role } })));
    const bad = r.filter((x) => x.status === "rejected").length;
    flash(bad ? `${ids.length - bad} updated, ${bad} failed` : `${ids.length} users set to ${bulk.role}`);
    setSel(new Set()); setBulk({ open: false, role: "customer" }); load(); loadCounts();
  };

  const openDossier = async (u) => {
    setOpen({ user: u, role: role(u), active: status(u) === "active", loading: true });
    try {
      const full = await api(`/users/${uid(u)}`);
      setOpen((o) => o && { ...o, user: { ...u, ...full }, loading: false });
    } catch { setOpen((o) => o && { ...o, loading: false }); }
  };

  const save = async () => {
    const { user, role: r, active } = open;
    setOpen((o) => ({ ...o, saving: true, error: "" }));
    try {
      if (r !== role(user)) await api(`/users/${uid(user)}`, { method: "PUT", body: { role: r } });
      if (active !== (status(user) === "active")) await api(`/users/${uid(user)}/status`, { method: "PATCH", body: { status: active ? "active" : "suspended" } });
      setOpen(null); flash("Changes saved"); load(); loadCounts();
    } catch (e) { setOpen((o) => ({ ...o, saving: false, error: e.message })); }
  };

  const createAdmin = async () => {
    setCreate((c) => ({ ...c, saving: true, error: "" }));
    try {
      await api("/auth/register", { method: "POST", body: { name: create.name, email: create.email, password: create.password, role: "admin" } });
      setCreate(null); flash("Admin account created"); load(); loadCounts();
    } catch (e) { setCreate((c) => ({ ...c, saving: false, error: e.message })); }
  };

  const o = open?.user;
  const drawer = (<>
    {open && <div className="us-scrim" onClick={() => setOpen(null)} />}
    {open && (
      <aside className="us-drawer" role="dialog" aria-label="User dossier">
        <header>
          <span className="us-dav">{initials(nm(o))}</span>
          <div><h2>{nm(o)}{verified(o) && <Icon n="shield" size={16} />}</h2><p>{ROLES.find((x) => x.key === role(o))?.label} • {o.region || ROLE_SUB[role(o)]}</p></div>
          <button className="us-x" onClick={() => setOpen(null)} aria-label="Close"><Icon n="plus" size={20} /></button>
        </header>
        <div className="us-dbody">
          <section className="us-box">
            <p className="us-cap">Identity credentials &amp; verification</p>
            <dl>
              <div><dt>Email Address</dt><dd>{o.email}</dd></div>
              <div><dt>Mobile Contact</dt><dd className="mono">{o.phone || "—"}</dd></div>
              <div><dt>Accreditation ID</dt><dd className="mono">{o.licenseNumber || o.nationalId || "—"}</dd></div>
              <div><dt>Operating Base</dt><dd>{o.region || o.operatingBase || "—"}</dd></div>
            </dl>
          </section>
          <div className="us-rh"><h3>Platform Role Assignment</h3><small>RBAC Schema v3</small></div>
          <p className="us-hint">Controls routing privileges, escrow disbursements, and administrative read/write authority across TravelOra.</p>
          <div className="us-roles">
            {ROLES.map((r) => (
              <button key={r.key} className={"us-role" + (open.role === r.key ? " on" : "")} onClick={() => setOpen({ ...open, role: r.key })}>
                <span className={"us-rico" + (r.warn ? " warn" : "")}><Icon n={r.icon} size={16} /></span>
                <b>{r.label}</b><small className={r.warn ? "warn" : ""}>{r.sub}</small>
              </button>
            ))}
          </div>
          <section className="us-box us-switch">
            <div><b>Account Status</b><p>Allow user to sign in, accept payouts, or lead trips</p></div>
            <button role="switch" aria-checked={open.active} className={"us-tg" + (open.active ? " on" : "")} onClick={() => setOpen({ ...open, active: !open.active })}><i /></button>
          </section>
          <h3 className="us-sec">Authentication &amp; Security Controls</h3>
          <section className="us-box us-mfa">
            <Icon n="shield" size={18} />
            <div><b>Two-Factor Authentication (MTA-Compliant)</b><p>Enforced via TOTP Authenticator App</p></div>
            {/* No MFA-reset endpoint in the API list yet — wire it up when it exists. */}
            <button className="us-link" disabled title="No endpoint available yet">Reset MFA</button>
          </section>
          {open.error && <p className="us-err">{open.error}</p>}
        </div>
        <footer>
          <button className="btn" onClick={() => setOpen(null)}>Cancel</button>
          <button className="btn dark" disabled={open.saving} onClick={save}><Icon n="check" size={16} />{open.saving ? "Saving…" : "Save Changes"}</button>
        </footer>
      </aside>
    )}
    {create && (
      <div className="us-scrim mid" onClick={() => setCreate(null)}>
        <div className="us-modal" role="dialog" aria-label="Create admin" onClick={(e) => e.stopPropagation()}>
          <h2>Create New Admin Account</h2>
          <p>The account is created with the Admin role and must enroll in 2FA at first sign-in.</p>
          {["name", "email", "password"].map((k) => (
            <label key={k}>{k[0].toUpperCase() + k.slice(1)}
              <input type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={create[k] || ""} onChange={(e) => setCreate({ ...create, [k]: e.target.value })} />
            </label>
          ))}
          {create.error && <p className="us-err">{create.error}</p>}
          <div className="us-mact">
            <button className="btn" onClick={() => setCreate(null)}>Cancel</button>
            <button className="btn dark" disabled={create.saving || !create.name || !create.email || !create.password} onClick={createAdmin}>{create.saving ? "Creating…" : "Create Account"}</button>
          </div>
        </div>
      </div>
    )}
    {toast && <div className="us-toast" role="status">{toast}</div>}
  </>);

  return (
    <AdminLayout crumb="Overview" drawer={drawer}>
      <div className="us-head">
        <div>
          <p className="us-eye"><Icon n="shield" size={13} />Identity &amp; Access Governance</p>
          <h1>Users &amp; Role-Based Access Control (RBAC)</h1>
          <p className="us-sub">Manage {n(counts.all)} platform accounts, security credentials, outfitter certifications, and operational privileges across Egyptian protectorates.</p>
        </div>
        <div className="us-acts">
          <button className="btn" onClick={exportCsv}><Icon n="download" size={16} />Export Users Directory (CSV)</button>
          <button className="btn" onClick={() => setBulk((b) => ({ ...b, open: !b.open }))}><Icon n="users" size={16} />Bulk Assign Role</button>
          <button className="btn dark" onClick={() => setCreate({})}><Icon n="plus" size={16} />Create New Admin Account</button>
        </div>
      </div>

      <section className="us-kpis">
        <article className="us-card kpi"><span className="us-ic"><Icon n="shield" size={22} /></span><div><small>Active staff RBAC</small><p className="big">{n(counts.admin)} Admins</p><p className="note">100% MFA Enforced</p></div></article>
        <article className="us-card kpi"><span className="us-ic"><Icon n="compass" size={22} /></span><div><small>Licensed outfitters</small><p className="big">{n(counts.operator)} Guides</p><p className="note">EEAA &amp; MTA Vetted</p></div></article>
        <article className="us-card kpi"><span className="us-ic blue"><Icon n="users" size={22} /></span><div><small>Active customers</small><p className="big">{n(counts.customer)} Passholders</p><p className="note">Registered travelers</p></div></article>
        <article className="us-card kpi"><span className="us-ic rust"><Icon n="idcard" size={22} /></span><div><small>Awaiting verification</small><p className="big rust">{n(counts.pending)} Pending</p><p className="note rust">Action required</p></div></article>
      </section>

      <section className="us-card us-list">
        <div className="us-tabs" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
              {l} <span className={k === "pending" ? "rust" : ""}>{n(counts[k])}</span>
            </button>
          ))}
        </div>

        <div className="us-filters">
          <label className="us-s"><Icon n="search" size={16} /><input placeholder="Search Name, Email, National ID, or License…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <select aria-label="Role" value={f.role} disabled={tab !== "all" && tab !== "pending"} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="">Role: All Roles</option>{ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
          <select aria-label="Status" value={f.status} disabled={tab === "pending"} onChange={(e) => setF({ ...f, status: e.target.value })}>
            <option value="">Status: All Statuses</option><option value="active">Active</option><option value="pending">Pending Review</option><option value="suspended">Suspended</option>
          </select>
          <select aria-label="Region" value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })}>
            <option value="">Region: All Egypt</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="us-reset" onClick={resetFilters}><Icon n="swap" size={15} />Reset Filters</button>
        </div>

        {bulk.open && (
          <div className="us-bulk">
            <b>{sel.size} selected</b>
            <select aria-label="New role" value={bulk.role} onChange={(e) => setBulk({ ...bulk, role: e.target.value })}>{ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
            <button className="btn dark sm" disabled={!sel.size} onClick={applyBulk}>Assign role</button>
            {!sel.size && <small>Tick users in the table first.</small>}
          </div>
        )}

        <div className="us-scroll">
          <table className="us-tbl">
            <thead><tr>
              <th className="c"><input type="checkbox" aria-label="Select all" checked={!!selectable.length && sel.size === selectable.length} onChange={(e) => toggleAll(e.target.checked)} /></th>
              <th>User Identity</th><th>Platform Role</th><th>Accreditation / Verification</th><th>Account Status</th><th>Timeline / Last Active</th><th />
            </tr></thead>
            <tbody>
              {busy && !list && [1, 2, 3].map((i) => <tr key={i}><td colSpan={7}><div className="skel" /></td></tr>)}
              {err && <tr><td colSpan={7} className="us-state err">Could not load users: {err} <button className="btn sm" onClick={load}>Retry</button></td></tr>}
              {!err && list && rows.length === 0 && <tr><td colSpan={7} className="us-state">No users match these filters. <button className="btn sm" onClick={resetFilters}>Reset filters</button></td></tr>}
              {!err && rows.map((u) => {
                const v = verification(u), s = status(u), r = role(u), you = isMe(u);
                return (
                  <tr key={uid(u)} className={you ? "you" : ""}>
                    <td className="c"><input type="checkbox" aria-label={`Select ${nm(u)}`} disabled={you} checked={sel.has(uid(u))} onChange={() => toggleOne(uid(u))} /></td>
                    <td>
                      <div className="us-id">
                        <span className={"us-av " + (r === "admin" ? "dark" : r === "operator" ? "" : "navy")} style={u.avatar || u.avatarUrl ? { backgroundImage: `url(${u.avatar || u.avatarUrl})` } : undefined}>{!(u.avatar || u.avatarUrl) && initials(nm(u))}</span>
                        <div>
                          <b>{nm(u)}{verified(u) && r !== "customer" && <Icon n="shield" size={14} />}{you && <em className="you-tag">YOU</em>}</b>
                          <small>{u.email}</small>
                          <small className="mono">{u.phone}{u.licenseNumber ? ` • License #${u.licenseNumber}` : ""}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="us-pill"><Icon n={ROLE_ICON[r]} size={13} />{r[0].toUpperCase() + r.slice(1)}</span><small>{u.roleNote || ROLE_SUB[r]}</small></td>
                    <td><span className={"us-ver " + v.tone}><Icon n={v.ico} size={13} />{v.label}</span>{v.sub && <small className={v.subRed ? "rust" : ""}>{v.sub}</small>}</td>
                    <td><span className={"us-st " + s}><i />{s === "active" ? (you ? "Active Session" : "Active") : s === "pending" ? "Pending Review" : "Suspended"}</span></td>
                    <td className="mono us-time"><span>Joined {day(u.createdAt)}</span><span>Active {ago(u.lastLoginAt || u.lastActiveAt)}</span></td>
                    <td><button className="us-dos" onClick={() => openDossier(u)}>Dossier</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="us-foot">
          <span>Showing <b>{rows.length}</b> of <b>{n(total)}</b> users • Displaying Page {page} of {pages}</span>
          <nav aria-label="Pagination">
            <button disabled={page === 1} onClick={() => setPage(1)} aria-label="First">|‹</button>
            <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous">‹</button>
            {pageNums.map((p, i) => p === "…" ? <span key={i}>…</span> : <button key={p} className={p === page ? "on" : ""} onClick={() => setPage(p)}>{p}</button>)}
            <button disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next">›</button>
            <button disabled={page === pages} onClick={() => setPage(pages)} aria-label="Last">›|</button>
          </nav>
        </footer>
      </section>
    </AdminLayout>
  );
}
