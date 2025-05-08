const express = require("express");
const authController = require("../backend/Controllers/authController");

// To define the Router in the express
const router = express.Router();

// Used to post the data into respective routes
router.post("/signup", authController.SignUp);
router.post("/login", authController.Login);

module.exports = router;
