import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../Utils/api";
import { useNavigate } from "react-router-dom";
import PaymentAmountModal from "../components/PaymentAmountModal";

const ServiceRequests = () => {
  const { token, isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequestAmount, setSelectedRequestAmount] = useState("");
  const [selectedRequestPartsCost, setSelectedRequestPartsCost] = useState(0);
  const [selectedRequestLaborCost, setSelectedRequestLaborCost] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await api.get("/api/requests/shop", {
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
      await api.post(
        `/api/requests/${id}/update`,
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
      await api.post(
        `/api/requests/${id}/update`,
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
      await api.post(
        `/api/requests/${selectedRequestId}/complete`,
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
      setSelectedRequestPartsCost(0);
      setSelectedRequestLaborCost(0);
    }
  };

  const handleMarkComplete = (requestId, currentAmount, partsCost, laborCost) => {
    setSelectedRequestId(requestId);
    setSelectedRequestAmount(currentAmount || "");
    setShowPaymentModal(true);
    // Store parts and labor costs for the modal
    setSelectedRequestPartsCost(partsCost || 0);
    setSelectedRequestLaborCost(laborCost || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage and process all service requests</p>
        </div>
        
        {/* Service Requests Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {requestsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 text-gray-400">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No service requests yet</p>
              <p className="text-gray-400 text-sm mt-2">Service requests will appear here when customers submit them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{r.modelName} ({r.modelNumber})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Customer:</span> {r.customerName}</p>
                          <p><span className="font-medium">Phone:</span> {r.customerPhone}</p>
                          <p><span className="font-medium">Address:</span> {r.customerAddress}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Problem:</span> {r.problem}</p>
                          <p><span className="font-medium">Date:</span> {new Date(r.createdAt).toLocaleDateString()}</p>
                          <p><span className="font-medium">Priority:</span> {r.priority || 'Medium'}</p>
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-3 ${
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        r.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        r.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        r.status === 'payment_pending' ? 'bg-orange-100 text-orange-800' :
                        r.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {r.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {r.status === "pending" && (
                        <>
                          <button 
                            onClick={() => acceptRequest(r._id)} 
                            disabled={updatingId===r._id} 
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                          >
                            {updatingId===r._id?"Processing...":"✓ Accept"}
                          </button>
                          <button 
                            onClick={() => declineRequest(r._id)} 
                            disabled={updatingId===r._id} 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                          >
                            ✗ Decline
                          </button>
                        </>
                      )}
                      {r.status === "accepted" && (
                        <button 
                          onClick={() => updateServiceDetails(r._id)} 
                          disabled={updatingId===r._id} 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          {updatingId===r._id?"Updating...":"🔧 Update Details"}
                        </button>
                      )}
                      {r.status === "in_progress" && (
                        <>
                          <button 
                            onClick={() => updateServiceDetails(r._id)} 
                            disabled={updatingId===r._id} 
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                          >
                            {updatingId===r._id?"Updating...":"✏️ Edit Details"}
                          </button>
                          <button 
                            onClick={() => handleMarkComplete(r._id, r.repairUpdate?.totalCost, r.repairUpdate?.partsCost, r.repairUpdate?.laborCost)} 
                            disabled={updatingId===r._id} 
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                          >
                            {updatingId===r._id?"Processing...":"✅ Mark Complete"}
                          </button>
                        </>
                      )}
                      {r.status === "payment_pending" && (
                        <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded text-sm font-medium text-center">
                          Waiting for Payment
                        </span>
                      )}
                      {r.status === "paid" && (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded text-sm font-medium text-center">
                          Completed & Paid
                        </span>
                      )}
                      {r.status === "declined" && (
                        <span className="px-4 py-2 bg-red-100 text-red-800 rounded text-sm font-medium text-center">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Amount Modal */}
      <PaymentAmountModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedRequestId(null);
          setSelectedRequestAmount("");
          setSelectedRequestPartsCost(0);
          setSelectedRequestLaborCost(0);
        }}
        onSubmit={markCompleted}
        currentAmount={selectedRequestAmount}
        partsCost={selectedRequestPartsCost}
        laborCost={selectedRequestLaborCost}
      />
    </div>
  );
};

export default ServiceRequests;
