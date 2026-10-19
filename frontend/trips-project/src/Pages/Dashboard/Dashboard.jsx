import { useState } from "react";
import {
    LayoutGrid, Compass, Ticket, UserCog, LogOut, Bell, User, RefreshCw, Download,
    Plus, ArrowLeftRight,  ClipboardList, CalendarX, Mail, ChevronRight,
    Armchair, CirclePlus, FileDown, Wallet, ShieldCheck, Mountain, Clock, Hourglass,
    CheckCircle2, CalendarCheck, Bus,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const NAV = [
    { 
        label: "Dashboard",
        icon: LayoutGrid, 
        to: "/dashboard", 
        active: true 
    
    },
    { 
        label: "Trips", 
        icon: Compass, 
        to: "/trips/edit" 
    },
    { 
        label: "Bookings", 
        icon: Ticket, 
        to: "/bookings" 
    },
    { label: "Profile", 
        icon: UserCog, 
        to: "/profile" 
    },
];

console.log("the lag is from the dashboard.jsx file")
const BOOKINGS = [
    { ref: "#BK-7842", name: "Tarek El-Sayed", sub: "Sinai Pass #884", trip: "Sinai High Mountain Sanctuary", dates: "Nov 14 – Nov 18, 2025", pax: 2, status: "confirmed" },
    { ref: "#BK-7890", name: "Omar Al-Khatib", sub: "Requested 12m ago", trip: "Sinai High Mountain Sanctuary", dates: "Nov 14 – Nov 18, 2025", pax: 1, status: "pending", hot: true },
    { ref: "#BK-7894", name: "Mariam Soliman", sub: "Cairo Expeditions Club", trip: "White Desert Lunar Traverse", dates: "Dec 04 – Dec 07, 2025", pax: 2, status: "pending", hot: true },
    { ref: "#BK-6912", name: "Nouran El-Gamil", sub: "Family Pass (4 Pax)", trip: "White Desert Lunar Traverse", dates: "Dec 04 – Dec 07, 2025", pax: 4, status: "upcoming" },
    { ref: "#BK-5820", name: "Karim Mostafa", sub: "Alexandria Trek Club", trip: "Siwa Oasis Great Sand Sea", dates: "Dec 15 – Dec 20, 2025", pax: 2, status: "confirmed" },
];

const STATUS = {
    confirmed: { label: "Confirmed", Icon: CheckCircle2 },
    pending: { label: "Pending", Icon: Hourglass },
    upcoming: { label: "Upcoming", Icon: CalendarCheck },
};

const SHORTCUTS = [
    { label: "Manage Availability & Quotas", Icon: Armchair, to: "/trips/dates" },
    { label: "+ Create New Expedition Listing", Icon: CirclePlus, to: "/trips/edit" },
    { label: "Export Passenger Manifest (PDF / SAR)", Icon: FileDown, download: true },
    { label: "View All Bookings & Escrow Log", Icon: Wallet },
];

const GUIDES = [
    { initials: "SJ", name: "Salem Jabali (Lead Guide)", track: "High Mountain Track", dot: "ok" },
    { initials: "FZ", name: "Farag Zeidan (Desert Scout)", track: "White Desert Traverse", dot: "busy" },
];

export default function Dashboard() {
  console.log("Dashboard rendered");

    const [tab, setTab] = useState("all");
    const rows = BOOKINGS.filter((b) => tab === "all" || b.status === tab);
    const confirm = (ref) => console.log("confirm booking", ref);

    return (
        <div className="db-shell">
            <aside className="db-sidebar">
                <Link to="/" className="db-brand" title="Return to Home" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="db-logo">T</span>
                    <span><b>TravelOra</b><small>OPERATOR WORKSPACE</small></span>
                </Link>
                <nav>
                    {NAV.map(({ label, icon: Icon, active, to }) => (
                        <Link key={label} to={to} className={active ? "db-nav is-active" : "db-nav"}>
                            <Icon size={18} /> {label}
                        </Link>
                    ))}
                </nav>
                <Link to="/logout" className="db-nav db-logout"><LogOut size={18} /> Logout</Link>
            </aside>

            <div className="db-main">
                <header className="db-topbar">
                    <div className="db-crumb">Operator Workspace › <b>Dashboard</b></div>
                    <div className="db-top-right">
                        <span className="db-fx"><RefreshCw size={14} /> $1 USD = 48.75 EGP</span>
                        <Bell size={18} className="db-bell" />
                        <div className="db-user">
                            <span>Sheikh Salem Al-Jabali Expeditions<small>Active Operator</small></span>
                            <i className="db-avatar"><User size={18} /></i>
                        </div>
                    </div>
                </header>

                <main className="db-content">
                    <section className="db-card db-hero">
                        <div>
                            <p className="db-eyebrow">Sheikh Salem Al-Jabali Expeditions · <em>Sinai Protectorate Station #4</em></p>
                            <h1>Dashboard</h1>
                            <p className="db-muted">Overview of your expedition fleets, customer bookings, and live mountain pass capacity.</p>
                        </div>
                        <div className="db-hero-actions">
                            <span className="db-pill"><i className="db-dot" /> Live Manifest Sync · Just now</span>
                            <button className="db-btn db-btn-soft"><Download size={15} /> Export Summary (CSV)</button>
                            <Link to="/trips/edit" className="db-btn db-btn-dark"><Plus size={16} /> Create Trip</Link>
                        </div>
                    </section>

                    <section className="db-stats">
                        <article className="db-card db-stat db-t-green">
                            <header><span>Total Expeditions</span><i><Compass size={18} /></i></header>
                            <strong>8</strong>
                            <footer><span>5 Published</span><span>2 Draft</span><span>1 Full</span></footer>
                        </article>
                        <article className="db-card db-stat db-t-blue">
                            <header><span>Upcoming Departures</span><i><Bus size={18} /></i></header>
                            <strong>6</strong>
                            <footer><span><Clock size={13} /> Next: Sinai High Mountain</span><span>Nov 14 (in 4 days) <b className="db-red">12/14 Pax</b></span></footer>
                        </article>
                        <article className="db-card db-stat db-t-red">
                            <header><span>Total Bookings</span><i><Ticket size={18} /></i></header>
                            <strong>34</strong>
                            <footer><span className="db-chip-red"><i className="db-dot" /> 4 Pending Confirmation</span><a href="#">Review</a></footer>
                        </article>
                        <article className="db-card db-stat db-t-teal">
                            <header><span>Capacity & Seats</span><i><Armchair size={18} /></i></header>
                            <strong>142 <small>Seats</small></strong>
                            <div className="db-occ"><span>Occupancy</span><b>71% (68 Sold)</b></div>
                            <div className="db-bar"><i style={{ width: "71%" }} /></div>
                            <p className="db-muted db-sm">28 seats remaining for Nov</p>
                        </article>
                    </section>

                    <div className="db-grid">
                        <div className="db-col">
                            <section className="db-sync">
                                <ArrowLeftRight size={22} />
                                <div>
                                    <h3>Customer Sync Active</h3>
                                    <p>Confirming an expedition seat immediately transmits SMS coordinates, triggers Sinai security clearances, and updates the traveler's offline guide pass.</p>
                                </div>
                            </section>

                            <section className="db-card db-table-card">
                                <header className="db-table-head">
                                    <div>
                                        <h2>Recent Customer Bookings</h2>
                                        <p className="db-muted">Incoming traveler requests awaiting guide dispatch</p>
                                    </div>
                                    <div className="db-tabs" role="tablist">
                                        {[["all", "All"], ["pending", "Pending (4)"], ["confirmed", "Confirmed (18)"]].map(([k, l]) => (
                                            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>{l}</button>
                                        ))}
                                    </div>
                                </header>
                                <div className="db-scroll">
                                    <table>
                                        <thead>
                                            <tr><th>Booking Ref</th><th>Traveler & Pass</th><th>Expedition & Dates</th><th>Pax</th><th>Status</th><th /></tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((b) => {
                                                const { label, Icon } = STATUS[b.status];
                                                return (
                                                    <tr key={b.ref} className={b.hot ? "is-hot" : ""}>
                                                        <td className={"db-mono" + (b.hot ? " db-red" : "")}>{b.ref}</td>
                                                        <td><b>{b.name}</b><small className={b.hot ? "db-red" : ""}>{b.sub}</small></td>
                                                        <td><b>{b.trip}</b><small>{b.dates}</small></td>
                                                        <td>{b.pax}</td>
                                                        <td><span className={`db-status db-s-${b.status}`}><Icon size={13} /> {label}</span></td>
                                                        <td>{b.status === "pending" && <button className="db-btn db-btn-dark db-btn-sm" onClick={() => confirm(b.ref)}>Confirm</button>}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <footer className="db-table-foot">
                                    <span>Showing {rows.length} of 34 recent reservations</span>
                                    <a href="#">Go to Bookings Management <ChevronRight size={14} /></a>
                                </footer>
                            </section>

                            <section className="db-card db-guides">
                                <header>
                                    <h2><Mountain size={18} /> Sinai Bedouin Guides & Fleet Allocation</h2>
                                    <span className="db-badge-green">4 Active Rangers</span>
                                </header>
                                <div className="db-guide-grid">
                                    {GUIDES.map((g) => (
                                        <div key={g.name} className="db-guide">
                                            <i className="db-initials">{g.initials}</i>
                                            <span><b>{g.name}</b><small>{g.track}</small></span>
                                            <i className={`db-dot db-dot-${g.dot}`} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="db-col">
                            <section className="db-card db-attn">
                                <header><h2><Bell size={18} /> Attention Required</h2><span className="db-badge-red">3 Alerts</span></header>
                                <div className="db-alert db-a-red">
                                    <p className="db-alert-title"><span><ClipboardList size={14} /> 4 Bookings Pending Confirmation</span><small>2h ago</small></p>
                                    <p>Travelers are waiting for your outfitter manifest approval to lock in their camp permits.</p>
                                    <a href="#">Review & Confirm (4) →</a>
                                </div>
                                <div className="db-alert db-a-red">
                                    <p className="db-alert-title"><span><CalendarX size={14} /> 2 Trips Have Low Availability</span><small>&lt; 4 Seats</small></p>
                                    <p>Sinai High Mountain (Nov 14) and White Desert (Dec 04) are nearing maximum convoy thresholds.</p>
                                    <Link to="/trips/dates">Manage Dates & Quotas →</Link>
                                </div>
                                <div className="db-alert db-a-blue">
                                    <p className="db-alert-title"><span><Mail size={14} /> 1 Trip in Draft / Unpublished</span><small>Staging</small></p>
                                    <p>Gebel Elba Deep Biosphere Explorer is saved as draft and currently hidden from public discovery.</p>
                                    <a href="#">Review & Publish Expedition →</a>
                                </div>
                            </section>

                            <section className="db-card db-shortcuts">
                                <header><h2>Command Shortcuts</h2></header>
                                {SHORTCUTS.map(({ label, Icon, download, to = "#" }) => (
                                    <Link to={to} key={label} className="db-shortcut">
                                        <Icon size={20} /><span>{label}</span>
                                        {download ? <Download size={15} /> : <ChevronRight size={15} />}
                                    </Link>
                                ))}
                            </section>

                            <section className="db-card db-escrow">
                                <header><h2><ShieldCheck size={18} /> Outfitter Escrow & Trust</h2><span className="db-mono db-tag">CBE BONDED</span></header>
                                <div className="db-escrow-box">
                                    <small>ESCROW LOCKED FUNDS</small>
                                    <p><strong>184,200 EGP</strong><span className="db-mono">~$3,780 USD</span></p>
                                    <p className="db-muted">Disbursed directly upon successful expedition completion and Sinai ranger sign-off.</p>
                                </div>
                                <footer><span><i className="db-dot" /> EEAA Outfitter Status: Grade A Active</span><span className="db-mono">#EEAA-SIN-441-EXP</span></footer>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}
