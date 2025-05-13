import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const ServiceHomePage = () => {
  const { token, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/shop/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
          Welcome to Your Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/service/report-problem"
            className="p-6 bg-green-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-green-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Report Problem</h2>
            <p className="text-sm">Document device issues brought by users.</p>
          </Link>
          <Link
            to="/service/update"
            className="p-6 bg-blue-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Service Update</h2>
            <p className="text-sm">Record repairs and changes performed.</p>
          </Link>
          <Link
            to="/service/history"
            className="p-6 bg-purple-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-purple-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Service History</h2>
            <p className="text-sm">View full service record by model number.</p>
          </Link>
        </div>

        {/* New Messages Dashboard Link */}
        <div className="mt-8">
          <Link
            to="/shop-dashboard"
            className="relative p-6 bg-yellow-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-yellow-600 hover:scale-105 transition-transform duration-300 block"
          >
            <h2 className="text-xl font-bold mb-2">Customer Messages</h2>
            <p className="text-sm">View and respond to customer inquiries.</p>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceHomePage;
