import React from "react";
import { Link } from "react-router-dom";

const UserHomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          Welcome to Your Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/add-warranty"
            className="p-6 bg-blue-500 text-white text-center rounded-xl shadow-lg 
                       hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Add Warranty</h2>
            <p className="text-sm">Manage and add new warranty details for your products.</p>
          </Link>

          <Link
            to="/service-history"
            className="p-6 bg-green-500 text-white text-center rounded-xl shadow-lg 
                       hover:bg-green-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Check Service History</h2>
            <p className="text-sm">Track your product's service details.</p>
          </Link>

          <Link
            to="/shops"
            className="p-6 bg-purple-500 text-white text-center rounded-xl shadow-lg 
                       hover:bg-purple-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Find Electronics Shops</h2>
            <p className="text-sm">Locate the nearest electronics repair shops.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserHomePage;
