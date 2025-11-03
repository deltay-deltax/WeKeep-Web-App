import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import { useAuth } from "../contexts/AuthContext";

const AdminAnalytics = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data || []);
      } catch (e) {
        console.error("Failed to load transactions", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [token]);

  const total = transactions.reduce((sum, t) => sum + (t?.payment?.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Transactions</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold">₹{total}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Avg Ticket Size</div>
            <div className="text-2xl font-bold">₹{transactions.length ? Math.round(total / transactions.length) : 0}</div>
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Shop</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Model</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Txn ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{new Date(tx.updatedAt || tx.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{tx.userId?.name}</td>
                    <td className="px-4 py-2 text-sm">{tx.shopId?.shopName || tx.shopId?.name}</td>
                    <td className="px-4 py-2 text-sm">{tx.modelName} {tx.modelNumber}</td>
                    <td className="px-4 py-2 text-sm">₹{tx?.payment?.amount || 0}</td>
                    <td className="px-4 py-2 text-sm">{tx?.payment?.paymentMethod || '-'}</td>
                    <td className="px-4 py-2 text-sm">{tx?.payment?.transactionId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;


