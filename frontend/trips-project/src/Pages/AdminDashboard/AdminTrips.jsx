import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout, { api, unwrap, totalOf, Icon } from "./AdminLayout";
import "./AdminTrips.css";

/*
 * Endpoints used on this page (all under /api/v1):
 *   GET    /trips?page&limit&search&status&destinationId&operatorId   trips table (+ limit=1 call for tab count)
 *   GET    /trips/:tripId/dates                                       departures + seats per row
 *   GET    /trips/:tripId/operator                                    operator/guild per row (if not embedded)
 *   PUT    /trips/:tripId           { status }                        publish / unpublish / archive
 *   DELETE /trips/:tripId
 *   PATCH  /admin/trips/:tripId/operator  { operatorId }              assign operator
 *   DELETE /admin/trips/:tripId/operator                              remove operator
 *   GET    /operators?limit=100                                       guild filter + assign list
 *   GET    /destinations                                              protectorate filter + Destinations tab
 *   POST   /destinations | PUT /destinations/:id | DELETE /destinations/:id
 * ASSUMPTIONS: trip = { id, title|name, code, category, image|imageUrl, status: draft|published|archived,
 *   destination:{name,region}, operator:{name,guild|region}, dates?:[{startDate, capacity, booked|availableSeats}] }.
 * Adjust the accessors below if your DTO differs.
 */

const LIMIT = 5;
const id = (x) => x.id || x._id;
const ttl = (t) => t.title || t.name || "Untitled trip";
const stat = (t) => String(t.status || "draft").toLowerCase();
const n = (v) => Number(v ?? 0).toLocaleString();
const day = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
const code = (t) => t.code || t.slug || `#TRV-${String(id(t)).slice(-4).toUpperCase()}`;
const seatsOf = (dates) => dates.reduce((a, d) => {
  const cap = Number(d.capacity ?? d.totalSeats ?? d.maxParticipants ?? 0);
  const booked = Number(d.booked ?? d.bookedSeats ?? (d.availableSeats != null ? cap - d.availableSeats : 0));
  return { cap: a.cap + cap, booked: a.booked + booked };
}, { cap: 0, booked: 0 });
const STATUS = [["", "Status: All"], ["published", "Published"], ["draft", "Draft / Review"], ["archived", "Archived"]];

