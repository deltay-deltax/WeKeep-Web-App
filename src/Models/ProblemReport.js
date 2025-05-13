const mongoose = require("mongoose");

const ProblemReportSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  modelName: { type: String, required: true },
  modelNumber: { type: String, required: true },
  problemDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  servicePersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("ProblemReport", ProblemReportSchema);
