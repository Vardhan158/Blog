import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      setMessage({
        type: "success",
        title: "Account created!",
        text: res.data.message || "Redirecting you to login…",
      });
      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        title: "Signup Failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = "#6366f1";
    e.target.style.background = "#fff";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  const inputStyle = {
    width: "100%",
    height: 44,
    paddingLeft: 40,
    paddingRight: 16,
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 14,
    color: "#1e293b",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  const fields = [
    {
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "email",
      type: "email",
      placeholder: "you@example.com",
      label: "Email address",
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      name: "password",
      type: "password",
      placeholder: "••••••••",
      label: "Password",
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        .signup-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        input::placeholder { color: #cbd5e1; }
        .signup-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .signup-submit:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      <div
        className="signup-root"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            border: "1px solid rgba(99,102,241,0.1)",
            boxShadow: "0 4px 32px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Logo mark */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 20px",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z" />
            </svg>
          </div>

          <h1 style={{ textAlign: "center", fontSize: 22, fontWeight: 600, color: "#1e1b4b", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
            Create account
          </h1>
          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "0 0 28px" }}>
            Sign up to get started for free
          </p>

          {/* Toast message */}
          {message && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20,
              background: message.type === "success" ? "#f0fdf4" : "#fff5f5",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              borderRadius: 12, padding: "12px 14px",
            }}>
              {message.type === "success" ? (
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0Zm0 13.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm0-3.6a.9.9 0 0 0 .9-.9V5.4a.9.9 0 1 0-1.8 0v3.6a.9.9 0 0 0 .9.9Z" fill="#EF4444" />
                </svg>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: message.type === "success" ? "#15803d" : "#dc2626", margin: "0 0 2px" }}>
                  {message.title}
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{message.text}</p>
              </div>
              <button
                type="button"
                aria-label="close"
                onClick={() => setMessage(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: 18, lineHeight: 1, padding: "0 2px", marginLeft: 4 }}
                onMouseEnter={(e) => e.target.style.color = "#94a3b8"}
                onMouseLeave={(e) => e.target.style.color = "#cbd5e1"}
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map(({ name, type, placeholder, label, icon }) => (
              <div key={name}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 6, letterSpacing: "0.3px" }}>
                  {label}
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none", display: "flex" }}>
                    {icon}
                  </span>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="signup-submit"
              style={{
                marginTop: 4,
                width: "100%",
                height: 46,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "opacity 0.2s, transform 0.15s",
                letterSpacing: "0.2px",
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: 16, height: 16, animation: "spin 0.7s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="white" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>Have an account?</span>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: 0 }}>
            Already registered?{" "}
            <a href="/login" style={{ color: "#6366f1", fontWeight: 500, textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;