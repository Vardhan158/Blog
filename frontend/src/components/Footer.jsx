import React, { useState } from "react";

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

  .ft-root {
    font-family: 'Poppins', sans-serif;
    background: #f8f7ff;
    color: #1e1b4b;
    position: relative;
    overflow: hidden;
  }

  /* ── BACKGROUND ── */
  .ft-bg-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
  }
  .ft-glow-1 {
    width: 440px; height: 440px;
    background: rgba(165,180,252,0.28);
    top: -140px; left: -100px;
  }
  .ft-glow-2 {
    width: 320px; height: 320px;
    background: rgba(251,191,36,0.14);
    bottom: -60px; right: 40px;
  }
  .ft-glow-3 {
    width: 220px; height: 220px;
    background: rgba(244,114,182,0.1);
    top: 20px; right: 25%;
  }

  .ft-grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }
  .ft-grid-lines::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(248,247,255,0.9) 100%);
  }

  /* Top accent bar */
  .ft-accent-bar {
    height: 3px;
    background: linear-gradient(90deg, #6366f1 0%, #a78bfa 45%, #f472b6 75%, transparent 100%);
  }

  .ft-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 28px;
  }

  /* ── MAIN BODY ── */
  .ft-body {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 52px;
    padding: 64px 0 52px;
    border-bottom: 1px solid rgba(99,102,241,0.1);
  }

  /* ── BRAND COLUMN ── */
  .ft-logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .ft-logo-mark {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  }
  .ft-logo-name {
    font-family: 'Poppins', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #1e1b4b;
    letter-spacing: -0.4px;
  }
  .ft-logo-name span { color: #6366f1; }

  .ft-tagline {
    font-size: 13.5px;
    line-height: 1.8;
    color: #6b7280;
    font-weight: 300;
    max-width: 300px;
    margin-bottom: 28px;
  }

  /* Newsletter */
  .ft-newsletter {
    display: flex;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(99,102,241,0.2);
    max-width: 320px;
    background: #fff;
    box-shadow: 0 2px 16px rgba(99,102,241,0.08);
  }
  .ft-nl-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 14px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #1e1b4b;
    min-width: 0;
  }
  .ft-nl-input::placeholder { color: #c4b5fd; }
  .ft-nl-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    border: none;
    padding: 12px 20px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    letter-spacing: 0.03em;
    white-space: nowrap;
    transition: opacity 0.18s, box-shadow 0.18s;
  }
  .ft-nl-btn:hover {
    opacity: 0.9;
    box-shadow: -4px 0 16px rgba(99,102,241,0.25);
  }

  /* Socials */
  .ft-socials {
    display: flex;
    gap: 9px;
    margin-top: 22px;
  }
  .ft-social-link {
    width: 38px; height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(99,102,241,0.15);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(99,102,241,0.07);
    transition: background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
    text-decoration: none;
  }
  .ft-social-link:hover {
    background: #eef2ff;
    border-color: rgba(99,102,241,0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(99,102,241,0.15);
  }

  /* ── LINK COLUMNS ── */
  .ft-col-heading {
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #c4b5fd;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  .ft-link-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
  }
  .ft-link-list a {
    font-size: 14px;
    color: #6b7280;
    text-decoration: none;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    gap: 0px;
    transition: color 0.18s, gap 0.2s;
    position: relative;
  }
  .ft-link-list a::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 1.5px;
    background: linear-gradient(90deg, #6366f1, #a78bfa);
    transition: width 0.22s;
    flex-shrink: 0;
    border-radius: 2px;
    margin-right: 0;
    transform: translateY(0.5px);
  }
  .ft-link-list a:hover {
    color: #6366f1;
    gap: 8px;
  }
  .ft-link-list a:hover::before { width: 14px; }

  /* ── BOTTOM BAR ── */
  .ft-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    gap: 12px;
    flex-wrap: wrap;
  }
  .ft-copy {
    font-size: 12.5px;
    color: #9ca3af;
    font-weight: 300;
  }
  .ft-copy strong {
    color: #6366f1;
    font-weight: 600;
  }

  .ft-bottom-links {
    display: flex;
    gap: 20px;
  }
  .ft-bottom-links a {
    font-size: 12px;
    color: #9ca3af;
    text-decoration: none;
    font-weight: 400;
    transition: color 0.18s;
    position: relative;
  }
  .ft-bottom-links a::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 1px;
    background: #6366f1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.22s;
  }
  .ft-bottom-links a:hover { color: #6366f1; }
  .ft-bottom-links a:hover::after { transform: scaleX(1); }

  /* ── RESPONSIVE ── */
  @media (max-width: 720px) {
    .ft-body {
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      padding: 48px 0 36px;
    }
    .ft-brand-col { grid-column: 1 / -1; }
    .ft-newsletter { max-width: 100%; }
    .ft-tagline { max-width: 100%; }
  }

  @media (max-width: 480px) {
    .ft-body { grid-template-columns: 1fr; gap: 32px; }
    .ft-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
    .ft-inner { padding: 0 20px; }
    .ft-bottom-links { gap: 14px; }
  }
`;

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ft-root">
        <div className="ft-accent-bar" />
        <div className="ft-bg-glow ft-glow-1" />
        <div className="ft-bg-glow ft-glow-2" />
        <div className="ft-bg-glow ft-glow-3" />
        <div className="ft-grid-lines" />

        <div className="ft-inner">
          <div className="ft-body">

            {/* ── BRAND ── */}
            <div className="ft-brand-col">
              <div className="ft-logo-wrap">
                <div className="ft-logo-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 20h9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                      stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="ft-logo-name">Blog<span>Page</span></span>
              </div>

              <p className="ft-tagline">
                The home for the latest stories, insights, and tutorials from
                developers, designers, and creators around the world.
              </p>

              <div className="ft-newsletter">
                <input
                  className="ft-nl-input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="ft-nl-btn">Subscribe</button>
              </div>

              <div className="ft-socials">
                <a href="#" aria-label="Twitter" className="ft-social-link">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M19.167 2.5a9.1 9.1 0 0 1-2.617 1.275 3.733 3.733 0 0 0-6.55 2.5v.833a8.88 8.88 0 0 1-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 0 1-5.834 1.667C8.333 20 17.5 15.833 17.5 6.25q0-.35-.067-.692A6.43 6.43 0 0 0 19.167 2.5"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="GitHub" className="ft-social-link">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15.833c-4.167 1.25-4.167-2.084-5.833-2.5m11.666 5v-3.225a2.8 2.8 0 0 0-.783-2.175c2.616-.292 5.366-1.283 5.366-5.833a4.53 4.53 0 0 0-1.25-3.125 4.22 4.22 0 0 0-.075-3.142s-.983-.292-3.258 1.233a11.15 11.15 0 0 0-5.833 0C5.225.541 4.242.833 4.242.833a4.22 4.22 0 0 0-.075 3.142 4.53 4.53 0 0 0-1.25 3.15c0 4.516 2.75 5.508 5.366 5.833a2.8 2.8 0 0 0-.783 2.15v3.225"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="ft-social-link">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M13.333 6.667a5 5 0 0 1 5 5V17.5H15v-5.833a1.667 1.667 0 0 0-3.334 0V17.5H8.333v-5.833a5 5 0 0 1 5-5M5 7.5H1.667v10H5zM3.333 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ── CATEGORIES ── */}
            <div className="ft-link-col">
              <h2 className="ft-col-heading">Categories</h2>
              <ul className="ft-link-list">
                {["Technology", "Lifestyle", "Programming", "Design"].map(item => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* ── ABOUT ── */}
            <div className="ft-link-col">
              <h2 className="ft-col-heading">About</h2>
              <ul className="ft-link-list">
                {["Our Story", "Contributors", "Contact", "Terms & Privacy"].map(item => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © 2025 <strong>BlogPage</strong>. All Rights Reserved.
            </p>
            <div className="ft-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}