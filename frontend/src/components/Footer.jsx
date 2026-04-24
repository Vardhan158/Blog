import React from "react";

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full bg-gray-50">
      <div className="flex flex-col md:flex-row items-start justify-center gap-10 py-10 border-b border-gray-500/30">
        {/* Brand Section */}
        <div className="max-w-96">
          <h1 className="text-2xl font-bold text-indigo-600">BlogPage</h1>
          <p className="mt-6 text-sm text-gray-500">
            BlogPage brings you the latest stories, insights, and tutorials
            from developers, designers, and creators around the world.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2 mt-3">
            <a href="#" aria-label="Twitter">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.167 2.5a9.1 9.1 0 0 1-2.617 1.275 3.733 3.733 0 0 0-6.55 2.5v.833a8.88 8.88 0 0 1-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 0 1-5.834 1.667C8.333 20 17.5 15.833 17.5 6.25q0-.35-.067-.692A6.43 6.43 0 0 0 19.167 2.5"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15.833c-4.167 1.25-4.167-2.084-5.833-2.5m11.666 5v-3.225a2.8 2.8 0 0 0-.783-2.175c2.616-.292 5.366-1.283 5.366-5.833a4.53 4.53 0 0 0-1.25-3.125 4.22 4.22 0 0 0-.075-3.142s-.983-.292-3.258 1.233a11.15 11.15 0 0 0-5.833 0C5.225.541 4.242.833 4.242.833a4.22 4.22 0 0 0-.075 3.142 4.53 4.53 0 0 0-1.25 3.15c0 4.516 2.75 5.508 5.366 5.833a2.8 2.8 0 0 0-.783 2.15v3.225"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.333 6.667a5 5 0 0 1 5 5V17.5H15v-5.833a1.667 1.667 0 0 0-3.334 0V17.5H8.333v-5.833a5 5 0 0 1 5-5M5 7.5H1.667v10H5zM3.333 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-1/2 flex flex-wrap md:flex-nowrap justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 mb-5">CATEGORIES</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>
                <a href="#">Technology</a>
              </li>
              <li>
                <a href="#">Lifestyle</a>
              </li>
              <li>
                <a href="#">Programming</a>
              </li>
              <li>
                <a href="#">Design</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-5">ABOUT</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>
                <a href="#">Our Story</a>
              </li>
              <li>
                <a href="#">Contributors</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Terms & Privacy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-gray-500">
        © 2025 <span className="font-semibold text-gray-700">BlogPage</span>. All Rights
        Reserved.
      </p>
    </footer>
  );
}
