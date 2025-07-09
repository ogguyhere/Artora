// UserDashboard.js — Integrated Dashboard
import React, { useState } from "react";
import Cart from "./Cart";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Profile from "./Profile";
import Settings from "./Settings";

function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <p>Welcome to your dashboard! Here's a summary of your activity.</p>;
      case "cart":
        return <Cart />;
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <p>Choose an option from the sidebar.</p>;
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-wrapper">
        <aside className="sidebar">
          <h2 className="sidebar-title">User Panel</h2>
          <ul className="nav-list">
            <li onClick={() => setSelectedTab("dashboard")} className={selectedTab === "dashboard" ? "active" : ""}>🏠 Dashboard</li>
            <li onClick={() => setSelectedTab("cart")} className={selectedTab === "cart" ? "active" : ""}>🛒 My Cart</li>
            <li onClick={() => setSelectedTab("orders")} className={selectedTab === "orders" ? "active" : ""}>📦 Orders</li>
            <li onClick={() => setSelectedTab("wishlist")} className={selectedTab === "wishlist" ? "active" : ""}>❤️ Wishlist</li>
            <li onClick={() => setSelectedTab("profile")} className={selectedTab === "profile" ? "active" : ""}>👤 Profile</li>
            <li onClick={() => setSelectedTab("settings")} className={selectedTab === "settings" ? "active" : ""}>⚙️ Settings</li>
          </ul>
        </aside>
        <main className="dashboard-content">
          <h3>{selectedTab.toUpperCase()}</h3>
          <div className="content-area">{renderContent()}</div>
        </main>
      </div>

      <style jsx>{`
        .user-dashboard {
          background: linear-gradient(135deg, #0C0420, #5D3C64);
          min-height: 100vh;
          color: #C8C8D0;
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-wrapper {
          display: flex;
        }

        .sidebar {
          width: 220px;
          background: rgba(93, 60, 100, 0.2);
          border-right: 1px solid rgba(93, 60, 100, 0.3);
          padding: 2rem 1rem;
        }

        .sidebar-title {
          color: #D391B0;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .nav-list {
          list-style: none;
          padding: 0;
        }

        .nav-list li {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
          color: #C8C8D0;
        }

        .nav-list li:hover {
          background: rgba(211, 145, 176, 0.1);
          color: #D391B0;
        }

        .nav-list li.active {
          background: #D391B0;
          color: #0C0420;
        }

        .dashboard-content {
          flex-grow: 1;
          padding: 2rem;
        }

        .dashboard-content h3 {
          color: #D391B0;
          margin-bottom: 1rem;
        }

        .content-area {
          background: rgba(93, 60, 100, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          min-height: 300px;
          border: 1px solid rgba(93, 60, 100, 0.3);
        }
      `}</style>
    </div>
  );
}

export default UserDashboard;
