const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  // Additional fields for service person
  shopName: {
    type: String,
    required: function () {
      return this.role === "service";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === "service";
    },
  },
  gstNo: {
    type: String,
    required: function () {
      return this.role === "service";
    },
  },
  // Google Maps integration fields
  googleMapsInfo: {
    businessName: {
      type: String,
      required: function () {
        return this.role === "service";
      },
    },
    placeId: String,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Admin review metadata
  adminStatus: {
    type: String, // 'pending' | 'approved' | 'rejected'
    default: 'pending',
  },
  adminReviewedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
  },
  services: [
    {
      name: String,
      price: String,
    },
  ],
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
