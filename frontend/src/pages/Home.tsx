import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import Carousel from "../components/Carousel";

export default function Home() {
  const location = useLocation();
  const [toast, setToast] = useState(null);

  // Show toast if redirected from login
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      const timer = setTimeout(() => setToast(null), 3000); // auto hide after 3s
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      {/* ✅ Toast Overlay */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
          {toast}
        </div>
      )}

      <Navbar />
      <Hero />
      <Testimonials />
      <Carousel />
      <Footer />

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes slide-in {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}
