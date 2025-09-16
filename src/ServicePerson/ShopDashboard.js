import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShopDashboard = () => {
  const { userData, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 30 seconds
    const interval = setInterval(() => {
      fetchConversations();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/shop/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };


  // NEW: Handle view click with unread reset
  const handleViewClick = async (shopId, userId) => {
    try {
      // Call API to mark messages as read
      await axios.post(
        `http://localhost:3000/api/chat/read/${shopId}/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Immediately update local state to reset unread count
      setConversations((prevConversations) =>
        prevConversations.map((convo) => {
          if (convo._id === userId) {
            return { ...convo, unreadCount: 0 };
          }
          return convo;
        })
      );

      // Navigate to conversation
      navigate(`/shop/conversation/${shopId}/${userId}`);
    } catch (error) {
      console.error("Failed to reset unread messages:", error);
      // Still navigate even if API call fails
      navigate(`/shop/conversation/${shopId}/${userId}`);
    }
  };

  // Add a function to refresh conversations when returning from chat
  const refreshConversations = () => {
    fetchConversations();
  };

  // Listen for focus events to refresh when user returns to dashboard
  useEffect(() => {
    const handleFocus = () => {
      fetchConversations();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-grow container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            📱 Shop Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {userData?.name || userData?.shopName}! Manage your
            customer conversations here.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-xl font-semibold flex items-center">
              💬 Customer Inquiries
              {conversations.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                  {conversations.length}
                </span>
              )}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : conversations.length === 0 ? (
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No messages yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Customer conversations will appear here when they start
                  chatting with your shop.
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {conversations.map((convo) => (
                    <div
                      key={convo._id}
                      className="py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold text-sm">
                                {convo.customerName?.charAt(0)?.toUpperCase() ||
                                  "?"}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {convo.customerName || "Anonymous Customer"}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Last message:{" "}
                                {new Date(
                                  convo.lastMessageTime
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  convo.lastMessageTime
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 ml-13 line-clamp-2">
                            "{convo.lastMessage}"
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {/* UPDATED: Show just "new" instead of number */}
                          {convo.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              new
                            </span>
                          )}
                          {/* UPDATED: Replace Link with button that resets unread count */}
                          <button
                            onClick={() =>
                              handleViewClick(convo.shopId, convo._id)
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            View Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Conversations
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {conversations.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Unread Messages
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ShopDashboard;
