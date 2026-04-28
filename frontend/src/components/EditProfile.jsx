import React, { useEffect, useState } from "react";
import md5 from "md5";
import axios from "axios";
import { FaBell, FaGlobe, FaLock, FaShieldAlt, FaUserCog } from "react-icons/fa";

const EditProfile = ({ userData, setUserData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  const getGravatar = (userEmail) => {
    if (!userEmail) return "/default-profile.png";
    const hash = md5(userEmail.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };

  const getImageUrl = (user) => {
    const image = user?.avatar || user?.profileImage;
    if (!image) return getGravatar(user?.email);
    return image.startsWith("http") ? image : `${API_URL}/uploads/${image}`;
  };

  const persistUser = (user) => {
    const imageUrl = getImageUrl(user);
    const nextUser = {
      ...getStoredUser(),
      ...user,
      avatar: imageUrl,
      profileImage: imageUrl,
    };

    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.setItem("profileImage", imageUrl);
    if (setUserData) setUserData(nextUser);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const res = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user || res.data;
      if (!user || !user.email) throw new Error("Invalid profile data received.");

      const imageUrl = getImageUrl(user);
      setName(user.name || user.username || "");
      setEmail(user.email || "");
      setProfileImage(imageUrl);
      persistUser({ ...user, avatar: imageUrl, profileImage: imageUrl });
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please make sure you're logged in.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/user/upload-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const user = res.data.user || {};
      const imageUrl = getImageUrl(user);
      setProfileImage(imageUrl);
      persistUser({ ...user, avatar: imageUrl, profileImage: imageUrl });
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      alert("Failed to upload image.");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={fetchProfile}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-3xl w-full max-w-4xl p-10 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center md:w-1/2">
          <button
            type="button"
            className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md overflow-hidden cursor-pointer"
            onClick={() => document.getElementById("profileInput").click()}
            aria-label="Upload profile picture"
          >
            <img
              src={profileImage || "/default-profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <input
            type="file"
            id="profileInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-4 text-center text-2xl font-semibold border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <p className="mt-2 text-gray-600">{email}</p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 space-y-4">
          <button className="flex items-center justify-start gap-3 px-5 py-3 rounded-lg bg-gray-100 hover:bg-indigo-100 transition text-gray-700 font-medium">
            <FaUserCog className="text-indigo-500 text-lg" />
            Account Settings
          </button>

          <button className="flex items-center justify-start gap-3 px-5 py-3 rounded-lg bg-gray-100 hover:bg-indigo-100 transition text-gray-700 font-medium">
            <FaShieldAlt className="text-green-500 text-lg" />
            Security
          </button>

          <button className="flex items-center justify-start gap-3 px-5 py-3 rounded-lg bg-gray-100 hover:bg-indigo-100 transition text-gray-700 font-medium">
            <FaLock className="text-red-500 text-lg" />
            Privacy
          </button>

          <button className="flex items-center justify-start gap-3 px-5 py-3 rounded-lg bg-gray-100 hover:bg-indigo-100 transition text-gray-700 font-medium">
            <FaBell className="text-yellow-500 text-lg" />
            Notifications
          </button>

          <button className="flex items-center justify-start gap-3 px-5 py-3 rounded-lg bg-gray-100 hover:bg-indigo-100 transition text-gray-700 font-medium">
            <FaGlobe className="text-blue-500 text-lg" />
            Language & Region
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
