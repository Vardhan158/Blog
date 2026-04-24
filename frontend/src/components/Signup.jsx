import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Auto-hide message after 3 seconds
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
        title: "Signup Successful!",
        text: res.data.message || "You can now log in.",
      });

      // Clear form
      setFormData({ username: "", email: "", password: "" });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        title: "Signup Failed!",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {/* ✅ Success/Error Message */}
      {message && (
        <div
          className={`bg-white inline-flex space-x-3 p-3 text-sm rounded border shadow-sm mb-4 ${
            message.type === "success" ? "border-green-200" : "border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0Zm0 13.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm0-3.6a.9.9 0 0 0 .9-.9V5.4a.9.9 0 1 0-1.8 0v3.6a.9.9 0 0 0 .9.9Z"
                fill="#EF4444"
              />
            </svg>
          )}
          <div>
            <h3
              className={`font-medium ${
                message.type === "success" ? "text-slate-700" : "text-red-600"
              }`}
            >
              {message.title}
            </h3>
            <p className="text-slate-500">{message.text}</p>
          </div>
          <button
            type="button"
            aria-label="close"
            onClick={() => setMessage(null)}
            className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="12.532"
                width="17.498"
                height="2.1"
                rx="1.05"
                transform="rotate(-45.74 0 12.532)"
                fill="currentColor"
                fillOpacity=".7"
              />
              <rect
                x="12.531"
                y="13.914"
                width="17.498"
                height="2.1"
                rx="1.05"
                transform="rotate(-135.74 12.531 13.914)"
                fill="currentColor"
                fillOpacity=".7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ✅ Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white mx-auto"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Sign Up</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign up to continue</p>

        <div className="mt-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
            required
          />
        </div>

        <div className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
            required
          />
        </div>

        <div className="mt-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
