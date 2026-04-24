import React from "react";
import { motion } from "framer-motion";

const Star = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
      fill="#FF532E"
    />
  </svg>
);

const testimonials = [
  {
    name: "Donald Jackman",
    role: "Content Creator",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    text: "I love this blog page! The articles are well-written, easy to read, and always provide valuable insights. It's become my go-to source for staying updated in my field.",
  },
  {
    name: "Richard Nelson",
    role: "Instagram Influencer",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
  {
    name: "James Washington",
    role: "Marketing Manager",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
];

export default function Testimonials() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pt-14">
      {testimonials.map((t, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.15 }}
          whileHover={{ scale: 1.05, rotateX: 2, rotateY: 2 }}
          className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 cursor-pointer"
        >
          <div className="flex flex-col items-center px-5 py-4 relative">
            <img
              className="h-24 w-24 absolute -top-14 rounded-full object-cover border border-gray-200"
              src={t.image}
              alt={t.name}
            />
            <div className="pt-8 text-center">
              <h1 className="text-lg font-medium text-gray-800">{t.name}</h1>
              <p className="text-gray-800/80">{t.role}</p>
            </div>
          </div>
          <p className="text-gray-500 px-6 text-center">{t.text}</p>
          <div className="flex justify-center pt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
