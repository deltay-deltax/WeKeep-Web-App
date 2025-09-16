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
      
      // Mark messages as read after fetching
      try {
        await axios.post(
          `http://localhost:3000/api/chat/read/${actualShopId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Chat messages marked as read");
      } catch (error) {
        console.error("Error marking chat messages as read:", error);
      }
      
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
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Chat with {shopName}</h3>
            <p className="text-xs text-blue-100">Online now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
        >
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

      {/* Chat messages container */}
      <div className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 text-sm">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Start a conversation!</p>
              <p className="text-gray-500 text-sm mt-1">Send your first message below</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-4 flex ${msg.senderId === userData?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    msg.senderId === userData?._id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderId === userData?._id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input - Fixed footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
