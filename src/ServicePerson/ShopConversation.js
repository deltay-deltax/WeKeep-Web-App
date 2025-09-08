import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const ShopConversation = () => {
  const { shopId, userId } = useParams();
  const navigate = useNavigate();
  const { userData, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/chat/${shopId}/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data.messages || []);
        setCustomerInfo(response.data.customerInfo);

        // Mark messages as read
        await axios.post(
          `http://localhost:3000/api/chat/read/${shopId}/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [shopId, userId, token]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    try {
      await axios.post(
        `http://localhost:3000/api/chat/${shopId}/${userId}`,
        { message: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMessage("");
      // Refetch messages after sending
      const response = await axios.get(
        `http://localhost:3000/api/chat/${shopId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // FIXED: Safe user ID comparison
  const isSender = (msg) => {
    return userData && msg.senderId === userData._id;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto p-6 max-w-3xl">
        <button
          onClick={() => navigate("/shop-dashboard")}
          className="mb-4 text-green-600 hover:text-green-800 font-semibold"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-xl font-bold">
              Conversation with {customerInfo?.name || "Customer"}
            </h2>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No messages yet</p>
            ) : (
              messages.map((msg) => {
                const sender = isSender(msg);
                return (
                  <div
                    key={msg._id}
                    className={`mb-4 max-w-[75%] p-3 shadow rounded-lg ${
                      sender
                        ? "ml-auto bg-green-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                        : "mr-auto bg-gray-200 text-gray-900 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              disabled={loading || !newMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Electronics Repair Service • Chat Interface</p>
        </div>
      </footer>
    </div>
  );
};

export default ShopConversation;
