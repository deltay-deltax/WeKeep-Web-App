require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cron = require("node-cron");
const ServiceHistory = require("../Models/ServiceHistoryEntry");
const authRouter = require("../Routes/AuthRoutes");
const AddWarranty = require("../Models/AddWarranty");
const dataBase = require("./Database");
const {
  checkAndSendWarrantyNotifications,
} = require("../Utils/WarrantyNotifications");

const app = express();
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

// File upload config
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadsDir));

// POST route to handle warranty form submission (with phone/email)
app.post("/api/warranty", upload.single("receipt"), async (req, res) => {
  const {
    modelName,
    modelNumber,
    purchaseDate,
    company,
    userEmail,
    phoneNumber,
  } = req.body;
  const receipt = req.file ? req.file.filename : "";

  try {
    const newWarranty = new AddWarranty({
      modelName,
      modelNumber,
      purchaseDate,
      company,
      receipt,
      userEmail,
      phoneNumber,
    });

    await newWarranty.save();
    res.status(201).json({ message: "Warranty added successfully" });
  } catch (error) {
    console.error("Error saving warranty:", error);
    res
      .status(500)
      .json({ message: "Failed to add warranty", error: error.message });
  }
});

// GET route to fetch all warranties
app.get("/api/warranties", async (req, res) => {
  try {
    const warranties = await AddWarranty.find();
    res.json(warranties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch warranties", error: error.message });
  }
});

// GET route to fetch a warranty by ID
app.get("/api/warranties/:id", async (req, res) => {
  try {
    const warranty = await AddWarranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }
    res.json(warranty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch warranty by ID",
      error: error.message,
    });
  }
});

// GET route to fetch warranty by model number
app.get("/api/warranty/:modelNumber", async (req, res) => {
  const { modelNumber } = req.params;
  try {
    const warranty = await AddWarranty.findOne({ modelNumber });
    if (!warranty) {
      return res
        .status(404)
        .json({ message: "No warranty found for this model number" });
    }
    res.json(warranty);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch warranty", error: error.message });
  }
});

// GET route to fetch an image by filename
app.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }
    res.sendFile(filePath);
  });
});

// POST route to add a service history entry
app.post("/api/service-history", async (req, res) => {
  const { modelNumber, description } = req.body;
  try {
    const newEntry = new ServiceHistory({ modelNumber, description });
    await newEntry.save();
    res
      .status(201)
      .json({ message: "Service history entry added successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add service history entry",
      error: error.message,
    });
  }
});

// GET route to fetch all service history entries for a given model number
app.get("/api/service-history/:modelNumber", async (req, res) => {
  const { modelNumber } = req.params;
  if (!modelNumber) {
    return res.status(400).json({ message: "Model number is required." });
  }
  try {
    const serviceHistory = await ServiceHistory.find({ modelNumber });
    if (!serviceHistory.length) {
      return res.status(404).json({
        message: `No service history found for model number: ${modelNumber}`,
      });
    }
    res.json(serviceHistory);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service history",
      error: error.message,
    });
  }
});

// Schedule warranty notification checks to run daily at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Running scheduled warranty expiration check...");
  checkAndSendWarrantyNotifications();
});

// For testing: run once shortly after server starts
setTimeout(() => {
  console.log("Running initial warranty check on server start...");
  checkAndSendWarrantyNotifications();
}, 10000);

// Error Handling Globally
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