export default function AdminTrips() {
  const [sp, setSp] = useSearchParams();
  const [tab, setTab] = useState(sp.get("tab") === "destinations" ? "destinations" : "trips");
  const [q, setQ] = useState(sp.get("q") || "");
  const [f, setF] = useState({ status: "", destinationId: "", operatorId: "" });
  const [page, setPage] = useState(1);
  const [list, setList] = useState(null);
  const [dests, setDests] = useState([]);
  const [ops, setOps] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [extra, setExtra] = useState({}); // per-trip { dates, operator }
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);
  const [sel, setSel] = useState(new Set());
  const [manage, setManage] = useState(null); // { trip, status, operatorId, saving, error }
  const [dForm, setDForm] = useState(null); // destination create/edit
  const [toast, setToast] = useState("");
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const params = useMemo(() => ({ page, limit: LIMIT, search: q.trim(), ...f }), [page, q, f]);

  const load = useCallback(async () => {
    setBusy(true); setErr("");
    try { setList(await api("/trips", { params })); } catch (e) { setErr(e.message); }
    setBusy(false);
  }, [params]);
  useEffect(() => { if (tab === "trips") load(); }, [load, tab]);

  const loadDests = useCallback(() => api("/destinations").then((d) => setDests(unwrap(d))).catch(() => {}), []);
  useEffect(() => {
    loadDests();
    api("/operators", { params: { limit: 100 } }).then((d) => setOps(unwrap(d))).catch(() => {});
    api("/trips", { params: { limit: 1 } }).then((d) => setTripCount(totalOf(d))).catch(() => {});
  }, [loadDests]);
  useEffect(() => { setPage(1); setSel(new Set()); }, [q, f]);

  const rows = unwrap(list);
  const total = totalOf(list);
  const pages = Math.max(1, Math.ceil(total / LIMIT));
  const pageNums = pages <= 5 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, "…", pages];

  // Fetch departures / operator for visible rows when the list payload doesn't embed them.
  useEffect(() => {
    rows.forEach(async (t) => {
      const k = id(t);
      if (extra[k]) return;
      setExtra((e) => ({ ...e, [k]: { loading: true } }));
      const [d, o] = await Promise.allSettled([
        t.dates || t.tripDates ? Promise.resolve(t.dates || t.tripDates) : api(`/trips/${k}/dates`),
        t.operator ? Promise.resolve(t.operator) : api(`/trips/${k}/operator`),
      ]);
      setExtra((e) => ({ ...e, [k]: { dates: d.status === "fulfilled" ? unwrap(d.value) : [], operator: o.status === "fulfilled" ? o.value : null } }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const quota = useMemo(() => {
    const all = Object.values(extra).flatMap((e) => e.dates || []);
    const { cap, booked } = seatsOf(all);
    return cap ? Math.round((booked / cap) * 1000) / 10 : null;
  }, [extra]);

  const resetFilters = () => { setQ(""); setF({ status: "", destinationId: "", operatorId: "" }); setSp({}); };
  const toggleOne = (k) => setSel((s) => { const x = new Set(s); x.has(k) ? x.delete(k) : x.add(k); return x; });

  const bulkStatus = async (status) => {
    const ids = [...sel];
    if (!ids.length) return flash("Tick at least one trip first");
    const r = await Promise.allSettled(ids.map((k) => api(`/trips/${k}`, { method: "PUT", body: { status } })));
    const bad = r.filter((x) => x.status === "rejected").length;
    flash(bad ? `${ids.length - bad} updated, ${bad} failed` : `${ids.length} trips set to ${status}`);
    setSel(new Set()); load();
  };

  const exportCsv = () => {
    const csv = ["id,code,title,status,destination,operator", ...rows.map((t) => [id(t), code(t), `"${ttl(t)}"`, stat(t), `"${t.destination?.name || ""}"`, `"${(extra[id(t)]?.operator || t.operator)?.name || ""}"`].join(","))].join("\n");
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "trip-manifest.csv" }).click();
  };

  const openManage = (t) => setManage({ trip: t, status: stat(t), operatorId: (extra[id(t)]?.operator || t.operator)?.id || (extra[id(t)]?.operator || t.operator)?._id || "" });
  const saveManage = async () => {
    const { trip, status, operatorId } = manage, k = id(trip);
    setManage((m) => ({ ...m, saving: true, error: "" }));
    try {
      if (status !== stat(trip)) await api(`/trips/${k}`, { method: "PUT", body: { status } });
      const cur = extra[k]?.operator || trip.operator, curId = cur?.id || cur?._id || "";
      if (operatorId !== curId) {
        if (operatorId) await api(`/admin/trips/${k}/operator`, { method: "PATCH", body: { operatorId } });
        else await api(`/admin/trips/${k}/operator`, { method: "DELETE" });
        setExtra((e) => { const c = { ...e }; delete c[k]; return c; });
      }
      setManage(null); flash("Trip updated"); load();
    } catch (e) { setManage((m) => ({ ...m, saving: false, error: e.message })); }
  };
  const deleteTrip = async () => {
    if (!window.confirm(`Delete "${ttl(manage.trip)}"? This removes it from all consumer listings.`)) return;
    try { await api(`/trips/${id(manage.trip)}`, { method: "DELETE" }); setManage(null); flash("Trip deleted"); load(); setTripCount((c) => c - 1); }
    catch (e) { setManage((m) => ({ ...m, error: e.message })); }
  };

  const saveDest = async () => {
    const { _id, id: did, saving, error, ...body } = dForm, k = did || _id;
    setDForm((d) => ({ ...d, saving: true, error: "" }));
    try {
      await api(k ? `/destinations/${k}` : "/destinations", { method: k ? "PUT" : "POST", body });
      setDForm(null); flash(k ? "Destination updated" : "Destination created"); loadDests();
    } catch (e) { setDForm((d) => ({ ...d, saving: false, error: e.message })); }
  };
  const deleteDest = async (d) => {
    if (!window.confirm(`Delete destination "${d.name}"?`)) return;
    try { await api(`/destinations/${id(d)}`, { method: "DELETE" }); flash("Destination deleted"); loadDests(); }
    catch (e) { flash(e.message); }
  };

  const mt = manage?.trip;
  const drawer = (<>
    {manage && <div className="tr-scrim" onClick={() => setManage(null)} />}
    {manage && (
      <aside className="tr-drawer" role="dialog" aria-label="Manage trip">
        <header>
          <div><h2>{ttl(mt)}</h2><p className="mono">{code(mt)}</p></div>
          <button className="tr-x" onClick={() => setManage(null)} aria-label="Close"><Icon n="plus" size={20} /></button>
        </header>
        <div className="tr-body">
          <label className="tr-f">Publication status
            <select value={manage.status} onChange={(e) => setManage({ ...manage, status: e.target.value })}>
              <option value="published">Published</option><option value="draft">Draft / Review</option><option value="archived">Archived</option>
            </select>
          </label>
          {manage.status !== "published" && stat(mt) === "published" && <p className="tr-warn"><Icon n="warn" size={15} />Unpublishing removes this expedition from consumer search and cached mobile feeds immediately.</p>}
          <label className="tr-f">Assigned operator
            <select value={manage.operatorId} onChange={(e) => setManage({ ...manage, operatorId: e.target.value })}>
              <option value="">No operator (unassigned)</option>
              {ops.map((o) => <option key={id(o)} value={id(o)}>{o.name || o.companyName}</option>)}
            </select>
          </label>
          <section className="tr-dates">
            <p className="tr-cap">Scheduled departures</p>
            {(extra[id(mt)]?.dates || []).length === 0 && <small>No departures scheduled.</small>}
            {(extra[id(mt)]?.dates || []).map((d) => {
              const s = seatsOf([d]);
              return <div key={id(d)}><span>{day(d.startDate || d.date)}</span><span className="mono">{s.booked}/{s.cap} seats</span></div>;
            })}
          </section>
          {manage.error && <p className="tr-err">{manage.error}</p>}
        </div>
        <footer>
          <button className="btn red" onClick={deleteTrip}>Delete trip</button>
          <span><button className="btn" onClick={() => setManage(null)}>Cancel</button>
            <button className="btn dark" disabled={manage.saving} onClick={saveManage}><Icon n="check" size={16} />{manage.saving ? "Saving…" : "Save Changes"}</button></span>
        </footer>
      </aside>
    )}
    {dForm && (
      <div className="tr-scrim mid" onClick={() => setDForm(null)}>
        <div className="tr-modal" role="dialog" aria-label="Destination" onClick={(e) => e.stopPropagation()}>
          <h2>{dForm.id || dForm._id ? "Edit destination" : "Add new destination"}</h2>
          {[["name", "Name"], ["region", "Region / Zone"], ["imageUrl", "Image URL"]].map(([k, l]) => (
            <label key={k} className="tr-f">{l}<input value={dForm[k] || ""} onChange={(e) => setDForm({ ...dForm, [k]: e.target.value })} /></label>
          ))}
          <label className="tr-f">Description<textarea rows={3} value={dForm.description || ""} onChange={(e) => setDForm({ ...dForm, description: e.target.value })} /></label>
          {dForm.error && <p className="tr-err">{dForm.error}</p>}
          <div className="tr-mact">
            <button className="btn" onClick={() => setDForm(null)}>Cancel</button>
            <button className="btn dark" disabled={dForm.saving || !dForm.name} onClick={saveDest}>{dForm.saving ? "Saving…" : "Save destination"}</button>
          </div>
        </div>
      </div>
    )}
    {toast && <div className="tr-toast" role="status">{toast}</div>}
  </>);

  return (
    <AdminLayout crumb="Overview" drawer={drawer}>
      <section className="tr-hero">
        <div>
          <h1>Trips &amp; Destinations Governance</h1>
          <p>Curate approved wilderness territories, monitor operator expedition listings, and enforce environmental quotas across Egyptian national protectorates.</p>
        </div>
        <div className="tr-stats">
          <div><small>Active protectorates</small><p className="big">{dests.length} <span>/ {dests.length} Zones</span></p></div>
          <div><small>EEAA daily quotas</small><p className="big">{quota != null ? `${quota}%` : "—"}</p><b className="rust">Tracked</b></div>
          <button className="btn dark" onClick={() => window.print()}><Icon n="shield" size={16} />Compliance Audit</button>
        </div>
        <div className="tr-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "trips"} className={tab === "trips" ? "on" : ""} onClick={() => setTab("trips")}><Icon n="tent" size={16} />All Expeditions &amp; Trips <span>{n(tripCount)}</span></button>
          <button role="tab" aria-selected={tab === "destinations"} className={tab === "destinations" ? "on" : ""} onClick={() => setTab("destinations")}><Icon n="pin" size={16} />Destinations &amp; Protectorates <span>{n(dests.length)}</span></button>
        </div>
        <p className="tr-live"><Icon n="swap" size={14} />Auto-sync with Bedouin Guild Registry: Live</p>
      </section>

      {tab === "trips" ? (<>
        <div className="tr-policy"><Icon n="info" size={16} /><p><b>Live Sync Policy:</b> Unpublishing or archiving any expedition immediately removes the itinerary from consumer search, cached mobile feeds, and Bedouin trail manifest listings.</p></div>

        <section className="tr-card">
          <div className="tr-filters">
            <label className="tr-s"><Icon n="search" size={16} /><input placeholder="Search by name, code (#TRV-8942-EGY), guide…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
            <select aria-label="Status" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <select aria-label="Protectorate" value={f.destinationId} onChange={(e) => setF({ ...f, destinationId: e.target.value })}>
              <option value="">All Protectorates</option>{dests.map((d) => <option key={id(d)} value={id(d)}>{d.name}</option>)}
            </select>
            <select aria-label="Guild" value={f.operatorId} onChange={(e) => setF({ ...f, operatorId: e.target.value })}>
              <option value="">All Bedouin Guilds</option>{ops.map((o) => <option key={id(o)} value={id(o)}>{o.name || o.companyName}</option>)}
            </select>
            <span className="tr-bulk">
              <button className="btn" onClick={() => bulkStatus("published")}><Icon n="check" size={15} />Bulk Publish</button>
              <button className="btn" onClick={() => bulkStatus("draft")}><Icon n="warn" size={15} />Bulk Unpublish</button>
              <button className="btn dark" onClick={exportCsv}><Icon n="download" size={15} />Export Manifest</button>
            </span>
          </div>

          <div className="tr-scroll">
            <table className="tr-tbl">
              <thead><tr>
                <th className="c"><input type="checkbox" aria-label="Select all" checked={!!rows.length && sel.size === rows.length} onChange={(e) => setSel(e.target.checked ? new Set(rows.map(id)) : new Set())} /></th>
                <th>Trip Name &amp; Code</th><th>Operator &amp; Guild</th><th>Destination / Zone</th><th>Departures</th><th>Quota &amp; Occupancy</th><th />
              </tr></thead>
              <tbody>
                {busy && !list && [1, 2, 3].map((i) => <tr key={i}><td colSpan={7}><div className="skel" /></td></tr>)}
                {err && <tr><td colSpan={7} className="tr-state err">Could not load trips: {err} <button className="btn sm" onClick={load}>Retry</button></td></tr>}
                {!err && list && rows.length === 0 && <tr><td colSpan={7} className="tr-state">No expeditions match these filters. <button className="btn sm" onClick={resetFilters}>Reset filters</button></td></tr>}
                {!err && rows.map((t) => {
                  const k = id(t), x = extra[k] || {}, dates = x.dates || [], op = x.operator || t.operator;
                  const up = dates.filter((d) => new Date(d.startDate || d.date) >= new Date()).sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date));
                  const { cap, booked } = seatsOf(dates), pct = cap ? Math.min(100, (booked / cap) * 100) : 0;
                  const dest = t.destination || dests.find((d) => id(d) === t.destinationId);
                  return (
                    <tr key={k}>
                      <td className="c"><input type="checkbox" aria-label={`Select ${ttl(t)}`} checked={sel.has(k)} onChange={() => toggleOne(k)} /></td>
                      <td>
                        <div className="tr-trip">
                          <span className="tr-img" style={t.image || t.imageUrl ? { backgroundImage: `url(${t.image || t.imageUrl})` } : undefined} />
                          <div><b>{ttl(t)}</b><small className="mono">{code(t)}</small></div>
                          {(t.category || t.type) && <span className={"tr-tag" + (/safari/i.test(t.category || t.type) ? " rust" : "")}>{t.category || t.type}</span>}
                        </div>
                        {stat(t) !== "published" && <span className={"tr-st " + stat(t)}>{stat(t) === "draft" ? "Draft / Review" : "Archived"}</span>}
                      </td>
                      <td>{op ? <><b>{op.name || op.companyName}</b><small>{op.guild || op.region || op.location}</small></> : <small className="rust">Unassigned</small>}</td>
                      <td>{dest ? <><b>{dest.name}</b><small>{dest.region || dest.zone}</small></> : <small>—</small>}</td>
                      <td>{x.loading ? <div className="skel sm" /> : up.length
                        ? <><b><Icon n="calendar" size={14} /> {day(up[0].startDate || up[0].date)}</b><small>{up.length} departures scheduled</small></>
                        : <><b><Icon n="calendar" size={14} /> Unscheduled</b><small>{stat(t) === "published" ? "No upcoming departures" : "Pending clearance"}</small></>}</td>
                      <td className="q">
                        <span className="mono">{booked}/{cap}</span>
                        <div className="bar"><i className={pct >= 100 ? "full" : ""} style={{ width: `${pct}%` }} /></div>
                      </td>
                      <td><button className="tr-btn" onClick={() => openManage(t)}>Manage</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <footer className="tr-foot">
            <span>Showing {rows.length ? (page - 1) * LIMIT + 1 : 0}–{(page - 1) * LIMIT + rows.length} of {n(total)} verified expeditions <i>|</i>
              <button className="tr-link" onClick={() => { setExtra({}); load(); }}><Icon n="swap" size={13} />Simulate Async Refresh</button></span>
            <nav aria-label="Pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous">‹</button>
              {pageNums.map((p, i) => p === "…" ? <span key={i}>…</span> : <button key={p} className={p === page ? "on" : ""} onClick={() => setPage(p)}>{p}</button>)}
              <button disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next">›</button>
            </nav>
          </footer>
        </section>
      </>) : (
        <section className="tr-card">
          <div className="tr-dhead">
            <div><h2>Destinations &amp; Protectorates</h2><p>Approved territories that operators can attach expeditions to.</p></div>
            <button className="btn dark" onClick={() => setDForm({})}><Icon n="plus" size={16} />Add New Destination</button>
          </div>
          {dests.length === 0 ? <p className="tr-state">No destinations yet. Add the first protectorate so operators can list expeditions there.</p> : (
            <div className="tr-grid">
              {dests.map((d) => (
                <article key={id(d)} className="tr-dest">
                  <div className="img" style={d.imageUrl || d.image ? { backgroundImage: `url(${d.imageUrl || d.image})` } : undefined} />
                  <div className="txt"><b>{d.name}</b><small>{d.region || d.zone || "—"}</small><p>{d.description}</p></div>
                  <div className="act">
                    <button className="tr-btn" onClick={() => setDForm(d)}>Edit</button>
                    <button className="tr-btn danger" onClick={() => deleteDest(d)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </AdminLayout>
  );
}
