import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/"); // redirect to login or home
  };

  const handleHomeNav = () => navigate("/home");

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <Link to="/home" className="text-2xl font-bold text-indigo-600 tracking-wide">
        <span className="text-gray-800">Blog</span>Page
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 text-gray-700">
        <button onClick={handleHomeNav} className="hover:text-indigo-600 transition">
          Home
        </button>

        <Link to="/articles" className="hover:text-indigo-600 transition">
          Articles
        </Link>

        {/* Categories Dropdown */}
        <div className="relative group">
          <button className="hover:text-indigo-600 transition flex items-center gap-1">
            Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-0 w-40 border border-gray-100 z-20">
            <ul className="flex flex-col text-sm text-gray-600">
              {["Technology", "Design", "Programming", "Lifestyle", "Productivity"].map((cat) => (
                <li key={cat} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer">
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link to="/about" className="hover:text-indigo-600 transition">
          About
        </Link>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="cursor-pointer px-6 py-2 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition rounded-full"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
        className="sm:hidden"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="21" height="1.5" rx=".75" fill="#4F46E5" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#4F46E5" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#4F46E5" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-3 px-6 text-gray-700 text-sm md:hidden`}
      >
        <button onClick={handleHomeNav} className="block hover:text-indigo-600 transition">
          Home
        </button>
        <Link to="/articles" className="block hover:text-indigo-600 transition">
          Articles
        </Link>
        <button className="block hover:text-indigo-600 transition">Categories</button>
        <Link to="/about" className="block hover:text-indigo-600 transition">
          About
        </Link>

        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-6 py-2 mt-3 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-6 py-2 mt-3 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
