import { useState } from "react";
import "./expeditionExplore.css";
import imgMain from "../../assets/images/expeditionExplore/Mount Sinai and St. Catherine High Mountain Range in Egypt.png";
import imgCanyon from "../../assets/images/expeditionExplore/canyon.png";
import imgSunset from "../../assets/images/expeditionExplore/desert.png";
import { Link, } from "react-router-dom"
import homeIcon from "../../assets/images/expeditionImages/homeIcon.png"

const days = [
  { n: 1, title: "Day 1: St. Catherine Basecamp & Monastery of the Transfiguration", tag: "Eco-Lodge Al-Karm",
    text: "4×4 desert transit to the foot of Mount Sinai. Private after-hours visit to UNESCO World Heritage St. Catherine Monastery & the Burning Bush. Traditional habak tea and briefing with Bedouin guides.",
    meta: ["4×4 desert transit & safety briefing", "Bedouin Welcome Feast included"] },
  { n: 2, title: "Day 2: Wadi Arbaeen & Ascent of Gebel Katherina (Egypt's Highest Peak – 2,629m)", tag: "High Summit Camp",
    text: "Traverse the ancient granite paths of Wadi Arbaeen, passing centuries-old hermit cells and red granite boulders. Ascend through Sinai high mountain granite passes to the summit chapel of Gebel Katherina with 360-degree vistas.",
    meta: ["14 km", "+1,350 m gain", "B, L, D included"] },
  { n: 3, title: "Day 3: Blue Desert & Farsh Elias Bedouin Bivouac under Desert Stars", tag: "Bedouin Orchard Bivouac",
    text: "Hike along secluded high-plateau trails into the Blue Desert art installation landscape. Camp under pure Saharan celestial skies on a Bedouin-led flatbread feast on campfire embers.",
    meta: ["13 km", "Stargazing Session", "B, L included"] },
  { n: 4, title: "Day 4: Sunrise over Mount Sinai (Gebel Musa) & Descent via the Steps of Repentance", tag: "Elijah's Basin & Camp",
    text: "Pre-dawn ridge climb to the summit of Mount Sinai (2,285m) for the legendary golden sunrise over South Sinai peaks. Descend the 3,750 ancient hand-hewn stone steps guided by Bedouin pathfinders.",
    meta: ["Mount Sinai Summit", "B, L included"] },
  { n: 5, title: "Day 5: Nuweiba Red Sea Coastal Canyon Transit & Bedouin Tea Ceremony", tag: "Red Sea Coastal Oasis", last: true,
    text: "4×4 desert transit through Nuweiba's vivid sandstone slot canyons. Conclude with a traditional Bedouin hospitality tea ceremony by the Red Sea coast before private onward transfers.",
    meta: ["Red Sea Coast", "Seafood Farewell Lunch"] },
];

const included = [
  "Jabaliya Bedouin mountain escorts & MTA verified pathfinders (1:5 guide-to-client safety ratio)",
  "South Sinai Protected Area & St. Catherine permits registered with Bedouin Sheikh Council",
  "All Authentic Bedouin Meals: Freshly baked Ribe flatbread, herbal habak teas, mountain dates & fresh produce",
  "4×4 Desert Transit & Camel Caravan Support: Camels convey heavy rucksacks and camp equipment",
  "Satellite SOS beacon tracking, first-aid trained Bedouin leadership & evacuation coordination",
];
const traveler = [
  "International and domestic commercial flights to/from Punta Arenas (PUQ)",
  "Mandatory emergency evacuation and alpine travel insurance",
  "Personal layered technical clothing (hardshell jacket, thermal base layers, hiking boots)",
  "Porter personal pack service (available on request for +$180)",
];
const reviews = [
  { name: "Elena Rostova", date: "Trek Date: March 2024",
    text: "The seat hold gave us 15 minutes to coordinate with our group before securing the 4 remaining slots. Mateo was an exemplary mountaineering guide on Gray Glacier!" },
  { name: "Julian Davies", date: "Trek Date: January 2024",
    text: "Seamless logistics from arrival in Natales to the early Base Torres climb. Having food, dome, and park entrance fully synchronized made a rugged trek feel like luxury." },
];
const departures = [
  { id: "a", dates: "Nov 14 – Nov 20", note: "High Season • Spring Bloom", badge: "4 seats left", tone: "mint", action: "Active Selection" },
  { id: "b", dates: "Nov 28 – Dec 4", note: "Glacier Trekking Peak", badge: "⚠ 1 seat left", tone: "peach", action: "Select" },
  { id: "c", dates: "Dec 12 – Dec 18", note: "Summer Solstice Expedition", badge: "Full • Sold Out", tone: "ghost", action: "Waitlist Only", disabled: true },
];

