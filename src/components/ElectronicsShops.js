import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../Utils/api";
import { useAuth } from "../contexts/AuthContext";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const ElectronicsShops = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  // Enhanced state for categorized shops
  const [verifiedNearbyShops, setVerifiedNearbyShops] = useState([]);
  const [unverifiedNearbyShops, setUnverifiedNearbyShops] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(true);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Enhanced function to categorize nearby shops
  const fetchNearbyGoogleShops = async (location) => {
    try {
      setNearbyLoading(true);
      const response = await api.get(
        `/api/nearby-shops?lat=${location.lat}&lng=${location.lng}`
      );
      const googleShops = Array.isArray(response.data) ? response.data : [];

      // Get all MongoDB service users for verification
      const mongoShops = await api.get(
        `/api/service-users?lat=${location.lat}&lng=${location.lng}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create a map of shop names to MongoDB user IDs for verified shops
      const mongoShopMap = {};
      mongoShops.data.forEach((user) => {
        if (user.shopName || user.googleMapsInfo?.businessName) {
          const shopName = (
            user.shopName || user.googleMapsInfo.businessName
          ).toLowerCase();
          mongoShopMap[shopName] = user._id;
        }
      });

      // Categorize shops
      const verified = [];
      const unverified = [];

      googleShops.forEach((shop) => {
        const mongoUserId = mongoShopMap[shop.name?.toLowerCase()];
        if (mongoUserId) {
          verified.push({
            ...shop,
            _id: mongoUserId, // Use MongoDB user ID for routing
            isVerified: true,
            isGoogleShop: true,
          });
        } else {
          unverified.push({ ...shop, isVerified: false, isGoogleShop: true });
        }
      });

      setVerifiedNearbyShops(verified);
      setUnverifiedNearbyShops(unverified);
    } catch (error) {
      console.error("Error fetching nearby shops:", error);
      setVerifiedNearbyShops([]);
      setUnverifiedNearbyShops([]);
    } finally {
      setNearbyLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userLoc);
        fetchNearbyGoogleShops(userLoc);
      },
      (error) => {
        console.error("Error getting location:", error);
        const defaultLoc = { lat: 28.6139, lng: 77.209 };
        setUserLocation(defaultLoc);
        fetchNearbyGoogleShops(defaultLoc);
      }
    );
  }, [token]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const onMapLoad = (map) => {
    setMapRef(map);
  };

  // Enhanced card component for consistent styling
  const ShopCard = ({ shop, type }) => {
    const getCardStyles = () => {
      switch (type) {
        case "verified-google":
          return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500 ring-2 ring-green-200";
        case "unverified-google":
          return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-400"; // Blue border
        default:
          return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-400";
      }
    };

    const getBadge = () => {
      switch (type) {
        case "verified-google":
          return (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              VERIFIED ✓
            </span>
          );
        case "unverified-google":
          return (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              NEARBY
            </span>
          );
        default:
          return null;
      }
    };

    return (
      <div className={getCardStyles()}>
        <div className="h-48 bg-gray-300 relative">
          {getBadge()}
          {shop.image ? (
            <img
              src={shop.image}
              alt={shop.shopName || shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">
            {shop.shopName || shop.name}
          </h2>
          <div className="text-gray-600 mb-2 text-sm">{shop.address}</div>
          {shop.distance && shop.distance !== "-" && (
            <div className="flex items-center mb-2 text-gray-600">
              <svg
                className="h-4 w-4 text-red-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{shop.distance} km away</span>
            </div>
          )}

          {/* Buttons section */}
          <div className="flex space-x-2 flex-wrap">
            {type === "verified-google" ? (
              <>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    (shop.name || shop.shopName) + " " + shop.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  View on Maps
                </a>
                <Link
                  to={`/shop/${shop._id}`}
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  💬 Chat
                </Link>
              </>
            ) : (
              <>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    (shop.name || shop.shopName) + " " + shop.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  View on Maps
                </a>
                {shop.phoneNumber && (
                  <a
                    href={`tel:${shop.phoneNumber}`}
                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Call
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get all shops for filtering
  const allShops = [...verifiedNearbyShops, ...unverifiedNearbyShops];
  const filteredShops = searchTerm
    ? allShops.filter((shop) =>
        (shop.name || shop.shopName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : allShops;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Nearby Electronics Shops
        </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for shops..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* MAP WITH DIFFERENT COLOR PINS */}
      {isLoaded && userLocation && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={userLocation}
            zoom={13}
            onLoad={onMapLoad}
          >
            {/* User location marker - RED */}
            <Marker
              position={userLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />

            {/* VERIFIED SHOPS - GREEN PINS */}
            {verifiedNearbyShops
              .filter(
                (shop) =>
                  !searchTerm ||
                  (shop.name || shop.shopName || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((shop, i) =>
                shop.location ? (
                  <Marker
                    key={`verified-${shop.placeId || shop._id || i}`}
                    position={shop.location}
                    onClick={() =>
                      setSelectedShop({
                        ...shop,
                        shopName: shop.name,
                        type: "verified-google",
                      })
                    }
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // GREEN for verified
                    }}
                  />
                ) : null
              )}

            {/* UNVERIFIED SHOPS - BLUE PINS */}
            {unverifiedNearbyShops
              .filter(
                (shop) =>
                  !searchTerm ||
                  (shop.name || shop.shopName || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((shop, i) =>
                shop.location ? (
                  <Marker
                    key={`unverified-${shop.placeId || i}`}
                    position={shop.location}
                    onClick={() =>
                      setSelectedShop({
                        ...shop,
                        shopName: shop.name,
                        type: "unverified-google",
                      })
                    }
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // BLUE for unverified
                    }}
                  />
                ) : null
              )}

            {/* Info window */}
            {selectedShop && (
              <InfoWindow
                position={selectedShop.location || userLocation}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg">
                    {selectedShop.shopName || selectedShop.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedShop.address}
                  </p>
                  {selectedShop.distance && (
                    <p className="text-sm">{selectedShop.distance} km away</p>
                  )}
                  <div className="mt-2">
                    {selectedShop.type === "verified-google" ? (
                      <>
                        <Link
                          to={`/shop/${selectedShop._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                        >
                          Chat →
                        </Link>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            (selectedShop.name || selectedShop.shopName) +
                              " " +
                              selectedShop.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          View on Maps →
                        </a>
                      </>
                    ) : (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          (selectedShop.name || selectedShop.shopName) +
                            " " +
                            selectedShop.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View on Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {/* Updated Map Legend */}
          <div className="flex justify-center space-x-4 mt-4 mb-4 text-sm flex-wrap">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Verified Shops</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Other Nearby Shops</span>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED NEARBY SHOPS */}
      {verifiedNearbyShops.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
            ✓ Verified Nearby Shops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifiedNearbyShops
              .filter(
                (shop) =>
                  !searchTerm ||
                  (shop.name || shop.shopName || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((shop, i) => (
                <ShopCard
                  key={shop.placeId || i}
                  shop={shop}
                  type="verified-google"
                />
              ))}
          </div>
        </div>
      )}

      {/* OTHER NEARBY SHOPS */}
      {unverifiedNearbyShops.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Other Nearby Shops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyLoading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              unverifiedNearbyShops
                .filter(
                  (shop) =>
                    !searchTerm ||
                    (shop.name || shop.shopName || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((shop, i) => (
                  <ShopCard
                    key={shop.placeId || i}
                    shop={shop}
                    type="unverified-google"
                  />
                ))
            )}
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default ElectronicsShops;
