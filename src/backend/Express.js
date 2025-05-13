require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cron = require("node-cron");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Import models
const User = require("../Models/Users");
const Chat = require("../Models/Chat");
const ProblemReport = require("../Models/ProblemReport");
const ServiceUpdate = require("../Models/ServiceUpdate");
const AddWarranty = require("../Models/AddWarranty");
const ServiceHistory = require("../Models/ServiceHistoryEntry");
const Notification = require("../Models/Notification");

// Import routes
const authRouter = require("../Routes/AuthRoutes");

// Import utilities
const {
  checkAndSendWarrantyNotifications,
} = require("../Utils/WarrantyNotifications");
const { createNotification } = require("../Utils/NotificationUtils");
const dataBase = require("./Database");

const app = express();

// Setup uploads directory
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

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "seckretKey213");
    const user = await User.findById(decoded._id || decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based access control middleware
const authorizeRoles = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ===== AUTHENTICATION ROUTES =====

// Service person registration endpoint
app.post("/api/auth/service-signup", async (req, res) => {
  try {
    const { name, email, password, shopName, address, gstNo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new service person
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "service",
      shopName,
      address,
      gstNo,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ _id: newUser._id }, "seckretKey213", {
      expiresIn: "100d",
    });

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        shopName: newUser.shopName,
        address: newUser.address,
        gstNo: newUser.gstNo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== CHAT ROUTES =====

// Mark messages as read - IMPORTANT: This route must come before other chat routes
app.post("/api/chat/read/:shopId/:userId", authMiddleware, async (req, res) => {
  try {
    const { shopId, userId } = req.params;
    const currentUserId = req.user._id;

    console.log(`Marking messages as read for shop ${shopId}, user ${userId}`);
    const result = await Chat.updateMany(
      {
        shopId: shopId,
        userId: new mongoose.Types.ObjectId(userId),
        senderId: { $nin: [shopId, new mongoose.Types.ObjectId(shopId)] },
        read: false,
      },
      { $set: { read: true } }
    );

    console.log(`Marked ${result.modifiedCount} messages as read`);
    res.json({
      message: "Messages marked as read",
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
});

// Get chat history for a shop
app.get("/api/chat/:shopId", authMiddleware, async (req, res) => {
  try {
    const { shopId } = req.params;
    const userId = req.user._id;

    console.log(
      `[Chat] Fetching chat history for shop ${shopId} and user ${userId}`
    );

    const chats = await Chat.find({
      shopId,
      $or: [{ userId }, { senderId: userId }],
    }).sort({ timestamp: 1 });

    console.log(`[Chat] Found ${chats.length} messages`);
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
});

// Send a message
app.post("/api/chat/:shopId", authMiddleware, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { message, shopName } = req.body;
    const userId = req.user._id;

    console.log(`[Chat] New message from user ${userId} to shop ${shopId}`);
    console.log(`[Chat] Message content: ${message}`);

    const newMessage = new Chat({
      shopId,
      userId,
      senderId: userId,
      message,
    });

    await newMessage.save();
    console.log("[Chat] Message saved successfully");

    // Create notification for shop owner
    if (userId.toString() !== shopId) {
      console.log(`[Chat] Creating notification for shop ${shopId}`);
      try {
        const notification = await createNotification(
          shopId,
          "New Message",
          `You have a new message from ${req.user.name || "a user"}`,
          { shopId, userId: userId.toString() } // Include data for navigation
        );
        console.log("[Chat] Notification creation result:", notification);
      } catch (error) {
        console.error("[Chat] Error creating notification:", error);
      }
    } else {
      console.log(
        "[Chat] Skipping notification - user is sending message to self"
      );
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("[Chat] Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get chat messages between a shop and user
app.get("/api/chat/:shopId/:userId", authMiddleware, async (req, res) => {
  try {
    const { shopId, userId } = req.params;
    console.log(
      `[Chat] Fetching messages between shop ${shopId} and user ${userId}`
    );

    const messages = await Chat.find({
      shopId,
      $or: [
        { userId, senderId: shopId },
        { userId, senderId: userId },
      ],
    }).sort({ timestamp: 1 });

    const customerInfo = await User.findById(userId, "name email");
    console.log(
      `[Chat] Found ${messages.length} messages for customer: ${
        customerInfo?.name || "Unknown"
      }`
    );

    res.json({
      messages,
      customerInfo,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Failed to fetch chat messages" });
  }
});

// Send a message from shop to user
app.post("/api/chat/:shopId/:userId", authMiddleware, async (req, res) => {
  try {
    const { shopId, userId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    console.log(
      `[Shop-Chat] New message from shop ${shopId} to user ${userId}`
    );
    console.log(`[Shop-Chat] Message content: ${message}`);

    const newMessage = new Chat({
      shopId,
      userId,
      senderId,
      message,
      read: false,
    });

    await newMessage.save();
    console.log("[Shop-Chat] Message saved successfully");

    // Add notification creation for user
    if (senderId.toString() === shopId) {
      console.log(`[Shop-Chat] Creating notification for user ${userId}`);
      try {
        const notification = await createNotification(
          userId,
          "New Message",
          `You have a new message from ${req.user.name || "Shop"}`,
          { shopId, userId } // Include data for navigation
        );
        console.log("[Shop-Chat] Notification creation result:", notification);
      } catch (error) {
        console.error("[Shop-Chat] Error creating notification:", error);
      }
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("[Shop-Chat] Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ===== SERVICE MANAGEMENT ROUTES =====

// Problem report endpoint
app.post("/api/problem-report", authMiddleware, async (req, res) => {
  try {
    // Add servicePersonId from authenticated user
    const data = {
      ...req.body,
      servicePersonId: req.user._id,
    };

    const report = new ProblemReport(data);
    await report.save();
    res.status(201).json({ message: "Problem reported successfully" });
  } catch (error) {
    console.error("Error saving problem report:", error);
    res
      .status(500)
      .json({ message: "Failed to report problem", error: error.message });
  }
});

// Service update endpoint
app.post("/api/service-update", authMiddleware, async (req, res) => {
  try {
    // Add servicePersonId from authenticated user
    const data = {
      ...req.body,
      servicePersonId: req.user._id,
    };

    const update = new ServiceUpdate(data);
    await update.save();
    res.status(201).json({ message: "Service update saved successfully" });
  } catch (error) {
    console.error("Error saving service update:", error);
    res
      .status(500)
      .json({ message: "Failed to save update", error: error.message });
  }
});

// Combined service history endpoint
app.get(
  "/api/service-history-full/:modelNumber",
  authMiddleware,
  async (req, res) => {
    try {
      const { modelNumber } = req.params;

      // Filter based on user role
      let filter = { modelNumber };
      if (req.user.role === "service") {
        filter.servicePersonId = req.user._id;
      }

      const problems = await ProblemReport.find(filter).sort({ createdAt: -1 });
      const updates = await ServiceUpdate.find(filter).sort({ updatedAt: -1 });

      res.status(200).json({ problems, updates });
    } catch (error) {
      console.error("Error fetching service history:", error);
      res.status(500).json({
        message: "Failed to fetch service history",
        error: error.message,
      });
    }
  }
);

// ===== WARRANTY MANAGEMENT ROUTES =====

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

// ===== SERVICE HISTORY ROUTES =====

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

// ===== SHOP DASHBOARD ROUTES =====

// Get all conversations for a shop
app.get("/api/shop/conversations", authMiddleware, async (req, res) => {
  try {
    // Ensure the user is a service provider
    if (req.user.role !== "service") {
      return res.status(403).json({ message: "Access denied" });
    }

    const shopId = req.user._id.toString();
    console.log(`[Shop] Fetching conversations for shop ${shopId}`);

    // Find all unique conversations for this shop
    const conversations = await Chat.aggregate([
      { $match: { shopId } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$userId",
          userId: { $first: "$userId" },
          shopId: { $first: "$shopId" },
          lastMessage: { $first: "$message" },
          lastMessageTime: { $first: "$timestamp" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$senderId", shopId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          shopId: 1,
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
          customerName: { $arrayElemAt: ["$userDetails.name", 0] },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    console.log(`[Shop] Found ${conversations.length} conversations`);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// Get unread message count for shop
app.get("/api/shop/unread-count", authMiddleware, async (req, res) => {
  try {
    const shopId = req.user._id.toString();
    console.log(`[Shop] Fetching unread count for shop ${shopId}`);

    // Only count messages where senderId is NOT the shop's ID
    const count = await Chat.countDocuments({
      shopId,
      senderId: { $ne: shopId },
      read: false,
    });

    console.log(`[Shop] Found ${count} unread messages`);
    res.json({ count });
  } catch (error) {
    console.error("Error counting unread messages:", error);
    res.status(500).json({ message: "Failed to count unread messages" });
  }
});
// Get shop details by ID

// ===== NOTIFICATION ROUTES =====

// Get user notifications
app.get("/api/user/notifications", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[Notifications] Fetching notifications for user ${userId}`);

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log(`[Notifications] Found ${notifications.length} notifications`);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Get unread notification count
app.get("/api/user/notifications/unread", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[Notifications] Fetching unread count for user ${userId}`);

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    console.log(`[Notifications] Found ${count} unread notifications`);
    res.json({ count });
  } catch (error) {
    console.error("[Notifications] Error counting notifications:", error);
    res.status(500).json({ message: "Failed to count notifications" });
  }
});

// Mark notifications as read
app.post("/api/user/notifications/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(
      `[Notifications] Marking notifications as read for user ${userId}`
    );

    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    console.log(
      `[Notifications] Marked ${result.modifiedCount} notifications as read`
    );
    res.json({
      message: "Notifications marked as read",
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

// ===== SCHEDULED TASKS =====

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

// ===== ERROR HANDLING =====

// Error Handling Globally
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// ===== CATCH-ALL ROUTE =====

// For any request that doesn't match one above, send back React's index.html file
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../build", "index.html"));
  });
} else {
  // In development, redirect to React dev server
  app.get("*", (req, res) => {
    res.redirect("http://localhost:3000");
  });
}

// Get shop details by ID

// ===== SERVER STARTUP =====

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
