import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { token, userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/user/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
      setLoading(false);

      // Mark notifications as read
      await axios.post(
        "http://localhost:3000/api/user/notifications/read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Extract shopId from notification data if available
    if (notification.data && notification.data.shopId) {
      if (userData.role === "service") {
        // For service providers, navigate to the conversation with the user
        navigate(
          `/shop/conversation/${notification.data.shopId}/${notification.data.userId}`
        );
      } else {
        // For regular users, navigate to the shop details page with chat open
        navigate(`/shop/${notification.data.shopId}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No notifications yet</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg divide-y">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                <div
                  className={`mt-1 mr-3 flex-shrink-0 rounded-full p-1 ${
                    notification.read ? "bg-gray-300" : "bg-blue-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
