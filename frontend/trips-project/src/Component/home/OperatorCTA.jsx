import { Users, BadgeCheck } from "lucide-react";

export default function OperatorCTA() {
  return (
    <section className="bg-lavender pb-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-brand p-10 shadow-lg md:p-12">
          <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100">
                <Users size={11} /> Accredited Pathfinder Network
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white">
                Are you a licensed Egyptian tour operator or Bedouin pathfinder guild?
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-emerald-100/80">
                Connect your field operations directly to international wilderness travelers.
                Receive zero-delay escrow payouts, centralized EEAA clearance processing, and
                automated safety telemetry dispatch.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-rust px-5 py-3 text-[13px] font-semibold text-white hover:opacity-90">
                Register as Operator <BadgeCheck size={14} />
              </button>
              <button className="rounded-lg bg-white/10 px-5 py-3 text-[13px] font-semibold text-white hover:bg-white/20">
                Operator Accord Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}