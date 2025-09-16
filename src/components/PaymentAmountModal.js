import React, { useState, useEffect } from "react";

const PaymentAmountModal = ({ isOpen, onClose, onSubmit, currentAmount = "", partsCost = 0, laborCost = 0 }) => {
  const [amount, setAmount] = useState(currentAmount);
  
  // Auto-calculate total when modal opens or costs change
  useEffect(() => {
    if (isOpen) {
      const totalCost = Number(partsCost) + Number(laborCost);
      if (totalCost > 0) {
        setAmount(totalCost.toString());
      }
    }
  }, [isOpen, partsCost, laborCost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && !isNaN(amount) && Number(amount) > 0) {
      onSubmit(Number(amount));
      setAmount("");
      onClose();
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Set Payment Amount
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Cost Breakdown */}
          {(partsCost > 0 || laborCost > 0) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Breakdown:</h4>
              <div className="space-y-1 text-sm">
                {partsCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parts Cost:</span>
                    <span className="font-medium">₹{partsCost}</span>
                  </div>
                )}
                {laborCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labor Cost:</span>
                    <span className="font-medium">₹{laborCost}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-300 pt-1">
                  <span className="font-medium text-gray-800">Total:</span>
                  <span className="font-bold text-green-600">₹{Number(partsCost) + Number(laborCost)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Set Amount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentAmountModal;
