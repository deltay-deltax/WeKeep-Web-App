import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import PaymentAmountModal from "../components/PaymentAmountModal";

const ServiceHomePage = () => {
  const { token, isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequestAmount, setSelectedRequestAmount] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      fetchRequests();
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchRequests();
      }, 30000);
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

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await axios.get("http://localhost:3000/api/requests/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      setUpdatingId(id);
      await axios.post(
        `http://localhost:3000/api/requests/${id}/update`,
        { status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (e) {
      console.error("Accept failed", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const declineRequest = async (id) => {
    try {
      setUpdatingId(id);
      await axios.post(
        `http://localhost:3000/api/requests/${id}/update`,
        { status: 'declined' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (e) {
      console.error("Decline failed", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateServiceDetails = (id) => {
    navigate(`/service/update/${id}`);
  };

  const markCompleted = async (amount) => {
    try {
      setUpdatingId(selectedRequestId);
      await axios.post(
        `http://localhost:3000/api/requests/${selectedRequestId}/complete`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (e) {
      console.error("Complete failed", e);
    } finally {
      setUpdatingId(null);
      setShowPaymentModal(false);
      setSelectedRequestId(null);
      setSelectedRequestAmount("");
    }
  };

  const handleMarkComplete = (requestId, currentAmount) => {
    setSelectedRequestId(requestId);
    setSelectedRequestAmount(currentAmount || "");
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
          Service Provider Dashboard
        </h1>
        
        {/* Four Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service History */}
          <Link
            to="/service/history"
            className="p-6 bg-purple-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-purple-600 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2">Service History</h2>
            <p className="text-sm">View full service record by model number</p>
          </Link>

          {/* Customer Messages */}
          <Link
            to="/shop-dashboard"
            className="relative p-6 bg-yellow-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-yellow-600 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-bold mb-2">Customer Messages</h2>
            <p className="text-sm">Chat with customers and manage conversations</p>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </Link>

          {/* Service Requests */}
          <Link
            to="/service-requests"
            className="p-6 bg-blue-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-xl font-bold mb-2">Service Requests</h2>
            <p className="text-sm">Manage and process service requests</p>
          </Link>

          {/* Analytics */}
          <Link
            to="/service-analytics"
            className="p-6 bg-indigo-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-indigo-600 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-2">Analytics</h2>
            <p className="text-sm">View earnings, performance & insights</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceHomePage;
