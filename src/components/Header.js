import React from "react";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboard = () => navigate("/profile");
  const handleBack = () => navigate(-1); // Go back dynamically

  // Show back button ONLY when on `/profile`
  const showBackButton = location.pathname === "/profile";

  return (
    <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Back Button - Appears Only When on Dashboard */}
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 hover:text-gray-200 transition"
          >
            <FaArrowLeft className="text-xl" />
            
          </button>
        )}

        <h1 className="text-2xl font-bold">We Keep</h1>
      </div>

      {/* Dashboard Button */}
      <div
        className="flex items-center space-x-2 cursor-pointer hover:text-gray-200 transition"
        onClick={handleDashboard}
      >
        <FaUserCircle className="text-3xl" />
        <span>Dashboard</span>
      </div>
    </div>
  );
};

export default Header;