export default function ExpeditionPage() {
  const [dep, setDep] = useState("a");
  const [pax, setPax] = useState(2);
  const total = 1450 * pax;

  return (
    <div className="xp">

      <main className="wrap">
        
      <div className="path">
        <img src={homeIcon} alt="HomeIcon" />
        <Link to="/">Home</Link>
        <span className="rightArrow"> &gt;</span>
        <span> Expedition Discovery</span>
      </div>

        <div className="grid">
          <section className="main">
            <div className="status-row">
              <span><span className="chip live"><i className="ld" />Live inventory stream</span><span className="code">EXP-PAT-2024-09</span></span>
              <span className="meta">Verified Operator: Andes Summit Co · ★ 4.94 (128 reviews)</span>
            </div>
            <div className="chips2"><span className="chip solid"><i className="ld g" />Live availability verified</span><span className="chip soft">Grade: Moderate–Challenging (Grade 5) • Max Group: 15 • Bedouin Sheikh Council &amp; MTA Certified</span></div>
            <h1>Sinai High Mountain Sanctuary &amp; Gebel Katherina Traverse</h1>
            <p className="lede">5 Days traversing ancient Sinai high mountain granite passes, secluded Bedouin orchards, sacred valleys, and kaleidoscopic canyons with Jabaliya Bedouin escorts &amp; MTA verified pathfinders.</p>
            <p className="loc"><i className="pin" />St. Catherine &amp; Mount Sinai Range, South Sinai, Egypt (28°32′ N, 33°58′ E)</p>

            <div className="gallery">
              <figure className="g-main" style={{ backgroundImage: `url(${imgMain})` }}><figcaption>Mount Sinai &amp; Katherina Range</figcaption></figure>
              <figure className="g-a" style={{ backgroundImage: `url(${imgCanyon})` }}><figcaption>Coloured Canyon Sandstone Gorges</figcaption></figure>
              <figure className="g-b" style={{ backgroundImage: `url(${imgSunset})` }}><figcaption>Desert Changeling Bivouac</figcaption></figure>
            </div>

            <div className="stats">
              <div><small>Duration</small><b>7 Days</b></div>
              <div><small>Distance</small><b>9.76 km</b></div>
              <div><small>Elevation gain</small><b>↗ +3,420 m</b></div>
              <div><small>Pace</small><b>Steady 5–7h/d</b></div>
            </div>

            <div className="sec-head">
              <div><small className="up red">Route map &amp; schedule</small><h2>Itinerary Highlights</h2></div>
              <button className="btn-ghost">Field Notes PDF</button>
            </div>

            <ol className="days">
              {days.map((d) => (
                <li key={d.n} className={`day ${d.last ? "last" : ""}`}>
                  <span className="dot">{d.n}</span>
                  <div className="day-card">
                    <div className="day-h"><h3>{d.title}</h3><span className="tag">{d.tag}</span></div>
                    <p>{d.text}</p>
                    <div className="day-meta">{d.meta.map((m) => <span key={m}>{m}</span>)}</div>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="h-lg">Expedition Logistics &amp; Inclusions</h2>
            <div className="logistics">
              <div className="panel inc">
                <h4>Included in Expedition</h4>
                <ul>{included.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div className="panel">
                <h4>Traveler Responsibility</h4>
                <ul className="x">{traveler.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>

            <div className="reviews">
              <div className="score"><strong>4.94</strong><span>★★★★★</span><small>Based on 128 verified departures</small><em>100% Summit Completion Rate</em></div>
              <div className="r-grid">
                {reviews.map((r) => (
                  <blockquote key={r.name}>
                    <p>“{r.text}”</p>
                    <footer><span className="avatar sm">{r.name[0]}</span><div><b>{r.name}</b><small>{r.date}</small></div></footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          <aside className="booking">
            <div className="b-card">
              <div className="b-top"><small className="up">Fixed all-inclusive rate</small><span className="chip soft">USD</span></div>
              <div className="price"><b>$1,450</b> / traveler</div>
              <div className="label">Select guaranteed departure <span className="red">Tier 1 inventory</span></div>
              {departures.map((d) => (
                <button key={d.id} disabled={d.disabled} onClick={() => setDep(d.id)}
                  className={`dep ${dep === d.id ? "sel" : ""}`}>
                  <span className="dep-l"><b><i className="rd" />{d.dates}</b><small>{d.note}</small></span>
                  <span className="dep-r"><em className={d.tone}>{d.badge}</em><code>{d.action}</code></span>
                </button>
              ))}
              <div className="pax">
                <div><b>Expedition Travelers</b><small>Ages 16+ eligible for trekking grade</small><p className="warn">Departure has 4 available slots total.</p></div>
                <div className="stepper">
                  <button aria-label="Fewer travelers" onClick={() => setPax(Math.max(1, pax - 1))}>−</button>
                  <span>{pax}</span>
                  <button aria-label="More travelers" onClick={() => setPax(Math.min(8, pax + 1))}>+</button>
                </div>
              </div>
              <dl className="lines">
                <div><dt>{pax} Travelers × $1,450</dt><dd>${total.toLocaleString()}</dd></div>
                <div><dt>National Park Access &amp; Port Concessions</dt><dd>INCLUDED</dd></div>
                <div><dt>UIAOM Safety Gear &amp; Refugio Surcharge</dt><dd>INCLUDED</dd></div>
              </dl>
              <div className="total"><span>Total Hold Value<small>Due upon operator manifest confirmation</small></span><b>${total.toLocaleString()}</b></div>
              <div className="escrow"><b>Official Reservation &amp; Deposit Escrow</b> No immediate charge: Our South Sinai operations desk reviews guide allocations and finalizes group manifest within 24 hours. Deposit protected via Bank Misr / Escrow: Bedouin Sheikh Council and MTA certified.</div>
              <button className="cta">Proceed to Booking Review ({pax} Seats Held)</button>
              <p className="hold">Seats temporarily held for <b>14:58</b> while you review.</p>
              <p className="seal">SSL Encrypted • UIAGM Safety Seal</p>
            </div>
            <div className="ask"><span>Questions on Fitness Rating? Live chat with Andes Summit Field Leads</span><button>Ask Lead</button></div>
          </aside>
        </div>
      </main>

    </div>
  );
}
