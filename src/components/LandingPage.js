import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../Utils/AnimationData.json";
import { motion } from "framer-motion"; // You'll need to install this

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8"
      >
        <div className="flex flex-col items-center mb-10">
          <Lottie animationData={animationData} className="w-40 h-40 mb-6" />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Welcome to WeKeep
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-center text-gray-600 mt-4"
          >
            Your warranty and service management solution
          </motion.p>
        </div>
        {/* 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 bg-blue-50 rounded-xl shadow-lg border border-blue-100"
          >
            <h2 className="text-2xl font-bold mb-3 text-blue-700">
              User Dashboard
            </h2>
            <p className="text-md mb-4 text-gray-600">
              Manage your warranties and check service history for your
              products.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 bg-green-50 rounded-xl shadow-lg border border-green-100"
          >
            <h2 className="text-2xl font-bold mb-3 text-green-700">
              Service Person Dashboard
            </h2>
            <p className="text-md mb-4 text-gray-600">
              Manage service records and update product maintenance details.
            </p>
          </motion.div>
        </div> */}

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-10 py-4 bg-blue-600 text-white text-center rounded-lg shadow-lg 
                       hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg block"
            >
              Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center rounded-lg shadow-lg 
                       hover:from-green-600 hover:to-emerald-700 transition-colors duration-300 font-semibold text-lg block"
            >
              Register
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
