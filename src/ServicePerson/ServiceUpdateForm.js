import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import auth context

const ServiceUpdateForm = () => {
  const navigate = useNavigate();
  const { userData, token } = useAuth(); // Get both user data and token

  const [form, setForm] = useState({
    modelName: "",
    modelNumber: "",
    servicePerson: "",
    serviceDetails: "",
    warrantyPeriod: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Include the authorization token in the request headers
      await axios.post("http://localhost:3000/api/service-update", form, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      });

      setMessage("Service update saved successfully!");
      setForm({
        modelName: "",
        modelNumber: "",
        servicePerson: "",
        serviceDetails: "",
        warrantyPeriod: "",
      });
    } catch (error) {
      console.error("Error updating service:", error);
      setMessage("Failed to save update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Service Update</h1>

      <div className="bg-white shadow-md rounded p-8 mb-4 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Model Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="modelName"
              type="text"
              value={form.modelName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Model Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="modelNumber"
              type="text"
              value={form.modelNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service Person Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="servicePerson"
              type="text"
              value={form.servicePerson}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service Details
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="serviceDetails"
              rows="4"
              value={form.serviceDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Warranty on New Service
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="warrantyPeriod"
              type="text"
              placeholder="e.g., 3 months, 1 year"
              value={form.warrantyPeriod}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Update Service"}
            </button>
          </div>

          {message && (
            <div className="mt-4 text-green-600 text-center font-semibold">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ServiceUpdateForm;
