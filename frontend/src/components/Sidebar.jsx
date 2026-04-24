import React from "react";
import { FaPenFancy, FaFileAlt, FaComments, FaUserEdit } from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "create-blog", label: "Create Blog", icon: <FaPenFancy /> },
    { id: "published-blogs", label: "Published Blogs", icon: <FaFileAlt /> },
    { id: "comments", label: "Comments", icon: <FaComments /> },
    { id: "edit-profile", label: "Edit Profile", icon: <FaUserEdit /> },
  ];

  return (
    <aside className="bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.08)] w-72 flex flex-col py-6 px-4 h-screen">
      <h2 className="text-xl font-semibold mb-4 select-none text-indigo-600 px-2">
        Dashboard
      </h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center h-14 px-3 gap-3 rounded-lg font-medium transition
              ${activeTab === item.id
                ? "text-indigo-500 bg-indigo-50 ring-1 ring-indigo-300"
                : "text-gray-700 hover:bg-zinc-100"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
