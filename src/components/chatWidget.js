import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import shopUserMapping from "../Utils/ShopUserMapping";

const ChatWidget = ({ shopId, shopName, onClose }) => {
  const { userData, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Get the actual shop user ID from mapping
  const actualShopId = shopUserMapping[shopId] || shopId;

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
    // Set up polling for new messages
    const interval = setInterval(fetchChatHistory, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [shopId]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/chat/${actualShopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/api/chat/${actualShopId}`,
        {
          message: newMessage,
          shopName: shopName, // Include shop name for notifications
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage("");
      fetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold">Chat with {shopName}</h3>
        <button onClick={onClose} className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Chat messages */}
      <div className="h-80 overflow-y-auto p-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                msg.senderId === userData?._id
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 mr-auto"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-lg p-2 focus:outline-none"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
