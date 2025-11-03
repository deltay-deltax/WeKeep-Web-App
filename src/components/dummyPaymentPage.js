import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../Utils/api";
import { useAuth } from '../contexts/AuthContext';

const DummyPaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const requestId = location.state?.requestId;

  // Fetch service request details to get the amount
  useEffect(() => {
    const fetchServiceRequest = async () => {
      if (requestId && token) {
        try {
          const response = await api.get(`/api/requests/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const request = response.data.find(req => req._id === requestId);
          setServiceRequest(request);
        } catch (error) {
          console.error('Failed to fetch service request:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchServiceRequest();
  }, [requestId, token]);

  const handlePayment = async (status) => {
    setPaymentStatus(status);
    setIsProcessing(true);
    
    try {
      if (status === 'success' && requestId) {
        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await api.post(`/api/requests/${requestId}/payment`, {
          paymentStatus: 'paid',
          paymentMethod: paymentMethod || 'dummy',
          amount: serviceRequest?.payment?.amount || serviceRequest?.repairUpdate?.totalCost,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Failed to update payment', e);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        if (status === 'success') {
          alert('✅ Payment Successful! Your service request has been completed.');
        } else {
          alert('❌ Payment Failed! Please try again.');
        }
        navigate('/service-history');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const amount = serviceRequest?.payment?.amount || serviceRequest?.repairUpdate?.totalCost || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your service payment</p>
        </div>

        {/* Service Details Card */}
        {serviceRequest && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Device</p>
                <p className="font-medium">{serviceRequest.modelName} ({serviceRequest.modelNumber})</p>
              </div>
              <div>
                <p className="text-gray-600">Problem</p>
                <p className="font-medium">{serviceRequest.problem}</p>
              </div>
              <div>
                <p className="text-gray-600">Service Provider</p>
                <p className="font-medium">{serviceRequest.shopId?.shopName || serviceRequest.shopId?.name || 'Service Center'}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-bold text-xl text-green-600">₹{amount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === 'upi' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium">UPI Payment</div>
                <div className="text-sm text-gray-500">Pay with UPI ID</div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('qr')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === 'qr' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="font-medium">QR Code</div>
                <div className="text-sm text-gray-500">Scan & Pay</div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-medium">Card Payment</div>
                <div className="text-sm text-gray-500">Credit/Debit Card</div>
              </div>
            </button>
          </div>
        </div>

        {/* UPI Payment Section */}
        {paymentMethod === 'upi' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">UPI Payment</h2>
                <p className="text-gray-600">Pay ₹{amount} using your UPI app</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. user@paytm, user@phonepe)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount to Pay</span>
                  <span className="text-2xl font-bold text-green-600">₹{amount}</span>
                </div>
              </div>
              
              <button
                onClick={() => handlePayment('success')}
                disabled={isProcessing || !upiId}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Pay ₹{amount} via UPI
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* QR Code Payment Section */}
        {paymentMethod === 'qr' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">📷</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">QR Code Payment</h2>
                <p className="text-gray-600">Scan QR code to pay ₹{amount}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-gray-500">QR Code</p>
                    <p className="text-xs text-gray-400">Amount: ₹{amount}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Open your UPI app and scan this QR code to complete payment
                </p>
              </div>
              
              <button
                onClick={() => handlePayment('success')}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    I've Scanned & Paid
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Card Payment Section */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Card Payment</h2>
                <p className="text-gray-600">Pay ₹{amount} using your card</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount to Pay</span>
                  <span className="text-2xl font-bold text-green-600">₹{amount}</span>
                </div>
              </div>
              
              <button
                onClick={() => handlePayment('success')}
                disabled={isProcessing || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Pay ₹{amount} with Card
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          </div>
        )}

        {/* Payment Status Display */}
        {paymentStatus && !isProcessing && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                paymentStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-3xl">
                  {paymentStatus === 'success' ? '✅' : '❌'}
                </span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {paymentStatus === 'success'
                  ? 'Payment Successful!'
                  : 'Payment Failed'}
              </h3>
              <p className="text-gray-600">
                {paymentStatus === 'success'
                  ? 'Your payment has been processed successfully. You will be redirected shortly.'
                  : 'There was an issue processing your payment. Please try again.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DummyPaymentPage;
