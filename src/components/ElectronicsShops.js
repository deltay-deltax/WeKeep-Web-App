import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const ElectronicsShops = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700">
        Nearby Electronics Shops
      </h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for shops..."
          className="w-3/4 sm:w-1/2 p-3 border-2 border-blue-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => navigate(`/shop/${shop.id}`)}
          >
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
            <p className="text-gray-600 text-lg">📍 {shop.distance} away</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectronicsShops;
