import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Choose an action</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/verify-services')}
              className="p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-left"
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="text-lg font-semibold">Verify Shops</div>
              <div className="text-sm opacity-80">Approve or reject service provider registrations</div>
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-lg font-semibold">Analytics</div>
              <div className="text-sm opacity-80">View all transactions and metrics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


