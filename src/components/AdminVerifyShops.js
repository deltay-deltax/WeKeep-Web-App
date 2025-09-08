// Create a new file: src/components/AdminVerifyShops.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const AdminVerifyShops = () => {
  const { token } = useAuth();
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/pending-shops",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingShops(response.data);
    } catch (error) {
      console.error("Error fetching pending shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyShop = async (shopId, isApproved) => {
    try {
      await axios.post(
        `http://localhost:3000/api/admin/verify-shop/${shopId}`,
        { isApproved },
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
                    <p>
                      Business Name:{" "}
                      {shop.googleMapsInfo?.businessName || "Not provided"}
                    </p>
                    <p>
                      Place ID: {shop.googleMapsInfo?.placeId || "Not provided"}
                    </p>
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
    </div>
  );
};

export default AdminVerifyShops;
