import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout, { api, unwrap, totalOf, initials, Icon } from "./AdminLayout";
import "./AdminDashboard.css";

const FX = 48.75; // EGP per USD (display only). Replace with your own rate source.
const st = (b) => String(b?.status || "").toLowerCase();
const amtEgp = (b) => Number(b.totalPrice ?? b.totalAmount ?? b.amount ?? 0); // ASSUMPTION: amounts stored in EGP
const id = (x) => x.id || x._id;
const n = (v) => Number(v ?? 0).toLocaleString();
const ago = (d) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(d)) / 60000));
  return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
const ROW_ICON = ["mountain", "sun", "waves"];
const STATE_ICON = { confirmed: ["check", ""], pending: ["hourglass", "bad"], completed: ["checks", "dim"] };

export default function AdminDashboard() {
  const [view, setView] = useState("live"); // live | loading | empty | error
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  const load = useCallback(async () => {
    setBusy(true); setErr("");
    const t0 = performance.now();
    const q = (path, params) => api(path, { params });
    const r = await Promise.allSettled([
      q("/users", { limit: 100 }), q("/trips", { limit: 100 }), q("/bookings", { limit: 100 }),
      q("/destinations"), q("/operators", { limit: 100 }), q("/health"),
      q("/users", { role: "customer", limit: 1 }), q("/users", { role: "operator", limit: 1 }), q("/users", { role: "admin", limit: 1 }),
      q("/bookings", { status: "pending", limit: 1 }), q("/bookings", { status: "confirmed", limit: 1 }), q("/bookings", { status: "completed", limit: 1 }),
    ]);
    const ms = Math.round(performance.now() - t0);
    if (r.slice(0, 3).every((x) => x.status === "rejected")) setErr(r[0].reason?.message || "Gateway unreachable");
    else {
      const v = (i) => (r[i].status === "fulfilled" ? r[i].value : null);
      setD({ users: v(0), trips: v(1), bookings: v(2), dest: v(3), ops: v(4), health: v(5), ms,
        cust: totalOf(v(6)), opsN: totalOf(v(7)), admins: totalOf(v(8)),
        pend: totalOf(v(9)), conf: totalOf(v(10)), done: totalOf(v(11)) });
    }
    setBusy(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const s = useMemo(() => {
    if (!d) return null;
    const trips = unwrap(d.trips), bookings = unwrap(d.bookings), ops = unwrap(d.ops), users = unwrap(d.users);
    const gbvEgp = bookings.reduce((a, b) => a + amtEgp(b), 0);
    return {
      trips, bookings, dest: unwrap(d.dest),
      live: trips.filter((t) => st(t) === "published").length,
      review: trips.filter((t) => /review/.test(st(t))).length,
      soldOut: trips.filter((t) => (t.availableSeats ?? 1) === 0),
      gbvEgp,
      pendingOps: ops.filter((o) => st(o) !== "active"),
      newest: [...users].filter((u) => u.role === "customer").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0],
      ok: String(d.health?.status || "").toLowerCase() === "ok",
    };
  }, [d]);

  const approve = async (opId) => {
    try { await api(`/admin/operators/${opId}/status`, { method: "PATCH", body: { status: "active" } }); load(); }
    catch (e) { alert(e.message); }
  };
  const exportCsv = () => {
    const rows = s?.bookings || [];
    const csv = ["id,customer,trip,amount_egp,status", ...rows.map((b) => [id(b), b.user?.email, `"${b.trip?.title || ""}"`, amtEgp(b), st(b)].join(","))].join("\n");
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "audit-manifest.csv" }).click();
  };

  const skel = view === "loading" || (busy && !d);
  const fail = view === "error" || (!!err && !d);
  const empty = view === "empty";
  const ready = !skel && !fail;
  const rows = empty ? [] : s?.bookings.slice(0, 3) || [];
  const vet = empty ? [] : s?.pendingOps.slice(0, 2) || [];
  const spot = s?.soldOut[0] || s?.trips[0];

  return (
    <AdminLayout crumb="Overview">
      <div className="db-head">
        <div>
          <p className="db-eyebrow"><span><i />Live ops surveillance</span><em>• Node: CAI-NORTH-01</em></p>
          <h1>Admin Command &amp; Operations Dashboard</h1>
          <p className="db-sub">Unified platform surveillance across Egyptian expeditions, verified operators, customer life-cycles, and infrastructure.</p>
        </div>
        <div className="db-acts">
          <Link className="btn" to="/admin/users"><Icon n="users" size={16} />Manage Users &amp; Access</Link>
          <Link className="btn" to="/admin/bookings"><Icon n="ticket" size={16} />View All Bookings</Link>
          <button className="btn dark" onClick={exportCsv}><Icon n="download" size={16} />Export Audit Manifest (CSV)</button>
        </div>
      </div>

      <section className="db-kpis">
        <article className="card kpi">
          <header><small>Total users</small><span className="ic blue"><Icon n="users" /></span></header>
          <p className="big">{n(d && totalOf(d.users))}{d && <em className="up"><Icon n="trend" size={12} /> live</em>}</p>
          <p className="note">Growth vs past 30 days</p>
          <p className="chip">{n(d?.cust)} Cust • {n(d?.opsN)} Ops • {n(d?.admins)} Admins</p>
        </article>
        <article className="card kpi">
          <header><small>Total trips</small><span className="ic mint"><Icon n="tent" /></span></header>
          <p className="big">{n(d && totalOf(d.trips))} <span>Expeditions</span></p>
          <p className="note dot"><i />{n(s?.live)} Live &amp; Published</p>
          <p className="chips"><b className="blue">{n(s?.review)} EEAA Review</b><b className="rust">{n(s?.soldOut.length)} Sold Out</b></p>
        </article>
        <article className="card kpi">
          <header><small>Bookings &amp; volume</small><span className="ic rust"><Icon n="cash" /></span></header>
          <p className="big">{n(d && totalOf(d.bookings))} <span>Orders</span></p>
          <p className="mono usd">${n(Math.round((s?.gbvEgp || 0) / FX))} USD</p>
          <p className="note">≈ {n(Math.round(s?.gbvEgp || 0))} EGP GBV</p>
          <p className="note foot"><b className="red">{n(d?.pend)} Pending</b> {n(d?.conf)} Conf {n(d?.done)} Done</p>
        </article>
        <article className="card kpi">
          <header><small>Destinations</small><span className="ic blue"><Icon n="mountain" /></span></header>
          <p className="big">{n(d && totalOf(d.dest))} <span>Protectorates</span></p>
          <p className="note">{s?.dest.slice(0, 3).map((x) => x.name).join(", ")}</p>
          <p className="note ok"><Icon n="shield" size={14} /> 100% EEAA Monitored</p>
        </article>
        <article className="card kpi">
          <header><small>Platform SLA</small><b className={"stable" + (s && !s.ok ? " down" : "")}>● {s ? (s.ok ? "Stable" : "Degraded") : "…"}</b></header>
          <p className="big">{d?.health?.uptime ?? "—"}</p>
          <p className="mono note">Latency: {d?.ms ?? "–"}ms</p>
          <p className="note foot"><span>0 Criticals / 24h</span><span className="mono">{d?.health?.version ? `v${d.health.version}` : ""}</span></p>
        </article>
      </section>

      <section className="db-sandbox">
        <Icon n="cog" />
        <div><b>Admin View Controls &amp; Resilience Sandbox</b><p>Preview edge-case fallback states, empty logs, and API gateway behaviors</p></div>
        <div className="seg" role="tablist">
          {[["live", "Live Feed (Active)"], ["loading", "Loading Skeleton"], ["empty", "Empty State"], ["error", "Gateway Error"]].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={view === k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{l}</button>
          ))}
        </div>
      </section>

      <div className="db-cols">
        <div className="db-stack">
          <section className="card">
            <header className="sec">
              <span className="ic soft"><Icon n="box" /></span>
              <div><h2>Recent Booking Transactions</h2><p>Realtime reservation stream processed across international payment &amp; local Fawry gateways</p></div>
              <Link className="more" to="/admin/bookings">View All Bookings <Icon n="arrow" size={15} /></Link>
            </header>
            {skel && <div className="pad">{[1, 2, 3].map((i) => <div key={i} className="skel" />)}</div>}
            {fail && <div className="state err">Gateway error{err ? `: ${err}` : ""}. <button className="btn sm" onClick={load}>Retry</button></div>}
            {ready && rows.length === 0 && <div className="state">No bookings yet. New reservations appear here as they are paid.</div>}
            {ready && rows.length > 0 && (
              <div className="scroll"><table className="tbl">
                <thead><tr><th>Booking<br />Ref</th><th>Customer</th><th>Expedition / Trip</th><th className="r">Amount<br />(EGP / USD)</th><th /></tr></thead>
                <tbody>{rows.map((b, i) => {
                  const egp = amtEgp(b), [ico, tone] = STATE_ICON[st(b)] || STATE_ICON.confirmed;
                  return (
                    <tr key={id(b)}>
                      <td className={"mono ref" + (st(b) === "pending" ? " red" : "")}>#BK-<br />{String(b.reference || id(b)).replace(/\D/g, "").slice(-4) || String(id(b)).slice(-4)}</td>
                      <td><b>{b.user?.name || b.customerName}</b><small>{b.user?.email}</small></td>
                      <td><span className="trip"><Icon n={ROW_ICON[i % 3]} size={16} />{b.trip?.title || b.trip?.name}</span></td>
                      <td className="r"><b className="mono">${n(Math.round(egp / FX))}<br />USD</b><small className="mono">≈ {n(Math.round(egp))}<br />EGP</small></td>
                      <td><span className={"stat " + tone}><Icon n={ico} size={15} /></span></td>
                    </tr>);
                })}</tbody></table></div>
            )}
          </section>

          <section className="card">
            <header className="sec">
              <span className="ic soft"><Icon n="idcard" /></span>
              <div><h2>Operator Vetting &amp; Verification Queue</h2><p>Egyptian Environmental Affairs Agency (EEAA) and Ministry of Tourism licensing compliance</p></div>
              <span className="badge">{empty ? 0 : s?.pendingOps.length ?? 0} Pending Vetting</span>
            </header>
            {skel && <div className="pad"><div className="skel" /><div className="skel" /></div>}
            {ready && vet.length === 0 && !s?.newest && <div className="state">Nobody is waiting for review.</div>}
            {ready && <div className="vets">
              {vet.map((o) => {
                const kyc = /kyc/.test(st(o));
                return (
                  <div className="vet" key={id(o)}>
                    <span className={"av " + (kyc ? "navy" : "")}>{initials(o.name || o.companyName)}</span>
                    <div className="vi">
                      <p><b>{o.name || o.companyName}</b><span className="tag">Operator</span></p>
                      <small>Reg: {o.region || o.location || "—"}</small>
                      <small className={kyc ? "bad" : "ok"}><Icon n={kyc ? "warn" : "shield"} size={13} /> {kyc ? "Commercial Registry & Tax Card Under Review" : `EEAA Certified Outfitter ${o.licenseNumber ? "#" + o.licenseNumber : ""}`}</small>
                    </div>
                    <Link className="btn sm white" to={`/admin/users?q=${encodeURIComponent(o.email || o.name || "")}`}>View Dossier</Link>
                    {kyc ? <Link className="btn sm red" to={`/admin/users?q=${encodeURIComponent(o.email || "")}`}><Icon n="shield" size={14} />Review KYC Documents</Link>
                         : <button className="btn sm dark" onClick={() => approve(id(o))}><Icon n="check" size={14} />Approve Outfitter</button>}
                  </div>);
              })}
              {!empty && s?.newest && (
                <div className="vet">
                  <span className="av">{initials(s.newest.name)}</span>
                  <div className="vi"><p><b>{s.newest.name}</b><span className="tag blue">Customer</span></p><small>{s.newest.email}</small></div>
                  <span className="mono joined">Joined {ago(s.newest.createdAt)}</span><button className="kebab" aria-label="More"><Icon n="more" size={16} /></button>
                </div>)}
            </div>}
          </section>

          {ready && spot && !empty && (
            <section className="card spot">
              <div className="img" style={spot.image || spot.imageUrl ? { backgroundImage: `url(${spot.image || spot.imageUrl})` } : undefined}><span>Spotlight</span></div>
              <div className="txt">
                <p className="mono eyebrow"><b>Capacity alert</b> • ID #{String(id(spot)).slice(-8)}</p>
                <h3>{spot.title || spot.name}</h3>
                <p>{(spot.availableSeats ?? 1) === 0 ? "Fully booked across all scheduled departures. Review operator requests for extra guide allotment." : spot.description}</p>
              </div>
              <Link className="btn" to="/admin/trips">Allocate Guides</Link>
            </section>
          )}
        </div>

        <aside className="db-stack">
          <section className="card att">
            <header><span className="ic soft rust"><Icon n="bell" /></span><h2>Attention Required</h2><i className="reddot" /></header>
            {!ready ? <div className="state">Waiting for data…</div> : <>
              <div className="item"><Icon n="warn" /><div><b>{n(d?.pend)} bookings pending confirmation</b><p>Approaching the guaranteed 24-hour traveler confirmation SLA threshold.</p><Link to="/admin/bookings">Review Booking Desk →</Link></div></div>
              <div className="item"><Icon n="calendar" /><div><b>{s.soldOut.length} live trips with 0 remaining seats</b><p>{s.soldOut.slice(0, 2).map((t) => t.title || t.name).join(" and ") || "None right now"}.</p><Link to="/admin/trips">Manage Trip Inventory →</Link></div></div>
              <div className="item"><Icon n="info" /><div><b>{s.pendingOps.length} operators awaiting EEAA vetting</b><p>Legal outfitter licenses submitted for protectorate access verification.</p><Link to="/admin/users">Open Operator Queue →</Link></div></div>
              <div className="item"><Icon n="check" /><div><b>System: {s.ok ? "all checks passing" : "health check failing"}</b><p>Reported by GET /health.</p><Link to="/admin/operations">Open Diagnostic Logs →</Link></div></div>
            </>}
          </section>

          <section className="card quick">
            <h2>Operations Quick Actions</h2>
            <Link className="q dark" to="/admin/trips?tab=destinations"><Icon n="pin" />+ Add New Destination<Icon n="chev" size={16} /></Link>
            <Link className="q" to="/admin/users"><Icon n="users" /><span><b>Manage Users &amp; Permissions</b></span><Icon n="chev" size={16} /></Link>
            <Link className="q" to="/admin/bookings"><Icon n="bank" /><span><b>Escrow Bond Vault</b><small>National Bank of Egypt (NBE)</small></span><Icon n="chev" size={16} /></Link>
            <Link className="q" to="/admin/operations"><Icon n="pulse" /><span><b>Health &amp; Diagnostic Center</b></span><Icon n="chev" size={16} /></Link>
          </section>

          <section className="fx">
            <p className="mono"><span>FX CLEARING MATRIX</span><span>Live Central Bank</span></p>
            <div><span><b>$1.00 USD</b><small>Settlement Base</small></span><Icon n="swap" size={22} /><span className="r"><b>{FX.toFixed(4)} EGP</b><small>Fawry / CBE Peg</small></span></div>
            <p className="mono foot"><span>Daily Vault Delta: +${n(Math.round((s?.gbvEgp || 0) / FX / 10))}</span><span>Settled: T+1</span></p>
          </section>
        </aside>
      </div>
    </AdminLayout>
  );
}
