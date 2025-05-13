const mongoose = require("mongoose");

const ServiceUpdateSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  modelNumber: { type: String, required: true },
  servicePerson: { type: String, required: true },
  serviceDetails: { type: String, required: true },
  warrantyPeriod: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  servicePersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("ServiceUpdate", ServiceUpdateSchema);
