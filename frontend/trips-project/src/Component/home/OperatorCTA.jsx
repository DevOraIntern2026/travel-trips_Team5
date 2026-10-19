import { Users, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function OperatorCTA() {
  return (
    <section className="bg-lavender pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-brand p-8 sm:p-10 md:p-12 shadow-xl border border-brand-900">
          <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl flex flex-col items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 border border-emerald-400/20">
                <Users size={12} /> Accredited Pathfinder Network
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                Are you a licensed Egyptian tour operator or Bedouin pathfinder guild?
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/80">
                Connect your field operations directly to international wilderness travelers.
                Receive zero-delay escrow payouts, centralized EEAA clearance processing, and
                automated safety telemetry dispatch.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row shrink-0 gap-3">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-rust px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rust/90 shadow-sm transition"
              >
                Register as Operator <BadgeCheck size={16} />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition border border-white/10"
              >
                Operator Accord Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}