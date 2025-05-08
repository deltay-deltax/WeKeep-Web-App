import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewServiceHistory = () => {
  const [modelNumber, setModelNumber] = useState('');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearched(true);
    setServiceHistory([]);
    setError('');

    try {
      const response = await axios.get(`http://localhost:3000/api/service-history/${modelNumber}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setServiceHistory(response.data);
      } else {
        setError(`No service history found for model number: ${modelNumber}`);
      }
    } catch (error) {
      console.error('Error fetching service history', error);
      setError(`Error fetching service history. Please try again later.`);
    }
  };

  const handlePaymentRedirect = () => {
    navigate('/payment', { state: { fromServicePage: true } }); // Passing data to track origin
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-center mb-8">Service History Lookup</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Search for Service History</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="Enter Model Number"
            className="p-3 border border-gray-300 rounded-l-lg w-full focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
      </div>

      {searched && serviceHistory.length > 0 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Service History</h3>
          <ul className="space-y-4">
            {serviceHistory.map((entry) => (
              <li key={entry._id} className="p-4 bg-gray-50 rounded-lg shadow-sm border">
                <p><strong>Model Number:</strong> {entry.modelNumber}</p>
                <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
                <p><strong>Description:</strong> {entry.description}</p>
              </li>
            ))}
          </ul>

          {/* Payment Button */}
          {!paymentDone && (
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
            <p className="mt-4 text-green-600 font-semibold">
              ✅ Payment confirmed. Thank you for your payment!
            </p>
          )}
        </div>
      )}

      {searched && serviceHistory.length === 0 && !error && (
        <p className="text-center text-gray-600">No service history available.</p>
      )}
    </div>
  );
};

export default ViewServiceHistory;
