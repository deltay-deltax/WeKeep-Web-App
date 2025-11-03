import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import auth context

const ServiceUpdateForm = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { userData, token } = useAuth(); // Get both user data and token

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [form, setForm] = useState({
    details: "",
    partsReplaced: "",
    laborCost: "",
    partsCost: "",
    totalCost: "",
    warrantyAfterRepair: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    
    // Auto-calculate total when labour or parts cost changes
    if (name === 'laborCost' || name === 'partsCost') {
      const laborCost = name === 'laborCost' ? Number(value) || 0 : Number(form.laborCost) || 0;
      const partsCost = name === 'partsCost' ? Number(value) || 0 : Number(form.partsCost) || 0;
      updatedForm.totalCost = String(laborCost + partsCost);
    }
    
    setForm(updatedForm);
  };

  useEffect(() => {
    const loadRequest = async () => {
      try {
        if (!requestId) {
          setLoadingInitial(false);
          return;
        }
        const res = await api.get(`/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const r = res.data;
        const ru = r.repairUpdate || {};
        setForm({
          details: ru.details || "",
          partsReplaced: ru.partsReplaced || "",
          laborCost: ru.laborCost != null ? String(ru.laborCost) : "",
          partsCost: ru.partsCost != null ? String(ru.partsCost) : "",
          totalCost: ru.totalCost != null ? String(ru.totalCost) : "",
          warrantyAfterRepair: ru.warrantyAfterRepair || "",
        });
      } catch (e) {
        console.error("Failed to load request", e);
      } finally {
        setLoadingInitial(false);
      }
    };
    loadRequest();
  }, [requestId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        status: 'in_progress', // Set status to in_progress when updating details
        details: form.details,
        partsReplaced: form.partsReplaced,
        laborCost: Number(form.laborCost) || 0,
        partsCost: Number(form.partsCost) || 0,
        totalCost:
          form.totalCost !== "" ? Number(form.totalCost) : (Number(form.laborCost) || 0) + (Number(form.partsCost) || 0),
        warrantyAfterRepair: form.warrantyAfterRepair,
      };

      if (!requestId) {
        throw new Error("No requestId provided in route");
      }

      await api.post(`/api/requests/${requestId}/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Service update saved successfully!");
      setTimeout(() => navigate("/service-requests"), 800);
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
        {loadingInitial ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Service Details
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="details"
                rows="4"
                value={form.details}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Parts Replaced
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="partsReplaced"
                type="text"
                value={form.partsReplaced}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Labor Cost (₹)</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="laborCost"
                  type="number"
                  min="0"
                  value={form.laborCost}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Parts Cost (₹)</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="partsCost"
                  type="number"
                  min="0"
                  value={form.partsCost}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Total (₹)</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="totalCost"
                  type="number"
                  min="0"
                  value={form.totalCost}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Warranty on New Service
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="warrantyAfterRepair"
                type="text"
                placeholder="e.g., 3 months, 1 year"
                value={form.warrantyAfterRepair}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Update"}
              </button>
            </div>

            {message && (
              <div className="mt-4 text-green-600 text-center font-semibold">
                {message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceUpdateForm;
