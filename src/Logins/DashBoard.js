import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "antd";
import Lottie from "lottie-react";
import ProfileAnimation from "../Utils/ProfileAnimation.json"; // Ensure you have the animation data JSON

// This is the profile Section of the User
//It handles mainly fetching data of the user and Logout functionality
const DashBoard = () => {
  const { logout, userData } = useAuth();

  const handleLogout = async () => {
    await logout(); //since its a async method and requires some time to perform operation
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8 flex flex-col items-center space-y-6">
        <Lottie animationData={ProfileAnimation} className="w-40 h-40 mb-5  " />
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Name: {userData.name}
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 font-medium">Email:</span>
            <p className="text-gray-700">{userData.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 font-medium">Role:</span>
            <p className="text-gray-700">{userData.role}</p>
          </div>
        </div>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashBoard;
