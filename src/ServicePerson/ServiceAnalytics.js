import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from "../Utils/api";

const ServiceAnalytics = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    averageEarning: 0,
    monthlyEarnings: [],
    recentRequests: [],
    topProblems: [],
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  useEffect(() => {
    fetchAnalytics();
  }, [token, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/analytics/service?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Analytics</h1>
              <p className="text-gray-600">Track your performance and earnings</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.totalEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Average per service: {formatCurrency(analytics.averageEarning)}
              </p>
            </div>
          </div>

          {/* Total Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalRequests}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Completed: {analytics.completedRequests}
              </p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.successRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Problem resolution rate
              </p>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.pendingRequests}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Awaiting your action
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Requests</h3>
            <div className="space-y-4">
              {analytics.recentRequests.length > 0 ? (
                analytics.recentRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{request.modelName}</p>
                      <p className="text-sm text-gray-600">{request.problem}</p>
                      <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'paid' ? 'bg-green-100 text-green-800' :
                        request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {request.payment?.amount && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {formatCurrency(request.payment.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent requests</p>
              )}
            </div>
          </div>

          {/* Top Problems */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Problems</h3>
            <div className="space-y-4">
              {analytics.topProblems.length > 0 ? (
                analytics.topProblems.map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{problem.problem}</p>
                        <p className="text-sm text-gray-600">{problem.count} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(problem.totalEarnings)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Earnings Chart */}
        {analytics.monthlyEarnings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Earnings Trend</h3>
            <div className="space-y-4">
              {analytics.monthlyEarnings.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <span className="text-sm font-bold text-green-600">{formatCurrency(month.earnings)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(month.earnings / Math.max(...analytics.monthlyEarnings.map(m => m.earnings))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAnalytics;

