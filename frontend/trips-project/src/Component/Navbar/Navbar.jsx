
import { useState } from "react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

const links = [
  { name: "Explore Expeditions", path: "/home/expedition" },
  { name: "Destinations", path: "/destinations" },
  { name: "My Bookings", path: "/bookings" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About", path: "/about" },
  { name: "Dashboard", path: "/dashboard" },
];

export default function NavLinkbar() {
  const [currency, setCurrency] = useState("USD");
  const { isLoggedIn, setIsLoggedIn, setUser } = useAppContext();
  const navigate = useNavigate();
 async function handleLogout() {

   try {
  const refreshToken = localStorage.getItem("refreshToken");
  if(!refreshToken){
    console.error("No refresh token found in localStorage.");
    return;
  }
  const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({refreshToken}),
    });
    const data = await response.json();
    if(!response.ok){
      console.error("Logout Failed: ",  data)
      return;
    }
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login")
    console.log("Logout successful:", data);
  }catch(error){
    console.error("Logout failed:", error);
  }
}
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
          {isLoggedIn?(
          <Link
          className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-light"
          onClick={handleLogout}
          >
            Sign Out
          </Link>
          ):(
            
            <Link
            to="/login"
            className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-light"
          >
            Sign In
          </Link>
          )}
          
          
          {/* User Profile */}
          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-btn text-brand hover:opacity-85 transition"
            title="Operator Workspace Profile"
          >
            <User size={16} />
          </Link>

        </div>

      </nav>
    </header>
  );
}
