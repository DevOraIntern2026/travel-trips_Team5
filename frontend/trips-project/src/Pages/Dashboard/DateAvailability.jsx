
import { useMemo, useState } from "react";
import {
    LayoutGrid, Compass, Ticket, UserCog, LogOut, Bell, User, RefreshCw, List,
    CalendarDays, SlidersHorizontal, Columns3, Plus, ExternalLink, Armchair, Users,
    Flame, PauseCircle, Trash2, X, Pencil, Lock, Zap, ShieldCheck, TimerReset,
    Clock, CheckCircle2, ScanLine, FolderOpen, TriangleAlert, PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./dateAvailability.css";
const NAV = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        to: "/dashboard"
    },
    {
        label: "Trips",
        icon: Compass,
        to: "/trips/edit",
        active: true
    },
    {
        label: "Bookings",
        icon: Ticket,
        to: "/bookings"
    },
    {
        label: "Profile",
        icon: UserCog,
        to: "/profile"
    },
];
console.log("the lag is from the dateAvailability.jsx file")
const INITIAL = [
    { id: 1, start: "2025-11-14", end: "2025-11-18", lead: "Sheikh Salem", seats: 16, booked: 12 },
    { id: 2, start: "2025-11-28", end: "2025-12-02", lead: "Youssef Bedouin Crew", seats: 16, booked: 16, waitlist: 4 },
    { id: 3, start: "2025-12-12", end: "2025-12-16", lead: "Sheikh Salem", seats: 16, booked: 14 },
    { id: 4, start: "2025-12-26", end: "2025-12-30", lead: "Sheikh Salem + 2 Assistant Guides", seats: 20, booked: 18, tag: "HOLIDAY SPECIAL", note: "New Year Alpine Crossing" },
    { id: 5, start: "2026-01-09", end: "2026-01-13", lead: null, seats: 16, booked: 8 },
    { id: 6, start: "2026-01-23", end: "2026-01-27", lead: null, seats: 12, booked: 0, paused: true, tag: "TRAIL REST", note: "Monastery Pass Path Maintenance" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return { y, m: m - 1, d }; };
const range = (a, b) => {
    const A = parse(a), B = parse(b);
    const same = A.y === B.y;
    return `${MONTHS[A.m]} ${A.d}${same ? "" : `, ${A.y}`} – ${MONTHS[B.m]} ${String(B.d).padStart(2, "0")}, ${B.y}`;
};
const nightsOf = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

const statusOf = (r) => {
    if (r.paused) return { key: "paused", label: "Closed / Paused" };
    const left = r.seats - r.booked;
    if (left === 0) return { key: "full", label: "Full (Sold Out)" };
    if (left <= 3) return { key: "low", label: `Low Availability (${left} left)` };
    return { key: "ok", label: `Available (${left} left)` };
};

const BLANK = { start: "", end: "", seats: 16, lead: "Sheikh Salem Al-Jabali (Master Guide)", price: "", publish: false };

export default function DatesAvailability() {
  console.log("DatesAvailability rendered");

    const [rows, setRows] = useState(INITIAL);
    const [drawer, setDrawer] = useState(false);
    const [form, setForm] = useState(BLANK);
    const [guard, setGuard] = useState({ date: "Nov 14 – Nov 18", want: 10, booked: 12 });
    const [editing, setEditing] = useState(null);

    const stats = useMemo(() => {
        const live = rows.filter((r) => !r.paused);
        const pool = live.reduce((s, r) => s + r.seats, 0);
        const booked = live.reduce((s, r) => s + r.booked, 0);
        return { dates: live.length, pool, booked, left: pool - booked, pct: pool ? Math.round((booked / pool) * 100) : 0, paused: rows.length - live.length };
    }, [rows]);

    const setSeats = (id, value) => {
        const row = rows.find((r) => r.id === id);
        const n = Math.max(0, parseInt(value, 10) || 0);
        if (n < row.booked) {
            setGuard({ date: range(row.start, row.end).replace(/, \d{4}/g, ""), want: n, booked: row.booked });
        } else {
            setGuard(null);
            setRows(rows.map((r) => (r.id === id ? { ...r, seats: n } : r)));
        }
        setEditing(null);
    };
    const togglePause = (id) => setRows(rows.map((r) => (r.id === id ? { ...r, paused: !r.paused } : r)));
    const remove = (id) => setRows(rows.filter((r) => r.id !== id));
    const submit = (e) => {
        e.preventDefault();
        if (!form.start || !form.end) return;
        setRows([...rows, { id: Date.now(), start: form.start, end: form.end, lead: form.lead, seats: +form.seats, booked: 0 }].sort((a, b) => a.start.localeCompare(b.start)));
        setForm(BLANK); setDrawer(false);
    };

    return (
        <div className="da-shell">
            <aside className="da-sidebar">
                <div className="da-brand"><span className="da-logo">T</span><span><b>TravelOra</b><small>OPERATOR WORKSPACE</small></span></div>
                <nav>{NAV.map(({ label, icon: Icon, active, to }) => (
                    <Link key={label} to={to} className={active ? "da-nav is-active" : "da-nav"}><Icon size={18} /> {label}</Link>
                ))}</nav>
                <Link to="/logout" className="da-nav da-logout"><LogOut size={18} /> Logout</Link>
            </aside>

            <div className="da-main">
                <header className="da-topbar">
                    <div className="da-crumb">Operator Workspace › <b>Trips</b></div>
                    <div className="da-top-right">
                        <span className="da-fx"><RefreshCw size={14} /> 1 USD = 48.75 EGP</span>
                        <Bell size={18} className="da-bell" />
                        <i className="da-avatar"><User size={18} /></i>
                    </div>
                </header>

                <div className="da-content">
                    <div className="da-trail">
                        <p><FolderOpen size={13} /> <Link to="/trips/edit">My Trips</Link> / <Link to="/trips/edit"><b>Sinai High Mountain Sanctuary Traverse</b></Link> <code>#TRV-8942-EGY</code> / <b>Dates & Availability</b></p>
                        <span><i className="da-dot" /> Seat Sync Engine: Active (Zero Latency)</span>
                    </div>

                    <section className="da-head">
                        <div>
                            <p className="da-kicker"><Armchair size={13} /> Inventory allocation & safety guardrails</p>
                            <h1>Dates & Availability Management</h1>
                            <p className="da-muted">Manage departure schedules, total seat quotas, and real-time customer capacity. Every seat count modified here directly synchronizes with the public Customer Seat Selector.</p>
                        </div>
                        <div className="da-tools">
                            <div className="da-seg"><button className="is-on"><List size={14} /> List View</button><button><CalendarDays size={14} /> Calendar</button></div>
                            <button className="da-btn da-btn-soft"><SlidersHorizontal size={14} /> Set Quota</button>
                            <button className="da-btn da-btn-outline"><Columns3 size={14} /> Bulk Add</button>
                            <button className="da-btn da-btn-dark" onClick={() => setDrawer(true)}><Plus size={15} /> Add Departure Date</button>
                        </div>
                    </section>

                    <section className="da-link">
                        <i><ScanLine size={20} /></i>
                        <div>
                            <h3>Direct Customer Link Active <span className="da-chip">PUBLIC FRONTEND HOOK</span></h3>
                            <p>Available seats shown below are live in the Customer Booking Flow. When an explorer confirms a reservation, remaining seats decrement instantly in real-time. Dates with 0 remaining seats automatically shift to <em>"Sold Out"</em> in the booking engine, stopping further transactions and queuing up waitlists.</p>
                        </div>
                        <a href="#" className="da-btn da-btn-white"><ExternalLink size={13} /> Preview Public Form</a>
                    </section>

                    {guard && (
                        <div className="da-guard" role="alert">
                            <i><TriangleAlert size={20} /></i>
                            <div>
                                <h3>Capacity Guardrail Triggered <span className="da-chip da-chip-red">BLOCKED ACTION</span></h3>
                                <p><b>Cannot reduce seats below booked count.</b> You attempted to reduce the <u>{guard.date}</u> departure to <b>{guard.want} seats</b>, but <b>{guard.booked} seats</b> are already confirmed and paid for by customers. Minimum allowed capacity for this date is strictly <b>{guard.booked} seats</b>.</p>
                            </div>
                            <button aria-label="Dismiss" onClick={() => setGuard(null)}><X size={18} /></button>
                        </div>
                    )}

                    <section className="da-stats">
                        <Stat label="Scheduled Departures" icon={<CalendarDays size={18} />} value={stats.dates} unit="Dates" foot={<><CheckCircle2 size={12} /> Through Jan 2026</>} />
                        <Stat label="Total Quota Pool" icon={<Armchair size={18} />} value={stats.pool} unit="Seats" foot="Average 16 seats / departure" />
                        <div className="da-stat">
                            <header><span>Customer Occupancy</span><b>{stats.pct}%</b></header>
                            <p className="da-big">{stats.booked}<small> / {stats.pool} Booked</small></p>
                            <div className="da-bar"><i style={{ width: `${stats.pct}%` }} /></div>
                        </div>
                        <Stat label="Remaining Unsold" icon={<Ticket size={18} />} value={stats.left} unit="Seats" red foot={<span className="da-red"><Flame size={12} /> High demand season</span>} />
                        <Stat label="Blackout / Paused" icon={<PauseCircle size={18} />} value={stats.paused} unit="Date" foot="Trail restoration maintenance" />
                    </section>

                    <section className="da-table">
                        <header>
                            <h2>Active Expedition Departures <span className="da-mono da-count">{rows.length} Records</span></h2>
                            <span className="da-muted">Sorted by: Departure Date ↓</span>
                        </header>
                        <div className="da-scroll">
                            <table>
                                <thead><tr><th>Departure & Return</th><th>Seat Capacity</th><th>Booked Customers</th><th>Live Remaining</th><th>Customer Visibility Status</th><th>Schedule Operations</th></tr></thead>
                                <tbody>
                                    {rows.map((r) => {
                                        const s = statusOf(r);
                                        const A = parse(r.start);
                                        const left = r.paused ? null : r.seats - r.booked;
                                        const n = nightsOf(r.start, r.end);
                                        return (
                                            <tr key={r.id} className={`is-${s.key}`}>
                                                <td>
                                                    <div className="da-date">
                                                        <i><small>{MONTHS[A.m].toUpperCase()}</small>{String(A.d).padStart(2, "0")}</i>
                                                        <div>
                                                            <b className={r.paused ? "da-strike" : ""}>{range(r.start, r.end)}</b>
                                                            <small>{n + 1} Days / {n} Nights · {r.note ?? <>Lead: {r.lead ?? "Unassigned"}</>}</small>
                                                            {r.tag && <span className="da-chip da-chip-blue">{r.tag}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {editing === r.id ? (
                                                        <input className="da-seat-input" type="number" autoFocus defaultValue={r.seats} onBlur={(e) => setSeats(r.id, e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
                                                    ) : (
                                                        <button className="da-seats" disabled={r.paused} onClick={() => setEditing(r.id)}>{r.seats} seats <Pencil size={11} /></button>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.paused ? <span className="da-mono da-dim">0 Booked</span> : (
                                                        <div className="da-booked">
                                                            <i className="da-av">{r.booked >= r.seats ? r.booked : "TE"}</i>
                                                            <span><b>{r.booked >= r.seats ? `${r.booked} Full (100%)` : `${r.booked} Booked`}</b>
                                                                {r.waitlist ? <small className="da-red">{r.waitlist} on Waitlist</small> : <a href="#">View Manifest</a>}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.paused ? <span className="da-mono da-dim">Blocked</span> : (
                                                        <div className="da-left">
                                                            <span className="da-mono"><i className={"da-dot" + (left <= 3 ? " is-red" : "")} /> {left} seats left</span>
                                                            <div className="da-bar"><i className={left <= 3 ? "is-red" : ""} style={{ width: `${(r.booked / r.seats) * 100}%` }} /></div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td><span className={`da-status da-st-${s.key}`}>{s.key === "full" && <Lock size={12} />}{s.key === "low" && <Zap size={12} />}{s.key === "ok" && <CheckCircle2 size={12} />}{s.label}</span></td>
                                                <td>
                                                    <div className="da-ops">
                                                        {s.key === "full" && <button className="da-btn da-btn-rust da-btn-sm" onClick={() => setSeats(r.id, r.seats + 4)}>+ Increase Seats</button>}
                                                        {r.paused && <button className="da-btn da-btn-forest da-btn-sm" onClick={() => togglePause(r.id)}><PlayCircle size={13} /> Re-open Date</button>}
                                                        {!r.paused && s.key !== "full" && <button aria-label="Quota" onClick={() => setEditing(r.id)}><SlidersHorizontal size={16} /></button>}
                                                        {s.key === "full" && <button aria-label="Manifest"><Users size={16} /></button>}
                                                        {!r.paused && <button aria-label="Pause date" onClick={() => togglePause(r.id)}><PauseCircle size={16} /></button>}
                                                        {s.key !== "full" && <button aria-label="Delete date" onClick={() => remove(r.id)}><Trash2 size={16} /></button>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {!rows.length && <tr><td colSpan={6} className="da-empty">No departures yet. Add a departure date to open seats to customers.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="da-bottom">
                        <section className="da-principles">
                            <header><i><ShieldCheck size={18} /></i><div><h3>Sinai Safety & Quota Principles</h3><p className="da-muted">Official operator guidelines for high-altitude eco-trekking capacity</p></div></header>
                            <div className="da-pr-grid">
                                <article><h4><Users size={14} /> Ranger-To-Trekker Ratio (1:8)</h4><p>Each departure with 16 seats requires at least 2 Bedouin mountain leaders and 4 baggage camels. Quota limits are legally locked at 20 seats per cohort.</p></article>
                                <article><h4><TimerReset size={14} /> 72-Hour Cutoff Threshold</h4><p>Unsold seats automatically lock 72 hours prior to departure to finalize supply caravan logistics at St. Catherine Base Camp.</p></article>
                            </div>
                        </section>
                        <section className="da-auto">
                            <span><Zap size={11} /> Fast Allocation Engine</span>
                            <h3>Spring 2026 Batch Scheduler</h3>
                            <p>Generate bi-weekly Friday departures through May 2026 in one click using your verified 16-seat mountain configuration.</p>
                            <button className="da-btn da-btn-white"><Zap size={14} /> Run Auto-Scheduler</button>
                        </section>
                    </div>
                </div>
            </div>

            {drawer && <div className="da-scrim" onClick={() => setDrawer(false)} />}
            <aside className={"da-drawer" + (drawer ? " is-open" : "")} aria-hidden={!drawer}>
                <header>
                    <i><Plus size={18} /></i>
                    <div><h2>Schedule New Departure</h2><small>Sinai High Mountain Sanctuary Traverse</small></div>
                    <button aria-label="Close" onClick={() => setDrawer(false)}><X size={20} /></button>
                </header>
                <form onSubmit={submit}>
                    <p className="da-field-title">Departure & Return Dates</p>
                    <div className="da-two">
                        <label><small>Start (Day 1)</small><input type="date" required value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></label>
                        <label><small>End (Day 5)</small><input type="date" required min={form.start} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></label>
                    </div>
                    <p className="da-field-title">Total Seat Quota (Max Capacity) <span className="da-mono">Default: 16 Seats</span></p>
                    <div className="da-seat-row"><input type="number" min="1" max="20" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /><span>Hikers / cohort</span></div>
                    <small className="da-hint">This number immediately represents 100% capacity in the customer checkout.</small>
                    <p className="da-field-title">Assigned Expedition Leader</p>
                    <select value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })}>
                        <option>Sheikh Salem Al-Jabali (Master Guide)</option>
                        <option>Youssef Bedouin Crew</option>
                        <option>Farag Zeidan (Desert Scout)</option>
                    </select>
                    <p className="da-field-title">Base Price Override (Optional) <span className="da-mono">Trip Default: $840 USD</span></p>
                    <div className="da-money"><span>$</span><input type="number" min="0" placeholder="840" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                    <small className="da-hint">Leave empty to preserve default expedition standard tier.</small>
                    <label className="da-switch">
                        <span><b>Publish Instantly</b><small>Make available to customers immediately upon save</small></span>
                        <input type="checkbox" checked={form.publish} onChange={(e) => setForm({ ...form, publish: e.target.checked })} />
                    </label>
                    <div className="da-two">
                        <button type="button" className="da-btn da-btn-soft da-btn-lg" onClick={() => setDrawer(false)}>Cancel</button>
                        <button type="submit" className="da-btn da-btn-dark da-btn-lg">Add to Schedule</button>
                    </div>
                </form>
            </aside>
        </div>
    );
}

function Stat({ label, icon, value, unit, foot, red }) {
    return (
        <div className="da-stat">
            <header><span>{label}</span><i>{icon}</i></header>
            <p className={"da-big" + (red ? " da-red" : "")}>{value}<small> {unit}</small></p>
            <footer>{foot}</footer>
        </div>
    );
}
