import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Travel
                <span className="text-blue-500">&</span>
                Trips
              </h2>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-gray-400">
              Discover amazing destinations, explore exciting trips,
              and book your next unforgettable journey with us.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition duration-200 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition duration-200 hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition duration-200 hover:bg-sky-500 hover:text-white"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition duration-200 hover:bg-blue-700 hover:text-white"
              >
                <FaLinkedinIn />
              </a>

            </div>
          </div>

          {/* Explore */}
 <div>
  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
    Support
  </h3>

  <ul className="space-y-3 text-sm">
    <li>
      <Link
        to="/contact"
        className="transition duration-200 hover:text-blue-500"
      >
        Contact Us
      </Link>
    </li>

    <li>
      <span className="cursor-pointer transition duration-200 hover:text-blue-500">
        Help Center
      </span>
    </li>

    <li>
      <span className="cursor-pointer transition duration-200 hover:text-blue-500">
        FAQs
      </span>
    </li>
  </ul>
</div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/contact"
                  className="transition duration-200 hover:text-blue-500"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition duration-200 hover:text-blue-500"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/trips"
                  className="transition duration-200 hover:text-blue-500"
                >
                  Browse Trips
                </Link>
              </li>

            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/login"
                  className="transition duration-200 hover:text-blue-500"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition duration-200 hover:text-blue-500"
                >
                  Create Account
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-800 pt-6">

          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-500 md:flex-row md:text-left">

            <p>
              © {new Date().getFullYear()} Travel & Trips.
              All rights reserved.
            </p>

            <p>
              Explore the world. Create memories.
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}

