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

  // Role-based theming: users = blue, service = green
  const isService = userData?.role === "service";
  const theme = {
    headerGradient: isService
      ? "bg-gradient-to-r from-green-600 to-green-700"
      : "bg-gradient-to-r from-blue-600 to-blue-700",
    backBtnBorder: isService ? "border-green-200 hover:border-green-300" : "border-blue-200 hover:border-blue-300",
    backBtnText: isService ? "text-green-600 hover:text-green-800" : "text-blue-600 hover:text-blue-800",
    spinnerBorder: isService ? "border-green-500" : "border-blue-500",
    emptyCircleBg: isService ? "bg-green-100" : "bg-blue-100",
    emptyIcon: isService ? "text-green-500" : "text-blue-500",
    bubbleMe: isService
      ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md"
      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md",
    bubbleMeTime: isService ? "text-green-100" : "text-blue-100",
    inputRing: isService ? "focus:ring-green-500" : "focus:ring-blue-500",
    sendBtn: isService
      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    subText: isService ? "text-green-100" : "text-blue-100",
  };

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
        try {
          await axios.post(
            `http://localhost:3000/api/chat/read/${shopId}/${userId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Messages marked as read successfully");
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-grow container mx-auto p-6 max-w-4xl">
        <button
          onClick={() => {
            // Force refresh of dashboard when returning
            window.dispatchEvent(new Event('focus'));
            navigate("/shop-dashboard");
          }}
          className={`mb-6 inline-flex items-center px-4 py-2 bg-white ${theme.backBtnText} font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border ${theme.backBtnBorder}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className={`${theme.headerGradient} text-white p-6`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Conversation with {customerInfo?.name || "Customer"}
                </h2>
                <p className={`${theme.subText} text-sm`}>Customer Support Chat</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${theme.spinnerBorder}`}></div>
                  <p className="text-gray-500 text-sm">Loading conversation...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`w-20 h-20 ${theme.emptyCircleBg} rounded-full flex items-center justify-center mb-4`}>
                  <svg className={`w-10 h-10 ${theme.emptyIcon}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-lg">No messages yet</p>
                <p className="text-gray-500 text-sm mt-1">Start the conversation below</p>
              </div>
            ) : (
              messages.map((msg) => {
                const sender = isSender(msg);
                return (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${sender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                        sender ? theme.bubbleMe : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-2 ${sender ? theme.bubbleMeTime : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`w-full border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 ${theme.inputRing} focus:border-transparent transition-all`}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                className={`${theme.sendBtn} disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ShopConversation;
