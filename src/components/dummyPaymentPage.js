import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const DummyPaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  const handlePayment = (status) => {
    setPaymentStatus(status);

    setTimeout(() => {
      if (status === 'success') {
        alert('✅ Payment Successful! Order confirmed.');
      } else {
        alert('❌ Payment Failed! Please try again.');
      }
      navigate('/');
    }, 2000); // Simulate a delay for better realism
  };

  return (
    <div className="container mx-auto p-6 text-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Payment Portal</h1>

      {/* Payment Method Selection */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('upi')}
          className={`px-6 py-3 rounded ${paymentMethod === 'upi' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          UPI Payment
        </button>

        <button
          onClick={() => setPaymentMethod('qr')}
          className={`px-6 py-3 rounded ${paymentMethod === 'qr' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          QR Code Payment
        </button>

        <button
          onClick={() => setPaymentMethod('card')}
          className={`px-6 py-3 rounded ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Card Payment
        </button>
      </div>

      {/* UPI Payment Section */}
      {paymentMethod === 'upi' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">UPI Payment</h2>
          <p className="text-gray-600 mb-4">Use your UPI app to pay ₹500</p>
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. user@upi)"
            className="p-3 border border-gray-300 rounded w-full mb-4"
          />
          <button
            onClick={() => handlePayment('success')}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Payment
          </button>
        </div>
      )}

      {/* QR Code Payment Section */}
      {paymentMethod === 'qr' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">QR Code Payment</h2>
          <p className="text-gray-600 mb-4">Scan this QR code to pay ₹500</p>
          <img
            src="https://www.emoderationskills.com/wp-content/uploads/2010/08/QR1.jpg"
            alt="QR Code"
            className="mx-auto mb-4"
          />
          <button
            onClick={() => handlePayment('success')}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            I've Scanned the Code
          </button>
        </div>
      )}

      {/* Card Payment Section */}
      {paymentMethod === 'card' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Card Payment</h2>
          <input
            type="text"
            placeholder="Card Number"
            className="p-3 border border-gray-300 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            className="p-3 border border-gray-300 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="CVV"
            className="p-3 border border-gray-300 rounded w-full mb-4"
          />
          <button
            onClick={() => handlePayment('success')}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Pay ₹500
          </button>
        </div>
      )}

      {/* Payment Status Display */}
      {paymentStatus && (
        <p
          className={`mt-6 font-semibold ${
            paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {paymentStatus === 'success'
            ? '✅ Payment was successful!'
            : '❌ Payment failed. Please try again.'}
        </p>
      )}
    </div>
  );
};

export default DummyPaymentPage;
