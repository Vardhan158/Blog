import React from "react";
import { motion } from "framer-motion";

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 22 20" fill="none">
    <path
      d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
      fill="#f26741"
    />
  </svg>
);

const testimonials = [
  {
    name: "Donald Jackman",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    text: "The articles are well-written, easy to read, and always provide valuable insights. It's become my go-to source for staying updated in my field.",
  },
  {
    name: "Richard Nelson",
    role: "Instagram Influencer",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    text: "I've been using it for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my workflow much easier and faster.",
  },
  {
    name: "James Washington",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    text: "I've been using it for nearly two years and it has been incredibly user-friendly. The interface is clean and the results are consistently impressive.",
  },
];

export default function Testimonials() {
  return (
    <section style={{ fontFamily: "'Poppins', sans-serif", padding: "3rem 1.5rem 2rem", background: "#fdf9f7" }}>
      <p style={{ textAlign: "center", fontSize: "12px", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#f26741", marginBottom: ".4rem" }}>
        What people say
      </p>
      <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 600, color: "#1a1a2e", marginBottom: ".3rem" }}>
        Loved by creators worldwide
      </h2>
      <p style={{ textAlign: "center", fontSize: ".875rem", color: "#888", fontWeight: 300, marginBottom: "3rem" }}>
        Real experiences from people who use it every day
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", maxWidth: "960px", margin: "0 auto" }}>
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -6 }}
            style={{ position: "relative", background: "#fff", borderRadius: "20px", padding: "2.5rem 1.75rem 1.75rem", border: "1px solid #f0ece8", cursor: "pointer" }}
          >
            {/* Avatar */}
            <div style={{ position: "absolute", top: "-1.5rem", left: "50%", transform: "translateX(-50%)" }}>
              <img
                src={t.image}
                alt={t.name}
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,.1)" }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a2e", marginTop: "1.75rem" }}>{t.name}</p>
              <p style={{ fontSize: ".72rem", fontWeight: 400, color: "#f26741", letterSpacing: ".06em", textTransform: "uppercase", marginTop: ".15rem", marginBottom: "1rem" }}>{t.role}</p>
              <span style={{ fontSize: "2rem", color: "#ffe8e0", fontFamily: "Georgia, serif", lineHeight: 1, display: "block", marginBottom: ".25rem" }}>"</span>
              <p style={{ fontSize: ".8rem", color: "#7a7a8a", lineHeight: 1.75, fontWeight: 300 }}>{t.text}</p>

              {/* Stars */}
              <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginTop: "1.25rem" }}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f0ece8", margin: "1.25rem 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf92" }} />
                <span style={{ fontSize: ".7rem", color: "#9a9aaa" }}>Verified user</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}