// Create a new file: src/components/AdminVerifyShops.js
import React, { useState, useEffect } from "react";
import api from "../Utils/api";
import { useAuth } from "../contexts/AuthContext";

const AdminVerifyShops = () => {
  const { token } = useAuth();
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "/api/admin/pending-services",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingShops(response.data);
      // Also fetch review history
      const histRes = await api.get(
        "/api/admin/review-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(histRes.data || []);
    } catch (error) {
      console.error("Error fetching pending shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyShop = async (shopId, isApproved) => {
    try {
      await api.post(
        `/api/admin/verify-service/${shopId}`,
        { approve: isApproved },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh the list
      fetchPendingShops();
    } catch (error) {
      console.error("Error verifying shop:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Verify Service Providers</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : pendingShops.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No pending verification requests
        </p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg divide-y">
          {pendingShops.map((shop) => (
            <div key={shop._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{shop.shopName}</h2>
                  <p className="text-gray-600">{shop.address}</p>
                  <p className="text-gray-600">Contact: {shop.email}</p>
                  <p className="text-gray-600">GST: {shop.gstNo}</p>

                  <div className="mt-2 p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Google Maps Information:</p>
                    <p>Business Name: {shop.googleMapsInfo?.businessName || '—'}</p>
                    <p>Place ID: {shop.googleMapsInfo?.placeId || '—'}</p>
                    {shop.location?.lat != null && shop.location?.lng != null && (
                      <p>Location: {shop.location.lat}, {shop.location.lng}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => verifyShop(shop._id, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => verifyShop(shop._id, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review History */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Review History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Shop</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{item.adminReviewedAt ? new Date(item.adminReviewedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-sm">{item.shopName}</td>
                    <td className="px-4 py-2 text-sm">{item.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${item.adminStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.adminStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{item.adminNotes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifyShops;
