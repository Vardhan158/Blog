import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const heroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');

  .hero-root {
    font-family: 'Poppins', sans-serif;
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #fafafe;
    padding: 100px 24px 80px;
  }

  /* ── BACKGROUND LAYERS ── */
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }
  .hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 75% 65% at 50% 40%, rgba(250,250,254,0) 30%, #fafafe 100%);
  }

  .hero-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .hero-glow-1 {
    width: 640px; height: 640px;
    background: radial-gradient(circle, rgba(165,180,252,0.35) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -58%);
    filter: blur(80px);
  }
  .hero-glow-2 {
    width: 320px; height: 320px;
    background: rgba(251,191,36,0.18);
    bottom: 40px; right: 8%;
    filter: blur(80px);
  }
  .hero-glow-3 {
    width: 240px; height: 240px;
    background: rgba(244,114,182,0.14);
    top: 60px; left: 6%;
    filter: blur(70px);
  }
  .hero-glow-4 {
    width: 180px; height: 180px;
    background: rgba(52,211,153,0.12);
    top: 30%; right: 5%;
    filter: blur(60px);
  }

  /* Floating particles */
  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .hero-dot {
    position: absolute;
    border-radius: 50%;
    animation: hero-float linear infinite;
  }
  @keyframes hero-float {
    0%   { transform: translateY(0) scale(0.6); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
  }

  /* Decorative rings */
  .hero-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.1);
    pointer-events: none;
  }
  .hero-ring-1 { width: 480px; height: 480px; top: 50%; left: 50%; transform: translate(-50%,-55%); }
  .hero-ring-2 { width: 720px; height: 720px; top: 50%; left: 50%; transform: translate(-50%,-55%); border-color: rgba(99,102,241,0.05); }

  /* ── CONTENT ── */
  .hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 860px;
    width: 100%;
  }

  /* Tag pill */
  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 999px;
    padding: 6px 18px 6px 8px;
    font-size: 12px;
    color: #6366f1;
    font-weight: 500;
    letter-spacing: 0.02em;
    margin-bottom: 32px;
    box-shadow: 0 2px 12px rgba(99,102,241,0.1);
  }
  .hero-pill-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    color: #fff;
    box-shadow: 0 0 10px rgba(99,102,241,0.4);
  }

  /* Headline */
  .hero-h1 {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(34px, 6.5vw, 72px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: #1e1b4b;
    margin-bottom: 24px;
    text-wrap: balance;
  }
  .hero-h1-accent {
    position: relative;
    display: inline-block;
    background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-h1-accent::after {
    content: '';
    position: absolute;
    left: 4px; right: 4px;
    bottom: 2px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #a78bfa, #f472b6);
    border-radius: 3px;
    opacity: 0.3;
  }

  /* Subtext */
  .hero-sub {
    font-size: clamp(13.5px, 1.8vw, 16.5px);
    line-height: 1.85;
    color: #6b7280;
    max-width: 540px;
    font-weight: 300;
    margin-bottom: 44px;
  }
  .hero-sub em {
    font-style: normal;
    font-weight: 600;
    color: #6366f1;
  }

  /* CTA row */
  .hero-cta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.38), 0 1px 0 rgba(255,255,255,0.25) inset;
    transition: box-shadow 0.22s, transform 0.18s;
    letter-spacing: 0.01em;
    text-decoration: none;
  }
  .hero-btn-primary:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.52);
  }
  .hero-btn-primary-arrow {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
  }

  .hero-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #e0e7ff;
    color: #6366f1;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 14px 28px;
    border-radius: 14px;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(99,102,241,0.08);
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .hero-btn-ghost:hover {
    background: #eef2ff;
    border-color: #a5b4fc;
    box-shadow: 0 4px 18px rgba(99,102,241,0.15);
  }

  /* Stats strip */
  .hero-stats {
    display: flex;
    align-items: stretch;
    margin-top: 60px;
    border: 1px solid rgba(99,102,241,0.12);
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 32px rgba(99,102,241,0.08), 0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .hero-stat-item {
    padding: 20px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-right: 1px solid rgba(99,102,241,0.08);
    position: relative;
  }
  .hero-stat-item:last-child { border-right: none; }
  .hero-stat-item::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 32px; height: 2px;
    background: linear-gradient(90deg, #6366f1, #a78bfa);
    border-radius: 0 0 4px 4px;
  }
  .hero-stat-num {
    font-family: 'Poppins', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1e1b4b;
    letter-spacing: -0.02em;
  }
  .hero-stat-label {
    font-size: 10.5px;
    color: #9ca3af;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Scroll hint */
  .hero-scroll-hint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    z-index: 2;
    color: #c7d2fe;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
  }
  .hero-scroll-track {
    width: 22px; height: 36px;
    border: 1.5px solid #c7d2fe;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    padding-top: 6px;
  }
  .hero-scroll-thumb {
    width: 4px; height: 8px;
    background: linear-gradient(180deg, #6366f1, #a78bfa);
    border-radius: 3px;
    animation: hero-scroll-bounce 1.8s ease-in-out infinite;
  }
  @keyframes hero-scroll-bounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50%       { transform: translateY(8px); opacity: 0.35; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .hero-root { padding: 90px 20px 110px; min-height: 100svh; }
    .hero-stats {
      flex-wrap: wrap;
      width: 100%;
      max-width: 320px;
      border-radius: 16px;
    }
    .hero-stat-item {
      flex: 1 1 calc(50% - 1px);
      padding: 18px 20px;
    }
    .hero-stat-item:nth-child(2) { border-right: none; }
    .hero-stat-item:nth-child(3),
    .hero-stat-item:nth-child(4) {
      border-top: 1px solid rgba(99,102,241,0.08);
      border-right: none;
    }
    .hero-stat-item:nth-child(3) { border-right: 1px solid rgba(99,102,241,0.08) !important; }
    .hero-btn-primary, .hero-btn-ghost { width: 100%; justify-content: center; }
    .hero-cta-row { flex-direction: column; width: 100%; max-width: 320px; }
    .hero-ring-1, .hero-ring-2 { display: none; }
  }
`;

const particles = [
  { size: 5,  left: "10%", delay: "0s",   dur: "16s", color: "rgba(99,102,241,0.18)"  },
  { size: 4,  left: "25%", delay: "3.5s", dur: "20s", color: "rgba(167,139,250,0.2)"  },
  { size: 6,  left: "42%", delay: "1s",   dur: "13s", color: "rgba(244,114,182,0.15)" },
  { size: 4,  left: "60%", delay: "5s",   dur: "17s", color: "rgba(99,102,241,0.14)"  },
  { size: 5,  left: "75%", delay: "2s",   dur: "21s", color: "rgba(52,211,153,0.14)"  },
  { size: 3,  left: "89%", delay: "7s",   dur: "14s", color: "rgba(251,191,36,0.2)"   },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  return (
    <>
      <style>{heroStyles}</style>
      <section className="hero-root" aria-label="Hero Section">

        {/* Background */}
        <div className="hero-grid" />
        <div className="hero-ring hero-ring-1" />
        <div className="hero-ring hero-ring-2" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
        <div className="hero-glow hero-glow-4" />

        {/* Particles */}
        <div className="hero-particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="hero-dot"
              style={{
                width: p.size, height: p.size,
                left: p.left, bottom: "-10px",
                background: p.color,
                animationDelay: p.delay,
                animationDuration: p.dur,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="hero-inner">

          <motion.div className="hero-pill" {...fadeUp(0)}>
            <span className="hero-pill-dot">✦</span>
            New stories published daily
          </motion.div>

          <motion.h1 className="hero-h1" {...fadeUp(0.15)}>
            Discover stories that{" "}
            <span className="hero-h1-accent">inspire</span>
            <br />
            and ideas that matter
          </motion.h1>

          <motion.p className="hero-sub" {...fadeUp(0.28)}>
            Insightful articles, trending tech topics, and personal stories from
            creators around the world —{" "}
            <em>your next favourite read is just a scroll away.</em>
          </motion.p>

          <motion.div className="hero-cta-row" {...fadeUp(0.42)}>
            <Link to="/dashboard">
              <motion.button
                className="hero-btn-primary"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Go to Dashboard
                <span className="hero-btn-primary-arrow">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="#fff" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </motion.button>
            </Link>

            <motion.button
              className="hero-btn-ghost"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Explore Categories"
            >
              Explore Categories
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3.5 2l4 3-4 3" stroke="#6366f1" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>

          <motion.div className="hero-stats" {...fadeUp(0.58)}>
            {[
              { num: "12K+", label: "Articles"     },
              { num: "3.4K", label: "Authors"      },
              { num: "980K", label: "Readers"      },
              { num: "98%",  label: "Satisfaction" },
            ].map((s) => (
              <div className="hero-stat-item" key={s.label}>
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-track">
            <div className="hero-scroll-thumb" />
          </div>
          Scroll
        </div>
      </section>
    </>
  );
}