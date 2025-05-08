import React, { useState } from "react";
import axios from "axios";
import laptopsData from "../testdata/laptopspecifications.json";

const ServiceHomePage = () => {
  const [modelNumber, setModelNumber] = useState("");
  const [foundLaptop, setFoundLaptop] = useState(null);
  const [searched, setSearched] = useState(false);
  const [description, setDescription] = useState("");
  const [serviceHistory, setServiceHistory] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    // Reset the states before starting the new search
    setSearched(true);
    console.log("modelNumber:", modelNumber);
    setFoundLaptop(null);
    setServiceHistory([]);
    setShowUpdateForm(false);
    setShowServiceHistory(false);
    setError("");

    const laptop = laptopsData.laptops.find(
      (laptop) => laptop.serialNumber === modelNumber
    );

    if (laptop) {
      setFoundLaptop(laptop);
      fetchServiceHistory(laptop.serialNumber);
    } else {
      setSearched(true);
      setError("Laptop not found for the provided model number.");
    }
  };

  const handleUpdateHistory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/service-history", {
        modelNumber,
        description,
      });
      setDescription("");
      fetchServiceHistory(modelNumber); // Refresh service history after new entry
    } catch (error) {
      console.error("Error submitting service history", error);
      alert("Failed to update service history");
    }
  };

  const fetchServiceHistory = async (modelNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/service-history/${modelNumber}`
      );
      if (Array.isArray(response.data)) {
        setServiceHistory(response.data);
      } else {
        setServiceHistory([]);
        setError(`No service history found for model number: ${modelNumber}`);
      }
    } catch (error) {
      console.error("Error fetching service history", error);
      setServiceHistory([]);
      setError(`Error fetching service history. Please try again later.`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Laptop Service Home Page
      </h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Search for Laptop
        </h2>
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

      {searched && foundLaptop && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Laptop Details
          </h2>
          <div className="mb-4">
            <p>
              <strong>Serial Number:</strong> {foundLaptop.serialNumber}
            </p>
            <p>
              <strong>Brand:</strong> {foundLaptop.brand}
            </p>
            <p>
              <strong>Model:</strong> {foundLaptop.model}
            </p>
            <p>
              <strong>Processor:</strong> {foundLaptop.processor}
            </p>
            <p>
              <strong>RAM:</strong> {foundLaptop.ram}
            </p>
            <p>
              <strong>Storage:</strong> {foundLaptop.storage}
            </p>
            <p>
              <strong>GPU:</strong> {foundLaptop.gpu}
            </p>
            <p>
              <strong>Screen Size:</strong> {foundLaptop.screenSize}
            </p>
            <p>
              <strong>Resolution:</strong> {foundLaptop.resolution}
            </p>
            <p>
              <strong>OS:</strong> {foundLaptop.os}
            </p>
            <p>
              <strong>Weight:</strong> {foundLaptop.weight}
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
            >
              {showUpdateForm ? "Hide Update Form" : "Add/Update History"}
            </button>
            <button
              onClick={() => setShowServiceHistory(!showServiceHistory)}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              {showServiceHistory
                ? "Hide Service History"
                : "Show Service History"}
            </button>
          </div>

          {showUpdateForm && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Update Service History
              </h3>
              <form onSubmit={handleUpdateHistory}>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Description:
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                  Update History
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {showServiceHistory && serviceHistory.length > 0 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Service History
          </h3>
          <ul className="space-y-4">
            {serviceHistory.map((entry) => (
              <li
                key={entry._id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm border"
              >
                <p>
                  <strong>Model Number:</strong> {entry.modelNumber}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
                </p>
                <p>
                  <strong>Description:</strong> {entry.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceHomePage;
