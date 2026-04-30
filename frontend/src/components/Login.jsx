import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  clearAdminSession,
  clearLegacyLocalAuth,
  clearUserSession,
  setAdminToken,
  setAdminUser,
  setProfileImage,
  setToken,
  setUser,
  setUsername,
} from "../utils/authStorage";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);

      if (res.data.token) {
        const user = res.data.user || {};

        if (user.role === "admin") {
          clearUserSession();
          clearLegacyLocalAuth();
          setAdminToken(res.data.token);
          setAdminUser(user);
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        clearAdminSession();
        clearLegacyLocalAuth();
        setToken(res.data.token);
        setUser(user);
        setUsername(user.name || user.username || "");
        if (user.avatar || user.profileImage) {
          setProfileImage(user.avatar || user.profileImage);
        }

        navigate("/dashboard", { replace: true, state: { toast: "Login Successful!" } });
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrorMsg(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Poppins font — add this once in your index.html or global CSS instead if preferred */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-10"
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)",
        }}
      >
        <div
          className="w-full bg-white px-8 py-10"
          style={{
            maxWidth: 420,
            borderRadius: 24,
            border: "1px solid rgba(99,102,241,0.1)",
            boxShadow: "0 4px 32px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Logo mark */}
          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 3L4 9v12h6v-7h4v7h6V9L12 3z" />
            </svg>
          </div>

          <h1
            className="text-center font-semibold tracking-tight"
            style={{ fontSize: 22, color: "#1e1b4b" }}
          >
            Welcome back
          </h1>
          <p
            className="text-center mt-1 mb-7"
            style={{ fontSize: 13, color: "#94a3b8" }}
          >
            Sign in to your account to continue
          </p>

          {/* Error banner */}
          {errorMsg && (
            <div
              className="flex items-start gap-3 mb-5"
              style={{
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <svg
                className="shrink-0 mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0Zm0 13.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm0-3.6a.9.9 0 0 0 .9-.9V5.4a.9.9 0 1 0-1.8 0v3.6a.9.9 0 0 0 .9.9Z"
                  fill="#EF4444"
                />
              </svg>
              <div className="flex-1">
                <p
                  className="font-semibold"
                  style={{ fontSize: 13, color: "#dc2626" }}
                >
                  Login Failed
                </p>
                <p className="mt-0.5" style={{ fontSize: 12, color: "#94a3b8" }}>
                  {errorMsg}
                </p>
              </div>
              <button
                type="button"
                aria-label="close"
                onClick={() => setErrorMsg(null)}
                className="ml-1 transition"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                  color: "#fca5a5",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#dc2626")}
                onMouseLeave={(e) => (e.target.style.color = "#fca5a5")}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-medium mb-1.5 tracking-wide"
                style={{ fontSize: 12, color: "#64748b" }}
              >
                Email address
              </label>
              <div className="relative">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: 14, color: "#a5b4fc" }}
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full outline-none transition"
                  style={{
                    height: 44,
                    paddingLeft: 40,
                    paddingRight: 16,
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: 14,
                    color: "#1e293b",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.background = "#fff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block font-medium mb-1.5 tracking-wide"
                style={{ fontSize: 12, color: "#64748b" }}
              >
                Password
              </label>
              <div className="relative">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: 14, color: "#a5b4fc" }}
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none transition"
                  style={{
                    height: 44,
                    paddingLeft: 40,
                    paddingRight: 16,
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: 14,
                    color: "#1e293b",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.background = "#fff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end" style={{ marginTop: -4 }}>
              <a
                href="/forgot-password"
                className="font-medium hover:underline"
                style={{ fontSize: 12, color: "#6366f1" }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-medium transition"
              style={{
                height: 46,
                borderRadius: 12,
                border: "none",
                background: loading
                  ? "rgba(99,102,241,0.6)"
                  : "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff",
                fontSize: 15,
                fontFamily: "'Poppins', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.2px",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    style={{ width: 16, height: 16 }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: 1, background: "#f1f5f9" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1", whiteSpace: "nowrap" }}>
              New here?
            </span>
            <div className="flex-1" style={{ height: 1, background: "#f1f5f9" }} />
          </div>

          <p className="text-center" style={{ fontSize: 13, color: "#94a3b8" }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium hover:underline"
              style={{ color: "#6366f1" }}
            >
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;