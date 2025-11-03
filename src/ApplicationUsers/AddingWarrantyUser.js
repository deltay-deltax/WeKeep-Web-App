import React, { useState } from "react";
import api from "../Utils/api";
import { useAuth } from "../contexts/AuthContext";

const AddingWarrantyUser = () => {
  const { token } = useAuth(); // Get authentication token
  const [formData, setFormData] = useState({
    modelName: "",
    modelNumber: "",
    purchaseDate: "",
    company: "",
    userEmail: "",
    phoneNumber: "", // <-- Added field
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("modelName", formData.modelName);
    data.append("modelNumber", formData.modelNumber);
    data.append("purchaseDate", formData.purchaseDate);
    data.append("company", formData.company);
    data.append("userEmail", formData.userEmail);
    data.append("phoneNumber", formData.phoneNumber); // <-- Added field
    if (receipt) {
      data.append("receipt", receipt);
    }

    setLoading(true);
    try {
      const response = await api.post(
        "/api/warranty",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setFormData({
        modelName: "",
        modelNumber: "",
        purchaseDate: "",
        company: "",
        userEmail: "",
        phoneNumber: "", // <-- Reset field
      });
      setReceipt(null);
    } catch (error) {
      console.error("Error submitting warranty:", error);
      setMessage("Failed to add warranty. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add Warranty Details</h1>
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes("success") ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="modelName"
          >
            Model Name
          </label>
          <input
            type="text"
            id="modelName"
            name="modelName"
            value={formData.modelName}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="modelNumber"
          >
            Model Number
          </label>
          <input
            type="text"
            id="modelNumber"
            name="modelNumber"
            value={formData.modelNumber}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="purchaseDate"
          >
            Purchase Date
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="company"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userEmail"
          >
            Email Address (for warranty notifications)
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        {/* NEW: Phone Number Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number (for SMS notifications)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="+919876543210"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="receipt"
          >
            Receipt (optional)
          </label>
          <input
            type="file"
            id="receipt"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Warranty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddingWarrantyUser;
