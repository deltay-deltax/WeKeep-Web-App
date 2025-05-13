// src/ServicePerson/ShopDashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const ShopDashboard = () => {
  const { userData, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Message Dashboard
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Customer Messages
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No messages yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((convo) => (
              <div key={convo._id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{convo.customerName}</h3>
                    <p className="text-sm text-gray-500">
                      Last message:{" "}
                      {new Date(convo.lastMessageTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {convo.lastMessage}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {convo.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-3">
                        {convo.unreadCount} new
                      </span>
                    )}
                    <Link
                      to={`/shop/conversation/${convo.shopId}/${convo.userId}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;
