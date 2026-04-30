import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const insights = [
  {
    title: "Practical Insights",
    text: "Hands-on coding lessons and real project experiences to help you grow faster and smarter.",
    icon: "⚡",
    accent: "#f59e0b",
  },
  {
    title: "Clean & Engaging Reads",
    text: "We focus on clarity and simplicity — every article is crafted to be easy and enjoyable to read.",
    icon: "✦",
    accent: "#10b981",
  },
  {
    title: "Built for Developers",
    text: "Articles written from a developer's perspective — honest, practical, and easy to apply.",
    icon: "⬡",
    accent: "#6366f1",
  },
];

const stats = [
  { value: "120+", label: "Articles" },
  { value: "40k+", label: "Readers / mo" },
  { value: "15+", label: "Topics" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
});

const About = () => {
  return (
    <>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --ink: #0d0d0d;
          --ink-soft: #1c1c1c;
          --cream: #f8f5ee;
          --cream-dark: #ede9df;
          --amber: #d97706;
          --amber-light: #fef3c7;
          --muted: #6b6459;
          --border: #e2ddd3;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'Outfit', sans-serif;
        }

        .ab-root {
          font-family: var(--font-body);
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
        }

        /* ── HERO ── */
        .ab-hero {
          position: relative;
          background: var(--ink);
          overflow: hidden;
          padding: clamp(72px, 12vw, 120px) clamp(20px, 6vw, 80px) clamp(60px, 10vw, 100px);
          text-align: center;
        }

        .ab-hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.6;
        }

        .ab-hero-glow {
          position: absolute;
          top: -120px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(ellipse, rgba(217,119,6,0.18) 0%, transparent 65%);
          pointer-events: none;
        }

        .ab-hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber);
          border: 1px solid rgba(217,119,6,0.35);
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: clamp(20px, 3vw, 28px);
        }

        .ab-hero-label::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--amber);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .ab-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(38px, 7.5vw, 80px);
          font-weight: 700;
          color: #fff;
          line-height: 1.08;
          letter-spacing: -0.01em;
          margin: 0 auto clamp(18px, 3vw, 24px);
          max-width: 820px;
        }

        .ab-hero h1 em {
          font-style: italic;
          color: var(--amber);
        }

        .ab-hero-sub {
          font-size: clamp(14px, 2.2vw, 18px);
          color: rgba(255,255,255,0.52);
          max-width: 500px;
          margin: 0 auto clamp(32px, 5vw, 48px);
          line-height: 1.8;
          font-weight: 300;
        }

        /* Stats row */
        .ab-stats {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          max-width: 480px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.04);
        }

        .ab-stat {
          flex: 1 1 120px;
          padding: clamp(16px, 3vw, 22px) clamp(12px, 2.5vw, 24px);
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .ab-stat:last-child { border-right: none; }

        .ab-stat-val {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 38px);
          font-weight: 700;
          color: var(--amber);
          display: block;
          line-height: 1;
        }

        .ab-stat-lbl {
          font-size: clamp(10px, 1.6vw, 12px);
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 5px;
          display: block;
        }

        /* ── DIAGONAL DIVIDER ── */
        .ab-divider {
          height: clamp(40px, 6vw, 70px);
          background: var(--ink);
          clip-path: polygon(0 0, 100% 0, 100% 30%, 0 100%);
          margin-bottom: -1px;
        }

        /* ── SPLIT SECTION ── */
        .ab-split {
          background: var(--cream);
          padding: clamp(48px, 8vw, 96px) clamp(20px, 6vw, 80px);
        }

        .ab-split-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: start;
        }

        @media (max-width: 820px) {
          .ab-split-inner {
            grid-template-columns: 1fr;
          }
        }

        /* Image column */
        .ab-img-wrap {
          position: relative;
        }

        .ab-img-frame {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .ab-img-frame img {
          width: 100%;
          height: clamp(280px, 45vw, 520px);
          object-fit: cover;
          display: block;
        }

        .ab-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(13,13,13,0.45) 0%, transparent 50%);
        }

        /* Floating accent box */
        .ab-img-accent {
          position: absolute;
          top: -14px;
          right: -14px;
          width: clamp(80px, 14vw, 110px);
          height: clamp(80px, 14vw, 110px);
          background: var(--amber);
          border-radius: 16px;
          z-index: -1;
        }

        /* Badge */
        .ab-img-badge {
          position: absolute;
          bottom: 16px; left: 16px;
          background: white;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }

        .badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        .badge-text {
          font-size: 12px;
          font-weight: 600;
          color: #111;
          white-space: nowrap;
          font-family: var(--font-body);
        }

        /* Inline stat strip on image */
        .ab-img-strip {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .ab-img-strip-item {
          flex: 1;
          background: var(--ink);
          color: white;
          border-radius: 12px;
          padding: 14px 12px;
          text-align: center;
        }

        .strip-val {
          font-family: var(--font-display);
          font-size: clamp(20px, 3.5vw, 26px);
          font-weight: 700;
          color: var(--amber);
          display: block;
          line-height: 1;
        }

        .strip-lbl {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
          display: block;
        }

        /* Text column */
        .ab-text-col {}

        .ab-section-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 12px;
          display: block;
        }

        .ab-text-col h2 {
          font-family: var(--font-display);
          font-size: clamp(28px, 4.5vw, 44px);
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 clamp(12px, 2vw, 20px);
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .ab-text-col > p {
          font-size: clamp(14px, 1.9vw, 16px);
          color: var(--muted);
          line-height: 1.85;
          margin: 0 0 clamp(24px, 4vw, 36px);
          font-weight: 300;
        }

        /* Insight cards */
        .ab-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: clamp(14px, 2.5vw, 20px);
          border-radius: 14px;
          border: 1px solid var(--border);
          background: white;
          margin-bottom: 12px;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
        }

        .ab-card:last-child { margin-bottom: 0; }

        .ab-card:hover {
          transform: translateX(6px);
          box-shadow: -4px 4px 0 0 var(--amber);
          border-color: var(--amber);
        }

        .ab-card-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          background: var(--cream-dark);
          border: 1px solid var(--border);
        }

        .ab-card-title {
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 4px;
        }

        .ab-card-text {
          font-size: clamp(12px, 1.8vw, 13px);
          color: var(--muted);
          margin: 0;
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── MISSION BAND ── */
        .ab-mission {
          background: var(--ink-soft);
          position: relative;
          overflow: hidden;
          padding: clamp(56px, 9vw, 100px) clamp(20px, 6vw, 80px);
        }

        .ab-mission-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: center;
        }

        @media (max-width: 760px) {
          .ab-mission-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .ab-mission-list { align-items: center; }
        }

        .ab-mission-text h2 {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 50px);
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin: 0 0 clamp(12px, 2vw, 20px);
          letter-spacing: -0.02em;
        }

        .ab-mission-text h2 em {
          color: var(--amber);
          font-style: italic;
        }

        .ab-mission-text p {
          font-size: clamp(14px, 2vw, 16px);
          color: rgba(255,255,255,0.48);
          line-height: 1.8;
          font-weight: 300;
          margin: 0 0 clamp(20px, 3vw, 28px);
        }

        .ab-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(12px, 2vw, 15px) clamp(24px, 4vw, 36px);
          background: var(--amber);
          color: white;
          border-radius: 999px;
          font-size: clamp(13px, 1.8vw, 15px);
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: var(--font-body);
        }

        .ab-cta:hover {
          background: #b45309;
          transform: translateY(-2px);
        }

        .ab-mission-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ab-mission-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: clamp(14px, 2.5vw, 20px);
          transition: background 0.2s, border-color 0.2s;
        }

        .ab-mission-item:hover {
          background: rgba(217,119,6,0.08);
          border-color: rgba(217,119,6,0.3);
        }

        .ab-mi-num {
          font-family: var(--font-display);
          font-size: clamp(22px, 3.5vw, 30px);
          font-weight: 700;
          color: var(--amber);
          flex-shrink: 0;
          min-width: 36px;
          line-height: 1;
        }

        .ab-mi-title {
          font-size: clamp(13px, 1.9vw, 15px);
          font-weight: 600;
          color: white;
          margin: 0 0 3px;
        }

        .ab-mi-text {
          font-size: clamp(11px, 1.7vw, 13px);
          color: rgba(255,255,255,0.42);
          margin: 0;
          font-weight: 300;
        }

        /* ── BOTTOM QUOTE ── */
        .ab-quote {
          background: var(--amber);
          padding: clamp(36px, 6vw, 64px) clamp(20px, 6vw, 80px);
          text-align: center;
        }

        .ab-quote blockquote {
          font-family: var(--font-display);
          font-size: clamp(20px, 4vw, 34px);
          font-style: italic;
          font-weight: 600;
          color: white;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .ab-quote cite {
          display: block;
          font-family: var(--font-body);
          font-size: 13px;
          font-style: normal;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          margin-top: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="ab-root">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-noise" />
          <div className="ab-hero-glow" />

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ab-hero-label">Developer Blog</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Stories that help<br />
            <em>developers grow</em>
          </motion.h1>

          <motion.p
            className="ab-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
          >
            Tutorials, deep-dives, and real developer experiences — written to inspire,
            educate, and empower the tech community.
          </motion.p>

          <motion.div
            className="ab-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
          >
            {stats.map((s, i) => (
              <div className="ab-stat" key={i}>
                <span className="ab-stat-val">{s.value}</span>
                <span className="ab-stat-lbl">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        <div className="ab-divider" />

        {/* ── SPLIT ── */}
        <section className="ab-split">
          <div className="ab-split-inner">

            {/* Image column */}
            <motion.div className="ab-img-wrap" {...fadeUp(0)}>
              <div className="ab-img-accent" />
              <div className="ab-img-frame">
                <img
                  src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=830&h=844&auto=format&fit=crop"
                  alt="Writing blog articles"
                />
                <div className="ab-img-overlay" />
                <div className="ab-img-badge">
                  <div className="badge-dot" />
                  <span className="badge-text">Publishing weekly</span>
                </div>
              </div>

              {/* Mini stat strip below image */}
              <div className="ab-img-strip">
                {stats.map((s, i) => (
                  <div className="ab-img-strip-item" key={i}>
                    <span className="strip-val">{s.value}</span>
                    <span className="strip-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div className="ab-text-col" {...fadeUp(0.15)}>
              <span className="ab-section-tag">Our Story</span>
              <h2>Why we write</h2>
              <p>
                Our blog is a space to share what we learn every day — from code to
                creativity. Whether it's debugging stories, tech deep-dives, or
                simple productivity hacks, we keep it real, relatable, and genuinely
                valuable for developers at every level.
              </p>

              {insights.map((item, i) => (
                <motion.div
                  key={i}
                  className="ab-card"
                  {...fadeUp(0.2 + i * 0.1)}
                >
                  <div className="ab-card-icon">{item.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <p className="ab-card-title">{item.title}</p>
                    <p className="ab-card-text">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="ab-mission">
          <div className="ab-mission-grid">

            <motion.div className="ab-mission-text" {...fadeUp(0)}>
              <h2>Built by devs,<br />for <em>devs</em></h2>
              <p>
                Every article starts with a real problem or a real discovery. No fluff —
                just the kind of writing you actually want to read at 2am debugging a
                production issue you can't explain.
              </p>
              <button className="ab-cta">
                Start reading →
              </button>
            </motion.div>

            <motion.div className="ab-mission-list" {...fadeUp(0.15)}>
              {[
                { n: "01", t: "Read real stories", d: "No AI-generated fluff. Every post is written by a human developer." },
                { n: "02", t: "Learn by example", d: "Code snippets, project walkthroughs, and battle-tested patterns." },
                { n: "03", t: "Stay current", d: "Weekly drops covering the tools and trends that actually matter." },
              ].map((item, i) => (
                <div className="ab-mission-item" key={i}>
                  <span className="ab-mi-num">{item.n}</span>
                  <div>
                    <p className="ab-mi-title">{item.t}</p>
                    <p className="ab-mi-text">{item.d}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── QUOTE BAND ── */}
        <motion.section className="ab-quote" {...fadeUp(0)}>
          <blockquote>
            "The best way to learn is to write about what you're building — and share it."
          </blockquote>
          <cite>— The BlogPage Team</cite>
        </motion.section>

        <Footer />
      </div>
    </>
  );
};

export default About;