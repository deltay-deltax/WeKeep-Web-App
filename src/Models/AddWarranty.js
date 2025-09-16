const mongoose = require("mongoose");

const AddWarrantySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    modelName: { type: String, required: true },
    modelNumber: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    company: { type: String, required: true },
    receipt: { type: String, required: true },
    userEmail: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+\d{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid E.164 phone number!`,
      },
    },
    notificationsSent: [
      {
        interval: Number,
        sentDate: Date,
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("AddWarranty", AddWarrantySchema);
