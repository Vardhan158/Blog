import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const insights = [
  {
    title: "Practical Insights",
    text: "Hands-on coding lessons and real project experiences to help you grow faster and smarter.",
    emoji: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png",
    color: "#eef2ff",
    border: "#c7d2fe",
  },
  {
    title: "Clean & Engaging Reads",
    text: "We focus on clarity and simplicity — every article is crafted to be easy and enjoyable to read.",
    emoji: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png",
    color: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    title: "Built for Developers",
    text: "Articles written from a developer's perspective — honest, practical, and easy to apply in your projects.",
    emoji: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png",
    color: "#fff7ed",
    border: "#fed7aa",
  },
];

const stats = [
  { value: "120+", label: "Articles published" },
  { value: "40k+", label: "Monthly readers" },
  { value: "15+", label: "Topics covered" },
];

const About = () => {
  return (
    <>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .about-root { font-family: 'DM Sans', sans-serif; background: #fafaf8; min-height: 100vh; }

        /* Hero */
        .about-hero {
          position: relative;
          padding: clamp(56px, 10vw, 96px) clamp(20px, 6vw, 80px) clamp(48px, 8vw, 80px);
          text-align: center;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%; transform: translateX(-50%);
          width: clamp(300px, 70vw, 700px);
          height: clamp(300px, 70vw, 700px);
          background: radial-gradient(circle, #e0e7ff 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .about-hero > * { position: relative; z-index: 1; }

        .about-hero h1 {
          font-family: 'Lora', serif;
          font-size: clamp(30px, 6vw, 58px);
          font-weight: 700;
          color: #111;
          line-height: 1.18;
          max-width: 700px;
          margin: 0 auto 16px;
          letter-spacing: -0.02em;
        }
        .about-hero p {
          font-size: clamp(15px, 2.5vw, 19px);
          color: #666;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.75;
          font-weight: 300;
        }

        /* Stats strip */
        .stats-strip {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(16px, 4vw, 0px);
          margin: clamp(24px, 5vw, 40px) auto 0;
          max-width: 520px;
        }
        .stat-item {
          flex: 1 1 120px;
          text-align: center;
          padding: 0 clamp(12px, 3vw, 28px);
          border-right: 1px solid #e0ddd6;
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: 'Lora', serif;
          font-size: clamp(26px, 5vw, 38px);
          font-weight: 700;
          color: #4f46e5;
          line-height: 1;
          display: block;
        }
        .stat-label {
          font-size: clamp(11px, 1.8vw, 13px);
          color: #999;
          margin-top: 4px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Two-col section */
        .about-split {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(40px, 7vw, 80px) clamp(20px, 6vw, 60px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        @media (max-width: 768px) {
          .about-split { grid-template-columns: 1fr; gap: 32px; }
        }

        .about-image-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
        }
        .about-image-wrap img {
          width: 100%;
          height: clamp(240px, 40vw, 480px);
          object-fit: cover;
          display: block;
        }
        .about-image-badge {
          position: absolute;
          bottom: 16px; left: 16px;
          background: white;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; animation: badgePulse 2s infinite; }
        @keyframes badgePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        .badge-text { font-size: 12px; font-weight: 600; color: #1a1a1a; white-space: nowrap; }

        .about-text-col h2 {
          font-family: 'Lora', serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #111;
          margin: 0 0 clamp(10px, 2vw, 16px);
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .about-text-col > p {
          font-size: clamp(14px, 2vw, 16px);
          color: #666;
          line-height: 1.8;
          margin: 0 0 clamp(20px, 4vw, 32px);
          font-weight: 300;
        }

        /* Insight cards */
        .insight-card {
          display: flex;
          align-items: flex-start;
          gap: clamp(12px, 2.5vw, 16px);
          border-radius: 14px;
          padding: clamp(12px, 2.5vw, 18px);
          margin-bottom: clamp(10px, 2vw, 14px);
          border: 1px solid transparent;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .insight-card:last-child { margin-bottom: 0; }
        .insight-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
        .insight-icon {
          width: clamp(36px, 6vw, 44px);
          height: clamp(36px, 6vw, 44px);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid transparent;
        }
        .insight-icon img { width: clamp(18px, 3.5vw, 24px); height: clamp(18px, 3.5vw, 24px); }
        .insight-title {
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px;
        }
        .insight-text {
          font-size: clamp(12px, 1.8vw, 14px);
          color: #777;
          margin: 0;
          line-height: 1.65;
        }

        /* Mission band */
        .mission-band {
          background: #111;
          padding: clamp(40px, 7vw, 72px) clamp(20px, 6vw, 60px);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .mission-band::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, #4f46e5 0%, transparent 65%);
          opacity: 0.15;
          pointer-events: none;
        }
        .mission-band h2 {
          font-family: 'Lora', serif;
          font-size: clamp(22px, 4.5vw, 40px);
          color: white;
          font-weight: 700;
          max-width: 620px;
          margin: 0 auto 14px;
          line-height: 1.25;
          position: relative;
          z-index: 1;
        }
        .mission-band p {
          font-size: clamp(14px, 2vw, 17px);
          color: rgba(255,255,255,0.6);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.8;
          font-weight: 300;
          position: relative;
          z-index: 1;
        }
        .mission-cta {
          display: inline-block;
          margin-top: clamp(20px, 3vw, 28px);
          padding: clamp(11px, 2vw, 14px) clamp(24px, 4vw, 36px);
          background: #4f46e5;
          color: white;
          border-radius: 999px;
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          position: relative;
          z-index: 1;
          cursor: pointer;
          border: none;
        }
        .mission-cta:hover { background: #4338ca; transform: translateY(-1px); }
      `}</style>

      <div className="about-root">

        {/* ── Hero ── */}
        <section className="about-hero">
          <motion.h1
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Stories that help<br />
            <em style={{ fontStyle: "italic", color: "#4f46e5" }}>developers grow</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Tutorials, deep-dives, and real developer experiences — written to inspire,
            educate, and empower the tech community.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="stats-strip"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Split section ── */}
        <section className="about-split">
          {/* Image */}
          <motion.div
            className="about-image-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=830&h=844&auto=format&fit=crop"
              alt="Team writing blog articles"
            />
            <div className="about-image-badge">
              <div className="badge-dot" />
              <span className="badge-text">Publishing weekly</span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="about-text-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2>Why we write</h2>
            <p>
              Our blog is a space to share what we learn every day — from code to
              creativity. Whether it's debugging stories, tech deep-dives, or simple
              productivity hacks, we keep it real, relatable, and valuable for all developers.
            </p>

            {insights.map((item, index) => (
              <motion.div
                key={index}
                className="insight-card"
                style={{ background: item.color, borderColor: item.border }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
              >
                <div className="insight-icon" style={{ background: "white", borderColor: item.border }}>
                  <img src={item.emoji} alt={item.title} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="insight-title">{item.title}</p>
                  <p className="insight-text">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Mission band ── */}
        <motion.section
          className="mission-band"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>Built by developers,<br />for developers</h2>
          <p>
            Every article starts with a real problem or a real discovery. No fluff —
            just the kind of writing you actually want to read at 2am debugging.
          </p>
          <button className="mission-cta">Start reading</button>
        </motion.section>

        <Footer />
      </div>
    </>
  );
};

export default About;