import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWidget from "../components/chatWidget";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Dummy services for verified shops
  const getDummyServices = (shopName) => {
    const serviceOptions = [
      { name: "Phone Screen Repair", price: "₹1,200" },
      { name: "Battery Replacement", price: "₹800" },
      { name: "Water Damage Repair", price: "₹2,500" },
      { name: "Speaker Repair", price: "₹600" },
      { name: "Camera Repair", price: "₹1,500" },
      { name: "Charging Port Repair", price: "₹700" },
      { name: "Software Update", price: "₹300" },
      { name: "Data Recovery", price: "₹1,800" },
    ];

    // Return 4-6 random services for variety
    const shuffled = serviceOptions.sort(() => 0.5 - Math.random());
    const count = 4 + Math.floor(Math.random() * 3); // 4-6 services
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);

        // Handle dummy shops first
        if (id === "gupta_electronics_dummy") {
          setShop({
            _id: id,
            name: "Gupta Electronics",
            address: "CMRIT COLLEGE MAIN GATE",
            services: getDummyServices("Gupta Electronics"),
            isDummy: true,
          });
          setLoading(false);
          return;
        }

        if (id === "gupta_dummy") {
          setShop({
            _id: id,
            name: "gupta",
            address: "Somewhere near you",
            services: getDummyServices("gupta"),
            isDummy: true,
          });
          setLoading(false);
          return;
        }

        // Fetch real shop data
        const response = await axios.get(
          `http://localhost:3000/api/shop/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let shopData = response.data;

        // Add dummy services if none exist
        if (!shopData.services || shopData.services.length === 0) {
          shopData.services = getDummyServices(
            shopData.name || shopData.shopName
          );
        }

        setShop(shopData);
      } catch (error) {
        console.error("Error fetching shop details:", error);
        setError("Shop not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id, token]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <h1 className="text-center text-red-500 text-xl mt-10">
        {error || "Shop not found!"}
      </h1>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {shop.name || shop.shopName}
        </h1>

        {isLoaded && shop.location && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "250px" }}
              center={shop.location}
              zoom={15}
            >
              <Marker position={shop.location} />
            </GoogleMap>
          </div>
        )}

        <p className="text-gray-600 text-center mb-6 text-lg">
          <span className="font-semibold">{shop.address}</span>
        </p>

        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
          Services & Charges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {shop.services.map((service, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-800">{service.name}</span>
              <span className="text-green-600 font-bold text-lg">
                {service.price}
              </span>
            </div>
          ))}
        </div>

        {/* Additional shop info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Info</h3>
          <p className="text-blue-700 text-sm">
            Professional electronics repair service with experienced
            technicians. All repairs come with quality guarantee.
          </p>
        </div>

        {/* Chat button */}
        <div className="text-center">
          <button
            onClick={toggleChat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            💬 Chat with Shop
          </button>
        </div>
      </div>

      {/* Chat widget with proper positioning */}
      {showChat && (
        <ChatWidget
          shopId={id}
          shopName={shop.name || shop.shopName}
          onClose={toggleChat}
        />
      )}
    </div>
  );
};

export default ShopDetails;
