import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearLegacyLocalAuth, clearUserSession, getToken } from "../utils/authStorage";
import { disablePushNotifications } from "../utils/pushNotifications";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await disablePushNotifications();
    } catch (error) {
      console.error("Unable to disable push notifications:", error);
    } finally {
      clearUserSession();
      clearLegacyLocalAuth();
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  const handleHomeNav = () => {
    setOpen(false);
    navigate("/home");
  };

  const categories = ["Technology", "Design", "Programming", "Lifestyle", "Productivity"];

  const navLinkStyle = {
    fontSize: 14,
    fontWeight: 500,
    color: "#475569",
    textDecoration: "none",
    fontFamily: "'Poppins', sans-serif",
    transition: "color 0.2s",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .nav-link:hover { color: #6366f1 !important; }

        .nav-dropdown { position: relative; }
        .nav-dropdown-menu {
          display: none;
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.1);
          min-width: 160px;
          z-index: 50;
          overflow: hidden;
          padding: 6px 0;
        }
        .nav-dropdown:hover .nav-dropdown-menu { display: block; }
        .nav-dropdown-item {
          display: block;
          padding: 9px 16px;
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          color: #475569;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nav-dropdown-item:hover { background: #f0f4ff; color: #6366f1; }

        .nav-btn-login {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
        }
        .nav-btn-login:hover { opacity: 0.88; transform: translateY(-1px); }

        .nav-btn-signup {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 10px;
          border: 1.5px solid #c7d2fe;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #6366f1;
        }
        .nav-btn-signup:hover { background: #f0f4ff; border-color: #818cf8; }

        .nav-btn-logout {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 10px;
          border: 1.5px solid #fecaca;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #ef4444;
        }
        .nav-btn-logout:hover { background: #fff5f5; border-color: #f87171; }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          padding: 11px 0;
          border: none;
          border-bottom: 1px solid #f1f5f9;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: color 0.2s;
          text-decoration: none;
        }
        .mobile-nav-link:hover { color: #6366f1; }

        .mobile-cat-item {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #94a3b8;
          padding: 7px 0;
          cursor: pointer;
          transition: color 0.2s;
        }
        .mobile-cat-item:hover { color: #6366f1; }

        .chevron { transition: transform 0.2s; display: inline-block; }
        .chevron.open { transform: rotate(180deg); }

        .ham-line {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: #6366f1;
          transition: transform 0.25s, opacity 0.2s;
        }
      `}</style>

      <nav
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: "#ffffff",
          borderBottom: "1px solid rgba(99,102,241,0.08)",
          boxShadow: "0 1px 12px rgba(99,102,241,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Main bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/home"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ color: "#1e1b4b" }}>Blog</span>
              <span style={{ color: "#6366f1" }}>Page</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <button className="nav-link" style={navLinkStyle} onClick={handleHomeNav}>
                Home
              </button>

              <Link to="/articles" className="nav-link" style={navLinkStyle}>
                Articles
              </Link>

              {/* Categories dropdown */}
              <div className="nav-dropdown">
                <button
                  className="nav-link"
                  style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 4 }}
                >
                  Categories
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="nav-dropdown-menu">
                  {categories.map((cat) => (
                    <span key={cat} className="nav-dropdown-item">{cat}</span>
                  ))}
                </div>
              </div>

              <Link to="/about" className="nav-link" style={navLinkStyle}>
                About
              </Link>

              {/* Auth buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!isLoggedIn ? (
                  <>
                    <button className="nav-btn-login" onClick={() => navigate("/login")}>
                      Login
                    </button>
                    <button className="nav-btn-signup" onClick={() => navigate("/signup")}>
                      Sign Up
                    </button>
                  </>
                ) : (
                  <button className="nav-btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <span className="ham-line"
                style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span className="ham-line"
                style={{ width: 16, marginLeft: "auto", opacity: open ? 0 : 1 }} />
              <span className="ham-line"
                style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
            </button>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && open && (
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "12px 24px 20px", background: "#fff" }}>
            <button className="mobile-nav-link" onClick={handleHomeNav}>
              Home
            </button>

            <Link to="/articles" className="mobile-nav-link" onClick={() => setOpen(false)}>
              Articles
            </Link>

            <button
              className="mobile-nav-link"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Categories
              <svg
                className={`chevron ${categoriesOpen ? "open" : ""}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {categoriesOpen && (
              <div style={{ paddingLeft: 12, paddingBottom: 4 }}>
                {categories.map((cat) => (
                  <span key={cat} className="mobile-cat-item">{cat}</span>
                ))}
              </div>
            )}

            <Link
              to="/about"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
              style={{ borderBottom: "none" }}
            >
              About
            </Link>

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              {!isLoggedIn ? (
                <>
                  <button className="nav-btn-login" style={{ flex: 1 }}
                    onClick={() => { setOpen(false); navigate("/login"); }}>
                    Login
                  </button>
                  <button className="nav-btn-signup" style={{ flex: 1 }}
                    onClick={() => { setOpen(false); navigate("/signup"); }}>
                    Sign Up
                  </button>
                </>
              ) : (
                <button className="nav-btn-logout" style={{ width: "100%" }}
                  onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;