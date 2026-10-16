import { useState } from "react";
import {
    LayoutGrid, Compass, Ticket, UserCog, LogOut, Bell, User, RefreshCw, FolderOpen,
    ExternalLink, Save, CheckCircle2, CircleAlert, ShieldCheck, UploadCloud, Star,
    Trash2, GripVertical, PlusCircle, ChevronUp, ChevronDown, X, Plus, Bold, Italic,
    List, Quote, CalendarPlus, CalendarDays, Network, Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./editTrips.css";
import sinai from "../../assets/images/dateImages/sinai.png";
import image1 from "../../assets/images/dateImages/1.png";
import image2 from "../../assets/images/dateImages/2.png";
import image3 from "../../assets/images/dateImages/3.png";
import image4 from "../../assets/images/dateImages/4.png";
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


console.log("the lag is from the editTrips.jsx file")
const INITIAL = {
    title: "Sinai High Mountain Traverse & Bivouac",
    protectorate: "south-sinai",
    price: 480,
    days: 5,
    nights: 4,
    tags: ["High-Altitude Trekking", "Bedouin Cultural Heritage", "Dark-Sky Stargazing"],
    overview:
        "Traverse the ancient granite plateaus of South Sinai under the guidance of native Jabaliya Bedouin pathfinders. Journey through Wadi Zawateen to the summit of Mt. Katherine (2,629m), bivouacking beneath pristine dark skies with traditional hearth-baked libba bread and campfire tea.",
    highlights: [
        "Ascend Mt. Katherine (2,629m), Egypt's highest alpine granite peak",
        "Authentic bivouac camps hosted by accredited Jabaliya Bedouin guides",
        "Full satellite transceiver mesh connectivity & mountain SAR support",
        "Zero-trace environmental stewardship in EEAA sanctuary zones",
    ],
    photos: [
        { id: 1, label: "Primary Hero Cover", alt: "Hiker traversing the vibrant red and purple canyon walls", path:image1 },
        { id: 2, label: "Gallery #2", alt: "Alpine sunset panorama over South Sinai's peaks", path:image2 },
        { id: 3, label: "Gallery #3", alt: "Bedouin host preparing artisan unleavened bread", path:image3 },
        { id: 4, label: "Gallery #4", alt: "Expedition camels trekking through high rock passes", path:image4 },
    ],
    itinerary: [
        { id: "D1", title: "Ascent to Wadi Zawateen Bivouac", elev: "+680m", km: "12.4 km", at: "St. Catherine Gate", body: "Pack camels rendezvous at St. Catherine Monastery gate node #2. Gentle ascent along ancient stone staircases into the secluded Wadi Zawateen amphitheater for traditional hearth tea and sunset dinner.", perks: ["Lunch Provided", "Campfire Bivouac"], open: true },
        { id: "D2", title: "Bab El-Dunya Ridge & Deep Canyon Scramble", elev: "+450m", km: "14.1 km", at: "Canyon Pass", body: "Geological formations and ancient hermit cell explorations. Scramble through the famous striped sandstone passes leading into the threshold of the \"Gate of the World\" (Bab El-Dunya) ridge.", perks: ["Bedouin Guide Led", "Fresh Spring Water Refill"], open: true },
        { id: "D3", title: "Mt. Katherine Summit Push & High Plateau Camp", elev: "+710m", km: "16.0 km", at: "Peak 2,629m", body: "Early dawn ascent to Egypt's highest peak at 2,629m. Unrivaled 360-degree views extending across the Gulf of Suez and Gulf of Aqaba. Night bivouac under world-class Bortle Class 1 dark skies.", perks: ["Summit Permit Cleared", "Stargazing Briefing"], open: true },
    ],
    published: true,
};

export default function EditTrip() {
  console.log("EditTrip rendered");

    const [t, setT] = useState(INITIAL);
    const set = (patch) => setT((p) => ({ ...p, ...patch }));
    const [newTag, setNewTag] = useState("");
    const [addingTag, setAddingTag] = useState(false);

    const updateHighlight = (i, v) => set({ highlights: t.highlights.map((h, j) => (j === i ? v : h)) });
    const removeHighlight = (i) => set({ highlights: t.highlights.filter((_, j) => j !== i) });
    const addHighlight = () => set({ highlights: [...t.highlights, ""] });
    const makeHero = (id) => set({ photos: t.photos.map((p) => ({ ...p, label: p.id === id ? "Primary Hero Cover" : p.label === "Primary Hero Cover" ? `Gallery #${p.id}` : p.label })) });
    const removePhoto = (id) => set({ photos: t.photos.filter((p) => p.id !== id) });
    const toggleDay = (id) => set({ itinerary: t.itinerary.map((d) => (d.id === id ? { ...d, open: !d.open } : d)) });
    const removeDay = (id) => set({ itinerary: t.itinerary.filter((d) => d.id !== id) });
    const addDay = () => {
        const n = t.itinerary.length + 1;
        set({ itinerary: [...t.itinerary, { id: `D${n}`, title: "New day", elev: "+0m", km: "0 km", at: "Trailhead", body: "", perks: [], open: true }] });
    };
    const addTag = () => {
        if (newTag.trim()) set({ tags: [...t.tags, newTag.trim()] });
        setNewTag(""); setAddingTag(false);
    };
    const save = (mode) => console.log("save", mode, t);

    return (
        <div className="et-shell">
            <aside className="et-sidebar">
                <div className="et-brand"><span className="et-logo">T</span><span><b>TravelOra</b><small>OPERATOR WORKSPACE</small></span></div>
                <nav>{NAV.map(({ label, icon: Icon, active, to }) => (
                    <Link key={label} to={to} className={active ? "et-nav is-active" : "et-nav"}><Icon size={18} /> {label}</Link>
                ))}</nav>
                <Link to="/logout" className="et-nav et-logout"><LogOut size={18} /> Logout</Link>
            </aside>

            <div className="et-main">
                <header className="et-topbar">
                    <div className="et-crumb">Operator Workspace › <b>Trips</b></div>
                    <div className="et-top-right">
                        <span className="et-fx"><RefreshCw size={14} /> 1 USD = 48.75 EGP</span>
                        <Bell size={18} className="et-bell" />
                        <i className="et-avatar"><User size={18} /></i>
                    </div>
                </header>

                <div className="et-content">
                    <p className="et-trail"><FolderOpen size={13} /> My Trips › Edit Trip: Sinai High Mountain Sanctuary Traverse <span className="et-mono">(#TRV-8942-EGY)</span></p>

                    <div className="et-title-row">
                        <div>
                            <h1>Edit Trip Details</h1>
                            <span className="et-status"><i className="et-dot" /> {t.published ? "Status: Published (Live on Customer Catalog)" : "Status: Draft (Hidden)"}</span>
                            <span className="et-synced"><RefreshCw size={12} /> Synced to Search Engine</span>
                            <p className="et-muted et-intro">All details configured here directly populate the public Customer Trip Detail page and search results cards across the TravelOra marketplace.</p>
                        </div>
                        <div className="et-actions">
                            <Link to="/trips/dates" className="et-btn et-btn-outline"><CalendarDays size={15} /> Dates & Availability</Link>
                            <button className="et-btn et-btn-ghost"><ExternalLink size={15} /> Preview Customer View</button>
                            <button className="et-btn et-btn-soft" onClick={() => save("draft")}><Save size={15} /> Save as Draft</button>
                            <button className="et-btn et-btn-dark" onClick={() => save("update")}><CheckCircle2 size={15} /> Save & Update Trip</button>
                        </div>
                    </div>

                    <div className="et-layout">
                        <div className="et-forms">
                            {/* 1 */}
                            <section className="et-card">
                                <SectionHead n={1} title="Basic Information" sub="Core taxonomy, commercial pricing, and headline copy displayed on traveler discovery." aside={<span className="et-badge">REQUIRED FIELDS MARKED *</span>} />
                                <label className="et-label">Trip Title * <small>{t.title.length} / 80 characters</small></label>
                                <input className="et-input" maxLength={80} value={t.title} onChange={(e) => set({ title: e.target.value })} />
                                <p className="et-hint"><Info size={12} /> Appears as main title on Customer Trip Detail, checkout receipts, and search cards.</p>

                                <div className="et-two">
                                    <div>
                                        <label className="et-label">Destination Protectorate *</label>
                                        <select className="et-input" value={t.protectorate} onChange={(e) => set({ protectorate: e.target.value })}>
                                            <option value="south-sinai">South Sinai Protectorate (St. Catherine &amp; Wadi Zawateen)</option>
                                            <option value="white-desert">White Desert Protectorate</option>
                                            <option value="wadi-rayan">Wadi El Rayan Protectorate</option>
                                        </select>
                                        <p className="et-hint">EEAA Permit Zone: Southern Section Sanctuary</p>
                                    </div>
                                    <div>
                                        <label className="et-label">Base Price per Person *</label>
                                        <div className="et-price">
                                            <span>$</span>
                                            <input type="number" min="0" value={t.price} onChange={(e) => set({ price: +e.target.value })} />
                                            <em className="et-mono">USD / {(t.price * 48.75).toLocaleString("en-US")} EGP</em>
                                        </div>
                                        <p className="et-hint">Displayed on customer search cards and trip detail pricing tier.</p>
                                    </div>
                                </div>

                                <div className="et-two">
                                    <div>
                                        <label className="et-label">Duration *</label>
                                        <div className="et-duration">
                                            <div className="et-input"><input type="number" min="1" value={t.days} onChange={(e) => set({ days: +e.target.value })} /><span>Days</span></div>
                                            <div className="et-input"><input type="number" min="0" value={t.nights} onChange={(e) => set({ nights: +e.target.value })} /><span>Nts</span></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="et-label">Trip Categories & Search Tags</label>
                                        <div className="et-tags">
                                            {t.tags.map((tag) => (
                                                <span key={tag} className="et-tag">{tag}<button aria-label={`Remove ${tag}`} onClick={() => set({ tags: t.tags.filter((x) => x !== tag) })}><X size={12} /></button></span>
                                            ))}
                                            {addingTag ? (
                                                <input autoFocus className="et-tag-input" value={newTag} onChange={(e) => setNewTag(e.target.value)} onBlur={addTag} onKeyDown={(e) => e.key === "Enter" && addTag()} />
                                            ) : (
                                                <button className="et-tag-add" onClick={() => setAddingTag(true)}><Plus size={13} /> Add Tag</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <label className="et-label">Trip Overview & Lore * <small className="et-mono">{t.overview.length} / 1,000</small></label>
                                <div className="et-editor">
                                    <div className="et-toolbar"><Bold size={14} /><Italic size={14} /><List size={14} /><span /><Quote size={14} /></div>
                                    <textarea maxLength={1000} rows={5} value={t.overview} onChange={(e) => set({ overview: e.target.value })} />
                                </div>
                                <p className="et-hint">Crafted for multi-day trekking enthusiasts seeking authentic heritage and remote natural wilderness.</p>
                            </section>

                            {/* 2 */}
                            <section className="et-card">
                                <SectionHead n={2} title="Media & Trail Photography" sub="High-resolution imagery powering the Customer Carousel, Lightbox & Search Thumbnails." aside={<span className="et-mono">{t.photos.length} / 12 Uploaded</span>} />
                                <label className="et-drop">
                                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden />
                                    <i><UploadCloud size={22} /></i>
                                    <p>Drag & drop high-resolution trail photographs here or <u>Browse files</u></p>
                                    <small>JPG, PNG or WebP up to 10MB each. 16:9 ratio recommended for full-bleed mobile display.</small>
                                </label>
                                <div className="et-photos">
                                    {t.photos.map((p) => {
                                        const hero = p.label === "Primary Hero Cover";
                                        return (
                                            <figure key={p.id} className="et-photo">
                                                <div className="et-img" >
                                                    <img className="sinaiImg" src={p.path} alt={p.label} />
                                                    <span className={hero ? "et-photo-tag is-hero" : "et-photo-tag"}>{hero && <Star size={11} />} {p.label}</span>
                                                    {!hero && <button className="et-make-hero" onClick={() => makeHero(p.id)}>Make Hero</button>}
                                                    <button className="et-del" aria-label="Delete photo" onClick={() => removePhoto(p.id)}><Trash2 size={13} /></button>
                                                </div>
                                                <figcaption>
                                                    <p><b>WCAG Accessible Alt-Text</b><span className="et-pass">PASSED</span></p>
                                                    <input className="et-input" value={p.alt} onChange={(e) => set({ photos: t.photos.map((x) => x.id === p.id ? { ...x, alt: e.target.value } : x) })} />
                                                </figcaption>
                                            </figure>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* 3 */}
                            <section className="et-card">
                                <SectionHead n={3} title="Trip Highlights & Selling Points" sub="Key takeaway bullets highlighted on the customer mobile booking card." aside={<span className="et-badge">SYNCED TO DETAILS PAGE</span>} />
                                {t.highlights.map((h, i) => (
                                    <div key={i} className="et-hl">
                                        <GripVertical size={16} className="et-grip" />
                                        <input className="et-input" value={h} placeholder="Add a selling point" onChange={(e) => updateHighlight(i, e.target.value)} />
                                        <button className="et-icon-btn" aria-label="Remove highlight" onClick={() => removeHighlight(i)}><Trash2 size={15} /></button>
                                    </div>
                                ))}
                                <button className="et-btn et-btn-soft" onClick={addHighlight}><PlusCircle size={15} /> + Add Another Highlight</button>
                            </section>

                            {/* 4 */}
                            <section className="et-card">
                                <SectionHead n={4} title="Day-by-Day Expedition Itinerary" sub="Collapsible day cards. Reorder, add elevation gain, and distance data." aside={<span className="et-badge">{t.itinerary.length} of {t.days} Days Configured</span>} />
                                {t.itinerary.map((d) => (
                                    <article key={d.id} className="et-day">
                                        <header onClick={() => toggleDay(d.id)}>
                                            <i className="et-day-id">{d.id}</i>
                                            <div>
                                                <h3>{d.title}</h3>
                                                <p className="et-mono"><b>{d.elev} Elevation</b> • {d.km} Trek • {d.at}</p>
                                            </div>
                                            <button className="et-icon-btn" aria-expanded={d.open} aria-label="Toggle day">{d.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                                        </header>
                                        {d.open && (
                                            <>
                                                <p className="et-day-body">{d.body}</p>
                                                <footer>
                                                    <span>{d.perks.map((x) => <em key={x}><i />{x}</em>)}</span>
                                                    <button className="et-remove" onClick={() => removeDay(d.id)}><Trash2 size={12} /> Remove Day</button>
                                                </footer>
                                            </>
                                        )}
                                    </article>
                                ))}
                                <button className="et-btn et-btn-soft" onClick={addDay}><CalendarPlus size={15} /> + Add Day to Itinerary</button>
                            </section>

                            {/* 5 */}
                            <section className="et-card">
                                <SectionHead n={5} title="Visibility & Customer Sync Control" sub="Control trip publication state across the marketplace index." aside={<Network size={20} />} />
                                {[
                                    [true, "Published (Visible to Customers in Catalog & Search)", "Travelers worldwide can discover, inspect, and complete instant seat bookings for this expedition."],
                                    [false, "Draft (Hidden from Customers — Only visible to Operator)", "Trip is delisted from public search. Current confirmed bookings remain intact but new checkout flows are blocked."],
                                ].map(([val, title, desc]) => (
                                    <label key={title} className={"et-radio" + (t.published === val ? " is-on" : "")}>
                                        <input type="radio" name="visibility" checked={t.published === val} onChange={() => set({ published: val })} />
                                        <span><b>{title}{val && <i className="et-dot" />}</b><small>{desc}</small></span>
                                    </label>
                                ))}
                            </section>
                        </div>

                        <aside className="et-side">
                            <section className="et-card et-health">
                                <header><span>MARKETPLACE HEALTH</span><ShieldCheck size={16} /></header>
                                <div className="et-score"><i>98%</i><span><b>Listing Completeness</b><small>High-conversion quality tier</small></span></div>
                                <ul>
                                    <li><CheckCircle2 size={14} /> {t.photos.length} High-Res Images <b className="et-mono">100%</b></li>
                                    <li><CheckCircle2 size={14} /> Daily GPS & Elevation <b className="et-mono">Ready</b></li>
                                    <li className="is-warn"><CircleAlert size={14} /> Days 4 & 5 Itinerary notes <b className="et-mono">Optional</b></li>
                                    <li><CheckCircle2 size={14} /> Bedouin Guide Accreditation <b className="et-mono">Verified</b></li>
                                </ul>
                            </section>

                            <section className="et-card et-preview">
                                <header>SEARCH RESULT PREVIEW</header>
                                <div className="et-card-prev">
                                    <div className="et-img"  >
                                        <img className="sinaiImg" src={sinai} alt="South Sinai" />
                                        <span className="et-photo-tag">South Sinai</span><span className="et-days">{t.days} Days</span>
                                    </div>
                                    <small><CircleAlert size={11} /> Sheikh Salem Expeditions</small>
                                    <h4>{t.title.split(" & ")[0]}</h4>
                                    <p><b>${t.price}</b> <span className="et-mono">/ person</span><em>● Instant Book</em></p>
                                </div>
                                <p className="et-center">Real-time snapshot of card rendered in consumer discovery feed.</p>
                            </section>

                            <section className="et-card et-eeaa">
                                <h4><ShieldCheck size={16} /> EEAA Sanctions & Logistics</h4>
                                <dl className="et-mono">
                                    <div><dt>PERMIT CODE:</dt><dd>EEAA-SS-2025-992</dd></div>
                                    <div><dt>CAMEL TRAIN ALLOTMENT:</dt><dd>4 Camels / 8 Pax</dd></div>
                                    <div><dt>RADIO FREQUENCY:</dt><dd>144.825 MHz CH-4</dd></div>
                                </dl>
                            </section>
                        </aside>
                    </div>
                </div>

                <footer className="et-bar">
                    <span className="et-mono"><i className="et-dot" /> Last autosaved: 2 minutes ago</span>
                    <small>Changes will deploy across customer CDN in ~3 seconds.</small>
                    <button className="et-btn et-btn-text">Cancel</button>
                    <button className="et-btn et-btn-soft" onClick={() => save("draft")}>Save as Draft</button>
                    <button className="et-btn et-btn-rust" onClick={() => save("publish")}><UploadCloud size={15} /> Publish / Save Changes</button>
                </footer>
            </div>
        </div>
    );
}

function SectionHead({ n, title, sub, aside }) {
    return (
        <header className="et-sec-head">
            <i className="et-n">{n}</i>
            <div><h2>{title}</h2><p className="et-muted">{sub}</p></div>
            <div className="et-aside">{aside}</div>
        </header>
    );
}
