import React from "react";
import { FaBell, FaPenFancy, FaFileAlt, FaComments, FaUserEdit } from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab, unreadCount = 0 }) {
  const menuItems = [
    { id: "create-blog",      label: "Create Blog",      icon: <FaPenFancy /> },
    { id: "published-blogs",  label: "Published Blogs",  icon: <FaFileAlt /> },
    { id: "comments",         label: "Comments",         icon: <FaComments /> },
    { id: "notifications",    label: "Notifications",    icon: <FaBell />, badge: unreadCount },
    { id: "edit-profile",     label: "Edit Profile",     icon: <FaUserEdit /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .sidebar-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .sidebar-root {
          width: 252px;
          min-width: 252px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid rgba(99,102,241,0.1);
          box-shadow: 2px 0 16px rgba(99,102,241,0.06);
          display: flex;
          flex-direction: column;
          padding: 28px 14px 24px;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }

        .sidebar-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 6px;
          margin-bottom: 28px;
        }

        .sidebar-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e1b4b;
          letter-spacing: -0.2px;
          user-select: none;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 600;
          color: #c7d2fe;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 0 10px;
          margin-bottom: 6px;
        }

        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 11px;
          height: 44px;
          padding: 0 12px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.18s, color 0.18s;
          position: relative;
        }
        .sidebar-item:hover {
          background: #f5f3ff;
          color: #6366f1;
        }
        .sidebar-item.active {
          background: linear-gradient(135deg, #ede9fe, #e0e7ff);
          color: #6366f1;
          font-weight: 600;
        }

        .sidebar-item-icon {
          font-size: 15px;
          flex-shrink: 0;
          width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-badge {
          margin-left: auto;
          min-width: 20px;
          padding: 2px 7px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.6;
          text-align: center;
        }

        .sidebar-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 14px 6px;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 14px 10px 0;
          border-top: 1px solid #f1f5f9;
        }

        .sidebar-footer-text {
          font-size: 11px;
          color: #cbd5e1;
          text-align: center;
          user-select: none;
        }

        /* Collapsed mobile strip */
        @media (max-width: 768px) {
          .sidebar-root {
            width: 64px;
            min-width: 64px;
            padding: 20px 8px;
            align-items: center;
          }
          .sidebar-logo-row { justify-content: center; padding: 0; margin-bottom: 24px; }
          .sidebar-title,
          .sidebar-section-label,
          .sidebar-item span.sidebar-item-label,
          .sidebar-badge,
          .sidebar-footer { display: none; }
          .sidebar-item {
            width: 44px;
            height: 44px;
            justify-content: center;
            padding: 0;
            border-radius: 12px;
          }
          .sidebar-item-icon { width: auto; font-size: 17px; }
          .sidebar-item.active::after {
            content: '';
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            border-radius: 2px;
            background: #6366f1;
          }
          .sidebar-divider { width: 32px; }
          .sidebar-badge-dot {
            display: block;
            position: absolute;
            top: 8px;
            right: 8px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #6366f1;
            border: 1.5px solid #fff;
          }
        }
        @media (min-width: 769px) {
          .sidebar-badge-dot { display: none; }
        }
      `}</style>

      <aside className="sidebar-root">
        {/* Logo / Brand */}
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <span className="sidebar-title">Dashboard</span>
        </div>

        {/* Section label */}
        <div className="sidebar-section-label">Menu</div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            const showDivider = idx === 2; // divider after Comments

            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`sidebar-item${isActive ? " active" : ""}`}
                  title={item.label}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>

                  {/* Full badge on desktop */}
                  {item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}

                  {/* Dot indicator on mobile */}
                  {item.badge > 0 && (
                    <span className="sidebar-badge-dot" />
                  )}
                </button>
                {showDivider && <div className="sidebar-divider" />}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">BlogPage &copy; {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  );
}