
import { useState } from "react";
  import { Link } from "react-router-dom";
  import {
    FiSearch,
    FiSliders,
    FiMenu,
    FiX,
    FiUser,
  } from "react-icons/fi";
export default function Navbar() {
  

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Trips", path: "/trips" },
    { name: "Destinations", path: "/destinations" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Travel
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-black transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

            <button className="p-2 rounded-lg hover:bg-gray-100">
              <FiSearch size={20} />
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100">
              <FiSliders size={20} />
            </button>

            <Link
              to="/login"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiUser size={20} />
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Sign Up
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">

            <div className="flex flex-col gap-4">

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-black"
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex gap-3 pt-2">

                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                  <FiSearch size={18} />
                  Search
                </button>

                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                  <FiSliders size={18} />
                  Filter
                </button>

              </div>

              <Link
                to="/login"
                className="text-center border border-gray-300 rounded-lg py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-center bg-black text-white rounded-lg py-2"
              >
                Sign Up
              </Link>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}