import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ViewServiceHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handlePaymentRedirect = (requestId) => {
    navigate("/payment", { state: { fromServicePage: true, requestId } });
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/requests/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure we always set an array, even if the API returns unexpected data
      const data = res.data;
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.warn("API returned non-array data:", data);
        setRequests([]);
      }
    } catch (e) {
      console.error("Failed to load requests", e);
      setRequests([]); // Ensure requests is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  // Filter requests based on search term and status
  const filteredRequests = Array.isArray(requests) ? requests.filter((request) => {
    const matchesSearch = 
      request.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Service Requests</h1>
          <p className="text-gray-600">Track and manage all your service requests</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Requests
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by model, brand, problem, or customer name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="paid">Paid</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchRequests}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 text-gray-400">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                {!Array.isArray(requests) || requests.length === 0 ? "No service requests yet" : "No requests match your search"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {!Array.isArray(requests) || requests.length === 0 
                  ? "Your service requests will appear here when you submit them."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.modelName} ({request.modelNumber})
                          </div>
                          <div className="text-sm text-gray-500">{request.brand}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {request.problem}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          request.status === 'payment_pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.payment?.amount ? `₹${request.payment.amount}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === "payment_pending" && (
                          <button
                            onClick={() => handlePaymentRedirect(request._id)}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                        {request.status === "paid" && (
                          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-md">
                            Paid
                          </span>
                        )}
                        {request.status === "declined" && (
                          <span className="text-red-600 bg-red-100 px-3 py-1 rounded-md">
                            Declined
                          </span>
                        )}
                        {!["payment_pending", "paid", "declined"].includes(request.status) && (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {Array.isArray(requests) && requests.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {requests.filter(r => r.status === 'payment_pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Payment</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {requests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status)).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        )}
      </div>
      
  
      
    </div>
  );
};

export default ViewServiceHistory;
