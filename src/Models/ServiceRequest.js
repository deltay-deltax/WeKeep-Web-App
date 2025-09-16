const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  deviceType: { type: String, required: true },
  brand: { type: String, required: true },
  modelName: { type: String, required: true },
  modelNumber: { type: String, required: true },
  problem: { type: String, required: true },
  description: { type: String },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "declined",
      "in_progress",
      "completed",
      "payment_pending",
      "paid",
    ],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  completedAt: { type: Date },
  repairUpdate: {
    type: {
      details: String,
      partsReplaced: String,
      totalCost: Number,
      laborCost: Number,
      partsCost: Number,
      warrantyAfterRepair: String,
      notes: String,
      servicePersonName: String,
      estimatedCompletionDate: Date,
    },
    default: null,
  },
  payment: {
    type: {
      amount: Number,
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      paymentMethod: String,
      transactionId: String,
      paidAt: Date,
      paymentNotes: String,
    },
    default: null,
  },
  // Add location for nearby shop matching
  userLocation: {
    lat: Number,
    lng: Number,
  },
  // Add priority and urgency
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  // Add estimated cost range
  estimatedCostRange: {
    min: Number,
    max: Number,
  },
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
