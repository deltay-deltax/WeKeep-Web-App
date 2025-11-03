import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../Utils/api";
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
      const response = await api.get(
        "/api/user/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
      setLoading(false);

      // Mark notifications as read
      await api.post(
        "/api/user/notifications/read",
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

  // Smart navigation based on notification type
  const handleNotificationClick = (notification) => {
    if (!notification.data) return;

    const { type, requestId, shopId, userId } = notification.data;

    switch (type) {
      case 'new_service_request':
        // Navigate to service requests page for service providers
        if (userData.role === "service") {
          navigate("/service-requests");
        } else {
          navigate("/service-history");
        }
        break;
      
      case 'service_request_update':
        // Navigate to service history for customers
        if (userData.role === "user") {
          navigate("/service-history");
        } else {
          navigate("/shop-dashboard");
        }
        break;
      
      case 'payment_received':
        // For service providers, navigate to analytics to see earnings
        if (userData.role === "service") {
          navigate("/service-analytics");
        } else {
          navigate("/service-history");
        }
        break;
      case 'payment_successful':
      case 'payment_failed':
      case 'payment_required':
        // Navigate to service history to see payment status
        navigate("/service-history");
        break;
      
      case 'warranty_expiration':
        // Navigate to warranty management page
        navigate("/add-warranty");
        break;
      
      default:
        // For chat messages or unknown types, navigate to chat
        if (shopId && userId) {
          if (userData.role === "service") {
            navigate(`/shop/conversation/${shopId}/${userId}`);
          } else {
            navigate(`/shop/conversation/${shopId}/${userId}`);
          }
        } else if (shopId) {
          navigate(`/shop/${shopId}`);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content with flex-grow */}
      <div className="flex-grow container mx-auto p-6 pb-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🔔 Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your latest messages and activities
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 text-gray-400">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.75 7.75L2.82 2.82M21.18 21.18l-3.12-3.12M14.25 14.25l4.93 4.93"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-2">
              New message notifications will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  className="w-full text-left p-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div
                      className={`mt-1 mr-3 flex-shrink-0 rounded-full p-2 ${
                        notification.read ? "bg-gray-300" : "bg-blue-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              notification.createdAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
