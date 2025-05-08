import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">WeKeep</h2>
            <p className="text-sm text-gray-400 mt-2">
              Your trusted platform for seamless warranty and service management.
            </p>
          </div>


          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm">📞 +91 9876787653</p>
            <p className="text-sm">✉️ support@wekeep.com</p>
            <p className="text-sm">📍 CMR Institute Of Technology</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} wekeep. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
