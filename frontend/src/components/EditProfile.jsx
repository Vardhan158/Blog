import React, { useEffect, useState } from "react";
import md5 from "md5";
import axios from "axios";
import { FaBell, FaGlobe, FaLock, FaShieldAlt, FaUserCog, FaCamera, FaChevronRight } from "react-icons/fa";
import { getToken, getUser, setProfileImage, setUser } from "../utils/authStorage";

const settingsItems = [
  {
    icon: FaUserCog,
    label: "Account Settings",
    desc: "Manage your account details",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    icon: FaShieldAlt,
    label: "Security",
    desc: "Password and authentication",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    icon: FaLock,
    label: "Privacy",
    desc: "Control your data and visibility",
    color: "#f43f5e",
    bg: "#fff1f2",
  },
  {
    icon: FaBell,
    label: "Notifications",
    desc: "Alerts and updates preferences",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: FaGlobe,
    label: "Language & Region",
    desc: "Set your locale and timezone",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
];

const EditProfile = ({ userData, setUserData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  const getGravatar = (userEmail) => {
    if (!userEmail) return "/default-profile.png";
    const hash = md5(userEmail.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const getStoredUser = () => getUser() || {};

  const getImageUrl = (user) => {
    const image = user?.avatar || user?.profileImage;
    if (!image) return getGravatar(user?.email);
    return image.startsWith("http") ? image : `${API_URL}/uploads/${image}`;
  };

  const persistUser = (user) => {
    const imageUrl = getImageUrl(user);
    const nextUser = { ...getStoredUser(), ...user, avatar: imageUrl, profileImage: imageUrl };
    setUser(nextUser);
    setProfileImage(imageUrl);
    if (setUserData) setUserData(nextUser);
  };

  const fetchProfile = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");
      const res = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user || res.data;
      if (!user || !user.email) throw new Error("Invalid profile data received.");
      const imageUrl = getImageUrl(user);
      setName(user.name || user.username || "");
      setEmail(user.email || "");
      setProfileImg(imageUrl);
      persistUser({ ...user, avatar: imageUrl, profileImage: imageUrl });
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please make sure you're logged in.");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = async (e) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);
    try {
      const token = getToken();
      const res = await axios.post(`${API_URL}/api/user/upload-profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const user = res.data.user || {};
      const imageUrl = getImageUrl(user);
      setProfileImg(imageUrl);
      persistUser({ ...user, avatar: imageUrl, profileImage: imageUrl });
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      alert("Failed to upload image.");
    }
  };

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="ep-error-state">
          <div className="ep-error-card">
            <div className="ep-error-icon">⚠️</div>
            <p className="ep-error-msg">{error}</p>
            <button onClick={fetchProfile} className="ep-retry-btn">Try Again</button>
          </div>
        </div>
      </>
    );
  }

  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <>
      <style>{styles}</style>
      <div className="ep-root">
        {/* Background decoration */}
        <div className="ep-bg-blob ep-blob-1" />
        <div className="ep-bg-blob ep-blob-2" />

        <div className="ep-container">
          {/* Header */}
          <div className="ep-page-header">
            <span className="ep-page-tag">PROFILE</span>
            <h1 className="ep-page-title">Your Account</h1>
          </div>

          <div className="ep-card">
            {/* Left Panel */}
            <div className="ep-left">
              <div className="ep-avatar-wrap">
                <div
                  className={`ep-avatar-ring ${hovering ? "ep-avatar-ring--hover" : ""}`}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  onClick={() => document.getElementById("profileInput").click()}
                >
                  {profileImg ? (
                    <img src={profileImg} alt="Profile" className="ep-avatar-img" />
                  ) : (
                    <div className="ep-avatar-placeholder">{initials}</div>
                  )}
                  <div className={`ep-avatar-overlay ${hovering ? "ep-avatar-overlay--show" : ""}`}>
                    <FaCamera className="ep-camera-icon" />
                    <span>Change</span>
                  </div>
                </div>
                <div className="ep-avatar-badge" title="Edit photo" onClick={() => document.getElementById("profileInput").click()}>
                  <FaCamera size={10} color="#fff" />
                </div>
              </div>

              <input type="file" id="profileInput" className="ep-hidden" accept="image/*" onChange={handleImageChange} />

              <div className="ep-name-field-wrap">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ep-name-input"
                  placeholder="Your name"
                  spellCheck={false}
                />
                <div className="ep-name-underline" />
              </div>

              <p className="ep-email">{email || "your@email.com"}</p>

              <div className="ep-stats-row">
                <div className="ep-stat">
                  <span className="ep-stat-num">24</span>
                  <span className="ep-stat-label">Posts</span>
                </div>
                <div className="ep-stat-divider" />
                <div className="ep-stat">
                  <span className="ep-stat-num">138</span>
                  <span className="ep-stat-label">Followers</span>
                </div>
                <div className="ep-stat-divider" />
                <div className="ep-stat">
                  <span className="ep-stat-num">72</span>
                  <span className="ep-stat-label">Following</span>
                </div>
              </div>

              <button className="ep-save-btn">Save Changes</button>
            </div>

            {/* Right Panel */}
            <div className="ep-right">
              <p className="ep-section-label">SETTINGS</p>
              <div className="ep-settings-list">
                {settingsItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeItem === i;
                  return (
                    <button
                      key={item.label}
                      className={`ep-setting-row ${isActive ? "ep-setting-row--active" : ""}`}
                      style={{ animationDelay: `${i * 60}ms` }}
                      onClick={() => setActiveItem(isActive ? null : i)}
                    >
                      <div className="ep-setting-icon-wrap" style={{ background: item.bg }}>
                        <Icon size={15} color={item.color} />
                      </div>
                      <div className="ep-setting-text">
                        <span className="ep-setting-name">{item.label}</span>
                        <span className="ep-setting-desc">{item.desc}</span>
                      </div>
                      <FaChevronRight
                        size={11}
                        className={`ep-setting-arrow ${isActive ? "ep-setting-arrow--open" : ""}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ep-root {
    min-height: 100vh;
    background: #f8f7f4;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
  }

  .ep-bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
    pointer-events: none;
  }
  .ep-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #c7d2fe 0%, #e0e7ff 100%);
    top: -100px; right: -120px;
  }
  .ep-blob-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, #fde68a 0%, #fef3c7 100%);
    bottom: -80px; left: -80px;
  }

  .ep-container {
    width: 100%;
    max-width: 860px;
    position: relative;
    z-index: 1;
  }

  .ep-page-header {
    margin-bottom: 24px;
  }
  .ep-page-tag {
    font-family: 'Sora', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #6366f1;
    display: block;
    margin-bottom: 6px;
  }
  .ep-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }

  .ep-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 40px rgba(99,102,241,0.08);
    display: flex;
    flex-direction: row;
    overflow: hidden;
    border: 1px solid rgba(99,102,241,0.08);
  }

  /* ── LEFT PANEL ── */
  .ep-left {
    width: 46%;
    padding: 44px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(160deg, #fafafe 0%, #f3f4ff 100%);
    border-right: 1px solid rgba(99,102,241,0.08);
  }

  .ep-avatar-wrap {
    position: relative;
    margin-bottom: 22px;
  }

  .ep-avatar-ring {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px #e0e7ff, 0 8px 24px rgba(99,102,241,0.2);
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .ep-avatar-ring--hover {
    box-shadow: 0 0 0 3px #6366f1, 0 10px 30px rgba(99,102,241,0.35);
    transform: scale(1.03);
  }

  .ep-avatar-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .ep-avatar-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 36px; font-weight: 700;
    color: #6366f1;
    background: #eef2ff;
  }

  .ep-avatar-overlay {
    position: absolute; inset: 0;
    background: rgba(99,102,241,0.72);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 5px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.22s;
    backdrop-filter: blur(2px);
  }
  .ep-avatar-overlay--show { opacity: 1; }

  .ep-camera-icon { font-size: 18px; }

  .ep-avatar-badge {
    position: absolute;
    bottom: 4px; right: 4px;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: #6366f1;
    border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(99,102,241,0.4);
    transition: transform 0.2s;
  }
  .ep-avatar-badge:hover { transform: scale(1.12); }

  .ep-hidden { display: none; }

  .ep-name-field-wrap {
    position: relative;
    width: 100%;
    max-width: 240px;
    margin-bottom: 6px;
  }
  .ep-name-input {
    width: 100%;
    text-align: center;
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a2e;
    background: transparent;
    border: none;
    outline: none;
    padding: 4px 0 8px;
    letter-spacing: -0.3px;
  }
  .ep-name-underline {
    position: absolute;
    bottom: 0; left: 10%; right: 10%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, #a5b4fc, transparent);
    border-radius: 2px;
  }
  .ep-name-input:focus ~ .ep-name-underline {
    background: linear-gradient(90deg, transparent, #6366f1, transparent);
  }

  .ep-email {
    font-size: 13.5px;
    color: #888;
    margin-bottom: 28px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.01em;
  }

  .ep-stats-row {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #fff;
    border-radius: 16px;
    padding: 16px 24px;
    box-shadow: 0 2px 12px rgba(99,102,241,0.07);
    border: 1px solid rgba(99,102,241,0.08);
    margin-bottom: 28px;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  .ep-stat {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .ep-stat-num {
    font-family: 'Sora', sans-serif;
    font-size: 17px; font-weight: 700; color: #1a1a2e;
  }
  .ep-stat-label {
    font-size: 11px; color: #aaa; font-weight: 400; letter-spacing: 0.03em;
  }
  .ep-stat-divider {
    width: 1px; height: 28px; background: #e8e8f0;
  }

  .ep-save-btn {
    width: 100%;
    max-width: 240px;
    padding: 13px 0;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(99,102,241,0.35);
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .ep-save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.42);
  }
  .ep-save-btn:active { transform: translateY(0); }

  /* ── RIGHT PANEL ── */
  .ep-right {
    flex: 1;
    padding: 44px 36px;
    display: flex;
    flex-direction: column;
  }

  .ep-section-label {
    font-family: 'Sora', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #bbb;
    margin-bottom: 16px;
  }

  .ep-settings-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ep-setting-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.18s, border-color 0.18s, transform 0.15s;
    animation: ep-slide-in 0.4s both;
  }
  @keyframes ep-slide-in {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .ep-setting-row:hover {
    background: #f8f7ff;
    border-color: rgba(99,102,241,0.1);
    transform: translateX(2px);
  }
  .ep-setting-row--active {
    background: #eef2ff;
    border-color: rgba(99,102,241,0.2);
  }

  .ep-setting-icon-wrap {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s;
  }
  .ep-setting-row:hover .ep-setting-icon-wrap { transform: scale(1.1); }

  .ep-setting-text {
    flex: 1;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ep-setting-name {
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 600;
    color: #1a1a2e;
  }
  .ep-setting-desc {
    font-size: 12px; color: #aaa; font-weight: 300;
  }

  .ep-setting-arrow {
    color: #ccc;
    transition: transform 0.22s, color 0.22s;
    flex-shrink: 0;
  }
  .ep-setting-arrow--open { transform: rotate(90deg); color: #6366f1; }
  .ep-setting-row:hover .ep-setting-arrow { color: #a5b4fc; }

  /* ── ERROR STATE ── */
  .ep-error-state {
    min-height: 100vh; display: flex;
    align-items: center; justify-content: center;
    background: #f8f7f4; font-family: 'DM Sans', sans-serif;
  }
  .ep-error-card {
    background: #fff; border-radius: 20px;
    padding: 48px 40px; text-align: center;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    max-width: 360px;
  }
  .ep-error-icon { font-size: 40px; margin-bottom: 16px; }
  .ep-error-msg { color: #f43f5e; font-size: 15px; margin-bottom: 24px; font-weight: 500; }
  .ep-retry-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #fff; border: none; border-radius: 12px;
    padding: 12px 32px; font-size: 14px; font-weight: 600;
    font-family: 'Sora', sans-serif; cursor: pointer;
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
    transition: transform 0.18s;
  }
  .ep-retry-btn:hover { transform: translateY(-2px); }

  /* ── RESPONSIVE ── */
  @media (max-width: 680px) {
    .ep-card { flex-direction: column; }
    .ep-left {
      width: 100%;
      padding: 36px 24px 28px;
      border-right: none;
      border-bottom: 1px solid rgba(99,102,241,0.08);
    }
    .ep-right { padding: 28px 20px 36px; }
    .ep-page-title { font-size: 22px; }
    .ep-avatar-ring { width: 100px; height: 100px; }
    .ep-name-input { font-size: 18px; }
    .ep-stats-row { max-width: 100%; }
    .ep-save-btn { max-width: 100%; }
  }
`;

export default EditProfile;