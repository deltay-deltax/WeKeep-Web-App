import React, { useState, useEffect } from "react";
import api from "../Utils/api";
import { useAuth } from "../contexts/AuthContext";

const ServiceHistoryViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const fetchAllRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        "/api/requests/shop",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure we always set an array, even if the API returns unexpected data
      const data = response.data;
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.warn("API returned non-array data:", data);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      setError("Failed to fetch service requests");
      setRequests([]); // Ensure requests is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [token]);

  const filteredRequests = Array.isArray(requests) ? requests.filter((request) => {
    const matchesSearch = searchTerm === "" || 
      request.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">Service History</h1>

        <div className="bg-white shadow-md rounded p-8 mb-4 max-w-6xl mx-auto">
          {/* Search and Filter Controls */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Search
            </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, model, brand, problem..."
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status Filter
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          )}

          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {!loading && !error && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  All Service Requests ({filteredRequests.length})
              </h2>
                <button
                  onClick={fetchAllRequests}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Refresh
                </button>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-400">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No service requests found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria" 
                      : "Service requests will appear here when customers submit them"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 pr-4">Customer</th>
                        <th className="py-3 pr-4">Device</th>
                        <th className="py-3 pr-4">Problem</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Amount</th>
                        <th className="py-3 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 pr-4">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4">
                            <div>
                              <div className="font-medium">{request.customerName}</div>
                              <div className="text-xs text-gray-500">{request.customerPhone}</div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div>
                              <div className="font-medium">{request.brand} {request.modelName}</div>
                              <div className="text-xs text-gray-500">({request.modelNumber})</div>
                            </div>
                          </td>
                          <td className="py-3 pr-4 max-w-xs truncate">
                            {request.problem}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              request.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                              request.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                              request.status === 'payment_pending' ? 'bg-orange-100 text-orange-700' :
                              request.status === 'paid' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {request.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {request.payment?.amount || request.repairUpdate?.totalCost ? 
                              `₹${request.payment?.amount || request.repairUpdate?.totalCost}` : 
                              '-'
                            }
                          </td>
                          <td className="py-3 pr-4">
                            {request.status === "accepted" && (
                              <button
                                onClick={() => window.location.href = `/service/update/${request._id}`}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Update
                              </button>
                            )}
                            {request.status === "in_progress" && (
                              <button
                                onClick={() => window.location.href = `/service/update/${request._id}`}
                                className="text-purple-600 hover:text-purple-800 text-xs"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceHistoryViewer;
