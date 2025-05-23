import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewServiceHistory = () => {
  const [modelNumber, setModelNumber] = useState("");
  const [history, setHistory] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!modelNumber) return;

    setSearched(true);
    setHistory(null);
    setError("");
    setLoading(true);

    try {
      // Use the same endpoint as the service person side
      const response = await axios.get(
        `http://localhost:3000/api/service-history-full/${modelNumber}`
      );
      setHistory(response.data);
      if (!response.data.problems.length && !response.data.updates.length) {
        setError(`No service history found for model number: ${modelNumber}`);
      }
    } catch (error) {
      console.error("Error fetching service history", error);
      setError(`Error fetching service history. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRedirect = () => {
    navigate("/payment", { state: { fromServicePage: true } });
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
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Search
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-blue-500" role="status">
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

              {/* Payment Button */}
              {!paymentDone && history.updates.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handlePaymentRedirect}
                    className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {/* Payment Confirmation Message */}
              {paymentDone && (
                <p className="mt-4 text-green-600 font-semibold text-center">
                  ✅ Payment confirmed. Thank you for your payment!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewServiceHistory;
