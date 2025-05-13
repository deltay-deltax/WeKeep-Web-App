import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWidget from "../components/chatWidget";
const shops = [
  {
    id: 1,
    name: "Sharma Electronics",
    distance: "2 km",
    image:
      "https://media.gettyimages.com/id/85019104/photo/new-delhi-india-people-make-their-way-past-an-electronics-retailer-in-khan-market-on-february.jpg?s=612x612&w=gi&k=20&c=gOgftDK2hCbCsN_4k70ubpOY0u3OB5dwTUijod_Q5iM=",
    services: [
      { name: "Phone Repair", price: "₹500" },
      { name: "Laptop Repair", price: "₹1200" },
    ],
  },
  {
    id: 2,
    name: "Raj Mobile Services",
    distance: "3.5 km",
    image:
      "https://www.shutterstock.com/image-photo/bangalore-india-june-03-2018-260nw-1139756126.jpg",
    services: [
      { name: "Screen Replacement", price: "₹1500" },
      { name: "Battery Change", price: "₹800" },
    ],
  },
  {
    id: 3,
    name: "Gupta Electronics",
    distance: "1.8 km",
    image:
      "https://c8.alamy.com/comp/D91GHE/singaporelittle-indiaelectronicsstorecamerasasian-asians-ethnic-immigrant-D91GHE.jpg",
    services: [
      { name: "Headphone Repair", price: "₹300" },
      { name: "Speaker Fixing", price: "₹700" },
    ],
  },
  {
    id: 4,
    name: "Kumar Electronics",
    distance: "2.5 km",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3s1L-60viBsia9GUNys6OIi88fZ1S1cRviQ&s",
    services: [
      { name: "Tablet Repair", price: "₹600" },
      { name: "TV Repair", price: "₹1500" },
    ],
  },
  {
    id: 5,
    name: "Verma Digital Hub",
    distance: "4.2 km",
    image:
      "https://www.shutterstock.com/image-photo/indian-electronic-store-salesman-talking-260nw-2278465747.jpg",
    services: [
      { name: "Camera Repair", price: "₹1200" },
      { name: "Printer Repair", price: "₹900" },
    ],
  },
  {
    id: 6,
    name: "Tech Care Solutions",
    distance: "3 km",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBN9MBBKCmZEt4Yaog147UIzZGFKqQJ3Wj0A&s",
    services: [
      { name: "Smartwatch Repair", price: "₹700" },
      { name: "Gaming Console Repair", price: "₹2000" },
    ],
  },
  {
    id: 7,
    name: "Soni Electronics",
    distance: "1.2 km",
    image:
      "https://lh3.googleusercontent.com/proxy/Zwo79V2vUnQ7Oc9AdWtGD3428FX8mbzsBU4m0DGeG8KcKyPLSwrQVKzODQyuFt5hJWFis1jDtm9rKUVfe7SnJb61-8mO1OiNIiK3hXmpNNB3Gqvx_sKhm_rKH_mvJqEEwJpYttndRwdq_84h2zgJRLo7iaVRShPHDsizz-eYhS2aDN4_ANI5nHboW3BmP5E0r7_LYLuv",
    services: [
      { name: "Fridge Repair", price: "₹2500" },
      { name: "Microwave Repair", price: "₹1300" },
    ],
  },
  {
    id: 8,
    name: "Goyal Mobile & Electronics",
    distance: "5.1 km",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcLPGDVCH5EWDb5ghA5-y1btyBCmw02-x5zA&s",
    services: [
      { name: "Water Purifier Repair", price: "₹1000" },
      { name: "Set-top Box Repair", price: "₹400" },
    ],
  },
  {
    id: 9,
    name: "Mehta Tech Solutions",
    distance: "3.8 km",
    image:
      "https://www.livemint.com/rf/Image-621x414/LiveMint/Period1/2012/10/30/Photos/Electronics621.jpg",
    services: [
      { name: "Smart TV Repair", price: "₹3000" },
      { name: "AC Remote Fix", price: "₹500" },
    ],
  },
  {
    id: 10,
    name: "Delhi Gadget Fix",
    distance: "6 km",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfIDbwshFadElfvlG8nj4OkI4_VCsmigxa8g&s",
    services: [
      { name: "Drone Repair", price: "₹5000" },
      { name: "Power Bank Repair", price: "₹600" },
    ],
  },
];

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const shop = shops.find((shop) => shop.id === parseInt(id));

  if (!shop) {
    return (
      <h1 className="text-center text-red-500 text-xl mt-10">
        Shop not found!
      </h1>
    );
  }

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
      >
        ← Back
      </button>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {shop.name}
        </h1>
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-600 text-center mb-4 text-lg">
          Distance: <span className="font-semibold">{shop.distance}</span>
        </p>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
          Services & Charges
        </h2>
        <ul className="bg-gray-50 p-4 rounded-lg shadow-md divide-y divide-gray-300">
          {shop.services.map((service, index) => (
            <li
              key={index}
              className="flex justify-between py-3 px-2 bg-white hover:bg-gray-100 rounded-md"
            >
              <span className="font-medium text-gray-800">{service.name}</span>
              <span className="text-green-600 font-bold">{service.price}</span>
            </li>
          ))}
        </ul>

        {/* Chat button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={toggleChat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center transition-all duration-300 transform hover:scale-105"
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
            Chat with Shop
          </button>
        </div>
      </div>

      {/* Chat widget */}
      {showChat && (
        <ChatWidget
          shopId={shop.id.toString()}
          shopName={shop.name}
          onClose={toggleChat}
        />
      )}
    </div>
  );
};

export default ShopDetails;
