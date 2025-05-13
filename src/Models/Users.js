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
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
