import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm py-32"
      aria-label="Hero Section"
    >
      {/* Main Heading */}
      <motion.h1
        className="text-4xl md:text-7xl font-semibold max-w-[850px] text-center mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Discover stories that{" "}
        <span className="text-blue-600">inspire</span> and ideas that matter
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-sm md:text-base mx-auto max-w-2xl text-center mt-20 px-4 text-gray-800 dark:text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Dive into insightful articles, trending tech topics, and personal
        stories from creators around the world — your next favorite read is
        just a scroll away.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="mx-auto w-full flex items-center justify-center gap-3 mt-12 mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Dashboard
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3"
          aria-label="Explore Categories"
        >
          <span>Explore Categories</span>
          <svg
            width="6"
            height="8"
            viewBox="0 0 6 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25.5 4.75 4l-3.5 3.5"
              stroke="#050040"
              strokeOpacity=".4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
