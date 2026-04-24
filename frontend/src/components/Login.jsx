import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        // ✅ Navigate instantly with state for success toast
        navigate("/home", { replace: true, state: { toast: "Login Successful!" } });
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrorMsg(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {errorMsg && (
        <div className="bg-white inline-flex space-x-3 p-3 text-sm rounded border border-red-200 shadow-sm mb-4">
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
          <div>
            <h3 className="font-medium text-red-600">Login Failed!</h3>
            <p className="text-slate-500">{errorMsg}</p>
          </div>
          <button
            type="button"
            aria-label="close"
            onClick={() => setErrorMsg(null)}
            className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
          >
            ✕
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white mx-auto transition-all duration-300"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please login to continue</p>

        <div className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
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
            className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition disabled:opacity-60 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-4 text-gray-500 text-sm mb-8">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
