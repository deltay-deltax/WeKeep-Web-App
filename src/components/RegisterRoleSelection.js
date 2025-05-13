import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";

const RegisterRoleSelection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-10">
          <Lottie animationData={animationData} className="w-32 h-32 mb-6" />
          <h1 className="text-4xl font-extrabold text-center text-blue-700">
            Select Registration Type
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Link
            to="/register/user"
            className="p-8 bg-blue-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-3">Register as User</h2>
            <p className="text-md">
              Create an account to manage warranties and access service history.
            </p>
          </Link>

          <Link
            to="/register/service"
            className="p-8 bg-green-500 text-white text-center rounded-xl shadow-lg 
                     hover:bg-green-600 hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-3">
              Register as Service Person
            </h2>
            <p className="text-md">
              Create an account to provide service and manage customer repairs.
            </p>
          </Link>
        </div>

        <div className="text-center mt-8">
          <span className="text-gray-700">Already have an account?</span>
          <Link to="/login">
            <button className="ml-2 text-blue-500 hover:text-blue-700 font-semibold">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterRoleSelection;
