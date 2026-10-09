
import { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { name: "Explore Expeditions", path: "Explore Expeditions" },
  { name: "Destinations", path: "#" },
  { name: "How It Works", path: "/How It Works" },
  { name: "About", path: "/about" },
  { name: "My Booking", path: "/MyBooking" },
];

export default function NavLinkbar() {
  const [currency, setCurrency] = useState("USD");

  return (
    <header className="bg-white/70 backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

        {/* Logo + Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand bg-brand text-lg font-extrabold text-white">
              T
            </span>

            <span className="text-lg font-bold text-brand">
              TravelOra
            </span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-[13px] font-semibold text-brand hover:opacity-70"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Currency */}
          <div className="flex rounded-full bg-lavender-btn p-0.5 text-[11px] font-bold">
            {["USD", "EGP"].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`rounded-full px-2.5 py-1 transition ${
                  currency === c
                    ? "bg-brand text-white"
                    : "text-brand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sign In */}
          <Link
            to="/login"
            className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-light"
          >
            Sign In
          </Link>

          {/* User */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-btn text-brand">
            <User size={16} />
          </button>

        </div>

      </nav>
    </header>
  );
}
