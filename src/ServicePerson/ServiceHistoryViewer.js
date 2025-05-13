import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ServiceHistoryViewer = () => {
  const [modelNumber, setModelNumber] = useState("");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const fetchHistory = async () => {
    if (!modelNumber) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/service-history-full/${modelNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching service history:", error);
      setError("Failed to fetch service history");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">Service History</h1>

        <div className="bg-white shadow-md rounded p-8 mb-4 max-w-3xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
              Enter Model Number
            </label>
            <div className="flex">
              <input
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="Enter model number"
              />
              <button
                onClick={fetchHistory}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Search
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-purple-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {history && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Problem Reports
              </h2>
              {history.problems.length === 0 ? (
                <p className="text-center text-gray-500">
                  No problem reports found
                </p>
              ) : (
                <div className="mb-6 space-y-4">
                  {history.problems.map((problem, index) => (
                    <div
                      key={index}
                      className="bg-red-50 rounded-lg p-4 shadow"
                    >
                      <p>
                        <strong>Customer:</strong> {problem.customerName}
                      </p>
                      <p>
                        <strong>Phone:</strong> {problem.phone}
                      </p>
                      <p>
                        <strong>Model:</strong> {problem.modelName} (
                        {problem.modelNumber})
                      </p>
                      <p>
                        <strong>Problem:</strong> {problem.problemDescription}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(problem.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-xl font-bold mb-4 text-center">
                Service Updates
              </h2>
              {history.updates.length === 0 ? (
                <p className="text-center text-gray-500">
                  No service updates found
                </p>
              ) : (
                <div className="space-y-4">
                  {history.updates.map((update, index) => (
                    <div
                      key={index}
                      className="bg-green-50 rounded-lg p-4 shadow"
                    >
                      <p>
                        <strong>Model:</strong> {update.modelName} (
                        {update.modelNumber})
                      </p>
                      <p>
                        <strong>Technician:</strong> {update.servicePerson}
                      </p>
                      <p>
                        <strong>Service:</strong> {update.serviceDetails}
                      </p>
                      <p>
                        <strong>Warranty:</strong> {update.warrantyPeriod}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
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
