import React, { useState, useEffect } from "react";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleDashboard = () => navigate("/profile");
  const handleBack = () => navigate(-1); // Go back dynamically

  // Show back button ONLY when on `/profile`
  const showBackButton = location.pathname === "/profile";

  useEffect(() => {
    if (isAuthenticated && userData) {
      fetchUnreadNotifications();
      const interval = setInterval(fetchUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userData, token]);

  const fetchUnreadNotifications = async () => {
    try {
      // Use different endpoints based on user role
      const endpoint =
        userData?.role === "service"
          ? "http://localhost:3000/api/shop/unread-count"
          : "http://localhost:3000/api/user/notifications/unread";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Back Button - Appears Only When on Dashboard */}
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 hover:text-gray-200 transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
        )}

        <Link to="/" className="text-2xl font-bold">
          WeKeep
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <>
            {/* Notification Bell with Badge */}
            <div className="relative">
              <Link to="/notifications" className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Link */}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:text-gray-200 transition"
              onClick={handleDashboard}
            >
              <FaUserCircle className="text-3xl" />
              <span>{userData?.name || "Profile"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
