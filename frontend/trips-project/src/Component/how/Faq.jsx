import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How are military and EEAA permits handled for foreigners and Egyptians?",
    a: "Once you book, we tokenize your passport or national ID and submit the manifest directly to the MTA, EEAA, and Frontier Border Guard. Most clearances are issued within 48–72 hours.",
  },
  {
    q: "What happens in case of a sudden sandstorm, flash flood, or medical emergency?",
    a: "Every group carries a live satellite transceiver linked to our 24/7 Cairo Command Hub. Our team coordinates extraction through pre-planned GPS rendezvous corridors, with an average response under 42 minutes.",
  },
  {
    q: "How does the dual-currency (USD / EGP) pricing lock work?",
    a: "You choose USD or EGP at checkout and the rate is locked for your booking. There are no hidden FX markups, and funds stay in licensed bank escrow until departure.",
  },
  {
    q: "Can beginners tackle Sinai high peaks or White Desert expeditions?",
    a: "Yes. Every trail is graded by endurance, altitude, and bivouac style, so you can pick a route that matches your level. Our Bedouin guides adjust the pace for each group.",
  },
  {
    q: "How does TravelOra directly support indigenous Bedouin communities?",
    a: "100% of guide stipends go directly to clan councils, with no middlemen. In addition, 12% of every booking funds wells, winter gear, and trail conservation.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-lavender py-14">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rust">Clear Guidance</p>
          <h2 className="mt-2 text-3xl font-extrabold text-brand">Frequently Asked Questions</h2>
          <p className="mt-2 text-[12px] text-slate-500">
            Everything you need to know about permits, desert safety protocols, currency parity, and
            ethical practices.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] font-semibold text-brand">{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[13px] leading-relaxed text-slate-500">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}