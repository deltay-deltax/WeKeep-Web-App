import React from "react";
import { Link } from "react-router-dom";

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          Select Your Role
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          <Link
            to="/uhomepage"
            className="p-8 bg-blue-500 text-white text-center rounded-xl shadow-lg 
                       hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-3">User</h2>
            <p className="text-md">
              Access your dashboard to manage warranties and check service history.
            </p>
          </Link>

          <Link
            to="/service-home"
            className="p-8 bg-green-500 text-white text-center rounded-xl shadow-lg 
                       hover:bg-green-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-3">Service Person</h2>
            <p className="text-md">
              Manage service records and update product maintenance details.
            </p>
          </Link>
        </div>

       
      </div>
    </div>
  );
};

export default RoleSelectionPage;
